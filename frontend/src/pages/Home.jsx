import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiSearch, FiMapPin, FiCalendar, FiUsers, FiArrowRight, FiStar, FiShield, FiAward, FiHeadphones } from 'react-icons/fi'
import { RiPlaneLine, RiRobot2Line } from 'react-icons/ri'
import { fetchFeaturedDestinations } from '../store/slices/destinationSlice'
import { fetchFeaturedPackages, fetchPopularPackages } from '../store/slices/packageSlice'
import PackageCard from '../components/packages/PackageCard'
import DestinationCard from '../components/destinations/DestinationCard'
import PageWrapper from '../components/common/PageWrapper'
import { SkeletonCard } from '../components/common/Skeleton'
import { Link } from 'react-router-dom'

const heroImages = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=85',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=85',
  'https://images.unsplash.com/photo-1543158266-0066955047b1?w=1600&q=85',
]

const categories = [
  { label: 'Adventure', icon: '🏔️', value: 'adventure' },
  { label: 'Honeymoon', icon: '💑', value: 'honeymoon' },
  { label: 'Family', icon: '👨‍👩‍👧‍👦', value: 'family' },
  { label: 'Beach', icon: '🏖️', value: 'beach' },
  { label: 'Cultural', icon: '🏛️', value: 'cultural' },
  { label: 'Solo', icon: '🎒', value: 'solo' },
]

const stats = [
  { value: '50,000+', label: 'Happy Travelers' },
  { value: '200+', label: 'Destinations' },
  { value: '500+', label: 'Tour Packages' },
  { value: '4.9★', label: 'Average Rating' },
]

const features = [
  { icon: <RiRobot2Line className="text-3xl" />, title: 'AI-Powered Planning', desc: 'Get personalized itineraries crafted by Gemini AI based on your preferences, budget, and travel style.' },
  { icon: <FiShield className="text-3xl" />, title: 'Secure Booking', desc: 'SSL-encrypted payments and instant confirmation. Your data and money are always protected.' },
  { icon: <FiAward className="text-3xl" />, title: 'Best Price Guarantee', desc: 'We promise the lowest prices. Find it cheaper elsewhere? We\'ll match it and give you extra 5% off.' },
  { icon: <FiHeadphones className="text-3xl" />, title: '24/7 Support', desc: 'Our travel experts are available around the clock to assist you before, during, and after your trip.' },
]

const testimonials = [
  { name: 'Priya Sharma', location: 'Mumbai', rating: 5, text: 'WanderLux made our Maldives honeymoon absolutely magical! The AI planner suggested activities we never would have found ourselves.', avatar: 'https://i.pravatar.cc/60?img=1' },
  { name: 'Rahul Gupta', location: 'Delhi', rating: 5, text: 'Booked a family trip to Rajasthan. Everything was perfectly organized. The team took care of every detail!', avatar: 'https://i.pravatar.cc/60?img=3' },
  { name: 'Ananya Patel', location: 'Bangalore', rating: 5, text: 'Solo trip to Ladakh was my best decision. WanderLux handled all logistics. I just focused on the experience!', avatar: 'https://i.pravatar.cc/60?img=5' },
]

export default function Home() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { featured: featuredDest } = useSelector(s => s.destinations)
  const { featured: featuredPkg, popular: popularPkg } = useSelector(s => s.packages)
  const [heroIdx, setHeroIdx] = useState(0)
  const [search, setSearch] = useState('')
  const [travelers, setTravelers] = useState(2)

  useEffect(() => {
    dispatch(fetchFeaturedDestinations())
    dispatch(fetchFeaturedPackages())
    dispatch(fetchPopularPackages())
    const interval = setInterval(() => setHeroIdx(i => (i + 1) % heroImages.length), 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/packages?search=${search}`)
  }

  return (
    <PageWrapper>
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center">
        {/* Background images with crossfade */}
        {heroImages.map((img, i) => (
          <motion.div
            key={img}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: i === heroIdx ? 1 : 0 }}
            transition={{ duration: 1.2 }}
          >
            <img src={img} alt="Travel" className="w-full h-full object-cover" />
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        {/* Hero dots */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIdx(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === heroIdx ? 'bg-white w-6' : 'bg-white/40'}`}
            />
          ))}
        </div>

        <div className="relative z-10 page-container pt-28 pb-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm mb-6"
            >
              <RiPlaneLine className="text-secondary" />
              <span>AI-Powered Travel Planning</span>
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            </motion.div>

            <h1 className="font-heading text-5xl md:text-7xl font-bold text-white mb-6 text-shadow-lg leading-tight">
              Discover the World's
              <span className="block text-secondary italic">Most Beautiful</span>
              Places
            </h1>

            <p className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Craft your perfect journey with AI-powered itineraries, handpicked packages, and expert travel guidance.
            </p>

            {/* Search Form */}
            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-3 shadow-2xl max-w-3xl mx-auto flex flex-col md:flex-row gap-3"
            >
              <div className="flex-1 flex items-center gap-2 px-3">
                <FiSearch className="text-primary text-xl flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400 text-sm"
                />
              </div>
              <div className="flex items-center gap-2 px-3 border-l border-gray-200 dark:border-gray-700">
                <FiUsers className="text-primary text-xl flex-shrink-0" />
                <select
                  value={travelers}
                  onChange={e => setTravelers(e.target.value)}
                  className="bg-transparent outline-none text-gray-800 dark:text-white text-sm"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <option key={n} value={n}>{n} Traveler{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn-primary whitespace-nowrap">
                <FiSearch /> Search
              </button>
            </motion.form>

            {/* Categories quick links */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                >
                  <Link
                    to={`/packages?category=${cat.value}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm hover:bg-white/20 transition-all"
                  >
                    <span>{cat.icon}</span> {cat.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-primary py-12">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-heading font-bold text-white">{stat.value}</div>
                <div className="text-primary-200 text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED DESTINATIONS */}
      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="page-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-2">Explore the World</p>
              <h2 className="section-title dark:text-white">Popular Destinations</h2>
            </div>
            <Link to="/destinations" className="btn-outline hidden md:flex">
              View All <FiArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDest.length > 0
              ? featuredDest.slice(0, 6).map((dest, i) => (
                <DestinationCard key={dest._id} destination={dest} delay={i * 0.1} variant="featured" />
              ))
              : Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            }
          </div>
          <div className="text-center mt-8 md:hidden">
            <Link to="/destinations" className="btn-outline">View All Destinations <FiArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* AI PLANNER CTA */}
      <section className="section-padding bg-gradient-to-br from-primary-900 via-primary-800 to-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 100 + 20,
                height: Math.random() * 100 + 20,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.3,
              }}
            />
          ))}
        </div>
        <div className="page-container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20">
              <RiRobot2Line className="text-4xl text-white" />
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
              Let AI Plan Your Perfect Trip
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Tell our Gemini-powered AI your destination, budget, and preferences. Get a detailed day-by-day itinerary in seconds — completely free!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/ai-planner" className="btn-secondary text-lg px-8 py-4">
                <RiPlaneLine /> Start Planning Free
              </Link>
              <Link to="/packages" className="px-8 py-4 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all text-lg flex items-center gap-2 justify-center">
                Browse Packages <FiArrowRight />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED PACKAGES */}
      <section className="section-padding bg-white dark:bg-gray-950">
        <div className="page-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-2">Handpicked For You</p>
              <h2 className="section-title dark:text-white">Featured Packages</h2>
            </div>
            <Link to="/packages" className="btn-outline hidden md:flex">View All <FiArrowRight /></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPkg.length > 0
              ? featuredPkg.slice(0, 8).map((pkg, i) => (
                <PackageCard key={pkg._id} pkg={pkg} delay={i * 0.05} />
              ))
              : Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            }
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="page-container">
          <div className="text-center mb-12">
            <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-2">Why WanderLux</p>
            <h2 className="section-title dark:text-white">Travel Smarter, Not Harder</h2>
            <p className="section-subtitle mx-auto dark:text-gray-400">We combine cutting-edge technology with human expertise to deliver travel experiences beyond expectations.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card card-hover p-6 text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                  {f.icon}
                </div>
                <h3 className="font-heading font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-padding bg-white dark:bg-gray-950">
        <div className="page-container">
          <div className="text-center mb-12">
            <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-2">Traveler Stories</p>
            <h2 className="section-title dark:text-white">What Our Travelers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <FiStar key={j} className="text-amber-400 fill-amber-400 text-sm" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1"><FiMapPin className="text-xs" />{t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-16 bg-gradient-to-r from-secondary to-orange-600">
        <div className="page-container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-3">Get Exclusive Travel Deals</h2>
            <p className="text-white/80 mb-8">Subscribe to our newsletter and receive curated deals, travel tips, and early access to flash sales.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Your email address" className="flex-1 px-5 py-3 rounded-xl outline-none text-gray-800 text-sm" />
              <button type="submit" className="px-6 py-3 bg-white text-secondary font-bold rounded-xl hover:bg-gray-50 transition-all whitespace-nowrap">
                Subscribe
              </button>
            </form>
            <p className="text-white/60 text-xs mt-3">No spam. Unsubscribe anytime.</p>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  )
}
