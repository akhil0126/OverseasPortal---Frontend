import { DollarSign, Star, BookOpen, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { formatCurrency } from '../../utils/validators'

export default function ServiceCard({ service, onEdit, onDelete, onToggle }) {
  const { id, title, description, price, priceCurrency, category,
          rating, totalReviews, totalBookings, active, features } = service

  return (
    <div className={`card p-5 transition-opacity ${!active ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {category?.name && <span className="badge badge-blue text-xs">{category.name}</span>}
            {!active && <span className="badge badge-gray text-xs">Inactive</span>}
          </div>
          <h3 className="font-semibold text-navy-900 leading-snug">{title}</h3>
          {description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{description}</p>}
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-700 text-navy-800 text-lg">{formatCurrency(price, priceCurrency)}</p>
          <p className="text-xs text-slate-400">per service</p>
        </div>
      </div>

      {features?.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 mb-3">
          {features.slice(0, 3).map((f, i) => (
            <li key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{f}</li>
          ))}
          {features.length > 3 && (
            <li className="text-xs text-slate-400">+{features.length - 3} more</li>
          )}
        </ul>
      )}

      <div className="flex items-center gap-4 text-xs text-slate-500 border-t border-slate-100 pt-3">
        <span className="flex items-center gap-1"><Star size={11} className="text-gold-500" /> {rating?.toFixed(1) || '0.0'} ({totalReviews})</span>
        <span className="flex items-center gap-1"><BookOpen size={11} /> {totalBookings} bookings</span>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => onToggle?.(id, !active)} className="text-navy-500 hover:text-navy-700">
            {active ? <ToggleRight size={18} className="text-emerald-500" /> : <ToggleLeft size={18} />}
          </button>
          <button onClick={() => onEdit?.(service)} className="text-navy-500 hover:text-navy-700"><Edit2 size={14} /></button>
          <button onClick={() => onDelete?.(id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
        </div>
      </div>
    </div>
  )
}
