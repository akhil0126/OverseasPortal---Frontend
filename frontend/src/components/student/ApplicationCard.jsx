import { MapPin, Calendar, ChevronRight, Send, X } from 'lucide-react'
import { APPLICATION_STATUSES } from '../../utils/constants'
import { formatDate } from '../../utils/validators'
import clsx from 'clsx'

const BADGE_MAP = {
  blue: 'badge-blue', green: 'badge-green', gold: 'badge-gold',
  red: 'badge-red', gray: 'badge-gray', purple: 'badge-purple',
}

export default function ApplicationCard({ application, onSubmit, onWithdraw }) {
  const { id, universityName, universityCountry, courseName, status,
          intakeSemester, intakeYear, submittedAt, createdAt } = application

  const statusInfo = APPLICATION_STATUSES[status] || { label: status, color: 'gray' }
  const canSubmit   = status === 'DRAFT'
  const canWithdraw = !['WITHDRAWN', 'ENROLLED', 'REJECTED'].includes(status)

  return (
    <div className="card p-5 hover:shadow-card-hover transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={clsx('badge', BADGE_MAP[statusInfo.color])}>{statusInfo.label}</span>
          </div>
          <h3 className="font-display text-base font-700 text-navy-900 truncate">{universityName}</h3>
          <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
            <MapPin size={11} /> {universityCountry}
          </p>
          {courseName && <p className="text-xs text-slate-600 mt-1 truncate">{courseName}</p>}
        </div>
        <div className="text-right text-xs text-slate-400 flex-shrink-0">
          {intakeSemester && <p>{intakeSemester} {intakeYear}</p>}
          <p className="mt-0.5">Created {formatDate(createdAt)}</p>
        </div>
      </div>

      {submittedAt && (
        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-3">
          <Calendar size={11} /> Submitted {formatDate(submittedAt)}
        </p>
      )}

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
        {canSubmit && (
          <button onClick={() => onSubmit?.(id)} className="btn-primary btn-sm flex-1">
            <Send size={12} /> Submit
          </button>
        )}
        {canWithdraw && status !== 'DRAFT' && (
          <button onClick={() => onWithdraw?.(id)}
            className="btn btn-secondary btn-sm text-red-600 border-red-200 hover:bg-red-50">
            <X size={12} /> Withdraw
          </button>
        )}
        <button className="btn btn-ghost btn-sm ml-auto text-navy-600">
          Details <ChevronRight size={13} />
        </button>
      </div>
    </div>
  )
}
