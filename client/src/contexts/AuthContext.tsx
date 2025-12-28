import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react'
import { authAPI } from '../utils/api'
import { User } from '../types'

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (username: string, password: string, role: string) => Promise<void>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth data
    const storedToken = localStorage.getItem('smartattend_token')
    const storedUser = localStorage.getItem('smartattend_user')
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Failed to parse stored user data:', error)
        localStorage.removeItem('smartattend_token')
        localStorage.removeItem('smartattend_user')
      }
    }
    
    setLoading(false)
  }, [])

  const login = async (username: string, password: string, role: string) => {
    try {
      setLoading(true)
      
      const response = await authAPI.login({
        username,
        password,
        role
      })
      
      const { token, user } = response.data
      
      // Store auth data
      localStorage.setItem('smartattend_token', token)
      localStorage.setItem('smartattend_user', JSON.stringify(user))
      
      setToken(token)
      setUser(user)
      
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('smartattend_token')
    localStorage.removeItem('smartattend_user')
    setUser(null)
    setToken(null)
    window.location.href = '/login'
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem('smartattend_user', JSON.stringify(updatedUser))
    }
  }

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}