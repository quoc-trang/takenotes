<template>
  <div class="max-w-md mx-auto">
    <div class="card">
      <h1 class="text-2xl font-bold text-center mb-6">Login</h1>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="input-field"
            placeholder="Enter your email"
          />
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="input-field"
            placeholder="Enter your password"
          />
        </div>
        
        <div v-if="error" class="text-red-600 text-sm">
          {{ error }}
        </div>
        
        <button
          type="submit"
          :disabled="loading"
          class="w-full btn-primary disabled:opacity-50"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
      
      <div class="mt-4 text-center">
        <p class="text-sm text-gray-600">
          Don't have an account?
          <NuxtLink to="/register" class="text-blue-600 hover:text-blue-700">
            Register here
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

definePageMeta({
  layout: false
})

const authStore = useAuthStore()
const router = useRouter()
const logger = useLogger()

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  logger.userAction('Login attempt', { email: form.value.email })
  
  try {
    const startTime = Date.now()
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: form.value
    })

    const duration = Date.now() - startTime
    
    logger.apiCall('POST', '/api/auth/login', 200, duration)
    logger.userAction('Login successful', { email: form.value.email })
    
    // Store authentication data
    authStore.setAuth(response.user, response.token)
    
    // Navigate to notes page
    await router.push('/notes')
    
  } catch (err: any) {
    logger.error('Login failed', err)
    error.value = err.data?.message || err.statusMessage || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script> 