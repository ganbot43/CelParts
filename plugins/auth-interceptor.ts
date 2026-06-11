import { ofetch } from 'ofetch'

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    // @ts-ignore
    globalThis.$fetch = ofetch.create({
      onRequest({ request, options }) {
        const authStore = useAuthStore()
        if (authStore.token) {
          options.headers = options.headers || {}
          // @ts-ignore
          options.headers.Authorization = `Bearer ${authStore.token}`
        }
      },
      async onResponseError({ response }) {
        if (response.status === 401 || response.status === 403) {
          try {
            const authStore = useAuthStore()
            authStore.clearAuth()
          } catch (e) {
            // Ignorar
          }
          const route = useRoute()
          if (!route.path.startsWith('/login')) {
            await navigateTo('/login')
          }
        }
      }
    })
  }
})
