import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSearch, FiGlobe } from 'react-icons/fi'
import { fetchDestinations } from '../store/slices/destinationSlice'
import DestinationCard from '../components/destinations/DestinationCard'
import PageWrapper from '../components/common/PageWrapper'
import { SkeletonCard } from '../components/common/Skeleton'

const CONTINENTS = ['Asia', 'Europe', 'Americas', 'Africa', 'Oceania']
const TYPES = [{ label: 'All', value: '' }, { label: 'Domestic', value: 'domestic' }, { label: 'International', value: 'international' }]

export default function Destinations() {
  const dispatch = useDispatch()
  const { destinations, loading, total, pages } = useSelector(s => s.destinations)
  const [search, setSearch] = useState('')
  const [continent, setContinent] = useState('')
  const [type, setType] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchDestinations({ search, continent, type, page }))
    }, 300)
    return () => clearTimeout(timer)
  }, [search, continent, type, page])

  return (
    <PageWrapper>
      <div className="pt-16 md:pt-20">
        <div className="bg-gradient-to-br from-primary-900 to-primary py-16 px-4">
          <div className="page-container text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">Explore Destinations</h1>
            <p className="text-white/70 text-lg mb-6">Discover {total}+ incredible destinations across the globe</p>
            <div className="max-w-md mx-auto relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search destinations..." className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-gray-800 outline-none shadow-lg"
                value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
            </div>
          </div>
        </div>

        <div className="page-container py-8">
          <div className="flex flex-wrap gap-3 mb-6">
            {TYPES.map(t => (
              <button key={t.value} onClick={() => { setType(t.value); setPage(1) }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${type === t.value ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}>
                {t.label}
              </button>
            ))}
            <div className="w-px bg-gray-200 dark:bg-gray-700" />
            {CONTINENTS.map(c => (
              <button key={c} onClick={() => { setContinent(continent === c ? '' : c); setPage(1) }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${continent === c ? 'bg-secondary text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}>
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : destinations.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinations.map((dest, i) => <DestinationCard key={dest._id} destination={dest} delay={i * 0.05} variant="featured" />)}
              </div>
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: pages }).map((_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-xl font-medium text-sm transition-all ${page === i + 1 ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <FiGlobe className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="font-heading text-2xl font-bold text-gray-700 dark:text-white mb-2">No destinations found</h3>
              <p className="text-gray-400">Try a different search term or filter</p>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
