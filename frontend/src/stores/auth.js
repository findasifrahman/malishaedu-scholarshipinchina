import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import { useToast } from 'vue-toastification'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  const loading = ref(false)
  const toast = useToast()

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  // Initialize auth state from localStorage
  const initAuth = async () => {
    if (token.value) {
      try {
        const response = await api.get('/auth/profile')
        user.value = response.data.user
      } catch (error) {
        // Token is invalid, clear it
        logout()
      }
    }
  }

  // Login
  const login = async (credentials) => {
    loading.value = true
    try {
      console.log('Auth store - Sending login request with:', credentials)
      const response = await api.post('/auth/login', credentials)
      console.log('Auth store - Login response:', response.data)
      const { user: userData, token: tokenData } = response.data
      
      user.value = userData
      token.value = tokenData
      localStorage.setItem('token', tokenData)
      
      // Set default authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${tokenData}`
      
      toast.success('Login successful!')
      
      // Check for redirect after login
      const redirectData = localStorage.getItem('redirectAfterLogin')
      if (redirectData) {
        try {
          const data = JSON.parse(redirectData)
          if (data.route === '/profile' && data.tab === 'programs') {
            // Redirect to profile page with programs tab
            router.push({
              path: '/profile',
              query: {
                tab: 'programs',
                programId: data.programId,
                programData: JSON.stringify(data.programData)
              }
            })
            return { success: true, user: userData, redirect: true }
          }
        } catch (error) {
          console.error('Error parsing redirect data:', error)
          localStorage.removeItem('redirectAfterLogin')
        }
      }
      
      return { success: true, user: userData }
    } catch (error) {
      console.error('Auth store - Login error:', error)
      console.error('Auth store - Error response:', error.response?.data)
      const message = error.response?.data?.error || 'Login failed'
      toast.error(message)
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  // Register
  const register = async (userData) => {
    loading.value = true
    try {
      console.log("userData");
      console.log(userData);
      const response = await api.post('/auth/signup', userData)
      const { user: newUser, token: tokenData } = response.data
      
      user.value = newUser
      token.value = tokenData
      localStorage.setItem('token', tokenData)
      console.log("tokenData");
      console.log(tokenData);
      // Set default authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${tokenData}`
      
      toast.success('Registration successful!')
      return { success: true, user: newUser }
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed'
      toast.error(message)
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  // Logout
  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    toast.info('Logged out successfully')
    
    // Redirect to signin page
    router.push('/signin')
  }

  // Update profile
  const updateProfile = async (updates) => {
    loading.value = true
    try {
      const response = await api.put('/auth/profile', updates)
      user.value = response.data.user
      toast.success('Profile updated successfully!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.error || 'Profile update failed'
      toast.error(message)
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  // Change password
  const changePassword = async (passwordData) => {
    loading.value = true
    try {
      await api.put('/auth/change-password', passwordData)
      toast.success('Password changed successfully!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.error || 'Password change failed'
      toast.error(message)
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  // Upload profile image
  const uploadProfileImage = async (file) => {
    loading.value = true
    try {
      const formData = new FormData()
      formData.append('image', file)
      
      const response = await api.post('/uploads/profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      user.value.profile_image_url = response.data.imageUrl
      toast.success('Profile image uploaded successfully!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.error || 'Image upload failed'
      toast.error(message)
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  // Upload passport
  const uploadPassport = async (file) => {
    loading.value = true
    try {
      const formData = new FormData()
      formData.append('passport', file)
      
      const response = await api.post('/uploads/passport', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      user.value.passport_image_url = response.data.imageUrl
      toast.success('Passport uploaded successfully!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.error || 'Passport upload failed'
      toast.error(message)
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    initAuth,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    uploadProfileImage,
    uploadPassport
  }
})
