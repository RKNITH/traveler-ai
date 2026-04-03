import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageWrapper from '../components/common/PageWrapper'

export default function NotFound() {
  return (
    <PageWrapper>
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="text-8xl mb-6">🗺️</div>
          <h1 className="font-heading text-6xl font-bold text-gray-900 dark:text-white mb-3">404</h1>
          <h2 className="font-heading text-2xl font-bold text-gray-700 dark:text-gray-300 mb-3">Page Not Found</h2>
          <p className="text-gray-400 mb-8 max-w-sm mx-auto">Looks like you've wandered off the beaten path! Let's get you back on track.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/" className="btn-primary">Back to Home</Link>
            <Link to="/packages" className="btn-outline">Explore Packages</Link>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  )
}
