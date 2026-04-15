import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiHeart, FiClock, FiUsers, FiMapPin, FiStar } from 'react-icons/fi'
import { toggleWishlist } from '../../store/slices/authSlice'

const categoryColors = {
  adventure: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
  honeymoon: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400',
  family: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  solo: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  luxury: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  budget: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  beach: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400',
  mountain: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
}

const PLACEHOLDER = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80'

export default function PackageCard({ pkg, delay = 0 }) {
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useSelector(s => s.auth)
  const isWishlisted = user?.wishlist?.includes(pkg._id)

  const handleWishlist = (e) => {
    e.preventDefault()
    if (!isAuthenticated) return
    dispatch(toggleWishlist(pkg._id))
  }

  const discountedPrice = pkg.pricing?.discountPercentage > 0
    ? pkg.pricing.adultPrice * (1 - pkg.pricing.discountPercentage / 100)
    : pkg.pricing?.adultPrice

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      className="card overflow-hidden group"
    >
      <Link to={`/packages/${pkg._id}`}>
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={pkg.coverImage || PLACEHOLDER}
            alt={pkg.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={e => { e.target.src = PLACEHOLDER }}
          />
          <div className="absolute inset-0 bg-card-gradient" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {pkg.isFeatured && (
              <span className="px-2 py-0.5 bg-secondary text-white text-xs font-bold rounded-full">Featured</span>
            )}
            {pkg.pricing?.discountPercentage > 0 && (
              <span className="px-2 py-0.5 bg-accent text-white text-xs font-bold rounded-full">
                {pkg.pricing.discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Wishlist */}
          {isAuthenticated && (
            <button
              onClick={handleWishlist}
              className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
                ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'}`}
            >
              <FiHeart className={isWishlisted ? 'fill-current' : ''} />
            </button>
          )}

          {/* Duration overlay */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs font-medium">
            <FiClock className="text-secondary" />
            {pkg.duration?.days}D/{pkg.duration?.nights}N
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Category tags */}
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {pkg.category?.slice(0, 2).map(cat => (
              <span key={cat} className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${categoryColors[cat] || 'bg-gray-100 text-gray-600'}`}>
                {cat}
              </span>
            ))}
          </div>

          <h3 className="font-heading font-bold text-gray-900 dark:text-white text-base leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {pkg.title}
          </h3>

          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mb-3">
            <FiMapPin className="text-primary flex-shrink-0" />
            <span className="truncate">{pkg.destination?.name || 'Multiple Destinations'}</span>
          </div>

          {/* Rating */}
          {pkg.averageRating > 0 && (
            <div className="flex items-center gap-1 mb-3">
              <FiStar className="text-amber-400 fill-amber-400 text-sm" />
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{Number(pkg.averageRating).toFixed(1)}</span>
              <span className="text-xs text-gray-400">({pkg.totalReviews} reviews)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs text-gray-400">Starting from</span>
              <div className="flex items-baseline gap-1.5">
                {pkg.pricing?.discountPercentage > 0 && (
                  <span className="text-xs text-gray-400 line-through">
                    ₹{pkg.pricing.adultPrice?.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xl font-bold text-primary">
                  ₹{discountedPrice?.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-gray-400">/person</span>
              </div>
            </div>
            <span className="px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-lg group-hover:bg-primary group-hover:text-white transition-all duration-200">
              View
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
