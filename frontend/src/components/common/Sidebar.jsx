import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import clsx from 'clsx'
import {
  LayoutDashboard, User, GraduationCap, FileText, FolderOpen,
  Briefcase, Calendar, CreditCard, Star, Users, Building2,
  BarChart3, Shield, Globe, Settings, LogOut, ChevronRight
} from 'lucide-react'

const STUDENT_NAV = [
  { icon: LayoutDashboard, label: 'Dashboard',     href: '/student/dashboard'    },
  { icon: User,            label: 'My Profile',    href: '/student/profile'      },
  { icon: GraduationCap,  label: 'Universities',  href: '/student/universities' },
  { icon: FileText,       label: 'Applications',  href: '/student/applications' },
  { icon: FolderOpen,     label: 'Documents',     href: '/student/documents'    },
  { icon: Briefcase,      label: 'Services',      href: '/student/services'     },
  { icon: Calendar,       label: 'Bookings',      href: '/student/bookings'     },
  { icon: CreditCard,     label: 'Subscription',  href: '/student/subscription' },
]

const PROVIDER_NAV = [
  { icon: LayoutDashboard, label: 'Dashboard',     href: '/provider/dashboard'    },
  { icon: Briefcase,       label: 'My Services',   href: '/provider/services'     },
  { icon: Calendar,        label: 'Appointments',  href: '/provider/appointments' },
  { icon: Star,            label: 'Reviews',       href: '/provider/reviews'      },
  { icon: User,            label: 'Profile',       href: '/provider/profile'      },
]

const ADMIN_NAV = [
  { icon: LayoutDashboard, label: 'Dashboard',     href: '/admin/dashboard'     },
  { icon: Users,           label: 'Students',      href: '/admin/students'      },
  { icon: Shield,          label: 'Providers',     href: '/admin/providers'     },
  { icon: Building2,       label: 'Universities',  href: '/admin/universities'  },
  { icon: FileText,        label: 'Applications',  href: '/admin/applications'  },
  { icon: CreditCard,      label: 'Subscriptions', href: '/admin/subscriptions' },
  { icon: BarChart3,       label: 'Reports',       href: '/admin/reports'       },
]

export default function Sidebar() {
  const { user, logout, isAdmin, isProvider } = useAuth()
  const location = useLocation()

  const navItems = isAdmin() ? ADMIN_NAV : isProvider() ? PROVIDER_NAV : STUDENT_NAV

  const roleLabel = isAdmin() ? 'Admin Panel' : isProvider() ? 'Provider Portal' : 'Student Portal'
  const roleBadge = isAdmin() ? 'bg-red-500' : isProvider() ? 'bg-ocean-500' : 'bg-gold-500'

  return (
    <aside className="w-64 min-h-screen bg-navy-950 flex flex-col border-r border-navy-800">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-navy-800">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center">
            <Globe size={16} className="text-navy-900" />
          </div>
          <span className="font-display text-lg font-700 text-white">
            Overseas<span className="text-gold-400">Portal</span>
          </span>
        </Link>
        <div className="mt-3 flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${roleBadge}`} />
          <span className="text-xs text-navy-400">{roleLabel}</span>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-navy-800">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-navy-900">
          <div className="w-9 h-9 rounded-full bg-gold-500 flex items-center justify-center font-700 text-navy-900 text-sm flex-shrink-0">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-navy-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const active = location.pathname === item.href
          return (
            <Link key={item.href} to={item.href}
              className={active ? 'nav-item-active' : 'nav-item-idle'}>
              <item.icon size={17} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight size={14} className="opacity-60" />}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-navy-800">
        <button onClick={logout}
          className="nav-item-idle w-full text-red-400 hover:!text-red-300 hover:!bg-red-900/30">
          <LogOut size={17} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
