export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
const { user, isLoggedIn: loggedIn } = storeToRefs(authStore);

  if (!loggedIn.value) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }

  if (user.value?.role !== 'customer') {
    // Si es admin, redirigir al panel de admin
    if (user.value?.role === 'admin') {
      return navigateTo('/admin')
    }
    return navigateTo('/')
  }
})
