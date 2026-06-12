import { ofetch } from 'ofetch'

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    // @ts-ignore
    globalThis.$fetch = ofetch.create({
      onRequest({ request, options }) {
        const authStore = useAuthStore()
        if (authStore.token) {
          options.headers = new Headers(options.headers || {})
          options.headers.set('Authorization', `Bearer ${authStore.token}`)
        }
      },
      async onResponseError({ response }) {
        if (response.status === 401 || response.status === 403) {
          // Temporalmente comentado para que puedas ver el error en la pestaña Network
          console.error("Error 401/403 detectado:", response._data || response.statusText);
          /*
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
          */
        }
      }
    })
  }
})
