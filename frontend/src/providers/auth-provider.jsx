import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/lib/api'
import { toast } from 'react-hot-toast'

const AuthContext = createContext({})

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('access_token')
    const storedUser = localStorage.getItem('user')
    return token && storedUser ? JSON.parse(storedUser) : null
  })
  const navigate = useNavigate()

  const login = async ({ email, password }) => {
    try {
      const { access, refresh, user: userData } = await authApi.login({ email, password })
      
      if (access && refresh && userData) {
        localStorage.setItem('access_token', access)
        localStorage.setItem('refresh_token', refresh)
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
        navigate('/dashboard')
        toast.success('Welcome back!')
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.error || 
                          'Login failed. Please check your credentials.'
      toast.error(errorMessage)
      throw error
    }
  }

  const register = async (data) => {
    try {
      const response = await authApi.register(data)
      if (response) {
        // After successful registration, log in
        await login({ email: data.email, password: data.password })
        toast.success('Registration successful!')
      }
    } catch (error) {
      console.error('Registration error:', error)
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.error || 
                          'Registration failed. Please try again.'
      toast.error(errorMessage)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/auth')
    toast.success('Logged out successfully')
  }

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export { AuthProvider } 