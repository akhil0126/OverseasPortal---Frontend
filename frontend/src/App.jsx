import { useEffect } from 'react'
import AppRoutes from './routes/AppRoutes.jsx'
import { useAuth } from './hooks/useAuth.js'

export default function App() {
  const { initAuth } = useAuth()

  useEffect(() => { initAuth() }, [])

  return <AppRoutes />
}
