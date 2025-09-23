import { defineStore } from 'pinia'
import loginAuthServices from '../features/Login/services/loginAuthServices'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    isAuthenticated: false,
    isLoading: false
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
    isMember: (state) => state.user?.role === 'member' || state.user?.role === 'admin',
    userName: (state) => state.user ? `${state.user.firstName} ${state.user.lastName}` : null
  },

  actions: {
    // Initialize auth state from localStorage
    initializeAuth() {
      const token = localStorage.getItem('accessToken')
      const user = localStorage.getItem('user')
      
      if (token && user) {
        this.accessToken = token
        this.refreshToken = localStorage.getItem('refreshToken')
        this.user = JSON.parse(user)
        this.isAuthenticated = true
      }
    },

    // Login action
    async login(credentials) {
      this.isLoading = true
      try {
        const response = await loginAuthServices.login(credentials)
        
        if (response.tokens && response.user) {
          // Store tokens
          this.accessToken = response.tokens.accessToken
          this.refreshToken = response.tokens.refreshToken
          this.user = response.user
          this.isAuthenticated = true

          // Persist to localStorage
          localStorage.setItem('accessToken', this.accessToken)
          localStorage.setItem('refreshToken', this.refreshToken)
          localStorage.setItem('user', JSON.stringify(this.user))

          return { success: true, message: response.message }
        } else {
          throw new Error('Invalid response format')
        }
      } catch (error) {
        console.error('Login error:', error)
        return { 
          success: false, 
          message: error.response?.data?.message || 'Login failed'
        }
      } finally {
        this.isLoading = false
      }
    },

    // Logout action
    async logout() {
      try {
        if (this.accessToken) {
          await loginAuthServices.logout()
        }
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        // Clear state and localStorage
        this.user = null
        this.accessToken = null
        this.refreshToken = null
        this.isAuthenticated = false
        
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
      }
    },

    // Refresh token action
    async refreshAccessToken() {
      if (!this.refreshToken) {
        this.logout()
        return false
      }

      try {
        const response = await loginAuthServices.refreshToken(this.refreshToken)
        
        if (response.accessToken) {
          this.accessToken = response.accessToken
          localStorage.setItem('accessToken', this.accessToken)
          return true
        } else {
          throw new Error('Failed to refresh token')
        }
      } catch (error) {
        console.error('Token refresh error:', error)
        this.logout()
        return false
      }
    },

    // Check if user has required role
    hasRole(requiredRole) {
      if (!this.user || !this.user.role) return false
      
      if (Array.isArray(requiredRole)) {
        return requiredRole.includes(this.user.role)
      }
      
      return this.user.role === requiredRole
    },

    // Update user profile
    updateUserProfile(updatedUser) {
      if (this.user) {
        this.user = { ...this.user, ...updatedUser }
        localStorage.setItem('user', JSON.stringify(this.user))
      }
    }
  }
})