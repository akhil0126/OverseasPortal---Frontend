import { Calendar, DollarSign, X, User } from 'lucide-react'
import { BOOKING_STATUSES } from '../../utils/constants'
import { formatDate, formatCurrency } from '../../utils/validators'
import clsx from 'clsx'

const BADGE_MAP = {
  gold: 'badge-gold', blue: 'badge-blue', green: 'badge-green',
  red: 'badge-red', gray: 'badge-gray', purple: 'badge-purple',
}

export default function BookingCard({ booking, onCancel, showProvider = true }) {
  const { id, serviceName, providerName, studentName, status,
          scheduledDate, amount, currency, paymentStatus, createdAt } = booking

  const statusInfo = BOOKING_STATUSES[status] || { label: status, color: 'gray' }
  const canCancel = !['COMPLETED', 'CANCELLED', 'REFUNDED'].includes(status)

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <span className={clsx('badge', BADGE_MAP[statusInfo.color])}>{statusInfo.label}</span>
          <h3 className="font-semibold text-navy-900 mt-2 text-sm leading-snug">{serviceName}</h3>
          {showProvider && providerName && (
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <User size={11} /> {providerName}
            </p>
          )}
          {!showProvider && studentName && (
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <User size={11} /> {studentName}
            </p>
          )}
        </div>
        <div className="text-right text-xs flex-shrink-0">
          {amount > 0 && (
            <p className="font-700 text-navy-800 text-sm">{formatCurrency(amount, currency)}</p>
          )}
          <p className={clsx('mt-0.5 badge',
            paymentStatus === 'PAID' ? 'badge-green' : 'badge-gray')}>
            {paymentStatus || 'Pending'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-500 border-t border-slate-100 pt-3">
        {scheduledDate && (
          <span className="flex items-center gap-1.5">
            <Calendar size={11} /> {formatDate(scheduledDate)}
          </span>
        )}
        <span className="ml-auto">Booked {formatDate(createdAt)}</span>
      </div>

      {canCancel && (
        <button onClick={() => onCancel?.(id)}
          className="w-full mt-3 btn btn-secondary btn-sm text-red-600 border-red-200 hover:bg-red-50">
          <X size={12} /> Cancel Booking
        </button>
      )}
    </div>
  )
}
