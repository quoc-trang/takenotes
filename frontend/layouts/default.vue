<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Token expiration warning -->
    <div v-if="showExpirationWarning" class="bg-yellow-50 border-b border-yellow-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span class="text-sm text-yellow-800">
              Your session will expire in {{ timeUntilExpiration }}
            </span>
          </div>
          <button 
            @click="handleRefreshToken" 
            class="text-sm text-yellow-800 hover:text-yellow-900 underline"
            :disabled="refreshing"
          >
            {{ refreshing ? 'Refreshing...' : 'Refresh Session' }}
          </button>
        </div>
      </div>
    </div>

    <nav v-if="authStore.isLoggedIn" class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/notes" class="text-xl font-bold text-gray-900">
              TakeNotes
            </NuxtLink>
          </div>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/notes" class="text-gray-700 hover:text-gray-900">
              Notes
            </NuxtLink>
            <button @click="logout" class="text-gray-700 hover:text-gray-900">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
    
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const { isTokenExpiringSoon, getTimeUntilExpiration, refreshToken } = useTokenExpiration()

const refreshing = ref(false)
const timeUntilExpiration = ref('')

// Computed property to show expiration warning
const showExpirationWarning = computed(() => {
  return authStore.isLoggedIn && isTokenExpiringSoon()
})

// Update time until expiration every minute
const updateExpirationTime = () => {
  if (authStore.isLoggedIn) {
    timeUntilExpiration.value = getTimeUntilExpiration()
  }
}

// Handle token refresh
const handleRefreshToken = async () => {
  refreshing.value = true
  try {
    const success = await refreshToken()
    if (success) {
      timeUntilExpiration.value = getTimeUntilExpiration()
    }
  } finally {
    refreshing.value = false
  }
}

// Set up timer to update expiration time
onMounted(() => {
  updateExpirationTime()
  const interval = setInterval(updateExpirationTime, 60000) // Update every minute
  
  onUnmounted(() => {
    clearInterval(interval)
  })
})

const logout = async () => {
  try {
    // Call backend logout endpoint if user is authenticated
    if (authStore.token) {
      await $fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })
    }
  } catch (error) {
    // Ignore logout errors, still clear local state
    console.error('Logout error:', error)
  } finally {
    // Always clear local auth state
    authStore.logout()
    router.push('/login')
  }
}
</script> 