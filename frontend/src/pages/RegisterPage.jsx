import { useNavigate } from 'react-router-dom'
import { Globe } from 'lucide-react'
import { Link } from 'react-router-dom'
import RegisterForm from '../components/auth/RegisterForm'
import { ROLES } from '../utils/constants'

export default function RegisterPage() {
  const navigate = useNavigate()

  const onSuccess = (user) => {
    if (user.roles?.includes(ROLES.PROVIDER)) navigate('/provider/dashboard', { replace: true })
    else navigate('/student/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-9 h-9 bg-gold-500 rounded-xl flex items-center justify-center">
            <Globe size={18} className="text-navy-900" />
          </div>
          <span className="font-display text-2xl font-700 text-navy-900">
            Overseas<span className="text-gold-500">Portal</span>
          </span>
        </div>
        <h1 className="font-display text-3xl font-700 text-navy-900 mb-1 text-center">Create your account</h1>
        <p className="text-slate-500 mb-8 text-center">Start your overseas journey today — it's free</p>
        <div className="card p-8">
          <RegisterForm onSuccess={onSuccess} />
        </div>
      </div>
    </div>
  )
}
