import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMapPin, FiStar } from 'react-icons/fi'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80'

export default function DestinationCard({ destination, delay = 0, variant = 'default' }) {
  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay }}
        whileHover={{ y: -6 }}
        className="group relative rounded-3xl overflow-hidden cursor-pointer"
      >
        <Link to={`/destinations/${destination._id}`}>
          <div className="relative h-72">
            <img
              src={destination.coverImage || PLACEHOLDER}
              alt={destination.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={e => { e.target.src = PLACEHOLDER }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-1.5 text-white/80 text-sm mb-1">
                <FiMapPin className="text-secondary" />
                <span>{destination.country}</span>
              </div>
              <h3 className="font-heading font-bold text-white text-2xl text-shadow">{destination.name}</h3>
              {destination.averageRating > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <FiStar className="text-amber-400 fill-amber-400 text-sm" />
                  <span className="text-white text-sm">{Number(destination.averageRating).toFixed(1)}</span>
                </div>
              )}
            </div>
            {destination.type && (
              <span className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full capitalize border border-white/30">
                {destination.type}
              </span>
            )}
          </div>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      className="card overflow-hidden group"
    >
      <Link to={`/destinations/${destination._id}`}>
        <div className="relative h-44 overflow-hidden">
          <img
            src={destination.coverImage || PLACEHOLDER}
            alt={destination.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={e => { e.target.src = PLACEHOLDER }}
          />
          <div className="absolute inset-0 bg-card-gradient" />
          <span className="absolute top-3 right-3 px-2 py-0.5 bg-white/90 text-gray-700 text-xs font-semibold rounded-full capitalize">
            {destination.type}
          </span>
        </div>
        <div className="p-4">
          <h3 className="font-heading font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
            {destination.name}
          </h3>
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mt-1">
            <FiMapPin className="text-primary text-xs" />
            <span>{destination.country}</span>
            <span className="mx-1">·</span>
            <span>{destination.continent}</span>
          </div>
          {destination.shortDescription && (
            <p className="text-xs text-gray-400 mt-2 line-clamp-2">{destination.shortDescription}</p>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
