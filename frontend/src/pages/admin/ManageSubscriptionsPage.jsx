import { useState } from 'react'
import { CreditCard, CheckCircle, XCircle, Zap, Star, Crown } from 'lucide-react'
import Sidebar from '../../components/common/Sidebar'
import Loader from '../../components/common/Loader'
import { useFetch } from '../../hooks/useFetch'
import adminService from '../../services/adminService'
import { formatCurrency, formatDate } from '../../utils/validators'
import clsx from 'clsx'

const PLAN_ICON = { FREE: Zap, BASIC: Star, PREMIUM: Crown, PRO: CreditCard }
const PLAN_COLOR = {
  FREE:    'bg-slate-100 text-slate-700',
  BASIC:   'bg-navy-100 text-navy-700',
  PREMIUM: 'bg-gold-100 text-gold-800',
  PRO:     'bg-purple-100 text-purple-700',
}

export default function ManageSubscriptionsPage() {
  const { data: plans, loading: plansLoading } = useFetch(adminService.getSubscriptionPlans)

  const planList = plans || []
  const totalRevenue = planList.reduce((acc, p) => acc + (p.price * (p._subscriberCount || 0)), 0)

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="page-wrapper">
          <div className="mb-8">
            <h1 className="page-title">Subscriptions</h1>
            <p className="page-subtitle">Manage subscription plans and revenue</p>
          </div>

          {plansLoading ? <Loader /> : (
            <>
              {/* Plan cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
                {planList.map(plan => {
                  const Icon  = PLAN_ICON[plan.type] || CreditCard
                  const color = PLAN_COLOR[plan.type] || PLAN_COLOR.FREE
                  return (
                    <div key={plan.id} className="card p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', color)}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="font-display font-700 text-navy-900">{plan.name}</p>
                          <p className="text-xs text-slate-500">{plan.type}</p>
                        </div>
                        <span className={clsx('ml-auto badge', plan.active ? 'badge-green' : 'badge-red')}>
                          {plan.active ? 'Active' : 'Off'}
                        </span>
                      </div>

                      <p className="text-3xl font-display font-700 text-navy-900 mb-1">
                        {plan.price === 0 ? 'Free' : formatCurrency(plan.price)}
                        {plan.price > 0 && <span className="text-sm font-normal text-slate-400"> /mo</span>}
                      </p>
                      <p className="text-xs text-slate-500 mb-4">{plan.durationDays} days · {plan.description}</p>

                      <div className="space-y-1.5 text-sm border-t border-slate-100 pt-4">
                        <Row label="Max Applications" value={plan.maxApplications === -1 ? 'Unlimited' : plan.maxApplications} />
                        <Row label="Max Bookings"     value={plan.maxBookings    === -1 ? 'Unlimited' : plan.maxBookings} />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Info note */}
              <div className="card p-5 border-l-4 border-navy-600">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-navy-800">Note:</span> To manage individual user subscriptions or view
                  subscriber counts, use the API directly at <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">/api/admin/subscriptions</code>.
                  Payment gateway integration can be configured in <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">subscriptionService.js</code>.
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-navy-800">{value}</span>
    </div>
  )
}
