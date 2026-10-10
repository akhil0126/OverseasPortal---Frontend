import { Calendar, Check, X, CheckCheck, User, Clock } from 'lucide-react'
import { BOOKING_STATUSES } from '../../utils/constants'
import { formatDate, formatCurrency } from '../../utils/validators'
import clsx from 'clsx'

const BADGE_MAP = {
  gold: 'badge-gold', blue: 'badge-blue', green: 'badge-green',
  red: 'badge-red', gray: 'badge-gray', purple: 'badge-purple',
}

export default function AppointmentTable({ bookings = [], onConfirm, onComplete, onCancel, loading }) {
  if (loading) return <div className="text-center py-10 text-slate-400 text-sm">Loading appointments…</div>
  if (!bookings.length) return (
    <div className="text-center py-16">
      <Calendar size={36} className="mx-auto text-slate-300 mb-3" />
      <p className="text-slate-500 font-medium">No appointments yet</p>
    </div>
  )

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Service</th>
            <th>Scheduled</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => {
            const statusInfo = BOOKING_STATUSES[b.status] || { label: b.status, color: 'gray' }
            return (
              <tr key={b.id}>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-navy-100 flex items-center justify-center text-navy-700 font-semibold text-xs">
                      {b.studentName?.[0]}
                    </div>
                    <span className="font-medium text-navy-800">{b.studentName}</span>
                  </div>
                </td>
                <td className="max-w-[180px] truncate">{b.serviceName}</td>
                <td>
                  {b.scheduledDate
                    ? <span className="flex items-center gap-1.5 text-xs"><Clock size={11} />{formatDate(b.scheduledDate)}</span>
                    : <span className="text-slate-400 text-xs">TBD</span>}
                </td>
                <td className="font-semibold text-navy-800">{formatCurrency(b.amount, b.currency)}</td>
                <td><span className={clsx('badge', BADGE_MAP[statusInfo.color])}>{statusInfo.label}</span></td>
                <td>
                  <div className="flex items-center gap-1.5">
                    {b.status === 'PENDING' && (
                      <button onClick={() => onConfirm?.(b.id)}
                        className="btn btn-primary btn-sm !px-2 !py-1" title="Confirm">
                        <Check size={13} />
                      </button>
                    )}
                    {b.status === 'CONFIRMED' && (
                      <button onClick={() => onComplete?.(b.id)}
                        className="btn btn-secondary btn-sm !px-2 !py-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50" title="Mark Complete">
                        <CheckCheck size={13} />
                      </button>
                    )}
                    {!['COMPLETED','CANCELLED','REFUNDED'].includes(b.status) && (
                      <button onClick={() => onCancel?.(b.id)}
                        className="btn btn-secondary btn-sm !px-2 !py-1 text-red-500 border-red-200 hover:bg-red-50" title="Cancel">
                        <X size={13} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
