import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/common/DashboardLayout'
import Loader from '../../components/common/Loader'
import subscriptionService from '../../services/subscriptionService'
import { formatCurrency, formatDate } from '../../utils/validators'
import toast from 'react-hot-toast'
import { Check, CreditCard, Crown, Zap } from 'lucide-react'
import clsx from 'clsx'

const ICONS = { FREE: CreditCard, BASIC: Zap, PREMIUM: Crown, PRO: Crown }

export default function SubscriptionPage() {
  const [plans, setPlans]         = useState([])
  const [status, setStatus]       = useState(null)
  const [loading, setLoading]     = useState(true)
  const [subscribing, setSubbing] = useState(null)

  useEffect(() => {
    Promise.all([
      subscriptionService.getPlans(),
      subscriptionService.getMyStatus(),
    ]).then(([p, s]) => { setPlans(p || []); setStatus(s) })
      .finally(() => setLoading(false))
  }, [])

  const handleSubscribe = async (plan) => {
    if (plan.price === 0) {
      toast('You are already on the Free plan.')
      return
    }
    setSubbing(plan.id)
    try {
      await subscriptionService.subscribe(plan.id)
      const s = await subscriptionService.getMyStatus()
      setStatus(s)
      toast.success(`Subscribed to ${plan.name} successfully!`)
    } catch (e) { toast.error(e?.response?.data?.message || 'Subscription failed') }
    finally { setSubbing(null) }
  }

  const handleCancel = async () => {
    if (!confirm('Cancel your current subscription?')) return
    try {
      await subscriptionService.cancel()
      const s = await subscriptionService.getMyStatus()
      setStatus(s)
      toast.success('Subscription cancelled')
    } catch (e) { toast.error(e?.response?.data?.message || 'Cancel failed') }
  }

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="page-wrapper max-w-5xl">
        <h1 className="page-title mb-2">Subscription</h1>
        <p className="page-subtitle mb-8">Upgrade your plan to unlock more applications and bookings</p>

        {/* Current status */}
        {status && (
          <div className="card p-6 mb-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gold-100 rounded-2xl flex items-center justify-center">
                <Crown size={22} className="text-gold-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Current Plan</p>
                <p className="font-display text-xl font-700 text-navy-900">{status.plan}</p>
                {status.endDate && (
                  <p className="text-xs text-slate-500">Active until {formatDate(status.endDate)}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <p className="font-700 text-navy-800">{status.maxApplications === -1 ? '∞' : status.maxApplications}</p>
                <p className="text-xs text-slate-400">Applications</p>
              </div>
              <div className="text-center">
                <p className="font-700 text-navy-800">{status.maxBookings === -1 ? '∞' : status.maxBookings}</p>
                <p className="text-xs text-slate-400">Bookings</p>
              </div>
              {status.active && status.type !== 'FREE' && (
                <button onClick={handleCancel} className="btn btn-secondary btn-sm text-red-500 border-red-200 hover:bg-red-50">
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}

        {/* Plans grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map(plan => {
            const Icon = ICONS[plan.type] || CreditCard
            const isCurrent = status?.type === plan.type
            const isPro = plan.type === 'PREMIUM' || plan.type === 'PRO'
            return (
              <div key={plan.id} className={clsx('card flex flex-col', isPro && 'ring-2 ring-navy-700')}>
                {isPro && (
                  <div className="bg-navy-700 text-white text-xs font-semibold text-center py-1.5 rounded-t-2xl">
                    Most Popular
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center mb-4',
                    isPro ? 'bg-navy-100' : 'bg-slate-100')}>
                    <Icon size={20} className={isPro ? 'text-navy-700' : 'text-slate-600'} />
                  </div>
                  <h3 className="font-display text-xl font-700 text-navy-900 mb-0.5">{plan.name}</h3>
                  <div className="mb-4">
                    {plan.price === 0
                      ? <span className="text-2xl font-700 text-navy-800">Free</span>
                      : <><span className="text-2xl font-700 text-navy-800">{formatCurrency(plan.price)}</span>
                          <span className="text-slate-400 text-sm">/mo</span></>
                    }
                  </div>
                  {plan.description && <p className="text-xs text-slate-500 mb-4 leading-relaxed">{plan.description}</p>}
                  <ul className="space-y-2 mb-6 flex-1">
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <Check size={14} className="text-emerald-500 flex-shrink-0" />
                      {plan.maxApplications === -1 ? 'Unlimited' : plan.maxApplications} Applications
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <Check size={14} className="text-emerald-500 flex-shrink-0" />
                      {plan.maxBookings === -1 ? 'Unlimited' : plan.maxBookings} Bookings
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <Check size={14} className="text-emerald-500 flex-shrink-0" />
                      {plan.durationDays} days access
                    </li>
                  </ul>
                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={isCurrent || subscribing === plan.id}
                    className={clsx('w-full', isCurrent ? 'btn btn-secondary opacity-60' : isPro ? 'btn-primary' : 'btn btn-secondary')}>
                    {isCurrent ? 'Current Plan' : subscribing === plan.id ? 'Processing…' : 'Select Plan'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}
