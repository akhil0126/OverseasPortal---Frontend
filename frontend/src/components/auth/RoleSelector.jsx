import { GraduationCap, Briefcase } from 'lucide-react'
import { useWatch } from 'react-hook-form'
import clsx from 'clsx'

const ROLES = [
  { value: 'ROLE_STUDENT',  label: 'Student',  desc: 'Apply to universities & book services', icon: GraduationCap },
  { value: 'ROLE_PROVIDER', label: 'Provider', desc: 'Offer services to students worldwide',   icon: Briefcase },
]

export default function RoleSelector({ register, control }) {
  return (
    <div>
      <label className="form-label">I am a…</label>
      <div className="grid grid-cols-2 gap-3">
        {ROLES.map(role => (
          <label key={role.value}
            className="relative cursor-pointer group">
            <input type="radio" value={role.value} {...register('role')} className="sr-only peer" />
            <div className={clsx(
              'border-2 rounded-xl p-4 transition-all duration-150 text-center',
              'peer-checked:border-navy-700 peer-checked:bg-navy-50',
              'border-slate-200 hover:border-navy-300'
            )}>
              <role.icon size={22} className="mx-auto mb-2 text-navy-600" />
              <p className="font-semibold text-navy-800 text-sm">{role.label}</p>
              <p className="text-xs text-slate-500 mt-0.5 leading-tight">{role.desc}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}
