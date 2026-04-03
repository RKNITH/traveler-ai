import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiSearch, FiUserCheck, FiUserX, FiShield } from 'react-icons/fi'
import { fetchAllUsers } from '../../store/slices/adminSlice'
import AdminLayout from '../../components/layout/AdminLayout'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const dispatch = useDispatch()
  const { users, loading } = useSelector(s => s.admin)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  useEffect(() => {
    dispatch(fetchAllUsers({ search, role: roleFilter || undefined }))
  }, [search, roleFilter])

  const handleToggleStatus = async (id) => {
    try {
      const res = await api.put(`/admin/users/${id}/status`)
      toast.success(res.data.message)
      dispatch(fetchAllUsers())
    } catch (e) { toast.error('Failed to update status') }
  }

  const handleRoleUpdate = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}/role`, { role })
      toast.success('Role updated')
      dispatch(fetchAllUsers())
    } catch (e) { toast.error('Failed to update role') }
  }

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div>
          <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white">Users</h2>
          <p className="text-sm text-gray-500">{users.length} users loaded</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by name or email..." className="input-field pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white w-full"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input-field w-auto dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
          </select>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  {['User', 'Email', 'Phone', 'Role', 'Points', 'Joined', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}><td colSpan={8} className="px-4 py-3"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></td></tr>
                  ))
                ) : users.map(user => (
                  <motion.tr key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                          {user.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800 dark:text-white text-xs">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{user.email}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{user.phone || '—'}</td>
                    <td className="px-4 py-3">
                      <select
                        value={user.role}
                        onChange={e => handleRoleUpdate(user._id, e.target.value)}
                        className="text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 capitalize bg-transparent dark:text-white"
                      >
                        {['user', 'admin', 'agent'].map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-amber-600 text-xs font-medium">⭐ {user.loyaltyPoints || 0}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs ${user.isActive ? 'badge-success' : 'badge-error'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleStatus(user._id)}
                        className={`p-1.5 rounded-lg transition-colors ${user.isActive ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'}`}
                        title={user.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {user.isActive ? <FiUserX /> : <FiUserCheck />}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {!loading && users.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p className="text-4xl mb-2">👥</p>
                <p>No users found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
