import { User, Globe, GraduationCap, Mail, Phone, MapPin, Edit3 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ProfileCard({ student }) {
  if (!student) return null
  const { firstName, lastName, email, phone, profileCompletion = 0,
          nationality, targetCountry, targetDegree, fieldOfStudy, bio } = student

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center text-white font-display text-2xl font-700 shadow-lg">
            {firstName?.[0]}{lastName?.[0]}
          </div>
          <div>
            <h2 className="font-display text-xl font-700 text-navy-900">{firstName} {lastName}</h2>
            {nationality && <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5"><Globe size={13} />{nationality}</p>}
          </div>
        </div>
        <Link to="/student/profile" className="btn btn-secondary btn-sm">
          <Edit3 size={13} /> Edit
        </Link>
      </div>

      {/* Completion bar */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>Profile completion</span>
          <span className="font-semibold text-navy-700">{profileCompletion}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-navy-600 to-ocean-500 rounded-full transition-all duration-500"
            style={{ width: `${profileCompletion}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        {email        && <Info icon={Mail}           label="Email"       value={email} />}
        {phone        && <Info icon={Phone}          label="Phone"       value={phone} />}
        {targetCountry&& <Info icon={MapPin}         label="Target"      value={targetCountry} />}
        {targetDegree && <Info icon={GraduationCap}  label="Degree"      value={targetDegree} />}
      </div>

      {bio && <p className="mt-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">{bio}</p>}
    </div>
  )
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 text-slate-600">
      <Icon size={14} className="text-navy-400 flex-shrink-0" />
      <span className="text-slate-400 text-xs">{label}:</span>
      <span className="text-navy-800 text-xs font-medium truncate">{value}</span>
    </div>
  )
}
