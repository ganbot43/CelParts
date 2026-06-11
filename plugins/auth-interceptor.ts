export default defineNuxtPlugin((nuxtApp) => {
  // Interceptor global para peticiones $fetch
  const originalFetch = globalThis.$fetch;
  
  globalThis.$fetch = originalFetch.create({
    onRequest({ options }) {
      const authStore = useAuthStore()
      if (authStore.token) {
        const headers = new Headers(options.headers as HeadersInit | undefined)
        headers.set('Authorization', `Bearer ${authStore.token}`)
        options.headers = headers
      }
    },
    async onResponseError({ response }) {
      // Si recibimos un 401, limpiar sesión y redirigir al login
      if (response.status === 401) {
        const { clear } = useUserSession()
        await clear()
        
        try {
          const authStore = useAuthStore()
          authStore.clearAuth()
        } catch (e) {
          // Ignorar si el store no está disponible
        }
        
        const route = useRoute()
        if (!route.path.startsWith('/login')) {
          await navigateTo('/login')
        }
      }
    }
  })
})
