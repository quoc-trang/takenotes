import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
  createdAt: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = ref(false)

  const getUser = computed(() => user.value)
  const getToken = computed(() => token.value)
  const isLoggedIn = computed(() => isAuthenticated.value)

  const setAuth = (newUser: User, newToken: string) => {
    user.value = newUser
    token.value = newToken
    isAuthenticated.value = true
  }

  const logout = () => {
    user.value = null
    token.value = null
    isAuthenticated.value = false
  }

  return {
    // State
    user,
    token,
    isAuthenticated,
    
    // Getters
    getUser,
    getToken,
    isLoggedIn,
    
    // Actions
    setAuth,
    logout
  }
}, {
  persist: true
}) 