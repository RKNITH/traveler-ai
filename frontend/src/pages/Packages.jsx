import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiFilter, FiGrid, FiList, FiSearch, FiX, FiChevronDown } from 'react-icons/fi'
import { fetchPackages, setFilters, clearFilters } from '../store/slices/packageSlice'
import PackageCard from '../components/packages/PackageCard'
import PageWrapper from '../components/common/PageWrapper'
import { SkeletonCard } from '../components/common/Skeleton'

const CATEGORIES = ['adventure', 'honeymoon', 'family', 'solo', 'luxury', 'budget', 'beach', 'mountain', 'cultural', 'wildlife']
const DURATIONS = [{ label: 'Any', value: '' }, { label: '1-3 Days', value: '1-3' }, { label: '4-7 Days', value: '4-7' }, { label: '8-14 Days', value: '8-14' }, { label: '15+ Days', value: '15-100' }]
const SORT_OPTIONS = [
  { label: 'Newest', value: '-createdAt' },
  { label: 'Price: Low to High', value: 'pricing.adultPrice' },
  { label: 'Price: High to Low', value: '-pricing.adultPrice' },
  { label: 'Most Popular', value: '-totalBookings' },
  { label: 'Top Rated', value: '-averageRating' },
]

export default function Packages() {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { packages, loading, total, pages, filters } = useSelector(s => s.packages)
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [localFilters, setLocalFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: '', maxPrice: '', duration: '', sort: '-createdAt'
  })

  useEffect(() => {
    dispatch(fetchPackages({ ...localFilters, page }))
  }, [localFilters, page])

  const handleFilterChange = (key, value) => {
    setLocalFilters(f => ({ ...f, [key]: value }))
    setPage(1)
  }

  const handleReset = () => {
    setLocalFilters({ search: '', category: '', minPrice: '', maxPrice: '', duration: '', sort: '-createdAt' })
    setPage(1)
  }

  const activeFiltersCount = [localFilters.category, localFilters.minPrice, localFilters.maxPrice, localFilters.duration].filter(Boolean).length

  return (
    <PageWrapper>
      <div className="pt-16 md:pt-20 min-h-screen bg-white dark:bg-gray-950">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary-900 to-primary py-16 px-4">
          <div className="page-container text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">
              Explore Tour Packages
            </motion.h1>
            <p className="text-white/70 text-lg">Discover {total}+ curated travel experiences for every type of traveler</p>
          </div>
        </div>

        <div className="page-container py-8">
          {/* Search + Sort Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search packages, destinations..."
                className="input-field pl-10 w-full"
                value={localFilters.search}
                onChange={e => handleFilterChange('search', e.target.value)}
              />
            </div>
            <select
              className="input-field w-auto min-w-44"
              value={localFilters.sort}
              onChange={e => handleFilterChange('sort', e.target.value)}
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-medium text-sm transition-all ${showFilters ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-700 hover:border-primary'}`}
            >
              <FiFilter /> Filters {activeFiltersCount > 0 && <span className="bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{activeFiltersCount}</span>}
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6 shadow-card"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Categories */}
                <div>
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 text-sm">Category</h4>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => handleFilterChange('category', localFilters.category === cat ? '' : cat)}
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${localFilters.category === cat ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-primary/10'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget Range */}
                <div>
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 text-sm">Budget (₹/person)</h4>
                  <div className="flex gap-2 items-center">
                    <input type="number" placeholder="Min" className="input-field text-sm py-2" value={localFilters.minPrice} onChange={e => handleFilterChange('minPrice', e.target.value)} />
                    <span className="text-gray-400">–</span>
                    <input type="number" placeholder="Max" className="input-field text-sm py-2" value={localFilters.maxPrice} onChange={e => handleFilterChange('maxPrice', e.target.value)} />
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 text-sm">Duration</h4>
                  <div className="flex flex-wrap gap-2">
                    {DURATIONS.map(d => (
                      <button
                        key={d.value}
                        onClick={() => handleFilterChange('duration', d.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${localFilters.duration === d.value ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-primary/10'}`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reset */}
                <div className="flex items-end">
                  <button onClick={handleReset} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium">
                    <FiX /> Reset Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Category Quick Filters */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-1">
            <button
              onClick={() => handleFilterChange('category', '')}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${!localFilters.category ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
            >
              All
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleFilterChange('category', localFilters.category === cat ? '' : cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${localFilters.category === cat ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary/10'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing <span className="font-semibold text-gray-800 dark:text-white">{packages.length}</span> of <span className="font-semibold text-gray-800 dark:text-white">{total}</span> packages
            </p>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : packages.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {packages.map((pkg, i) => <PackageCard key={pkg._id} pkg={pkg} delay={i * 0.03} />)}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: pages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-xl font-medium text-sm transition-all ${page === i + 1 ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary/10'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-6xl mb-4">🔍</p>
              <h3 className="font-heading text-2xl font-bold text-gray-700 dark:text-white mb-2">No packages found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your filters or search terms</p>
              <button onClick={handleReset} className="btn-primary">Clear Filters</button>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
