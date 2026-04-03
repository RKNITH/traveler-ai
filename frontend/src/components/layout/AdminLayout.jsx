import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiHome, FiPackage, FiBookOpen, FiUsers, FiMap, FiLogOut, FiMenu, FiX, FiGlobe, FiTag } from 'react-icons/fi'
import { RiDashboard2Line } from 'react-icons/ri'
import { logout } from '../../store/slices/authSlice'
import { useState } from 'react'

const navItems = [
  { icon: <RiDashboard2Line />, label: 'Dashboard', path: '/admin' },
  { icon: <FiPackage />, label: 'Packages', path: '/admin/packages' },
  { icon: <FiMap />, label: 'Destinations', path: '/admin/destinations' },
  { icon: <FiBookOpen />, label: 'Bookings', path: '/admin/bookings' },
  { icon: <FiUsers />, label: 'Users', path: '/admin/users' },
]

export default function AdminLayout({ children }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(s => s.auth)
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => { dispatch(logout()); navigate('/') }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-950 text-white transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
        <div className="p-5 border-b border-gray-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"><FiGlobe className="text-white" /></div>
            <span className="font-heading font-bold text-lg">Wander<span className="text-secondary">Lux</span></span>
          </Link>
          <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
        </div>
        <nav className="p-3 space-y-1 flex-1">
          {navItems.map(item => (
            <Link key={item.path} to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${location.pathname === item.path ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800 mt-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm">{user?.name?.[0]}</div>
            <div><p className="text-sm font-medium text-white">{user?.name}</p><p className="text-xs text-gray-500 capitalize">{user?.role}</p></div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 w-full">
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center gap-4">
          <button className="lg:hidden text-gray-600 dark:text-gray-300" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>
          <h1 className="font-heading font-bold text-gray-900 dark:text-white">
            {navItems.find(n => n.path === location.pathname)?.label || 'Admin'}
          </h1>
          <Link to="/" className="ml-auto text-sm text-primary hover:underline flex items-center gap-1">
            <FiHome /> View Site
          </Link>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
