import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiMapPin, FiClock, FiUsers, FiStar, FiHeart, FiShare2, FiCheck, FiX, FiChevronDown, FiChevronUp, FiCalendar } from 'react-icons/fi'
import { fetchPackage } from '../store/slices/packageSlice'
import { toggleWishlist } from '../store/slices/authSlice'
import PageWrapper from '../components/common/PageWrapper'
import StarRating from '../components/common/StarRating'
import { SkeletonText } from '../components/common/Skeleton'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80'

export default function PackageDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { current: pkg, loading } = useSelector(s => s.packages)
  const { user, isAuthenticated } = useSelector(s => s.auth)
  const [activeImg, setActiveImg] = useState(0)
  const [activeTab, setActiveTab] = useState('itinerary')
  const [expandedDay, setExpandedDay] = useState(0)

  const isWishlisted = user?.wishlist?.includes(pkg?._id)

  useEffect(() => { dispatch(fetchPackage(id)) }, [id])

  if (loading || !pkg) {
    return (
      <div className="pt-20 page-container py-10">
        <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse mb-8" />
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-4"><SkeletonText lines={6} /></div>
        </div>
      </div>
    )
  }

  const images = pkg.images?.length > 0 ? pkg.images : [{ url: PLACEHOLDER }]
  const discountedPrice = pkg.pricing?.discountPercentage > 0
    ? pkg.pricing.adultPrice * (1 - pkg.pricing.discountPercentage / 100)
    : pkg.pricing?.adultPrice

  return (
    <PageWrapper>
      <div className="pt-16 md:pt-20">
        {/* Image Gallery */}
        <div className="relative h-72 md:h-[500px] bg-gray-900">
          <motion.img
            key={activeImg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src={images[activeImg]?.url || PLACEHOLDER}
            alt={pkg.title}
            className="w-full h-full object-cover"
            onError={e => { e.target.src = PLACEHOLDER }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${i === activeImg ? 'bg-white w-8' : 'bg-white/50'}`}
                />
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="absolute top-4 right-4 flex gap-2">
            {isAuthenticated && (
              <button
                onClick={() => dispatch(toggleWishlist(pkg._id))}
                className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 transition-all ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-red-500'}`}
              >
                <FiHeart className={isWishlisted ? 'fill-current' : ''} />
              </button>
            )}
            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center">
              <FiShare2 />
            </button>
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {pkg.isFeatured && <span className="px-3 py-1 bg-secondary text-white text-xs font-bold rounded-full">⭐ Featured</span>}
            {pkg.pricing?.discountPercentage > 0 && <span className="px-3 py-1 bg-accent text-white text-xs font-bold rounded-full">{pkg.pricing.discountPercentage}% OFF</span>}
          </div>
        </div>

        <div className="page-container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title + Meta */}
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {pkg.category?.map(cat => (
                    <span key={cat} className="badge-primary capitalize">{cat}</span>
                  ))}
                </div>
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">{pkg.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  {pkg.destination && (
                    <span className="flex items-center gap-1"><FiMapPin className="text-primary" />{pkg.destination.name}, {pkg.destination.country}</span>
                  )}
                  <span className="flex items-center gap-1"><FiClock className="text-primary" />{pkg.duration?.days}D / {pkg.duration?.nights}N</span>
                  <span className="flex items-center gap-1"><FiUsers className="text-primary" />Max {pkg.maxGroupSize} people</span>
                  {pkg.averageRating > 0 && <StarRating rating={pkg.averageRating} count={pkg.totalReviews} />}
                </div>
              </div>

              {/* Description */}
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{pkg.description}</p>
              </div>

              {/* Highlights */}
              {pkg.highlights?.length > 0 && (
                <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-5 border border-primary/20">
                  <h3 className="font-heading font-bold text-gray-900 dark:text-white mb-3">✨ Trip Highlights</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {pkg.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <FiCheck className="text-accent mt-0.5 flex-shrink-0" />{h}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div>
                <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700 mb-5 overflow-x-auto scrollbar-hide">
                  {['itinerary', 'inclusions', 'accommodation', 'reviews'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2.5 text-sm font-medium capitalize whitespace-nowrap transition-all border-b-2 -mb-px ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Itinerary Tab */}
                {activeTab === 'itinerary' && pkg.itinerary?.length > 0 && (
                  <div className="space-y-3">
                    {pkg.itinerary.map((day, i) => (
                      <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setExpandedDay(expandedDay === i ? -1 : i)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-primary rounded-lg text-white text-sm font-bold flex items-center justify-center">{day.day}</span>
                            <span className="font-semibold text-gray-800 dark:text-white">{day.title}</span>
                          </div>
                          {expandedDay === i ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                        {expandedDay === i && (
                          <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400 my-3">{day.description}</p>
                            {day.activities?.length > 0 && (
                              <ul className="space-y-1">
                                {day.activities.map((act, j) => (
                                  <li key={j} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />{act}
                                  </li>
                                ))}
                              </ul>
                            )}
                            {day.accommodation && <p className="text-sm mt-2 text-gray-500"><strong>Stay:</strong> {day.accommodation}</p>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Inclusions Tab */}
                {activeTab === 'inclusions' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pkg.inclusions?.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                          <FiCheck className="text-accent" /> What's Included
                        </h4>
                        <ul className="space-y-2">
                          {pkg.inclusions.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <FiCheck className="text-accent mt-0.5 flex-shrink-0" />{item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {pkg.exclusions?.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                          <FiX className="text-red-500" /> What's Not Included
                        </h4>
                        <ul className="space-y-2">
                          {pkg.exclusions.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <FiX className="text-red-400 mt-0.5 flex-shrink-0" />{item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Accommodation Tab */}
                {activeTab === 'accommodation' && (
                  <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    <p>{pkg.accommodation?.type || 'Accommodation details will be provided upon booking.'}</p>
                    {pkg.accommodation?.hotels?.map((hotel, i) => (
                      <div key={i} className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                        <h4 className="font-semibold text-gray-800 dark:text-white">{hotel.name}</h4>
                        <p className="text-xs text-gray-400">{hotel.location}</p>
                        <div className="flex gap-1 mt-1">
                          {Array.from({ length: hotel.rating || 3 }).map((_, j) => <FiStar key={j} className="text-amber-400 fill-amber-400 text-xs" />)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="text-center py-8 text-gray-400">
                    <FiStar className="text-4xl mx-auto mb-2" />
                    <p>Reviews coming soon. Be the first to review!</p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT - Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 card p-6 space-y-4">
                <div>
                  <span className="text-xs text-gray-400">Starting from</span>
                  <div className="flex items-baseline gap-2">
                    {pkg.pricing?.discountPercentage > 0 && (
                      <span className="text-sm text-gray-400 line-through">₹{pkg.pricing.adultPrice?.toLocaleString('en-IN')}</span>
                    )}
                    <span className="text-3xl font-bold text-primary">₹{discountedPrice?.toLocaleString('en-IN')}</span>
                    <span className="text-sm text-gray-400">/person</span>
                  </div>
                  {pkg.pricing?.discountPercentage > 0 && (
                    <span className="badge-success mt-1">You save ₹{(pkg.pricing.adultPrice - discountedPrice)?.toLocaleString('en-IN')}</span>
                  )}
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  {[
                    { icon: <FiClock />, label: 'Duration', value: `${pkg.duration?.days} Days / ${pkg.duration?.nights} Nights` },
                    { icon: <FiUsers />, label: 'Group Size', value: `${pkg.minGroupSize || 1} - ${pkg.maxGroupSize} People` },
                    { icon: <FiMapPin />, label: 'Difficulty', value: pkg.difficulty || 'Easy', capitalize: true },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-3 p-3 text-sm ${i < 2 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}>
                      <span className="text-primary">{item.icon}</span>
                      <div className="flex justify-between w-full">
                        <span className="text-gray-500">{item.label}</span>
                        <span className={`font-medium text-gray-800 dark:text-white ${item.capitalize ? 'capitalize' : ''}`}>{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {pkg.availability?.isAvailable ? (
                  <button
                    onClick={() => isAuthenticated ? navigate(`/booking/${pkg._id}`) : navigate('/login')}
                    className="btn-primary w-full justify-center py-4 text-base"
                  >
                    <FiCalendar /> Book Now
                  </button>
                ) : (
                  <button disabled className="w-full py-4 bg-gray-200 text-gray-500 rounded-xl font-semibold cursor-not-allowed">
                    Currently Unavailable
                  </button>
                )}

                <button
                  onClick={() => isAuthenticated ? dispatch(toggleWishlist(pkg._id)) : navigate('/login')}
                  className="btn-outline w-full justify-center"
                >
                  <FiHeart className={isWishlisted ? 'fill-current text-red-500' : ''} />
                  {isWishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}
                </button>

                <p className="text-xs text-center text-gray-400">Free cancellation up to 30 days before departure</p>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Price includes:</p>
                  {['Hotel accommodation', 'Daily breakfast', 'Airport transfers', 'Tour guide'].map(item => (
                    <div key={item} className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <FiCheck className="text-accent" />{item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
