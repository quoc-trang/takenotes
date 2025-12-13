import { publicRoutes } from "~/config/routes"

export default defineNuxtRouteMiddleware((to) => {
  if(import.meta.server) return
  if(publicRoutes.includes(to.path)) return
  
  const authStore = useAuthStore()  
  if (!authStore.isLoggedIn) {
    return navigateTo('/')
  }
}) 
