import { useState } from 'react'
import Sidebar from '../../components/common/Sidebar'
import AppointmentTable from '../../components/provider/AppointmentTable'
import Loader from '../../components/common/Loader'
import { useFetch } from '../../hooks/useFetch'
import providerService from '../../services/providerService'
import toast from 'react-hot-toast'

const FILTERS = ['ALL','PENDING','CONFIRMED','COMPLETED','CANCELLED']

export default function AppointmentsPage() {
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [page, setPage] = useState(0)
  const [cancelId, setCancelId] = useState(null)
  const [reason,   setReason]   = useState('')

  const { data, loading, refetch } = useFetch(
    () => providerService.getMyBookings({ page, size: 20, status: statusFilter !== 'ALL' ? statusFilter : undefined }),
    [statusFilter, page]
  )

  const bookings   = data?.content || []
  const totalPages = data?.totalPages || 0

  const handleConfirm = async (id) => {
    try { await providerService.confirmBooking(id); toast.success('Booking confirmed'); refetch() }
    catch (e) { toast.error(e?.response?.data?.message || 'Failed') }
  }

  const handleComplete = async (id) => {
    try { await providerService.completeBooking(id); toast.success('Marked as complete'); refetch() }
    catch (e) { toast.error(e?.response?.data?.message || 'Failed') }
  }

  const submitCancel = async () => {
    if (!reason.trim()) { toast.error('Please provide a cancellation reason'); return }
    try {
      await providerService.cancelBooking(cancelId, reason)
      toast.success('Booking cancelled')
      setCancelId(null); setReason('')
      refetch()
    } catch (e) { toast.error(e?.response?.data?.message || 'Failed') }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="page-wrapper">
          <div className="mb-8">
            <h1 className="page-title">Appointments</h1>
            <p className="page-subtitle">Manage your upcoming and past bookings</p>
          </div>

          {/* Status filter tabs */}
          <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit mb-6">
            {FILTERS.map(f => (
              <button key={f} onClick={() => { setStatusFilter(f); setPage(0) }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === f ? 'bg-navy-700 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                {f}
              </button>
            ))}
          </div>

          {loading ? <Loader /> : (
            <>
              <AppointmentTable bookings={bookings}
                onConfirm={handleConfirm}
                onComplete={handleComplete}
                onCancel={(id) => { setCancelId(id); setReason('') }} />

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button onClick={() => setPage(p => Math.max(0, p-1))} disabled={page === 0} className="btn btn-secondary btn-sm">Previous</button>
                  <span className="text-sm text-slate-600 px-3">Page {page+1} of {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages-1, p+1))} disabled={page >= totalPages-1} className="btn btn-secondary btn-sm">Next</button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Cancel modal */}
      {cancelId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in">
            <h2 className="font-display text-xl font-700 text-navy-900 mb-4">Cancel Booking</h2>
            <div>
              <label className="form-label">Reason for cancellation *</label>
              <textarea rows={3} className="form-input resize-none" value={reason}
                onChange={e => setReason(e.target.value)} placeholder="Please explain why you're cancelling…" />
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setCancelId(null)} className="btn btn-secondary flex-1">Go Back</button>
              <button onClick={submitCancel} className="btn btn-danger flex-1">Confirm Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
