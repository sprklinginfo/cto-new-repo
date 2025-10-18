import { createContext, useCallback, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

export type User = {
  id: string
  name: string
}

export type SessionValue = {
  user: User | null
  isAuthenticated: boolean
  login: (name: string) => void
  logout: () => void
}

const SessionContext = createContext<SessionValue | undefined>(undefined)

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useLocalStorage<User | null>('session.user', null)

  const login = useCallback((name: string) => {
    const newUser: User = { id: Date.now().toString(), name }
    setUser(newUser)
  }, [setUser])

  const logout = useCallback(() => {
    setUser(null)
  }, [setUser])

  const value: SessionValue = {
    user,
    isAuthenticated: Boolean(user),
    login,
    logout,
  }

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export const useSession = (): SessionValue => {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within SessionProvider')
  return ctx
}
