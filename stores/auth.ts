import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as { id: number; name: string; role: string; email?: string } | null,
    token: null as string | null,
  }),
  getters: {
    isLoggedIn: (s) => !!s.token && !!s.user,
  },
  actions: {
    async login(email: string, password: string) {
      // Usar $fetch directamente para hacer login, el interceptor inyectará la URL base si está configurada
      // o el proxy de Nitro de nuxt.config lo llevará al Gateway 8080.
      const data = await $fetch<{ token: string; user: any }>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      
      this.token = data.token
      this.user = data.user
      
      if (this.user?.role === 'admin' || this.user?.role === 'superadmin') {
        await navigateTo('/admin')
      } else {
        await navigateTo('/')
      }
    },
    async logout() {
      // Limpiar store
      this.user = null
      this.token = null
      await navigateTo('/login')
    },
    clearAuth() {
      this.user = null
      this.token = null
    }
  },
  persist: true, // Esto guarda estado en localStorage
})
