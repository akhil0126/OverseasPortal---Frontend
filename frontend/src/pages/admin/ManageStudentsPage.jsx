import { useState } from 'react'
import { Search, UserX, UserCheck, Trash2, Users } from 'lucide-react'
import Sidebar from '../../components/common/Sidebar'
import Loader from '../../components/common/Loader'
import { useFetch } from '../../hooks/useFetch'
import adminService from '../../services/adminService'
import { formatDate } from '../../utils/validators'
import toast from 'react-hot-toast'
import clsx from 'clsx'

export default function ManageStudentsPage() {
  const [page,    setPage]    = useState(0)
  const [keyword, setKeyword] = useState('')

  const { data, loading, refetch } = useFetch(
    () => adminService.getUsers({ page, size: 20 }),
    [page]
  )

  const users      = (data?.content || []).filter(u =>
    !keyword || u.email?.toLowerCase().includes(keyword.toLowerCase()) ||
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(keyword.toLowerCase())
  )
  const totalPages = data?.totalPages || 0

  const toggle = async (id) => {
    try { await adminService.toggleUserActive(id); toast.success('Status updated'); refetch() }
    catch { toast.error('Failed to update') }
  }

  const remove = async (id) => {
    if (!confirm('Deactivate this user account?')) return
    try { await adminService.deleteUser(id); toast.success('User deactivated'); refetch() }
    catch { toast.error('Failed') }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="page-wrapper">
          <div className="mb-8">
            <h1 className="page-title">Manage Students</h1>
            <p className="page-subtitle">View and control all registered users</p>
          </div>

          <div className="card p-4 mb-5 flex gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="form-input pl-10" placeholder="Search by name or email…"
                value={keyword} onChange={e => setKeyword(e.target.value)} />
            </div>
          </div>

          {loading ? <Loader /> : (
            <>
              <div className="table-wrapper mb-6">
                <table className="data-table">
                  <thead><tr>
                    <th>Name</th><th>Email</th><th>Roles</th>
                    <th>Verified</th><th>Status</th><th>Joined</th><th>Actions</th>
                  </tr></thead>
                  <tbody>
                    {users.length === 0 && (
                      <tr><td colSpan={7} className="text-center py-12 text-slate-400">
                        <Users size={32} className="mx-auto mb-2 opacity-30" />No users found
                      </td></tr>
                    )}
                    {users.map(u => (
                      <tr key={u.id}>
                        <td className="font-medium text-navy-800">{u.firstName} {u.lastName}</td>
                        <td className="text-slate-600">{u.email}</td>
                        <td>
                          <div className="flex flex-wrap gap-1">
                            {u.roles?.map(r => (
                              <span key={r.name} className={clsx('badge text-xs',
                                r.name === 'ROLE_ADMIN' ? 'badge-red' :
                                r.name === 'ROLE_PROVIDER' ? 'badge-blue' : 'badge-gray')}>
                                {r.name.replace('ROLE_', '')}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <span className={u.emailVerified ? 'badge badge-green' : 'badge badge-gold'}>
                            {u.emailVerified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td>
                          <span className={u.active ? 'badge badge-green' : 'badge badge-red'}>
                            {u.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="text-slate-500">{formatDate(u.createdAt)}</td>
                        <td>
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => toggle(u.id)}
                              title={u.active ? 'Deactivate' : 'Activate'}
                              className={clsx('btn btn-sm !px-2 !py-1',
                                u.active ? 'btn-secondary !text-orange-600 !border-orange-200 hover:!bg-orange-50'
                                         : 'btn-secondary !text-emerald-600 !border-emerald-200 hover:!bg-emerald-50')}>
                              {u.active ? <UserX size={13} /> : <UserCheck size={13} />}
                            </button>
                            <button onClick={() => remove(u.id)}
                              className="btn btn-secondary btn-sm !px-2 !py-1 !text-red-600 !border-red-200 hover:!bg-red-50">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button onClick={() => setPage(p => Math.max(0, p-1))} disabled={page === 0} className="btn btn-secondary btn-sm">Previous</button>
                  <span className="text-sm text-slate-600 px-3">Page {page+1} of {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages-1, p+1))} disabled={page >= totalPages-1} className="btn btn-secondary btn-sm">Next</button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
