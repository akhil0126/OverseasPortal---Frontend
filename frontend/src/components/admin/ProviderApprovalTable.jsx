import { Shield, ShieldOff, ExternalLink } from 'lucide-react'
import { formatDate } from '../../utils/validators'

export default function ProviderApprovalTable({ providers = [], onVerify, loading }) {
  if (loading) return <div className="text-center py-10 text-slate-400 text-sm">Loading providers…</div>
  if (!providers.length) return (
    <div className="text-center py-10 text-slate-400 text-sm">No providers found.</div>
  )

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Provider</th>
            <th>Type</th>
            <th>Country</th>
            <th>Rating</th>
            <th>Joined</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {providers.map(p => (
            <tr key={p.profileId || p.userId}>
              <td>
                <div>
                  <p className="font-semibold text-navy-800 text-sm">{p.companyName}</p>
                  <p className="text-xs text-slate-400">{p.email}</p>
                </div>
              </td>
              <td>
                <span className="badge badge-blue text-xs">
                  {p.providerType?.replace(/_/g, ' ') || '—'}
                </span>
              </td>
              <td className="text-sm">{p.country || '—'}</td>
              <td>
                <span className="text-sm font-semibold text-navy-800">
                  {p.rating?.toFixed(1) || '—'}
                </span>
                <span className="text-xs text-slate-400 ml-1">({p.totalReviews || 0})</span>
              </td>
              <td className="text-xs text-slate-500">{formatDate(p.createdAt)}</td>
              <td>
                {p.verified
                  ? <span className="badge badge-green">Verified</span>
                  : <span className="badge badge-gold">Pending</span>}
              </td>
              <td>
                <div className="flex items-center gap-1.5">
                  {p.verified ? (
                    <button onClick={() => onVerify?.(p.profileId, false)}
                      className="btn btn-secondary btn-sm text-red-500 border-red-200 hover:bg-red-50"
                      title="Revoke verification">
                      <ShieldOff size={13} />
                    </button>
                  ) : (
                    <button onClick={() => onVerify?.(p.profileId, true)}
                      className="btn-primary btn-sm"
                      title="Verify provider">
                      <Shield size={13} /> Verify
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
