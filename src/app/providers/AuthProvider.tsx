import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react'
import { TOKEN_KEY, USER_KEY } from '@shared/constants'
import { User } from '@shared/types'
import { request } from '@shared/api/client'

interface AuthState {
  token: string | null
  user: User | null
  isLoading: boolean
}
interface AuthContextValue extends AuthState {
  login: (token: string, user: User) => void
  logout: () => void
  updateUser: (user: User) => void
}
const AuthContext = createContext<AuthContextValue | null>(null)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: localStorage.getItem(TOKEN_KEY),
    user: null,
    isLoading: true,
  })
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setState((s) => ({ ...s, isLoading: false }))
      return
    }
    request<{ user: User }>('/user/myinfo')
      .then(({ user }) => {
        setState({ token, user, isLoading: false })
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        setState({ token: null, user: null, isLoading: false })
      })
  }, [])
  const login = useCallback((token: string, user: User) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    setState({ token, user, isLoading: false })
  }, [])
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setState({ token: null, user: null, isLoading: false })
  }, [])
  const updateUser = useCallback((user: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    setState((s) => ({ ...s, user }))
  }, [])
  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
