<template>
  <div class="min-h-screen bg-gray-50">
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

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script> 