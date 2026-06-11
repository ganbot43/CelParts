import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as { id: number; name: string; role: string } | null,
    token: null as string | null,
  }),
  getters: {
    isLoggedIn: (s) => !!s.user && !!s.token,
  },
  actions: {
    async login(email: string, password: string) {
      const { fetch: fetchUserSession } = useUserSession()
      const data = await $fetch<{ user: any; token: string }>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      
      this.token = data.token
      this.user = data.user
      
      await fetchUserSession()
      
      if (this.user?.role === 'admin' || this.user?.role === 'superadmin') {
        await navigateTo('/admin')
      } else {
        await navigateTo('/mi-cuenta')
      }
    },
    async logout() {
      try {
        await $fetch('/api/auth/logout', { 
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        })
      } catch (e) {
        // Continuar con logout incluso si la llamada falla
      }
      this.user = null
      this.token = null
      const { clear } = useUserSession()
      await clear()
      await navigateTo('/login')
    },
    // Limpiar el store cuando se detecta un 401
    clearAuth() {
      this.user = null
      this.token = null
    }
  },
  persist: true,
})
