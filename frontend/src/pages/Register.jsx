import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiGlobe } from 'react-icons/fi'
import { register } from '../store/slices/authSlice'
import PageWrapper from '../components/common/PageWrapper'

export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, isAuthenticated } = useSelector(s => s.auth)
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [agree, setAgree] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true })
  }, [isAuthenticated])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!agree) return
    dispatch(register(form))
  }

  return (
    <PageWrapper>
      <div className="min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 relative bg-primary-900">
          <img src="https://images.unsplash.com/photo-1549221987-25a490f65d34?w=1000&q=80" alt="Travel" className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/70 to-primary-900/90 flex flex-col items-center justify-center p-12">
            <Link to="/" className="flex items-center gap-2 mb-12">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <FiGlobe className="text-white text-xl" />
              </div>
              <span className="font-heading font-bold text-2xl text-white">Wander<span className="text-secondary">Lux</span></span>
            </Link>
            <div className="text-center">
              <h2 className="font-heading text-4xl font-bold text-white mb-4">Join 50,000+ Travelers</h2>
              <p className="text-white/70 text-lg mb-8">Create your account and unlock exclusive deals, AI-powered trip planning, and personalized recommendations.</p>
              {['🎁 Free AI itinerary generator', '💰 Members-only pricing', '🌟 Loyalty rewards points', '📱 24/7 expert support'].map(b => (
                <div key={b} className="flex items-center gap-2 text-white/90 text-sm mb-2">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full" />{b}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-gray-950 overflow-y-auto">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md py-8">
            <div className="lg:hidden flex items-center gap-2 mb-8">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                  <FiGlobe className="text-white" />
                </div>
                <span className="font-heading font-bold text-xl text-gray-900 dark:text-white">Wander<span className="text-secondary">Lux</span></span>
              </Link>
            </div>

            <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h1>
            <p className="text-gray-500 mb-8">Start your travel journey today. It's free!</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label dark:text-gray-300">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Your full name" className="input-field pl-10 dark:bg-gray-900 dark:border-gray-700 dark:text-white" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
              </div>
              <div>
                <label className="label dark:text-gray-300">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" placeholder="you@example.com" className="input-field pl-10 dark:bg-gray-900 dark:border-gray-700 dark:text-white" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
              <div>
                <label className="label dark:text-gray-300">Phone Number</label>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" placeholder="+91 98765 43210" className="input-field pl-10 dark:bg-gray-900 dark:border-gray-700 dark:text-white" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="label dark:text-gray-300">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPass ? 'text' : 'password'} placeholder="Min 6 characters" className="input-field pl-10 pr-10 dark:bg-gray-900 dark:border-gray-700 dark:text-white" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className="mt-0.5 rounded" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </span>
              </label>

              <button type="submit" disabled={loading || !agree} className="btn-primary w-full justify-center py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</span> : 'Create Free Account'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  )
}
