import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiSearch, FiFilter, FiEye, FiEdit2 } from 'react-icons/fi'
import { fetchAllBookings, updateBookingStatus } from '../../store/slices/adminSlice'
import AdminLayout from '../../components/layout/AdminLayout'
import toast from 'react-hot-toast'

const STATUS_STYLES = {
  pending: 'badge-warning', confirmed: 'badge-success', processing: 'badge-primary',
  completed: 'bg-gray-100 text-gray-600', cancelled: 'badge-error', refunded: 'bg-purple-100 text-purple-600'
}
const STATUSES = ['', 'pending', 'confirmed', 'processing', 'completed', 'cancelled', 'refunded']

export default function AdminBookings() {
  const dispatch = useDispatch()
  const { bookings, loading } = useSelector(s => s.admin)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [newStatus, setNewStatus] = useState('')

  useEffect(() => {
    dispatch(fetchAllBookings({ status: statusFilter || undefined }))
  }, [statusFilter])

  const handleStatusUpdate = async (id) => {
    if (!newStatus) return
    await dispatch(updateBookingStatus({ id, status: newStatus }))
    setEditingId(null)
    setNewStatus('')
  }

  const filtered = bookings.filter(b =>
    !search ||
    b.bookingId?.toLowerCase().includes(search.toLowerCase()) ||
    b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.package?.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white">Bookings</h2>
            <p className="text-sm text-gray-500">{bookings.length} bookings</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by booking ID, user, package..." className="input-field pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white w-full"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input-field w-auto dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            {STATUSES.filter(Boolean).map(s => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  {['Booking ID', 'Customer', 'Package', 'Travel Date', 'Amount', 'Status', 'Payment', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}><td colSpan={8} className="px-4 py-3"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></td></tr>
                  ))
                ) : filtered.map(booking => (
                  <motion.tr key={booking._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-primary">{booking.bookingId}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800 dark:text-white text-xs">{booking.user?.name}</p>
                      <p className="text-gray-400 text-xs">{booking.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-xs max-w-36 truncate">{booking.package?.title}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {booking.travelDates?.departureDate ? new Date(booking.travelDates.departureDate).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '—'}
                    </td>
                    <td className="px-4 py-3 font-bold text-primary text-xs">₹{booking.pricing?.totalAmount?.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      {editingId === booking._id ? (
                        <div className="flex gap-1">
                          <select className="text-xs border border-gray-300 rounded-lg px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                            <option value="">Select...</option>
                            {STATUSES.filter(Boolean).map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                          </select>
                          <button onClick={() => handleStatusUpdate(booking._id)} className="px-2 py-1 bg-primary text-white text-xs rounded-lg">✓</button>
                          <button onClick={() => setEditingId(null)} className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-lg">✕</button>
                        </div>
                      ) : (
                        <span className={`badge text-xs capitalize ${STATUS_STYLES[booking.status]}`}>{booking.status}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs capitalize ${booking.paymentStatus === 'paid' ? 'badge-success' : booking.paymentStatus === 'refunded' ? 'bg-purple-100 text-purple-600' : 'badge-warning'}`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => { setEditingId(booking._id); setNewStatus(booking.status) }}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                        <FiEdit2 />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {!loading && filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p className="text-4xl mb-2">📋</p>
                <p>No bookings found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
