import { MapPin, Star, BookOpen, DollarSign, Award } from 'lucide-react'
import { formatCurrency } from '../../utils/validators'

export default function UniversityCard({ university, onApply }) {
  const { id, name, country, city, worldRanking, qsRanking, tuitionFeeMin, tuitionFeeMax,
          feeCurrency, scholarshipAvailable, totalCourses, logoUrl, acceptanceRate } = university

  return (
    <div className="card-hover group">
      {/* Header */}
      <div className="h-24 bg-gradient-to-br from-navy-800 to-navy-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #f5bc22 0%, transparent 50%)' }} />
        {logoUrl && (
          <img src={logoUrl} alt={name}
            className="absolute right-4 top-4 w-14 h-14 object-contain bg-white/10 rounded-xl p-1.5" />
        )}
        <div className="absolute bottom-3 left-4">
          {(worldRanking || qsRanking) && (
            <span className="badge badge-gold text-xs">
              <Award size={10} /> #{worldRanking || qsRanking} World
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-display text-lg font-700 text-navy-900 leading-tight group-hover:text-navy-700 transition-colors">
          {name}
        </h3>
        <p className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
          <MapPin size={13} /> {city ? `${city}, ` : ''}{country}
        </p>

        <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
          {(tuitionFeeMin || tuitionFeeMax) && (
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-0.5">Tuition / yr</p>
              <p className="font-semibold text-navy-800 text-xs">
                {tuitionFeeMin ? formatCurrency(tuitionFeeMin, feeCurrency) : ''}
                {tuitionFeeMin && tuitionFeeMax ? '–' : ''}
                {tuitionFeeMax ? formatCurrency(tuitionFeeMax, feeCurrency) : ''}
              </p>
            </div>
          )}
          {acceptanceRate && (
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-0.5">Acceptance</p>
              <p className="font-semibold text-navy-800 text-xs">{acceptanceRate}%</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1"><BookOpen size={12} /> {totalCourses || 0} courses</span>
            {scholarshipAvailable && <span className="badge badge-green">Scholarship</span>}
          </div>
          <button onClick={() => onApply?.(university)} className="btn-primary btn-sm">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  )
}
