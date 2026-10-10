import { useState, useEffect } from 'react'
import { Briefcase, Calendar, Star, DollarSign, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/common/DashboardLayout'
import StatsCard from '../../components/admin/StatsCard'
import Loader from '../../components/common/Loader'
import providerService from '../../services/providerService'
import { formatCurrency, formatDate } from '../../utils/validators'
import { BOOKING_STATUSES } from '../../utils/constants'
import clsx from 'clsx'
import toast from 'react-hot-toast'

export default function ProviderDashboard() {
  const [profile, setProfile] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    Promise.all([
      providerService.getMyProfile(),
      providerService.getMyBookings({ size: 5 }),
    ]).then(([p, b]) => { setProfile(p); setBookings(b?.content || []) })
      .catch(err => {
        const message = err?.response?.data?.message || 'Failed to load dashboard data'
        setLoadError(message)
        toast.error(message)
      }).finally(() => setLoading(false))
  }, [])

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>
  if (loadError) return <DashboardLayout><div className="page-wrapper"><p className="text-center text-red-600">{loadError}</p></div></DashboardLayout>

  const totalRevenue = bookings.filter(b => b.status === 'COMPLETED').reduce((s, b) => s + (b.amount || 0), 0)
  const pending   = bookings.filter(b => b.status === 'PENDING').length
  const confirmed = bookings.filter(b => b.status === 'CONFIRMED').length

  return (
    <DashboardLayout>
      <div className="page-wrapper">
        <h1 className="page-title mb-1">Provider Dashboard</h1>
        <p className="page-subtitle mb-8">{profile?.companyName}</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatsCard title="Total Bookings"  value={bookings.length}            icon={Calendar}  color="navy"  />
          <StatsCard title="Pending"         value={pending}                     icon={Briefcase} color="gold"  />
          <StatsCard title="Confirmed"       value={confirmed}                   icon={Calendar}  color="ocean" />
          <StatsCard title="Revenue (completed)" value={formatCurrency(totalRevenue)} icon={DollarSign} color="green" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="section-title mb-0">Recent Bookings</h3>
              <Link to="/provider/appointments" className="text-xs text-navy-600 hover:underline flex items-center gap-1">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            {bookings.length === 0 ? (
              <div className="text-center py-10"><Calendar size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="text-slate-400 text-sm">No bookings yet.</p></div>
            ) : (
              <div className="space-y-3">
                {bookings.map(b => {
                  const s = BOOKING_STATUSES[b.status] || { label: b.status, color: 'gray' }
                  const bm = { gold:'badge-gold',blue:'badge-blue',green:'badge-green',red:'badge-red',gray:'badge-gray',purple:'badge-purple' }
                  return (
                    <div key={b.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <div>
                        <p className="font-medium text-navy-800 text-sm">{b.studentName}</p>
                        <p className="text-xs text-slate-400">{b.serviceName} · {formatDate(b.createdAt)}</p>
                      </div>
                      <span className={clsx('badge', bm[s.color])}>{s.label}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Profile summary */}
          <div className="card p-6">
            <h3 className="section-title">Profile Overview</h3>
            {profile && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-navy-100 rounded-2xl flex items-center justify-center font-700 text-navy-700 text-xl">
                    {profile.firstName?.[0]}{profile.lastName?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-navy-900">{profile.companyName}</p>
                    <p className="text-sm text-slate-500">{profile.country}</p>
                    {profile.verified && <span className="badge badge-green text-xs">Verified</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-gold-500 fill-gold-500" />
                  <span className="font-semibold text-navy-800">{profile.rating?.toFixed(1) || '0.0'}</span>
                  <span className="text-slate-400 text-sm">({profile.totalReviews || 0} reviews)</span>
                </div>
                <Link to="/provider/profile" className="btn btn-secondary btn-sm">Edit Profile</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
