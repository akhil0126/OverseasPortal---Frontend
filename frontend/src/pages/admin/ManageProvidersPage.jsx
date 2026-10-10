import { useState } from 'react'
import { Search, ShieldCheck, ShieldOff, Star } from 'lucide-react'
import Sidebar from '../../components/common/Sidebar'
import Loader from '../../components/common/Loader'
import { useFetch } from '../../hooks/useFetch'
import adminService from '../../services/adminService'
import { formatDate } from '../../utils/validators'
import toast from 'react-hot-toast'
import clsx from 'clsx'

export default function ManageProvidersPage() {
  const [page,     setPage]     = useState(0)
  const [keyword,  setKeyword]  = useState('')
  const [verified, setVerified] = useState('')

  const { data, loading, refetch } = useFetch(
    () => adminService.getProviders({ page, size: 20, verified: verified !== '' ? verified : undefined }),
    [page, verified]
  )

  const providers  = (data?.content || []).filter(p =>
    !keyword ||
    p.companyName?.toLowerCase().includes(keyword.toLowerCase()) ||
    p.email?.toLowerCase().includes(keyword.toLowerCase())
  )
  const totalPages = data?.totalPages || 0

  const handleVerify = async (profileId, value) => {
    try {
      await adminService.verifyProvider(profileId, value)
      toast.success(value ? 'Provider verified' : 'Verification removed')
      refetch()
    } catch { toast.error('Failed to update verification') }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="page-wrapper">
          <div className="mb-8">
            <h1 className="page-title">Manage Providers</h1>
            <p className="page-subtitle">Review and verify service providers</p>
          </div>

          <div className="card p-4 mb-5 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="form-input pl-10" placeholder="Search by company or email…"
                value={keyword} onChange={e => setKeyword(e.target.value)} />
            </div>
            <select className="form-input w-44" value={verified}
              onChange={e => { setVerified(e.target.value); setPage(0) }}>
              <option value="">All Providers</option>
              <option value="true">Verified Only</option>
              <option value="false">Unverified Only</option>
            </select>
          </div>

          {loading ? <Loader /> : (
            <>
              <div className="table-wrapper mb-6">
                <table className="data-table">
                  <thead><tr>
                    <th>Company</th><th>Contact</th><th>Type</th>
                    <th>Country</th><th>Rating</th><th>Verified</th><th>Joined</th><th>Actions</th>
                  </tr></thead>
                  <tbody>
                    {providers.length === 0 && (
                      <tr><td colSpan={8} className="text-center py-12 text-slate-400">No providers found</td></tr>
                    )}
                    {providers.map(p => (
                      <tr key={p.profileId}>
                        <td>
                          <div>
                            <p className="font-medium text-navy-800">{p.companyName}</p>
                            <p className="text-xs text-slate-400">{p.email}</p>
                          </div>
                        </td>
                        <td className="text-slate-600">{p.firstName} {p.lastName}</td>
                        <td>
                          {p.providerType && (
                            <span className="badge badge-blue text-xs">{p.providerType.replace(/_/g,' ')}</span>
                          )}
                        </td>
                        <td className="text-slate-600">{p.country || '—'}</td>
                        <td>
                          <span className="flex items-center gap-1 text-sm">
                            <Star size={12} className="text-gold-500" />
                            {p.rating?.toFixed(1) || '—'}
                            <span className="text-slate-400 text-xs">({p.totalReviews})</span>
                          </span>
                        </td>
                        <td>
                          <span className={p.verified ? 'badge badge-green' : 'badge badge-gold'}>
                            {p.verified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="text-slate-500 text-xs">{formatDate(p.createdAt)}</td>
                        <td>
                          <button
                            onClick={() => handleVerify(p.profileId, !p.verified)}
                            title={p.verified ? 'Remove verification' : 'Verify provider'}
                            className={clsx('btn btn-sm !px-2.5 !py-1.5',
                              p.verified
                                ? 'btn-secondary !text-orange-600 !border-orange-200 hover:!bg-orange-50'
                                : 'btn-secondary !text-emerald-600 !border-emerald-200 hover:!bg-emerald-50')}>
                            {p.verified ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
                          </button>
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
