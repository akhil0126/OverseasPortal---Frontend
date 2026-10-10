import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Globe, Menu, X, Bell, ChevronDown, LogOut, User } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { ROLES } from '../../utils/constants'
import clsx from 'clsx'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/student/universities', label: 'Universities' },
  { href: '/student/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const { user, logout, isStudent, isProvider, isAdmin } = useAuth()
  const navigate    = useNavigate()
  const location    = useLocation()
  const [open, setOpen]       = useState(false)
  const [userMenu, setUserMenu] = useState(false)

  const dashboardPath = isAdmin() ? '/admin/dashboard'
    : isProvider() ? '/provider/dashboard'
    : '/student/dashboard'

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav className="sticky top-0 z-40 bg-navy-950/95 backdrop-blur border-b border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center group-hover:bg-gold-400 transition-colors">
              <Globe size={18} className="text-navy-900" />
            </div>
            <span className="font-display text-xl font-700 text-white tracking-tight">
              Overseas<span className="text-gold-400">Portal</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={clsx(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === link.href
                    ? 'text-gold-400 bg-navy-800'
                    : 'text-navy-300 hover:text-white hover:bg-navy-800'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to={dashboardPath}
                  className="text-sm text-navy-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-navy-800">
                  Dashboard
                </Link>

                {/* User menu */}
                <div className="relative">
                  <button onClick={() => setUserMenu(v => !v)}
                    className="flex items-center gap-2 bg-navy-800 hover:bg-navy-700 rounded-xl px-3 py-2 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-gold-500 flex items-center justify-center text-navy-900 font-700 text-xs">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </div>
                    <span className="text-white text-sm font-medium">{user.firstName}</span>
                    <ChevronDown size={14} className={clsx('text-navy-400 transition-transform', userMenu && 'rotate-180')} />
                  </button>

                  {userMenu && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-card-hover border border-slate-100 py-1.5 animate-in">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="font-semibold text-navy-900 text-sm">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      <Link to={`${isProvider() ? '/provider' : '/student'}/profile`}
                        onClick={() => setUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                        <User size={15} /> My Profile
                      </Link>
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login"    className="btn btn-ghost !text-navy-300 hover:!text-white">Sign In</Link>
                <Link to="/register" className="btn-gold btn-sm">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button className="md:hidden text-white" onClick={() => setOpen(v => !v)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-navy-900 border-t border-navy-800 px-4 py-4 space-y-1 animate-in">
          {NAV_LINKS.map(link => (
            <Link key={link.href} to={link.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm text-navy-300 hover:text-white hover:bg-navy-800 transition-colors">
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-navy-800 flex flex-col gap-2">
            {user ? (
              <>
                <Link to={dashboardPath} onClick={() => setOpen(false)}
                  className="btn btn-secondary !text-navy-900 w-full">Dashboard</Link>
                <button onClick={() => { handleLogout(); setOpen(false) }}
                  className="btn btn-danger w-full">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login"    onClick={() => setOpen(false)} className="btn btn-secondary w-full">Sign In</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn-gold w-full text-center">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
