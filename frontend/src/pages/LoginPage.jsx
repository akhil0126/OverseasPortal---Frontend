import { useNavigate, useLocation } from 'react-router-dom'
import { Globe } from 'lucide-react'
import { Link } from 'react-router-dom'
import LoginForm from '../components/auth/LoginForm'
import { ROLES } from '../utils/constants'

export default function LoginPage() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || null

  const onSuccess = (user) => {
    if (from) { navigate(from, { replace: true }); return }
    if (user.roles?.includes(ROLES.ADMIN))    navigate('/admin/dashboard', { replace: true })
    else if (user.roles?.includes(ROLES.PROVIDER)) navigate('/provider/dashboard', { replace: true })
    else navigate('/student/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy-950 flex-col justify-between p-12">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gold-500 rounded-xl flex items-center justify-center">
            <Globe size={18} className="text-navy-900" />
          </div>
          <span className="font-display text-2xl font-700 text-white">
            Overseas<span className="text-gold-400">Portal</span>
          </span>
        </Link>
        <div>
          <blockquote className="font-display text-3xl font-600 text-white leading-relaxed mb-6">
            "The world is a book, and those who do not travel read only one page."
          </blockquote>
          <p className="text-navy-400">— Saint Augustine</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2.5 mb-10 justify-center">
            <div className="w-9 h-9 bg-gold-500 rounded-xl flex items-center justify-center">
              <Globe size={18} className="text-navy-900" />
            </div>
            <span className="font-display text-2xl font-700 text-navy-900">
              Overseas<span className="text-gold-500">Portal</span>
            </span>
          </div>
          <h1 className="font-display text-3xl font-700 text-navy-900 mb-1">Welcome back</h1>
          <p className="text-slate-500 mb-8">Sign in to your account to continue</p>
          <div className="card p-8">
            <LoginForm onSuccess={onSuccess} />
          </div>
        </div>
      </div>
    </div>
  )
}
