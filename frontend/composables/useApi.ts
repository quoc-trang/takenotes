import { useAuthStore } from '@/stores/auth'

export const useApi = () => {
  const authStore = useAuthStore()
  const logger = useLogger()

  const apiCall = async (endpoint: string, options: any = {}) => {
    const token = authStore.getToken
    
    // Add authorization header if token exists
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      }
    }

    try {
      const response = await $fetch(endpoint, options)
      return response
    } catch (error: any) {
      // If token is expired and we get a 401/403, try to refresh
      if ((error.status === 401 || error.status === 403) && token && !authStore.isTokenExpired()) {
        try {
          logger.info('Token expired, attempting refresh')
          
          // Try to refresh the token
          const refreshResponse = await $fetch('/api/auth/refresh', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          // Update the token in the store
          authStore.setAuth(refreshResponse.user, refreshResponse.token)
          
          // Retry the original request with the new token
          const newToken = authStore.getToken
          options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${newToken}`
          }
          
          const retryResponse = await $fetch(endpoint, options)
          return retryResponse
        } catch (refreshError: any) {
          // If refresh fails, logout the user
          logger.error('Token refresh failed, logging out user')
          authStore.logout()
          throw refreshError
        }
      }
      
      throw error
    }
  }

  return {
    apiCall
  }
} 