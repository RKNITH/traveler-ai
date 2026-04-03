import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiUsers, FiPackage, FiBookOpen, FiDollarSign, FiTrendingUp, FiClock, FiCheck, FiAlertCircle } from 'react-icons/fi'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { fetchDashboardStats } from '../../store/slices/adminSlice'
import AdminLayout from '../../components/layout/AdminLayout'

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function AdminDashboard() {
  const dispatch = useDispatch()
  const { stats, loading } = useSelector(s => s.admin)

  useEffect(() => { dispatch(fetchDashboardStats()) }, [])

  if (loading || !stats) {
    return (
      <AdminLayout>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
        </div>
      </AdminLayout>
    )
  }

  const { stats: s, recentBookings, topPackages, revenueByMonth } = stats

  const statCards = [
    { label: 'Total Users', value: s.users.total.toLocaleString(), sub: `+${s.users.newThisMonth} this month`, icon: <FiUsers />, color: 'bg-blue-500' },
    { label: 'Total Revenue', value: `₹${(s.revenue.total / 100000).toFixed(1)}L`, sub: `₹${(s.revenue.thisMonth / 1000).toFixed(0)}K this month`, icon: <FiDollarSign />, color: 'bg-emerald-500' },
    { label: 'Total Bookings', value: s.bookings.total.toLocaleString(), sub: `${s.bookings.growth}% vs last month`, icon: <FiBookOpen />, color: 'bg-orange-500' },
    { label: 'Active Packages', value: s.packages.total.toLocaleString(), sub: `${s.destinations.total} destinations`, icon: <FiPackage />, color: 'bg-purple-500' },
  ]

  const chartData = revenueByMonth?.map(r => ({
    month: MONTH_NAMES[(r._id.month - 1)],
    revenue: Math.round(r.revenue / 1000),
    bookings: r.count
  })) || []

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((card, i) => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 ${card.color} rounded-xl flex items-center justify-center text-white text-xl`}>{card.icon}</div>
                <FiTrendingUp className="text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-0.5">{card.label}</p>
              <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Booking status quick stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Pending', value: s.bookings.pending, icon: <FiClock />, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
            { label: 'Confirmed', value: s.bookings.confirmed, icon: <FiCheck />, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
            { label: 'Revenue Growth', value: `${s.revenue.growth}%`, icon: <FiTrendingUp />, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
          ].map(item => (
            <div key={item.label} className={`${item.color} rounded-2xl p-4 flex items-center gap-3`}>
              <span className="text-2xl">{item.icon}</span>
              <div><p className="text-lg font-bold">{item.value}</p><p className="text-xs opacity-70">{item.label}</p></div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Revenue (₹K)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a6fb5" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1a6fb5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={v => [`₹${v}K`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#1a6fb5" fill="url(#colorRev)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Bookings by Month</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={v => [v, 'Bookings']} />
                <Bar dataKey="bookings" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Bookings + Top Packages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Recent Bookings</h3>
            <div className="space-y-3">
              {recentBookings?.map(b => (
                <div key={b._id} className="flex items-center justify-between gap-3 py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{b.user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{b.package?.title}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-primary">₹{b.pricing?.totalAmount?.toLocaleString('en-IN')}</p>
                    <span className={`badge text-xs capitalize ${b.status === 'confirmed' ? 'badge-success' : b.status === 'pending' ? 'badge-warning' : 'badge-error'}`}>{b.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Top Packages</h3>
            <div className="space-y-3">
              {topPackages?.map((pkg, i) => (
                <div key={pkg._id} className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{pkg.title}</p>
                    <p className="text-xs text-gray-400">{pkg.count} bookings</p>
                  </div>
                  <p className="text-sm font-bold text-primary">₹{(pkg.revenue / 1000).toFixed(0)}K</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
