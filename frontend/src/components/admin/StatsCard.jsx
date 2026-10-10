import { TrendingUp, TrendingDown } from 'lucide-react'
import clsx from 'clsx'

export default function StatsCard({ title, value, subtitle, icon: Icon, color = 'navy', trend }) {
  const colors = {
    navy:   { bg: 'bg-navy-100',   icon: 'text-navy-700',   glow: 'bg-navy-700'   },
    gold:   { bg: 'bg-gold-100',   icon: 'text-gold-700',   glow: 'bg-gold-500'   },
    green:  { bg: 'bg-emerald-100',icon: 'text-emerald-700',glow: 'bg-emerald-600' },
    ocean:  { bg: 'bg-cyan-100',   icon: 'text-cyan-700',   glow: 'bg-cyan-600'   },
    red:    { bg: 'bg-red-100',    icon: 'text-red-700',    glow: 'bg-red-600'    },
    purple: { bg: 'bg-purple-100', icon: 'text-purple-700', glow: 'bg-purple-600' },
  }
  const c = colors[color] || colors.navy

  return (
    <div className="stat-card group hover:shadow-card-hover transition-shadow">
      <div className={clsx('stat-icon', c.bg)}>
        <Icon size={22} className={c.icon} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">{title}</p>
        <p className="font-display text-2xl font-700 text-navy-900 leading-none">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        {trend !== undefined && (
          <div className={clsx('flex items-center gap-1 text-xs font-medium mt-1',
            trend >= 0 ? 'text-emerald-600' : 'text-red-500')}>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}% vs last month
          </div>
        )}
      </div>
    </div>
  )
}
