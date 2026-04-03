import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiMapPin, FiSun, FiCalendar, FiArrowRight } from 'react-icons/fi'
import { fetchDestination } from '../store/slices/destinationSlice'
import { fetchPackages } from '../store/slices/packageSlice'
import PackageCard from '../components/packages/PackageCard'
import PageWrapper from '../components/common/PageWrapper'

export default function DestinationDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { current: dest } = useSelector(s => s.destinations)
  const { packages } = useSelector(s => s.packages)
  const PLACEHOLDER = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&q=80'

  useEffect(() => {
    dispatch(fetchDestination(id))
    dispatch(fetchPackages({ destination: id }))
  }, [id])

  if (!dest) return <div className="pt-20 text-center py-20">Loading...</div>

  return (
    <PageWrapper>
      <div className="pt-16 md:pt-20">
        <div className="relative h-80 md:h-[500px]">
          <img src={dest.coverImage || PLACEHOLDER} alt={dest.name} className="w-full h-full object-cover" onError={e => { e.target.src = PLACEHOLDER }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="page-container">
              <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
                <FiMapPin className="text-secondary" />{dest.country} · {dest.continent}
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs capitalize">{dest.type}</span>
              </div>
              <h1 className="font-heading text-5xl font-bold text-white text-shadow-lg">{dest.name}</h1>
            </div>
          </div>
        </div>

        <div className="page-container py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-3">About {dest.name}</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{dest.description}</p>
            </div>
            {dest.highlights?.length > 0 && (
              <div>
                <h3 className="font-heading text-xl font-bold text-gray-900 dark:text-white mb-3">Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {dest.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl">
                      <span className="text-secondary">✨</span>{h}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {packages.length > 0 && (
              <div>
                <h3 className="font-heading text-xl font-bold text-gray-900 dark:text-white mb-4">Packages to {dest.name}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {packages.slice(0, 4).map((pkg, i) => <PackageCard key={pkg._id} pkg={pkg} delay={i * 0.1} />)}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-5">
            {dest.climate && (
              <div className="card p-5">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2"><FiSun className="text-secondary" /> Best Time to Visit</h4>
                <div className="flex flex-wrap gap-1.5">
                  {dest.climate.bestMonths?.map(m => <span key={m} className="badge-primary capitalize">{m}</span>)}
                </div>
                {dest.climate.temperature && (
                  <p className="text-sm text-gray-500 mt-2">Temperature: {dest.climate.temperature.min}°–{dest.climate.temperature.max}°C</p>
                )}
              </div>
            )}
            {dest.visaInfo && (
              <div className="card p-5">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Visa Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Required</span><span className={dest.visaInfo.required ? 'text-red-500' : 'text-accent'}>{dest.visaInfo.required ? 'Yes' : 'No'}</span></div>
                  {dest.visaInfo.onArrival && <div className="flex justify-between"><span className="text-gray-500">On Arrival</span><span className="text-accent">Available</span></div>}
                  {dest.visaInfo.eVisa && <div className="flex justify-between"><span className="text-gray-500">e-Visa</span><span className="text-accent">Available</span></div>}
                  {dest.visaInfo.fee && <div className="flex justify-between"><span className="text-gray-500">Fee</span><span className="text-gray-800 dark:text-white">${dest.visaInfo.fee}</span></div>}
                </div>
              </div>
            )}
            {dest.currency && (
              <div className="card p-5">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Currency</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{dest.currency.name} ({dest.currency.code})</p>
                {dest.currency.exchangeRate && <p className="text-xs text-gray-400 mt-1">1 USD ≈ {dest.currency.exchangeRate} {dest.currency.code}</p>}
              </div>
            )}
            <Link to={`/packages?destination=${dest._id}`} className="btn-primary w-full justify-center">
              View All Packages <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
