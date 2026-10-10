import { BarChart3, TrendingUp, Users, FileText, Calendar, Building2, DollarSign, Download } from 'lucide-react'
import Sidebar from '../../components/common/Sidebar'
import Loader from '../../components/common/Loader'
import { useFetch } from '../../hooks/useFetch'
import adminService from '../../services/adminService'
import clsx from 'clsx'

const APPLICATION_STATUS_COLORS = {
  SUBMITTED:    'bg-blue-500',
  UNDER_REVIEW: 'bg-purple-500',
  ACCEPTED:     'bg-emerald-500',
  REJECTED:     'bg-red-500',
  ENROLLED:     'bg-gold-500',
  WITHDRAWN:    'bg-slate-400',
}

export default function ReportsPage() {
  const { data: stats, loading } = useFetch(adminService.getDashboard)

  const metrics = stats ? [
    { label: 'Total Users',        value: stats.totalUsers,        icon: Users,     color: 'bg-blue-100 text-blue-700'     },
    { label: 'Active Providers',   value: stats.totalProviders,    icon: Building2, color: 'bg-purple-100 text-purple-700' },
    { label: 'Universities Listed',value: stats.totalUniversities, icon: Building2, color: 'bg-gold-100 text-gold-700'     },
    { label: 'Total Applications', value: stats.totalApplications, icon: FileText,  color: 'bg-emerald-100 text-emerald-700'},
    { label: 'Total Bookings',     value: stats.totalBookings,     icon: Calendar,  color: 'bg-orange-100 text-orange-700' },
  ] : []

  const conversionRate = stats
    ? ((stats.totalApplications / Math.max(stats.totalUsers, 1)) * 100).toFixed(1)
    : 0

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="page-wrapper">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="page-title">Platform Reports</h1>
              <p className="page-subtitle">Key metrics and platform health overview</p>
            </div>
            <button className="btn btn-secondary btn-sm opacity-50 cursor-not-allowed" disabled>
              <Download size={14} /> Export CSV
            </button>
          </div>

          {loading ? <Loader /> : (
            <div className="space-y-6">
              {/* Key metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {metrics.map(m => (
                  <div key={m.label} className="card p-5">
                    <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center mb-3', m.color)}>
                      <m.icon size={18} />
                    </div>
                    <p className="font-display text-2xl font-700 text-navy-900">{m.value?.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{m.label}</p>
                  </div>
                ))}
              </div>

              {/* Engagement row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="card p-6 text-center">
                  <TrendingUp size={28} className="mx-auto mb-2 text-navy-500" />
                  <p className="font-display text-3xl font-700 text-navy-900">{conversionRate}%</p>
                  <p className="text-sm text-slate-500 mt-1">User → Application Rate</p>
                </div>
                <div className="card p-6 text-center">
                  <DollarSign size={28} className="mx-auto mb-2 text-gold-500" />
                  <p className="font-display text-3xl font-700 text-navy-900">
                    {((stats?.totalBookings || 0) / Math.max(stats?.totalUsers || 1, 1) * 100).toFixed(0)}%
                  </p>
                  <p className="text-sm text-slate-500 mt-1">User → Booking Rate</p>
                </div>
                <div className="card p-6 text-center">
                  <BarChart3 size={28} className="mx-auto mb-2 text-ocean-500" />
                  <p className="font-display text-3xl font-700 text-navy-900">
                    {stats?.totalProviders && stats?.totalUniversities
                      ? (stats.totalUniversities / Math.max(stats.totalProviders, 1)).toFixed(1)
                      : '—'}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">Universities per Provider</p>
                </div>
              </div>

              {/* Summary table */}
              <div className="card p-6">
                <h2 className="section-title">Platform Summary</h2>
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead><tr><th>Metric</th><th>Value</th><th>Notes</th></tr></thead>
                    <tbody>
                      {[
                        { metric:'Registered Users',       value: stats?.totalUsers,         note:'All roles combined'            },
                        { metric:'Service Providers',      value: stats?.totalProviders,      note:'Active provider profiles'       },
                        { metric:'Universities in DB',     value: stats?.totalUniversities,   note:'Active & inactive'              },
                        { metric:'Student Applications',   value: stats?.totalApplications,   note:'All statuses'                   },
                        { metric:'Service Bookings',       value: stats?.totalBookings,       note:'All statuses'                   },
                      ].map(r => (
                        <tr key={r.metric}>
                          <td className="font-medium text-navy-800">{r.metric}</td>
                          <td className="font-700 text-navy-900">{r.value?.toLocaleString() ?? '—'}</td>
                          <td className="text-slate-500 text-xs">{r.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-slate-400 mt-4">
                  * Full chart analytics (time-series, funnels, cohort) can be integrated with a BI tool
                  or a charting library such as Recharts connected to dedicated analytics endpoints.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
