import { useCallback, useEffect, useState } from 'react'
import type { StaffUser } from '../lib/api'
import { authApi } from '../lib/api'

const STORAGE_KEY = 'ds-psi-staff-token'

export function getStoredToken(): string | null {
  return localStorage.getItem(STORAGE_KEY)
}

export function setStoredToken(token: string | null) {
  if (token) localStorage.setItem(STORAGE_KEY, token)
  else localStorage.removeItem(STORAGE_KEY)
}

export function useAuth() {
  const [user, setUser] = useState<StaffUser | null>(null)
  const [token, setToken] = useState<string | null>(() => getStoredToken())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const stored = getStoredToken()
      if (!stored) {
        if (!cancelled) {
          setLoading(false)
          setUser(null)
        }
        return
      }

      try {
        const { user: me } = await authApi.me(stored)
        if (!cancelled) {
          setToken(stored)
          setUser(me)
        }
      } catch {
        setStoredToken(null)
        if (!cancelled) {
          setToken(null)
          setUser(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const result = await authApi.login(email, password)
    setStoredToken(result.token)
    setToken(result.token)
    setUser(result.user)
    return result.user
  }, [])

  const logout = useCallback(() => {
    setStoredToken(null)
    setToken(null)
    setUser(null)
  }, [])

  const updateUser = useCallback((nextUser: StaffUser, nextToken?: string) => {
    setUser(nextUser)
    if (nextToken) {
      setStoredToken(nextToken)
      setToken(nextToken)
    }
  }, [])

  return { user, token, loading, login, logout, updateUser, isAdmin: user?.role === 'admin' }
}
