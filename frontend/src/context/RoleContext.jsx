import { createContext, useContext } from 'react'
import { AuthContext } from './AuthContext'

export const RoleContext = createContext(null)

export function RoleProvider({ children }) {
  const auth = useContext(AuthContext)
  return <RoleContext.Provider value={auth}>{children}</RoleContext.Provider>
}
