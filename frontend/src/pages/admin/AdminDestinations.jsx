import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiCheck } from 'react-icons/fi'
import { fetchDestinations, createDestination, updateDestination, deleteDestination } from '../../store/slices/destinationSlice'
import AdminLayout from '../../components/layout/AdminLayout'
import toast from 'react-hot-toast'

const CONTINENTS = ['Asia', 'Europe', 'Americas', 'Africa', 'Oceania', 'Antarctica']
const EMPTY = {
  name: '', country: '', continent: 'Asia', type: 'international',
  description: '', shortDescription: '', coverImage: '',
  highlights: [], tags: [], isFeatured: false, isActive: true,
  climate: { bestMonths: [] },
  visaInfo: { required: false, onArrival: false, eVisa: false }
}

export default function AdminDestinations() {
  const dispatch = useDispatch()
  const { destinations, loading, total } = useSelector(s => s.destinations)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [highlightsStr, setHighlightsStr] = useState('')
  const [tagsStr, setTagsStr] = useState('')

  useEffect(() => {
    dispatch(fetchDestinations({ search, limit: 20 }))
  }, [search])

  const openCreate = () => { setForm(EMPTY); setHighlightsStr(''); setTagsStr(''); setEditing(null); setShowModal(true) }
  const openEdit = (dest) => {
    setForm({ ...EMPTY, ...dest })
    setHighlightsStr(dest.highlights?.join('\n') || '')
    setTagsStr(dest.tags?.join(', ') || '')
    setEditing(dest._id)
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      highlights: highlightsStr.split('\n').filter(Boolean),
      tags: tagsStr.split(',').map(t => t.trim()).filter(Boolean),
    }
    if (editing) {
      await dispatch(updateDestination({ id: editing, ...payload }))
      // Re-fetch since updateDestination passes full body
      toast.success('Destination updated!')
    } else {
      await dispatch(createDestination(payload))
      toast.success('Destination created!')
    }
    setShowModal(false)
    dispatch(fetchDestinations({ limit: 20 }))
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this destination?')) return
    await dispatch(deleteDestination(id))
    toast.success('Destination deleted')
  }

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white">Destinations</h2>
            <p className="text-sm text-gray-500">{total} destinations</p>
          </div>
          <button onClick={openCreate} className="btn-primary"><FiPlus /> Add Destination</button>
        </div>

        <div className="relative max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search destinations..." className="input-field pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading ? Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-52 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
          )) : destinations.map(dest => (
            <motion.div key={dest._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 group">
              <div className="relative h-36 overflow-hidden">
                <img src={dest.coverImage || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=70'}
                  alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=70' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-2 right-2 flex gap-1">
                  {dest.isFeatured && <span className="px-1.5 py-0.5 bg-amber-400 text-white text-xs font-bold rounded-full">⭐</span>}
                  <span className={`px-1.5 py-0.5 text-xs font-bold rounded-full ${dest.isActive ? 'bg-accent text-white' : 'bg-red-500 text-white'}`}>
                    {dest.isActive ? '●' : '○'}
                  </span>
                </div>
                <div className="absolute bottom-2 left-3">
                  <p className="text-white font-bold text-sm">{dest.name}</p>
                  <p className="text-white/70 text-xs">{dest.country}</p>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div className="flex gap-1">
                  <span className="badge bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs capitalize">{dest.type}</span>
                  <span className="badge bg-blue-50 dark:bg-blue-900/20 text-blue-600 text-xs">{dest.continent}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(dest)} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"><FiEdit2 className="text-sm" /></button>
                  <button onClick={() => handleDelete(dest._id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><FiTrash2 className="text-sm" /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl my-4 shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-heading text-xl font-bold text-gray-900 dark:text-white">
                  {editing ? 'Edit Destination' : 'Add Destination'}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><FiX /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label dark:text-gray-300">Name *</label>
                    <input required type="text" className="input-field dark:bg-gray-800 dark:border-gray-700 dark:text-white" placeholder="e.g., Bali" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label dark:text-gray-300">Country *</label>
                    <input required type="text" className="input-field dark:bg-gray-800 dark:border-gray-700 dark:text-white" placeholder="e.g., Indonesia" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label dark:text-gray-300">Continent</label>
                    <select className="input-field dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={form.continent} onChange={e => setForm(f => ({ ...f, continent: e.target.value }))}>
                      {CONTINENTS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label dark:text-gray-300">Type</label>
                    <select className="input-field dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                      <option value="domestic">Domestic</option>
                      <option value="international">International</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label dark:text-gray-300">Cover Image URL</label>
                    <input type="url" className="input-field dark:bg-gray-800 dark:border-gray-700 dark:text-white" placeholder="https://..." value={form.coverImage} onChange={e => setForm(f => ({ ...f, coverImage: e.target.value }))} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label dark:text-gray-300">Short Description</label>
                    <input type="text" maxLength={200} className="input-field dark:bg-gray-800 dark:border-gray-700 dark:text-white" placeholder="Brief summary..." value={form.shortDescription || ''} onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label dark:text-gray-300">Full Description *</label>
                    <textarea required className="input-field dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label dark:text-gray-300">Highlights (one per line)</label>
                    <textarea className="input-field dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none text-sm" rows={3} value={highlightsStr} onChange={e => setHighlightsStr(e.target.value)} />
                  </div>
                  <div>
                    <label className="label dark:text-gray-300">Tags (comma-separated)</label>
                    <textarea className="input-field dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none text-sm" rows={3} value={tagsStr} onChange={e => setTagsStr(e.target.value)} />
                  </div>
                </div>
                <div className="flex gap-4 flex-wrap">
                  {[{ key: 'isActive', label: 'Active' }, { key: 'isFeatured', label: 'Featured' }].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} className="w-4 h-4 accent-primary" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-ghost flex-1 justify-center border border-gray-200 dark:border-gray-600">Cancel</button>
                  <button type="submit" className="btn-primary flex-1 justify-center">{editing ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
