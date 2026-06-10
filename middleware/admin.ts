export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, user, fetch } = useUserSession()

  await fetch()

  if (!loggedIn.value) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }

  // Solo permitir a admin y superadmin
  if (user.value?.role !== 'admin' && user.value?.role !== 'superadmin') {
    // Si es un cliente, mandarlo a su cuenta
    if (user.value?.role === 'customer') {
      return navigateTo('/mi-cuenta')
    }
    // Por si acaso, mandarlo al inicio
    return navigateTo('/')
  }
})
