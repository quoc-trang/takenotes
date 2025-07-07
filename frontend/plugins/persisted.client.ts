import piniaPluginPersistedState from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin((nuxtApp) => {
  // Only run on client-side since localStorage is not available on server
  if (import.meta.client) {
    // Use the existing Pinia instance from Nuxt
    const pinia = nuxtApp.$pinia as any
    if (pinia) {
      pinia.use(piniaPluginPersistedState)
    }
  }
}) 