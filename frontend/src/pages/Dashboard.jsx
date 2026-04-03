import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiBookOpen, FiHeart, FiStar, FiEdit, FiMap } from 'react-icons/fi'
import { fetchUserBookings } from '../store/slices/bookingSlice'
import { updateProfile } from '../store/slices/authSlice'
import PageWrapper from '../components/common/PageWrapper'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const dispatch = useDispatch()
  const { user } = useSelector(s => s.auth)
  const { bookings } = useSelector(s => s.bookings)
  const [activeTab, setActiveTab] = useState('overview')
  const [wishlist, setWishlist] = useState([])
  const [editing, setEditing] = useState(false)
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' })

  useEffect(() => {
    dispatch(fetchUserBookings())
    if (activeTab === 'wishlist') loadWishlist()
  }, [activeTab])

  const loadWishlist = async () => {
    try {
      const res = await api.get('/users/wishlist')
      setWishlist(res.data.wishlist)
    } catch (e) { }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    await dispatch(updateProfile(profileForm))
    setEditing(false)
  }

  const recentBookings = bookings.slice(0, 5)
  const totalSpent = bookings.reduce((sum, b) => sum + (b.pricing?.totalAmount || 0), 0)

  return (
    <PageWrapper>
      <div className="pt-16 md:pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="page-container py-8">
          {/* Profile Header */}
          <div className="card p-6 mb-6 flex flex-col sm:flex-row items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold flex-shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="font-heading text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h1>
              <p className="text-gray-500">{user?.email}</p>
              <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                <span className="badge-primary capitalize">{user?.role}</span>
                <span className="badge bg-amber-100 text-amber-700">⭐ {user?.loyaltyPoints || 0} Points</span>
              </div>
            </div>
            <div className="flex gap-3 text-center">
              <div className="px-4"><p className="text-2xl font-bold text-primary">{bookings.length}</p><p className="text-xs text-gray-400">Trips</p></div>
              <div className="px-4"><p className="text-2xl font-bold text-primary">₹{(totalSpent / 1000).toFixed(0)}K</p><p className="text-xs text-gray-400">Spent</p></div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm mb-6 w-fit overflow-x-auto scrollbar-hide">
            {['overview', 'profile', 'wishlist'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-all ${activeTab === tab ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Total Bookings', value: bookings.length, icon: <FiBookOpen />, color: 'primary' },
                  { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, icon: <FiStar />, color: 'accent' },
                  { label: 'Wishlist', value: user?.wishlist?.length || 0, icon: <FiHeart />, color: 'secondary' },
                  { label: 'Loyalty Points', value: user?.loyaltyPoints || 0, icon: <FiStar />, color: 'amber' },
                ].map((stat, i) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card p-5">
                    <div className={`w-10 h-10 rounded-xl bg-${stat.color}/10 flex items-center justify-center text-${stat.color} mb-3`}>{stat.icon}</div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-gray-900 dark:text-white">Recent Bookings</h3>
                  <Link to="/my-bookings" className="text-sm text-primary hover:underline">View All</Link>
                </div>
                {recentBookings.length > 0 ? (
                  <div className="space-y-3">
                    {recentBookings.map(b => (
                      <div key={b._id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                          {b.package?.coverImage && <img src={b.package.coverImage} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{b.package?.title}</p>
                          <p className="text-xs text-gray-400">{b.bookingId}</p>
                        </div>
                        <span className={`badge text-xs capitalize ${b.status === 'confirmed' ? 'badge-success' : b.status === 'pending' ? 'badge-warning' : 'badge-error'}`}>{b.status}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FiMap className="text-4xl text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No bookings yet. Start exploring!</p>
                    <Link to="/packages" className="btn-primary mt-3">Explore Packages</Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="card p-6 max-w-lg">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-heading font-bold text-gray-900 dark:text-white">Edit Profile</h3>
                <button onClick={() => setEditing(!editing)} className="text-sm text-primary hover:underline flex items-center gap-1">
                  <FiEdit /> {editing ? 'Cancel' : 'Edit'}
                </button>
              </div>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                {[{ label: 'Full Name', key: 'name', type: 'text' }, { label: 'Phone', key: 'phone', type: 'tel' }].map(field => (
                  <div key={field.key}>
                    <label className="label dark:text-gray-300">{field.label}</label>
                    <input type={field.type} className="input-field dark:bg-gray-800 dark:border-gray-700 dark:text-white disabled:opacity-70 disabled:cursor-not-allowed"
                      value={profileForm[field.key]} disabled={!editing}
                      onChange={e => setProfileForm(f => ({ ...f, [field.key]: e.target.value }))} />
                  </div>
                ))}
                <div>
                  <label className="label dark:text-gray-300">Email</label>
                  <input type="email" value={user?.email} disabled className="input-field opacity-60 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                </div>
                {editing && <button type="submit" className="btn-primary w-full justify-center">Save Changes</button>}
              </form>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div>
              {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {wishlist.map(pkg => (
                    <Link key={pkg._id} to={`/packages/${pkg._id}`} className="card overflow-hidden group hover:-translate-y-1 transition-transform">
                      <img src={pkg.coverImage || ''} alt={pkg.title} className="w-full h-40 object-cover" />
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-800 dark:text-white group-hover:text-primary transition-colors">{pkg.title}</h4>
                        <p className="text-sm text-primary font-bold mt-1">₹{pkg.pricing?.adultPrice?.toLocaleString('en-IN')}/person</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <FiHeart className="text-5xl text-gray-300 mx-auto mb-3" />
                  <h3 className="font-heading text-xl font-bold text-gray-700 dark:text-white mb-2">No saved packages</h3>
                  <p className="text-gray-400 mb-5">Save packages you love to your wishlist!</p>
                  <Link to="/packages" className="btn-primary">Browse Packages</Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
