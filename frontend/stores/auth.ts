import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

interface User {
  id: string
  email: string
  createdAt: string
}

interface JWTPayload {
  id: string
  email: string
  exp: number
  iat: number
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)

  const decodedToken = computed<JWTPayload | null>(() => {
    if (!token.value) return null
    try {
      return jwtDecode<JWTPayload>(token.value)
    } catch {
      return null
    }
  })

  const user = computed<User | null>(() => {
    const decoded = decodedToken.value
    if (!decoded) return null
    return {
      id: decoded.id,
      email: decoded.email,
      createdAt: new Date(decoded.iat * 1000).toISOString(),
    }
  })

  const isLoggedIn = computed(() => {
    const decoded = decodedToken.value
    if (!decoded) return false
    return decoded.exp > Date.now() / 1000
  })

  const isTokenExpired = computed(() => !isLoggedIn.value)

  const getTokenExpiration = computed(() => {
    const decoded = decodedToken.value
    if (!decoded) return null
    return new Date(decoded.exp * 1000)
  })

  const setAuth = (newToken: string) => {
    token.value = newToken
  }

  const logout = () => {
    token.value = null
  }

  return {
    // State
    token,

    // Computed
    user,
    isLoggedIn,
    isTokenExpired,
    getTokenExpiration,

    // Actions
    setAuth,
    logout,
  }
}, {
  persist: true
})
