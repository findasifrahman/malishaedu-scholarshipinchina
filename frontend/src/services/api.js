import axios from 'axios'
import { useToast } from 'vue-toastification'

const api = axios.create({
  baseURL: '/api',
  timeout: 15000, // Increased timeout to 15 seconds
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const toast = useToast()
    
    // Handle common errors
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token')
          delete api.defaults.headers.common['Authorization']
          if (window.location.pathname !== '/signin') {
            toast.error('Session expired. Please login again.')
            window.location.href = '/signin'
          }
          break
        case 403:
          toast.error('Access denied')
          break
        case 404:
          toast.error('Resource not found')
          break
        case 422:
          // Validation errors
          if (data.details && Array.isArray(data.details)) {
            data.details.forEach(detail => toast.error(detail))
          } else {
            toast.error(data.error || 'Validation failed')
          }
          break
        case 500:
          toast.error('Server error. Please try again later.')
          break
        default:
          toast.error(data.error || 'An error occurred')
      }
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection.')
    } else {
      // Other error
      toast.error('An unexpected error occurred')
    }
    
    return Promise.reject(error)
  }
)

export default api
