import { UserCheck, UserX, Trash2, Search } from 'lucide-react'
import { formatDate } from '../../utils/validators'
import { useState } from 'react'
import clsx from 'clsx'

export default function UserManagementTable({ users = [], onToggleActive, onDelete, loading }) {
  const [search, setSearch] = useState('')

  const filtered = users.filter(u =>
    [u.firstName, u.lastName, u.email].join(' ').toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="text-center py-10 text-slate-400 text-sm">Loading users…</div>

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input className="form-input pl-10" placeholder="Search users…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => {
              const role = u.roles?.[0]?.replace('ROLE_', '') || '—'
              const roleColors = { STUDENT: 'badge-blue', PROVIDER: 'badge-purple', ADMIN: 'badge-red' }
              return (
                <tr key={u.id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center font-700 text-navy-700 text-xs flex-shrink-0">
                        {u.firstName?.[0]}{u.lastName?.[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-navy-800 text-sm">{u.firstName} {u.lastName}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className={clsx('badge', roleColors[role] || 'badge-gray')}>{role}</span></td>
                  <td className="text-sm text-slate-600">{u.phone || '—'}</td>
                  <td className="text-xs text-slate-500">{formatDate(u.createdAt)}</td>
                  <td>
                    {u.active
                      ? <span className="badge badge-green">Active</span>
                      : <span className="badge badge-red">Disabled</span>}
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => onToggleActive?.(u.id)}
                        className={clsx('btn btn-secondary btn-sm',
                          u.active ? 'text-amber-600 border-amber-200 hover:bg-amber-50'
                                   : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50')}
                        title={u.active ? 'Disable user' : 'Enable user'}>
                        {u.active ? <UserX size={13} /> : <UserCheck size={13} />}
                      </button>
                      <button onClick={() => onDelete?.(u.id)}
                        className="btn btn-secondary btn-sm text-red-500 border-red-200 hover:bg-red-50">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {!filtered.length && (
              <tr><td colSpan={6} className="text-center py-8 text-slate-400 text-sm">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
