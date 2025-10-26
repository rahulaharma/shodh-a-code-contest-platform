import { createContext, useCallback, useMemo, useState } from 'react'

import { login as loginRequest, register as registerRequest } from '../api/auth'
import { session } from '../lib/session'

export const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(() => session.getAccessToken())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const persistSession = useCallback((token) => {
    if (!token) {
      throw new Error('Authentication response missing token')
    }
    session.setTokens({ token })
    setAccessToken(token)
  }, [])

  const login = useCallback(
    async (credentials) => {
      try {
        setLoading(true)
        setError(null)
        const response = await loginRequest(credentials)
        persistSession(response.token)
        setUser({ username: credentials.username })
      } catch (err) {
        console.error(err)
        setError(err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [persistSession],
  )

  const register = useCallback(
    async (payload) => {
      try {
        setLoading(true)
        setError(null)
        const response = await registerRequest(payload)
        persistSession(response.token)
        setUser({ username: payload.username })
      } catch (err) {
        console.error(err)
        setError(err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [persistSession],
  )

  const logout = useCallback(() => {
    session.clear()
    setUser(null)
    setAccessToken(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      token: accessToken,
      isAuthenticated: Boolean(accessToken),
      loading,
      error,
      login,
      register,
      logout,
    }),
    [user, accessToken, loading, error, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
