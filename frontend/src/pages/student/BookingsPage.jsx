import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../components/common/DashboardLayout'
import BookingCard from '../../components/student/BookingCard'
import Loader from '../../components/common/Loader'
import bookingService from '../../services/bookingService'
import { Calendar } from 'lucide-react'

const STATUS_TABS = ['All', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']

export default function BookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading]   = useState(true)
  const [tab, setTab]           = useState('All')
  const [loadError, setLoadError] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    setLoadError(null)
    bookingService.getMyBookings({ size: 50 })
      .then(r => setBookings(r.content || []))
      .catch(err => {
        setLoadError(
          err?.response?.data?.message ||
          (err?.response?.status
            ? `Failed to load bookings (HTTP ${err.response.status}).`
            : 'Failed to load bookings. Check your connection and try again.')
        )
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleCancel = async (id) => {
    const reason = prompt('Reason for cancellation (optional):') ?? ''
    try {
      await bookingService.cancel(id, reason)
      toast.success('Booking cancelled')
      load()
    } catch (e) { toast.error(e?.response?.data?.message || 'Cancel failed') }
  }

  const filtered = tab === 'All' ? bookings : bookings.filter(b => b.status === tab)

  return (
    <DashboardLayout>
      <div className="page-wrapper">
        <h1 className="page-title mb-2">My Bookings</h1>
        <p className="page-subtitle mb-8">
          {loadError
            ? 'Bookings could not be loaded.'
            : loading
              ? 'Loading bookings…'
              : `${bookings.length} total booking${bookings.length !== 1 ? 's' : ''}`}
        </p>

        {/* Status tabs */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-8 w-fit overflow-x-auto">
          {STATUS_TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                tab === t ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-500 hover:text-navy-700'
              }`}>
              {t}
            </button>
          ))}
        </div>

        {loading ? <Loader /> : loadError ? (
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">{loadError}</p>
            <button onClick={load} className="btn btn-secondary">Try again</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Calendar size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">No bookings found.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(b => <BookingCard key={b.id} booking={b} onCancel={handleCancel} />)}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
