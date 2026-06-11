export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();
const { user, isLoggedIn: loggedIn } = storeToRefs(authStore);

  if (!loggedIn.value) return navigateTo('/login')
  if (user.value?.role !== 'superadmin') return navigateTo('/admin')
})