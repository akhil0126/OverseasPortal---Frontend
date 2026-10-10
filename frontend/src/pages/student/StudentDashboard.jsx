import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, FileText, Calendar, CreditCard, ArrowRight, Bell } from 'lucide-react'
import DashboardLayout from '../../components/common/DashboardLayout'
import ProfileCard from '../../components/student/ProfileCard'
import Loader from '../../components/common/Loader'
import { useAuth } from '../../hooks/useAuth'
import studentService from '../../services/studentService'
import bookingService from '../../services/bookingService'
import subscriptionService from '../../services/subscriptionService'
import { formatDate } from '../../utils/validators'
import { APPLICATION_STATUSES, BOOKING_STATUSES } from '../../utils/constants'
import clsx from 'clsx'
import toast from 'react-hot-toast'

const QUICK_LINKS = [
  { icon: GraduationCap, label: 'Browse Universities', href: '/student/universities', color: 'bg-navy-100 text-navy-700' },
  { icon: FileText,      label: 'My Applications',    href: '/student/applications', color: 'bg-gold-100 text-gold-700' },
  { icon: Calendar,      label: 'My Bookings',         href: '/student/bookings',    color: 'bg-emerald-100 text-emerald-700' },
  { icon: CreditCard,    label: 'Subscription',        href: '/student/subscription',color: 'bg-purple-100 text-purple-700' },
]

export default function StudentDashboard() {
  const { user } = useAuth()
  const [profile, setProfile]     = useState(null)
  const [apps, setApps]           = useState([])
  const [bookings, setBookings]   = useState([])
  const [subscription, setSub]    = useState(null)
  const [notifications, setNotifs]= useState([])
  const [loading, setLoading]     = useState(true)
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    Promise.all([
      studentService.getProfile(),
      bookingService.getMyApplications({ size: 5 }),
      bookingService.getMyBookings({ size: 5 }),
      subscriptionService.getMyStatus(),
      studentService.getNotifications(),
    ]).then(([prof, a, b, sub, notifs]) => {
      setProfile(prof)
      setApps(a?.content || [])
      setBookings(b?.content || [])
      setSub(sub)
      setNotifs((notifs?.content || []).slice(0, 4))
    }).catch(err => {
      const message = err?.response?.data?.message || 'Failed to load dashboard data'
      setLoadError(message)
      toast.error(message)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>
  if (loadError) return <DashboardLayout><div className="page-wrapper"><p className="text-center text-red-600">{loadError}</p></div></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="page-wrapper">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="page-title">Welcome back, {user?.firstName}! 👋</h1>
            <p className="page-subtitle">Here's what's happening with your study journey.</p>
          </div>
          {subscription && (
            <div className="hidden sm:flex items-center gap-2 bg-navy-50 border border-navy-100 rounded-xl px-4 py-2.5">
              <CreditCard size={15} className="text-navy-600" />
              <span className="text-sm font-semibold text-navy-700">{subscription.plan}</span>
              <span className="badge badge-blue text-xs">{subscription.type}</span>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            <ProfileCard student={profile} />

            {/* Quick links */}
            <div className="card p-5">
              <h3 className="section-title text-base">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {QUICK_LINKS.map(q => (
                  <Link key={q.href} to={q.href}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-center group">
                    <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', q.color)}>
                      <q.icon size={18} />
                    </div>
                    <span className="text-xs font-medium text-navy-700 leading-tight">{q.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Middle + Right */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Applications */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="section-title mb-0">Recent Applications</h3>
                <Link to="/student/applications" className="text-xs text-navy-600 hover:underline flex items-center gap-1">
                  View all <ArrowRight size={12} />
                </Link>
              </div>
              {apps.length === 0 ? (
                <div className="text-center py-10">
                  <GraduationCap size={32} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-slate-400 text-sm">No applications yet.</p>
                  <Link to="/student/universities" className="btn-primary btn-sm mt-3 inline-flex">
                    Find Universities
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {apps.map(app => {
                    const s = APPLICATION_STATUSES[app.status] || { label: app.status, color: 'gray' }
                    const badgeMap = { blue:'badge-blue',green:'badge-green',gold:'badge-gold',red:'badge-red',gray:'badge-gray',purple:'badge-purple' }
                    return (
                      <div key={app.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                        <div>
                          <p className="font-semibold text-navy-800 text-sm">{app.universityName}</p>
                          <p className="text-xs text-slate-400">{app.courseName || 'General'} · {formatDate(app.createdAt)}</p>
                        </div>
                        <span className={clsx('badge', badgeMap[s.color])}>{s.label}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="section-title mb-0 flex items-center gap-2">
                  <Bell size={16} /> Notifications
                </h3>
              </div>
              {notifications.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-6">No new notifications.</p>
              ) : (
                <div className="space-y-3">
                  {notifications.map(n => (
                    <div key={n.id} className={clsx('flex gap-3 p-3 rounded-xl', !n.read ? 'bg-navy-50' : '')}>
                      <div className={clsx('w-2 h-2 rounded-full mt-2 flex-shrink-0', n.read ? 'bg-slate-300' : 'bg-navy-600')} />
                      <div>
                        <p className="text-sm font-medium text-navy-800">{n.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{formatDate(n.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
