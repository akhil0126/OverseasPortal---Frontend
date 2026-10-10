import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { validators } from '../../utils/validators'
import { useAuth } from '../../hooks/useAuth'
import RoleSelector from './RoleSelector'

export default function RegisterForm({ onSuccess }) {
  const { register: registerUser, loading } = useAuth()
  const [showPwd, setShowPwd] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { role: 'ROLE_STUDENT' }
  })

  const selectedRole = watch('role')

  const onSubmit = async (data) => {
    const user = await registerUser(data)
    if (user) onSuccess?.(user)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <RoleSelector register={register} />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">First Name</label>
          <input className={`form-input ${errors.firstName ? 'form-input-error' : ''}`}
            placeholder="John" {...register('firstName', validators.name('First name'))} />
          {errors.firstName && <p className="form-error">{errors.firstName.message}</p>}
        </div>
        <div>
          <label className="form-label">Last Name</label>
          <input className={`form-input ${errors.lastName ? 'form-input-error' : ''}`}
            placeholder="Doe" {...register('lastName', validators.name('Last name'))} />
          {errors.lastName && <p className="form-error">{errors.lastName.message}</p>}
        </div>
      </div>

      <div>
        <label className="form-label">Email</label>
        <div className="relative">
          <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="email" placeholder="you@example.com"
            className={`form-input pl-10 ${errors.email ? 'form-input-error' : ''}`}
            {...register('email', validators.email)} />
        </div>
        {errors.email && <p className="form-error">{errors.email.message}</p>}
      </div>

      <div>
        <label className="form-label">Phone</label>
        <div className="relative">
          <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input placeholder="Enter your phone number"
            className={`form-input pl-10 ${errors.phone ? 'form-input-error' : ''}`}
            {...register('phone', validators.phone)} />
        </div>
        {errors.phone && <p className="form-error">{errors.phone.message}</p>}
      </div>

      {selectedRole === 'ROLE_PROVIDER' && (
        <div>
          <label className="form-label">Company Name</label>
          <input placeholder="Your Company Ltd."
            className={`form-input ${errors.companyName ? 'form-input-error' : ''}`}
            {...register('companyName', { required: 'Company name is required for providers' })} />
          {errors.companyName && <p className="form-error">{errors.companyName.message}</p>}
        </div>
      )}

      <div>
        <label className="form-label">Password</label>
        <div className="relative">
          <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type={showPwd ? 'text' : 'password'} placeholder="Min 8 chars, uppercase & digit"
            className={`form-input pl-10 pr-10 ${errors.password ? 'form-input-error' : ''}`}
            {...register('password', validators.password)} />
          <button type="button" onClick={() => setShowPwd(v => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {errors.password && <p className="form-error">{errors.password.message}</p>}
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full btn-lg mt-2">
        {loading ? 'Creating account…' : 'Create Account'}
      </button>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="text-navy-700 font-semibold hover:underline">Sign in</Link>
      </p>
    </form>
  )
}
