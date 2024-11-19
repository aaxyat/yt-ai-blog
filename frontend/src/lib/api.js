import axios from 'axios'

const BASE_URL = 'http://localhost:8000/api'

// Set default axios configs
axios.defaults.withCredentials = true
axios.defaults.headers.common['Content-Type'] = 'application/json'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Enable this for CORS
})

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    // Ensure headers are set for every request
    config.headers = {
      ...config.headers,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data ? { ...config.data, password: '***' } : undefined,
    })
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      data: response.data,
    })
    return response
  },
  (error) => {
    console.error('API Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    })
    return Promise.reject(error)
  }
)

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        const response = await api.post('/auth/token/refresh/', {
          refresh: refreshToken,
        })

        const { access } = response.data
        localStorage.setItem('access_token', access)

        originalRequest.headers.Authorization = `Bearer ${access}`
        return api(originalRequest)
      } catch (error) {
        // Refresh token expired, redirect to login
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/auth'
      }
    }

    return Promise.reject(error)
  }
)

export const authApi = {
  login: async ({ email, password }) => {
    try {
      console.log('Attempting login with:', { email })
      const response = await api.post('/auth/token/', {
        email,
        password,
      })
      console.log('Login response:', response.data)
      return response.data
    } catch (error) {
      console.error('Login API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        }
      })
      throw error
    }
  },

  register: async (userData) => {
    const { firstName, lastName, email, password, inviteCode } = userData
    try {
      const response = await api.post('/auth/register/', {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        invite_code: inviteCode,
      })
      return response.data
    } catch (error) {
      console.error('Register API Error:', error.response?.data || error.message)
      throw error
    }
  },

  changePassword: async ({ old_password, new_password }) => {
    try {
      const response = await api.post('/auth/password/change/', {
        old_password,
        new_password,
      })
      return response.data
    } catch (error) {
      console.error('Change password error:', error.response?.data || error.message)
      throw error
    }
  },

  updateTheme: async ({ ui_theme }) => {
    try {
      const response = await api.post('/auth/theme/', {
        ui_theme,
      })
      return response.data
    } catch (error) {
      console.error('Update theme error:', error.response?.data || error.message)
      throw error
    }
  },

  deleteAccount: async () => {
    try {
      await api.delete('/auth/delete-account/')
    } catch (error) {
      console.error('Delete account error:', error.response?.data || error.message)
      throw error
    }
  },
}

export const blogApi = {
  generateBlog: async ({ url, regen = false }) => {
    try {
      const response = await api.post('/blog/generate-from-youtube/', {
        url,
        regen: regen.toString()
      })
      console.log('Generate blog response:', response.data)
      return response.data
    } catch (error) {
      console.error('Generate blog error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      throw error
    }
  },

  getMyBlogs: async () => {
    try {
      const response = await api.get('/blog/my-blogs/')
      return response.data
    } catch (error) {
      console.error('Get blogs error:', error.response?.data || error.message)
      throw error
    }
  },

  deleteBlog: async (id) => {
    try {
      await api.delete(`/blog/my-blogs/${id}/`)
    } catch (error) {
      console.error('Delete blog error:', error.response?.data || error.message)
      throw error
    }
  },

  getBlog: async (id) => {
    try {
      const response = await api.get(`/blog/my-blogs/${id}/`)
      return response.data
    } catch (error) {
      console.error('Get single blog error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      throw error
    }
  },
}

export const adminApi = {
  getUsers: async () => {
    try {
      const response = await api.get('/management/users/')
      return response.data
    } catch (error) {
      console.error('Get users error:', error.response?.data || error.message)
      throw error
    }
  },

  banUser: async ({ email, reason }) => {
    try {
      const response = await api.post('/management/ban/', {
        email,
        reason,
      })
      return response.data
    } catch (error) {
      console.error('Ban user error:', error.response?.data || error.message)
      throw error
    }
  },

  getInvites: async () => {
    try {
      const response = await api.get('/management/invites/')
      return response.data
    } catch (error) {
      console.error('Get invites error:', error.response?.data || error.message)
      throw error
    }
  },

  createInvite: async ({ max_uses } = {}) => {
    try {
      const response = await api.post('/management/invites/', {
        max_uses,
      })
      return response.data
    } catch (error) {
      console.error('Create invite error:', error.response?.data || error.message)
      throw error
    }
  },

  deleteInvite: async (code) => {
    try {
      await api.delete(`/management/invites/${code}/`)
    } catch (error) {
      console.error('Delete invite error:', error.response?.data || error.message)
      throw error
    }
  },

  getStats: async () => {
    try {
      const response = await api.get('/management/stats/')
      return response.data
    } catch (error) {
      console.error('Get stats error:', error.response?.data || error.message)
      throw error
    }
  },
}

export default api 