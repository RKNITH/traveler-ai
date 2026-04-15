import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff, FiGlobe } from 'react-icons/fi'
import { login } from '../store/slices/authSlice'
import PageWrapper from '../components/common/PageWrapper'

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading, isAuthenticated } = useSelector(s => s.auth)
  const from = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true })
  }, [isAuthenticated])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(login(form))
  }

  return (
    <PageWrapper>
      <div className="min-h-screen flex">
        {/* Left - Image */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-primary-900">
          <img
            src="https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1000&q=80"
            alt="Travel"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary-900/80 flex flex-col items-center justify-center p-12">
            <Link to="/" className="flex items-center gap-2 mb-12">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <FiGlobe className="text-white text-xl" />
              </div>
              <span className="font-heading font-bold text-2xl text-white">Wander<span className="text-secondary">Lux</span></span>
            </Link>
            <div className="text-center">
              <h2 className="font-heading text-4xl font-bold text-white mb-4">Welcome Back, Explorer!</h2>
              <p className="text-white/70 text-lg">Your next adventure is just a login away. Discover amazing destinations and exclusive deals.</p>
              <div className="mt-8 grid grid-cols-3 gap-4">
                {['🏖️', '🏔️', '🗼', '🌴', '🏛️', '🗺️'].map((e, i) => (
                  <div key={i} className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl">{e}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-gray-950">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-md"
          >
            <div className="lg:hidden flex items-center gap-2 mb-8">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                  <FiGlobe className="text-white" />
                </div>
                <span className="font-heading font-bold text-xl text-gray-900 dark:text-white">Wander<span className="text-secondary">Lux</span></span>
              </Link>
            </div>

            <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-white mb-2">Sign In</h1>
            <p className="text-gray-500 mb-8">Enter your credentials to access your account.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label dark:text-gray-300">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="input-field pl-10 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="label dark:text-gray-300">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="input-field pl-10 pr-10 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  Remember me
                </label>
                <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 text-base">
                {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</span> : 'Sign In'}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              <span className="text-gray-400 text-sm">or try demo</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => dispatch(login({ email: 'user@demo.com', password: 'demo123' }))}
                className="py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              >
                👤 Demo User
              </button>
              <button
                onClick={() => dispatch(login({ email: 'admin@demo.com', password: 'demo123' }))}
                className="py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              >
                ⚙️ Demo Admin
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Create account</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  )
}
