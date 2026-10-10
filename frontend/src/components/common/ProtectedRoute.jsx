import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Loader from './Loader'

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Loader fullScreen />
  if (!user)   return <Navigate to="/login" state={{ from: location }} replace />

  const hasRole = allowedRoles.length === 0 || allowedRoles.some(r => user.roles?.includes(r))
  if (!hasRole) return <Navigate to="/" replace />

  return <Outlet />
}
