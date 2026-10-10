import { createContext, useState, useCallback } from 'react'
import { tokenHelper } from '../utils/tokenHelper'
import authService from '../services/authService'
import toast from 'react-hot-toast'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(tokenHelper.getUser())
  const [loading, setLoading] = useState(false)

  const initAuth = useCallback(() => {
    const stored = tokenHelper.getUser()
    if (stored) setUser(stored)
  }, [])

  const login = useCallback(async (credentials) => {
    setLoading(true)
    try {
      const data = await authService.login(credentials)
      tokenHelper.setTokens(data.accessToken, data.refreshToken)
      tokenHelper.setUser(data)
      setUser(data)
      toast.success(`Welcome back, ${data.firstName}!`)
      return data
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (payload) => {
    setLoading(true)
    try {
      const data = await authService.register(payload)
      tokenHelper.setTokens(data.accessToken, data.refreshToken)
      tokenHelper.setUser(data)
      setUser(data)
      toast.success('Account created successfully!')
      return data
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    tokenHelper.clear()
    setUser(null)
    toast.success('Logged out successfully')
  }, [])

  const hasRole = useCallback((role) => user?.roles?.includes(role) ?? false, [user])

  const isStudent  = useCallback(() => hasRole('ROLE_STUDENT'),  [hasRole])
  const isProvider = useCallback(() => hasRole('ROLE_PROVIDER'), [hasRole])
  const isAdmin    = useCallback(() => hasRole('ROLE_ADMIN'),    [hasRole])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, initAuth, hasRole, isStudent, isProvider, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}
