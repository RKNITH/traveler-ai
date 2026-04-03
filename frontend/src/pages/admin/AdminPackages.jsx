import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiCheck, FiStar, FiPackage } from 'react-icons/fi'
import { fetchPackages, createPackage, updatePackage, deletePackage } from '../../store/slices/packageSlice'
import { fetchDestinations } from '../../store/slices/destinationSlice'
import AdminLayout from '../../components/layout/AdminLayout'
import toast from 'react-hot-toast'

const EMPTY_FORM = {
  title: '', description: '', shortDescription: '',
  destination: '', category: [],
  duration: { days: 5, nights: 4 },
  pricing: { adultPrice: 0, childPrice: 0, discountPercentage: 0, currency: 'INR' },
  difficulty: 'easy', maxGroupSize: 20, minGroupSize: 1,
  inclusions: [], exclusions: [], highlights: [], tags: [],
  coverImage: '', isActive: true, isFeatured: false, isPopular: false,
  availability: { isAvailable: true, slots: 20 }
}

const CATEGORIES = ['adventure','honeymoon','family','solo','group','luxury','budget','cultural','beach','mountain','wildlife']

export default function AdminPackages() {
  const dispatch = useDispatch()
  const { packages, loading, total } = useSelector(s => s.packages)
  const { destinations } = useSelector(s => s.destinations)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [page, setPage] = useState(1)
  const [listStr, setListStr] = useState({ inclusions: '', exclusions: '', highlights: '', tags: '' })

  useEffect(() => {
    dispatch(fetchPackages({ search, page, limit: 15 }))
    dispatch(fetchDestinations({ limit: 100 }))
  }, [search, page])

  const openCreate = () => { setForm(EMPTY_FORM); setEditing(null); setShowModal(true) }
  const openEdit = (pkg) => {
    setForm({
      ...pkg,
      destination: pkg.destination?._id || pkg.destination,
      pricing: pkg.pricing || EMPTY_FORM.pricing,
      duration: pkg.duration || EMPTY_FORM.duration,
    })
    setListStr({
      inclusions: pkg.inclusions?.join('\n') || '',
      exclusions: pkg.exclusions?.join('\n') || '',
      highlights: pkg.highlights?.join('\n') || '',
      tags: pkg.tags?.join(', ') || '',
    })
    setEditing(pkg._id)
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      inclusions: listStr.inclusions.split('\n').filter(Boolean),
      exclusions: listStr.exclusions.split('\n').filter(Boolean),
      highlights: listStr.highlights.split('\n').filter(Boolean),
      tags: listStr.tags.split(',').map(t => t.trim()).filter(Boolean),
    }
    if (editing) {
      await dispatch(updatePackage({ id: editing, data: payload }))
      toast.success('Package updated!')
    } else {
      await dispatch(createPackage(payload))
      toast.success('Package created!')
    }
    setShowModal(false)
    dispatch(fetchPackages({ page, limit: 15 }))
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this package?')) return
    await dispatch(deletePackage(id))
    toast.success('Package deleted')
  }

  const toggleCategory = (cat) => {
    setForm(f => ({
      ...f,
      category: f.category.includes(cat) ? f.category.filter(c => c !== cat) : [...f.category, cat]
    }))
  }

  return (
    <AdminLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white">Packages</h2>
            <p className="text-sm text-gray-500">{total} packages total</p>
          </div>
          <button onClick={openCreate} className="btn-primary">
            <FiPlus /> Add Package
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search packages..." className="input-field pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  {['Package', 'Destination', 'Category', 'Price', 'Duration', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></td></tr>
                  ))
                ) : packages.map(pkg => (
                  <motion.tr key={pkg._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {pkg.coverImage && <img src={pkg.coverImage} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" onError={e => e.target.style.display='none'} />}
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 dark:text-white truncate max-w-40">{pkg.title}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            {pkg.averageRating > 0 && <>
                              <FiStar className="text-amber-400 fill-amber-400 text-xs" />
                              <span className="text-xs text-gray-400">{Number(pkg.averageRating).toFixed(1)}</span>
                            </>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-xs">{pkg.destination?.name || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {pkg.category?.slice(0, 2).map(c => (
                          <span key={c} className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-xs capitalize">{c}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-primary">₹{pkg.pricing?.adultPrice?.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{pkg.duration?.days}D/{pkg.duration?.nights}N</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className={`badge text-xs ${pkg.isActive ? 'badge-success' : 'badge-error'}`}>{pkg.isActive ? 'Active' : 'Inactive'}</span>
                        {pkg.isFeatured && <span className="badge bg-amber-100 text-amber-700 text-xs">Featured</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(pkg)} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"><FiEdit2 /></button>
                        <button onClick={() => handleDelete(pkg._id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><FiTrash2 /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {total > 15 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: Math.ceil(total / 15) }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${page === i + 1 ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-3xl my-4 shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-heading text-xl font-bold text-gray-900 dark:text-white">
                  {editing ? 'Edit Package' : 'Create New Package'}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><FiX /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="label dark:text-gray-300">Package Title *</label>
                    <input required type="text" className="input-field dark:bg-gray-800 dark:border-gray-700 dark:text-white" placeholder="e.g., Enchanting Kerala Backwaters" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label dark:text-gray-300">Destination</label>
                    <select className="input-field dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}>
                      <option value="">Select destination</option>
                      {destinations.map(d => <option key={d._id} value={d._id}>{d.name}, {d.country}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label dark:text-gray-300">Cover Image URL</label>
                    <input type="url" className="input-field dark:bg-gray-800 dark:border-gray-700 dark:text-white" placeholder="https://..." value={form.coverImage} onChange={e => setForm(f => ({ ...f, coverImage: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label dark:text-gray-300">Adult Price (₹) *</label>
                    <input required type="number" min="0" className="input-field dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={form.pricing.adultPrice} onChange={e => setForm(f => ({ ...f, pricing: { ...f.pricing, adultPrice: +e.target.value } }))} />
                  </div>
                  <div>
                    <label className="label dark:text-gray-300">Child Price (₹)</label>
                    <input type="number" min="0" className="input-field dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={form.pricing.childPrice} onChange={e => setForm(f => ({ ...f, pricing: { ...f.pricing, childPrice: +e.target.value } }))} />
                  </div>
                  <div>
                    <label className="label dark:text-gray-300">Days</label>
                    <input type="number" min="1" className="input-field dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={form.duration.days} onChange={e => setForm(f => ({ ...f, duration: { ...f.duration, days: +e.target.value, nights: +e.target.value - 1 } }))} />
                  </div>
                  <div>
                    <label className="label dark:text-gray-300">Discount %</label>
                    <input type="number" min="0" max="100" className="input-field dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={form.pricing.discountPercentage} onChange={e => setForm(f => ({ ...f, pricing: { ...f.pricing, discountPercentage: +e.target.value } }))} />
                  </div>
                  <div>
                    <label className="label dark:text-gray-300">Max Group Size</label>
                    <input type="number" min="1" className="input-field dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={form.maxGroupSize} onChange={e => setForm(f => ({ ...f, maxGroupSize: +e.target.value }))} />
                  </div>
                  <div>
                    <label className="label dark:text-gray-300">Difficulty</label>
                    <select className="input-field dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}>
                      {['easy','moderate','challenging','expert'].map(d => <option key={d} value={d} className="capitalize">{d}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label dark:text-gray-300">Short Description</label>
                  <input type="text" className="input-field dark:bg-gray-800 dark:border-gray-700 dark:text-white" placeholder="Brief summary (max 300 chars)" value={form.shortDescription || ''} onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))} maxLength={300} />
                </div>

                <div>
                  <label className="label dark:text-gray-300">Full Description</label>
                  <textarea className="input-field dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none" rows={3} placeholder="Detailed description..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>

                <div>
                  <label className="label dark:text-gray-300">Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                      <button key={cat} type="button" onClick={() => toggleCategory(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${form.category?.includes(cat) ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                        {form.category?.includes(cat) && <FiCheck className="inline mr-1" />}{cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'inclusions', label: 'Inclusions (one per line)' },
                    { key: 'exclusions', label: 'Exclusions (one per line)' },
                    { key: 'highlights', label: 'Highlights (one per line)' },
                    { key: 'tags', label: 'Tags (comma-separated)' },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="label dark:text-gray-300">{label}</label>
                      <textarea className="input-field dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none text-sm" rows={3} value={listStr[key]}
                        onChange={e => setListStr(s => ({ ...s, [key]: e.target.value }))} />
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 flex-wrap">
                  {[
                    { key: 'isActive', label: 'Active' },
                    { key: 'isFeatured', label: 'Featured' },
                    { key: 'isPopular', label: 'Popular' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} className="w-4 h-4 accent-primary" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-ghost flex-1 justify-center border border-gray-200 dark:border-gray-600">Cancel</button>
                  <button type="submit" className="btn-primary flex-1 justify-center">{editing ? 'Update Package' : 'Create Package'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
