<template>
  <div class="flex min-h-screen bg-white font-sans">
    <!-- Sidebar -->
    <aside v-if="authStore.isLoggedIn" class="notion-sidebar">
      <NuxtLink to="/notes" class="text-2xl font-bold mb-8 px-2 text-gray-900">TakeNotes</NuxtLink>
      <nav class="flex-1 flex flex-col gap-1">
        <NuxtLink to="/notes" class="notion-sidebar-link">All Notes</NuxtLink>
        <NuxtLink to="/notes/new" class="notion-sidebar-link">New Note</NuxtLink>
      </nav>
      <div class="mt-auto pt-8 border-t border-gray-200">
        <button @click="logout" class="notion-sidebar-link w-full text-left">Logout</button>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-h-screen">
      <!-- Token expiration warning -->
      <div v-if="showExpirationWarning" class="bg-yellow-50 border-b border-yellow-200">
        <div class="max-w-3xl mx-auto px-4 py-2">
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
      <main class="flex-1 flex flex-col items-center bg-white">
        <div class="w-full max-w-3xl px-4 py-10">
          <slot />
        </div>
      </main>
    </div>
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