import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as { 
      id: number; 
      name: string; 
      lastName?: string;
      username?: string;
      role: string; 
      email?: string; 
      phone?: string;
      dni?: string;
      address?: string;
      gender?: string;
      birthDate?: string;
      profileImageUrl?: string;
    } | null,
  }),
  getters: {
    isLoggedIn: (s) => !!s.user,
  },
  actions: {
    async login(email: string, password: string) {
      // Usar $fetch directamente para hacer login, el interceptor inyectará la URL base si está configurada
      // o el proxy de Nitro de nuxt.config lo llevará al Gateway 8080.
      const data = await $fetch<{ user: any }>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      
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
      
      // Llamar al backend para que limpie la cookie
      try {
        await $fetch('/api/auth/logout', { method: 'POST' })
      } catch (e) {
        console.error("Logout error", e)
      }
      
      await navigateTo('/login')
    },
    clearAuth() {
      this.user = null
    },
    async updateProfile(userData: any) {
      const data = await $fetch<any>('/api/auth/me', {
        method: 'PUT',
        body: userData
      })
      this.user = data
    }
  },
  persist: true, // Esto guarda estado en localStorage
})
