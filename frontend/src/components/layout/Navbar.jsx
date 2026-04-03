import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiMenu, FiX, FiUser, FiLogOut, FiHeart, FiBookOpen,
  FiSettings, FiSun, FiMoon, FiChevronDown, FiGlobe
} from 'react-icons/fi'
import { RiPlaneLine } from 'react-icons/ri'
import { logout } from '../../store/slices/authSlice'
import { toggleDarkMode, closeMobileMenu, toggleMobileMenu } from '../../store/slices/uiSlice'

const navLinks = [
  { label: 'Destinations', path: '/destinations' },
  { label: 'Packages', path: '/packages' },
  { label: 'AI Planner', path: '/ai-planner', icon: <RiPlaneLine /> },
]

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated } = useSelector(s => s.auth)
  const { darkMode, mobileMenuOpen } = useSelector(s => s.ui)
  const [scrolled, setScrolled] = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)

  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    dispatch(closeMobileMenu())
    setUserDropdown(false)
  }, [location.pathname])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const navBg = isHome && !scrolled
    ? 'bg-transparent'
    : 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm'

  const textColor = isHome && !scrolled
    ? 'text-white'
    : 'text-gray-800 dark:text-gray-100'

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${navBg}`}>
      <div className="page-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-primary group-hover:scale-110 transition-transform">
              <FiGlobe className="text-white text-xl" />
            </div>
            <span className={`font-heading font-bold text-xl tracking-tight ${textColor}`}>
              Wander<span className="text-secondary">Lux</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                  ${location.pathname === link.path
                    ? 'bg-primary text-white'
                    : `${textColor} hover:bg-white/10 dark:hover:bg-white/5`
                  }`}
              >
                {link.icon && <span>{link.icon}</span>}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className={`p-2 rounded-lg transition-all ${textColor} hover:bg-white/10`}
            >
              {darkMode ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${textColor} hover:bg-white/10`}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                    {user?.avatar
                      ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      : <span className="text-primary font-bold text-sm">{user?.name?.[0]?.toUpperCase()}</span>
                    }
                  </div>
                  <span className="font-medium text-sm max-w-24 truncate">{user?.name?.split(' ')[0]}</span>
                  <FiChevronDown className={`text-sm transition-transform ${userDropdown ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="font-semibold text-sm text-gray-800 dark:text-white">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        {[
                          { icon: <FiUser />, label: 'Dashboard', path: '/dashboard' },
                          { icon: <FiBookOpen />, label: 'My Bookings', path: '/my-bookings' },
                          { icon: <FiHeart />, label: 'Wishlist', path: '/dashboard?tab=wishlist' },
                          ...(user?.role === 'admin' ? [{ icon: <FiSettings />, label: 'Admin Panel', path: '/admin' }] : [])
                        ].map(item => (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setUserDropdown(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <span className="text-primary">{item.icon}</span>
                            {item.label}
                          </Link>
                        ))}
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left"
                        >
                          <FiLogOut /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${textColor} hover:bg-white/10`}>
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 rounded-lg text-sm font-semibold bg-secondary text-white hover:bg-orange-600 transition-all shadow-md">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className={`md:hidden p-2 rounded-lg ${textColor}`}
            onClick={() => dispatch(toggleMobileMenu())}
          >
            {mobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800"
          >
            <div className="page-container py-4 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all
                    ${location.pathname === link.path
                      ? 'bg-primary text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                >
                  {link.icon} {link.label}
                </Link>
              ))}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-3 mt-3">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" className="flex items-center gap-2 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <FiUser /> Dashboard
                    </Link>
                    <Link to="/my-bookings" className="flex items-center gap-2 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <FiBookOpen /> My Bookings
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="flex items-center gap-2 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <FiSettings /> Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 w-full text-left">
                      <FiLogOut /> Logout
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2 px-2">
                    <Link to="/login" className="flex-1 text-center py-2.5 border border-primary text-primary rounded-xl font-medium">Login</Link>
                    <Link to="/register" className="flex-1 text-center py-2.5 bg-secondary text-white rounded-xl font-medium">Sign Up</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
