export default defineNuxtRouteMiddleware((to, from) => {
  const { loggedIn, user } = useUserSession()

  if (!loggedIn.value) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }

  if (user.value?.role !== 'customer') {
    // Si es admin o superadmin, mandarlo SIEMPRE a su panel
    if (user.value?.role === 'admin' || user.value?.role === 'superadmin') {
      return navigateTo('/admin')
    }
    // Si por alguna razón no tiene rol, al login
    return navigateTo('/login')
  }
})
