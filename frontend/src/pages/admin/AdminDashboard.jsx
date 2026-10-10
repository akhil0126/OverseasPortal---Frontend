import { Users, Building2, FileText, Calendar, TrendingUp, Shield, DollarSign, Activity } from 'lucide-react'
import Sidebar from '../../components/common/Sidebar'
import Loader from '../../components/common/Loader'
import { useFetch } from '../../hooks/useFetch'
import adminService from '../../services/adminService'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

const STAT_CONFIG = [
  { key: 'totalUsers',         label: 'Total Users',       icon: Users,     color: 'bg-blue-100 text-blue-700',    link: '/admin/students'     },
  { key: 'totalProviders',     label: 'Providers',         icon: Shield,    color: 'bg-purple-100 text-purple-700',link: '/admin/providers'    },
  { key: 'totalUniversities',  label: 'Universities',      icon: Building2, color: 'bg-gold-100 text-gold-700',    link: '/admin/universities' },
  { key: 'totalApplications',  label: 'Applications',      icon: FileText,  color: 'bg-emerald-100 text-emerald-700', link: '/admin/applications' },
  { key: 'totalBookings',      label: 'Bookings',          icon: Calendar,  color: 'bg-orange-100 text-orange-700',link: '/admin/students'     },
]

const QUICK_LINKS = [
  { label: 'Manage Students',     href: '/admin/students',      icon: Users    },
  { label: 'Verify Providers',    href: '/admin/providers',     icon: Shield   },
  { label: 'Add University',      href: '/admin/universities',  icon: Building2},
  { label: 'Review Applications', href: '/admin/applications',  icon: FileText },
  { label: 'Subscriptions',       href: '/admin/subscriptions', icon: DollarSign},
  { label: 'View Reports',        href: '/admin/reports',       icon: TrendingUp},
]

export default function AdminDashboard() {
  const { data: stats, loading } = useFetch(adminService.getDashboard)

  if (loading) return <div className="flex min-h-screen bg-slate-50"><Sidebar /><main className="flex-1"><Loader /></main></div>

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="page-wrapper">
          <div className="mb-8">
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">Platform overview and management</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
            {STAT_CONFIG.map(s => (
              <Link key={s.key} to={s.link}
                className="card p-5 flex flex-col gap-3 hover:shadow-card-hover transition-shadow group">
                <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', s.color)}>
                  <s.icon size={18} />
                </div>
                <div>
                  <p className="font-display text-2xl font-700 text-navy-900">
                    {stats?.[s.key]?.toLocaleString() ?? '—'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick links */}
          <div className="card p-6">
            <h2 className="section-title">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {QUICK_LINKS.map(q => (
                <Link key={q.href} to={q.href}
                  className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-navy-400 hover:bg-navy-50 transition-all group">
                  <div className="w-9 h-9 rounded-xl bg-navy-100 group-hover:bg-navy-200 flex items-center justify-center transition-colors">
                    <q.icon size={16} className="text-navy-700" />
                  </div>
                  <span className="text-sm font-medium text-navy-800">{q.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
