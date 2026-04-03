// BookingConfirmation.jsx
import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiCheck, FiCalendar, FiUsers, FiDownload, FiHome } from 'react-icons/fi'
import { fetchBooking } from '../store/slices/bookingSlice'
import PageWrapper from '../components/common/PageWrapper'

export default function BookingConfirmation() {
  const { bookingId } = useParams()
  const dispatch = useDispatch()
  const { current: booking } = useSelector(s => s.bookings)

  useEffect(() => { dispatch(fetchBooking(bookingId)) }, [bookingId])

  return (
    <PageWrapper>
      <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 20 }}
          className="card p-8 max-w-lg w-full text-center"
        >
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}>
              <FiCheck className="text-4xl text-accent" />
            </motion.div>
          </div>
          <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-white mb-2">Booking Confirmed! 🎉</h1>
          <p className="text-gray-500 mb-6">Your adventure is booked. Get ready for an amazing experience!</p>

          {booking && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 mb-6 text-left space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Booking ID</span>
                <span className="font-bold text-primary">{booking.bookingId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Package</span>
                <span className="font-medium text-gray-800 dark:text-white text-right max-w-48 truncate">{booking.package?.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className="badge-success capitalize">{booking.status}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Paid</span>
                <span className="font-bold text-gray-900 dark:text-white">₹{booking.pricing?.totalAmount?.toLocaleString('en-IN')}</span>
              </div>
              {booking.travelDates?.departureDate && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Departure</span>
                  <span className="font-medium text-gray-800 dark:text-white">{new Date(booking.travelDates.departureDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/my-bookings" className="btn-primary flex-1 justify-center">
              <FiCalendar /> My Bookings
            </Link>
            <Link to="/" className="btn-outline flex-1 justify-center">
              <FiHome /> Back to Home
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-4">A confirmation email has been sent to your registered email address.</p>
        </motion.div>
      </div>
    </PageWrapper>
  )
}
