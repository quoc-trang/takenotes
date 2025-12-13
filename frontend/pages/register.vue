<template>
  <div class="max-w-md mx-auto mt-10">
    <div class="card">
      <h1 class="text-2xl font-bold text-center mb-6">Register</h1>
      
      <form @submit.prevent="handleRegister" class="space-y-4">
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
            minlength="6"
            class="input-field"
            placeholder="Enter your password"
          />
        </div>
        
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            required
            class="input-field"
            placeholder="Confirm your password"
          />
        </div>
        
        <div v-if="error" class="text-red-600 text-sm">
          {{ error }}
        </div>
        
        <button
          type="submit"
          :disabled="loading || !passwordsMatch"
          class="w-full btn-primary disabled:opacity-50"
        >
          {{ loading ? 'Creating account...' : 'Register' }}
        </button>
      </form>
      
      <div class="mt-4 text-center">
        <p class="text-sm text-gray-600">
          Already have an account?
          <NuxtLink to="/login" class="text-blue-600 hover:text-blue-700">
            Login here
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: false
})

const authStore = useAuthStore()
const router = useRouter()

const form = ref({
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')

const passwordsMatch = computed(() => {
  return form.value.password === form.value.confirmPassword && form.value.password.length >= 6
})

const handleRegister = async () => {
  if (!passwordsMatch.value) {
    error.value = 'Passwords do not match or are too short'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    const response = await $fetch('/api/auth/register', {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'POST',
      body: {
        email: form.value.email,
        password: form.value.password
      }
    })
    
    authStore.setAuth(response.user, response.token)
    router.push('/notes')
  } catch (err: any) {
    error.value = err.data?.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script> 