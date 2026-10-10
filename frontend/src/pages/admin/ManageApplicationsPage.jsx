import { useState } from 'react'
import { Search, FileText } from 'lucide-react'
import Sidebar from '../../components/common/Sidebar'
import Loader from '../../components/common/Loader'
import { useFetch } from '../../hooks/useFetch'
import adminService from '../../services/adminService'
import { APPLICATION_STATUSES } from '../../utils/constants'
import { formatDate } from '../../utils/validators'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const BADGE_MAP = {
  blue:'badge-blue', green:'badge-green', gold:'badge-gold',
  red:'badge-red', gray:'badge-gray', purple:'badge-purple',
}
const STATUS_OPTIONS = Object.keys(APPLICATION_STATUSES)

export default function ManageApplicationsPage() {
  const [page,       setPage]       = useState(0)
  const [status,     setStatus]     = useState('')
  const [updateId,   setUpdateId]   = useState(null)
  const [newStatus,  setNewStatus]  = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [saving,     setSaving]     = useState(false)

  const { data, loading, refetch } = useFetch(
    () => adminService.getAllApplications({ page, size: 20, status: status || undefined }),
    [page, status]
  )

  const applications = data?.content || []
  const totalPages   = data?.totalPages || 0

  const openUpdate = (app) => {
    setUpdateId(app.id)
    setNewStatus(app.status)
    setAdminNotes(app.adminNotes || '')
  }

  const handleUpdate = async () => {
    if (!newStatus) return
    setSaving(true)
    try {
      await adminService.updateApplicationStatus(updateId, newStatus, adminNotes)
      toast.success('Application status updated')
      setUpdateId(null); refetch()
    } catch (e) { toast.error(e?.response?.data?.message || 'Update failed') }
    finally { setSaving(false) }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="page-wrapper">
          <div className="mb-8">
            <h1 className="page-title">Manage Applications</h1>
            <p className="page-subtitle">Review and update student university applications</p>
          </div>

          <div className="card p-4 mb-5 flex flex-wrap gap-3">
            <select className="form-input w-52" value={status}
              onChange={e => { setStatus(e.target.value); setPage(0) }}>
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{APPLICATION_STATUSES[s].label}</option>
              ))}
            </select>
          </div>

          {loading ? <Loader /> : (
            <>
              <div className="table-wrapper mb-6">
                <table className="data-table">
                  <thead><tr>
                    <th>Student</th><th>University</th><th>Course</th>
                    <th>Intake</th><th>Status</th><th>Submitted</th><th>Actions</th>
                  </tr></thead>
                  <tbody>
                    {applications.length === 0 && (
                      <tr><td colSpan={7} className="text-center py-12 text-slate-400">
                        <FileText size={32} className="mx-auto mb-2 opacity-30" />No applications found
                      </td></tr>
                    )}
                    {applications.map(a => {
                      const si = APPLICATION_STATUSES[a.status] || { label: a.status, color: 'gray' }
                      return (
                        <tr key={a.id}>
                          <td className="font-medium text-navy-800">{a.studentName}</td>
                          <td>
                            <p className="text-slate-700">{a.universityName}</p>
                            <p className="text-xs text-slate-400">{a.universityCountry}</p>
                          </td>
                          <td className="text-slate-600 text-xs max-w-[140px] truncate">{a.courseName || '—'}</td>
                          <td className="text-slate-600 text-xs">{a.intakeSemester} {a.intakeYear}</td>
                          <td><span className={clsx('badge', BADGE_MAP[si.color])}>{si.label}</span></td>
                          <td className="text-slate-500 text-xs">{a.submittedAt ? formatDate(a.submittedAt) : '—'}</td>
                          <td>
                            <button onClick={() => openUpdate(a)}
                              className="btn btn-secondary btn-sm">Update</button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button onClick={() => setPage(p => Math.max(0,p-1))} disabled={page===0} className="btn btn-secondary btn-sm">Previous</button>
                  <span className="text-sm text-slate-600 px-3">Page {page+1} of {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages-1,p+1))} disabled={page>=totalPages-1} className="btn btn-secondary btn-sm">Next</button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {updateId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in">
            <h2 className="font-display text-xl font-700 text-navy-900 mb-5">Update Application Status</h2>
            <div className="space-y-4">
              <div>
                <label className="form-label">New Status</label>
                <select className="form-input" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{APPLICATION_STATUSES[s].label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Admin Notes (optional)</label>
                <textarea rows={3} className="form-input resize-none" value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  placeholder="Internal notes or message to student…" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setUpdateId(null)} className="btn btn-secondary flex-1">Cancel</button>
              <button onClick={handleUpdate} disabled={saving} className="btn-primary flex-1">
                {saving ? 'Saving…' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
