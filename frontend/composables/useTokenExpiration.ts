import { useAuthStore } from '@/stores/auth'

export const useTokenExpiration = () => {
  const authStore = useAuthStore()
  const logger = useLogger()

  // Check if token will expire soon (within 2 hours)
  const isTokenExpiringSoon = (): boolean => {
    const expiration = authStore.getTokenExpiration
    if (!expiration) return false
    
    const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000)
    return expiration < twoHoursFromNow
  }

  // Get time until token expires
  const getTimeUntilExpiration = (): string => {
    const expiration = authStore.getTokenExpiration
    if (!expiration) return 'Unknown'
    
    const now = new Date()
    const diff = expiration.getTime() - now.getTime()
    
    if (diff <= 0) return 'Expired'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  // Attempt to refresh token
  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await $fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })
      
      authStore.setAuth(response.token)
      logger.info('Token refreshed successfully')
      return true
    } catch (error) {
      logger.error('Token refresh failed', error)
      authStore.logout()
      return false
    }
  }

  return {
    isTokenExpiringSoon,
    getTimeUntilExpiration,
    refreshToken
  }
} 