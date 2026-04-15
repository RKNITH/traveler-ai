import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCalendar, FiMapPin, FiUsers, FiXCircle, FiEye, FiClock } from 'react-icons/fi'
import { fetchUserBookings, cancelBooking } from '../store/slices/bookingSlice'
import PageWrapper from '../components/common/PageWrapper'

const STATUS_STYLES = {
  pending: 'badge-warning',
  confirmed: 'badge-success',
  processing: 'badge-primary',
  completed: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
  cancelled: 'badge-error',
  refunded: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
}

const PLACEHOLDER = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80'

export default function MyBookings() {
  const dispatch = useDispatch()
  const { bookings, loading, total } = useSelector(s => s.bookings)
  const [activeStatus, setActiveStatus] = useState('')
  const [cancelId, setCancelId] = useState(null)

  useEffect(() => {
    dispatch(fetchUserBookings({ status: activeStatus || undefined }))
  }, [activeStatus])

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      await dispatch(cancelBooking({ id, reason: 'User requested cancellation' }))
      dispatch(fetchUserBookings())
    }
    setCancelId(null)
  }

  const statusTabs = ['', 'pending', 'confirmed', 'completed', 'cancelled']

  return (
    <PageWrapper>
      <div className="pt-16 md:pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="page-container py-8">
          <div className="mb-6">
            <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-white">My Bookings</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Track and manage all your travel bookings</p>
          </div>

          {/* Status filter tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6">
            {statusTabs.map(s => (
              <button
                key={s || 'all'}
                onClick={() => setActiveStatus(s)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${activeStatus === s ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary/10 border border-gray-200 dark:border-gray-700'}`}
              >
                {s || 'All Bookings'}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-36 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
            </div>
          ) : bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking, i) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card p-5 flex flex-col sm:flex-row gap-4"
                >
                  {/* Package Image */}
                  <div className="w-full sm:w-36 h-32 sm:h-28 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={booking.package?.coverImage || PLACEHOLDER}
                      alt={booking.package?.title}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.src = PLACEHOLDER }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{booking.package?.title}</h3>
                        <p className="text-xs text-gray-400 font-mono">{booking.bookingId}</p>
                      </div>
                      <span className={`badge flex-shrink-0 ${STATUS_STYLES[booking.status] || 'badge-primary'} capitalize`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                      {booking.travelDates?.departureDate && (
                        <span className="flex items-center gap-1">
                          <FiCalendar className="text-primary" />
                          {new Date(booking.travelDates.departureDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <FiUsers className="text-primary" />
                        {booking.pricing?.adultsCount + (booking.pricing?.childrenCount || 0)} travelers
                      </span>
                      {booking.travelDates?.duration && (
                        <span className="flex items-center gap-1">
                          <FiClock className="text-primary" />
                          {booking.travelDates.duration} days
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">₹{booking.pricing?.totalAmount?.toLocaleString('en-IN')}</span>
                      <div className="flex gap-2">
                        <Link to={`/booking/confirmation/${booking._id}`} className="btn-ghost text-xs px-3 py-1.5 border border-gray-200 dark:border-gray-700">
                          <FiEye /> View
                        </Link>
                        {['pending', 'confirmed'].includes(booking.status) && (
                          <button
                            onClick={() => handleCancel(booking._id)}
                            className="flex items-center gap-1 text-xs px-3 py-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-900/50 transition-all"
                          >
                            <FiXCircle /> Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-6xl mb-4">✈️</p>
              <h3 className="font-heading text-2xl font-bold text-gray-700 dark:text-white mb-2">No bookings yet</h3>
              <p className="text-gray-400 mb-6">Start your travel journey with WanderLux!</p>
              <Link to="/packages" className="btn-primary">Explore Packages</Link>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
