export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn, fetch } = useUserSession()

  await fetch()

  if (loggedIn.value) {
    if (user.value?.role === 'admin' || user.value?.role === 'superadmin') {
      return navigateTo('/admin')
    }
    return navigateTo('/mi-cuenta')
  }
})
