import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { validators } from '../../utils/validators'
import { useAuth } from '../../hooks/useAuth'

export default function LoginForm({ onSuccess }) {
  const { login, loading } = useAuth()
  const [showPwd, setShowPwd] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    const user = await login(data)
    if (user) onSuccess?.(user)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="form-label">Email address</label>
        <div className="relative">
          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            placeholder="you@example.com"
            className={`form-input pl-10 ${errors.email ? 'form-input-error' : ''}`}
            {...register('email', validators.email)}
          />
        </div>
        {errors.email && <p className="form-error">{errors.email.message}</p>}
      </div>

      <div>
        <label className="form-label">Password</label>
        <div className="relative">
          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type={showPwd ? 'text' : 'password'}
            placeholder="••••••••"
            className={`form-input pl-10 pr-10 ${errors.password ? 'form-input-error' : ''}`}
            {...register('password', { required: 'Password is required' })}
          />
          <button type="button" onClick={() => setShowPwd(v => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p className="form-error">{errors.password.message}</p>}
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full btn-lg">
        {loading ? 'Signing in…' : 'Sign In'}
      </button>

      <p className="text-center text-sm text-slate-500">
        Don't have an account?{' '}
        <Link to="/register" className="text-navy-700 font-semibold hover:underline">Create one</Link>
      </p>
    </form>
  )
}
