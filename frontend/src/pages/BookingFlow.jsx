import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUser, FiCalendar, FiCreditCard, FiCheck, FiPlus, FiMinus, FiTag, FiArrowLeft } from 'react-icons/fi'
import { fetchPackage } from '../store/slices/packageSlice'
import { createBooking } from '../store/slices/bookingSlice'
import PageWrapper from '../components/common/PageWrapper'
import api from '../services/api'
import toast from 'react-hot-toast'

const STEPS = ['Trip Details', 'Travelers', 'Payment']
const PLACEHOLDER = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80'

export default function BookingFlow() {
  const { packageId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { current: pkg } = useSelector(s => s.packages)
  const { loading } = useSelector(s => s.bookings)
  const { user } = useSelector(s => s.auth)

  const [step, setStep] = useState(0)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [departureDate, setDepartureDate] = useState('')
  const [roomType, setRoomType] = useState('double')
  const [specialRequests, setSpecialRequests] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [couponData, setCouponData] = useState(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('online')
  const [travelers, setTravelers] = useState([{ type: 'adult', name: user?.name || '', age: '', gender: 'male', passportNumber: '' }])

  useEffect(() => { dispatch(fetchPackage(packageId)) }, [packageId])

  useEffect(() => {
    if (adults + children !== travelers.length) {
      const newTravelers = Array.from({ length: adults + children }, (_, i) => ({
        type: i < adults ? 'adult' : 'child',
        name: i === 0 ? (user?.name || '') : '',
        age: '', gender: 'male', passportNumber: ''
      }))
      setTravelers(newTravelers)
    }
  }, [adults, children])

  if (!pkg) return <div className="pt-20 page-container py-10 text-center">Loading package...</div>

  const adultPrice = pkg.pricing?.adultPrice || 0
  const childPrice = pkg.pricing?.childPrice || adultPrice * 0.7
  const subtotal = adults * adultPrice + children * childPrice
  const couponDiscount = couponData?.discount || 0
  const taxes = (subtotal - couponDiscount) * 0.05
  const processingFee = 199
  const total = subtotal - couponDiscount + taxes + processingFee

  const returnDate = departureDate
    ? new Date(new Date(departureDate).getTime() + pkg.duration.days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    : ''

  const applyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    try {
      const res = await api.post('/coupons/validate', { code: couponCode, amount: subtotal })
      setCouponData(res.data.coupon)
      toast.success(res.data.message)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon')
      setCouponData(null)
    } finally {
      setCouponLoading(false)
    }
  }

  const handleBook = async () => {
    if (!departureDate) return toast.error('Please select departure date')
    const result = await dispatch(createBooking({
      packageId,
      travelers,
      travelDates: { departureDate, returnDate },
      couponCode: couponData?.code,
      roomType,
      specialRequests,
      paymentMethod
    }))
    if (result.payload?.booking) {
      try {
        await api.post('/payments/process', {
          bookingId: result.payload.booking._id,
          method: paymentMethod
        })
        toast.success('Payment successful! Confirmation email sent.')
      } catch (e) {
        console.error('Payment error:', e)
      }
      navigate(`/booking/confirmation/${result.payload.booking._id}`)
    }
  }

  return (
    <PageWrapper>
      <div className="pt-16 md:pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="page-container py-8">
          {/* Back button */}
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors">
            <FiArrowLeft /> Back to Package
          </button>

          {/* Progress */}
          <div className="flex items-center justify-center mb-8">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center gap-2 ${i <= step ? 'text-primary' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i < step ? 'bg-primary text-white' : i === step ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                    {i < step ? <FiCheck /> : i + 1}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{s}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`w-16 sm:w-24 h-0.5 mx-2 transition-all ${i < step ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`} />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {/* STEP 0 - Trip Details */}
                {step === 0 && (
                  <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card p-6 space-y-6">
                    <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white">Trip Details</h2>

                    {/* Travelers count */}
                    <div className="space-y-4">
                      {[{ label: 'Adults', sublabel: '12+ years', value: adults, setter: setAdults, min: 1, max: 10 },
                      { label: 'Children', sublabel: '2-11 years', value: children, setter: setChildren, min: 0, max: 8 }
                      ].map(({ label, sublabel, value, setter, min, max }) => (
                        <div key={label} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-white">{label}</p>
                            <p className="text-xs text-gray-400">{sublabel}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button onClick={() => setter(v => Math.max(min, v - 1))} disabled={value <= min} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-40 hover:border-primary hover:text-primary transition-all">
                              <FiMinus />
                            </button>
                            <span className="w-6 text-center font-bold text-gray-800 dark:text-white">{value}</span>
                            <button onClick={() => setter(v => Math.min(max, v + 1))} disabled={value >= max} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-40 hover:border-primary hover:text-primary transition-all">
                              <FiPlus />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Departure Date */}
                    <div>
                      <label className="label dark:text-gray-300">Departure Date</label>
                      <div className="relative">
                        <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="date"
                          className="input-field pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                          value={departureDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={e => setDepartureDate(e.target.value)}
                        />
                      </div>
                      {returnDate && <p className="text-xs text-gray-400 mt-1">Return: {new Date(returnDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
                    </div>

                    {/* Room Type */}
                    <div>
                      <label className="label dark:text-gray-300">Room Type</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {['single', 'double', 'twin', 'suite'].map(type => (
                          <button
                            key={type}
                            onClick={() => setRoomType(type)}
                            className={`py-2.5 rounded-xl border text-sm font-medium capitalize transition-all ${roomType === type ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 text-gray-600 hover:border-primary'}`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Special requests */}
                    <div>
                      <label className="label dark:text-gray-300">Special Requests (Optional)</label>
                      <textarea
                        className="input-field dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none"
                        rows={3}
                        placeholder="Dietary requirements, accessibility needs, anniversary arrangements..."
                        value={specialRequests}
                        onChange={e => setSpecialRequests(e.target.value)}
                      />
                    </div>

                    <button onClick={() => setStep(1)} disabled={!departureDate} className="btn-primary w-full justify-center py-3.5 disabled:opacity-50">
                      Continue to Traveler Details
                    </button>
                  </motion.div>
                )}

                {/* STEP 1 - Traveler Details */}
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card p-6 space-y-5">
                    <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white">Traveler Information</h2>
                    {travelers.map((t, i) => (
                      <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3">
                        <h4 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                          <FiUser className="text-primary" />
                          {t.type === 'adult' ? 'Adult' : 'Child'} {i + 1}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="label dark:text-gray-300 text-xs">Full Name *</label>
                            <input
                              type="text"
                              className="input-field text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                              placeholder="As per passport"
                              value={t.name}
                              onChange={e => { const n = [...travelers]; n[i] = { ...n[i], name: e.target.value }; setTravelers(n) }}
                              required
                            />
                          </div>
                          <div>
                            <label className="label dark:text-gray-300 text-xs">Age</label>
                            <input type="number" className="input-field text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white" placeholder="Age" value={t.age}
                              onChange={e => { const n = [...travelers]; n[i] = { ...n[i], age: e.target.value }; setTravelers(n) }} />
                          </div>
                          <div>
                            <label className="label dark:text-gray-300 text-xs">Gender</label>
                            <select className="input-field text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={t.gender}
                              onChange={e => { const n = [...travelers]; n[i] = { ...n[i], gender: e.target.value }; setTravelers(n) }}>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="label dark:text-gray-300 text-xs">Passport No. (Optional)</label>
                            <input type="text" className="input-field text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white" placeholder="For international trips" value={t.passportNumber}
                              onChange={e => { const n = [...travelers]; n[i] = { ...n[i], passportNumber: e.target.value }; setTravelers(n) }} />
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-3">
                      <button onClick={() => setStep(0)} className="btn-ghost flex-1 justify-center border border-gray-200">Back</button>
                      <button onClick={() => setStep(2)} disabled={travelers.some(t => !t.name)} className="btn-primary flex-1 justify-center disabled:opacity-50">
                        Continue to Payment
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2 - Payment */}
                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card p-6 space-y-5">
                    <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white">Payment Details</h2>

                    {/* Coupon */}
                    <div>
                      <label className="label dark:text-gray-300">Coupon Code</label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <FiTag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            className="input-field pl-10 uppercase dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={e => setCouponCode(e.target.value.toUpperCase())}
                          />
                        </div>
                        <button onClick={applyCoupon} disabled={couponLoading} className="btn-primary whitespace-nowrap">
                          {couponLoading ? 'Applying...' : 'Apply'}
                        </button>
                      </div>
                      {couponData && (
                        <div className="mt-2 flex items-center gap-2 text-accent text-sm">
                          <FiCheck /> Coupon applied! You save ₹{couponData.discount?.toFixed(2)}
                        </div>
                      )}
                    </div>

                    {/* Payment method */}
                    <div>
                      <label className="label dark:text-gray-300">Payment Method</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: 'online', label: '💳 Online Payment', sub: 'Card / Net Banking' },
                          { value: 'upi', label: '📱 UPI', sub: 'GPay, PhonePe, Paytm' },
                          { value: 'bank_transfer', label: '🏦 Bank Transfer', sub: 'NEFT / RTGS / IMPS' },
                          { value: 'cash', label: '💵 Cash on Arrival', sub: 'Pay at our office' },
                        ].map(m => (
                          <button key={m.value} onClick={() => setPaymentMethod(m.value)} className={`p-4 rounded-xl border text-left transition-all ${paymentMethod === m.value ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-gray-200 dark:border-gray-700 hover:border-primary'}`}>
                            <p className="font-medium text-sm text-gray-800 dark:text-white">{m.label}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{m.sub}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm text-amber-700 dark:text-amber-400">
                      🔒 Your payment is secured with 256-bit SSL encryption. A confirmation email will be sent after payment.
                    </div>

                    <div className="flex gap-3">
                      <button onClick={() => setStep(1)} className="btn-ghost flex-1 justify-center border border-gray-200">Back</button>
                      <button onClick={handleBook} disabled={loading} className="btn-primary flex-1 justify-center text-base">
                        {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing...</span> : `Confirm & Pay ₹${total.toLocaleString('en-IN')}`}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Summary Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 card p-5 space-y-4">
                <img src={pkg.coverImage || PLACEHOLDER} alt={pkg.title} className="w-full h-40 object-cover rounded-xl" onError={e => { e.target.src = PLACEHOLDER }} />
                <h3 className="font-heading font-bold text-gray-900 dark:text-white">{pkg.title}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Adults × {adults}</span>
                    <span>₹{(adults * adultPrice).toLocaleString('en-IN')}</span>
                  </div>
                  {children > 0 && (
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Children × {children}</span>
                      <span>₹{(children * childPrice).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-accent">
                      <span>Coupon Discount</span>
                      <span>-₹{couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Taxes (5%)</span>
                    <span>₹{taxes.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Processing Fee</span>
                    <span>₹{processingFee}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between font-bold text-gray-900 dark:text-white text-base">
                    <span>Total</span>
                    <span className="text-primary">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                {departureDate && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-xs text-gray-500 space-y-1">
                    <p>📅 Departure: {new Date(departureDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    {returnDate && <p>✈️ Return: {new Date(returnDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
