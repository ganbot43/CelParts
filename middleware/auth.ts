export default defineNuxtRouteMiddleware(async () => {
    const authStore = useAuthStore();
const { isLoggedIn: loggedIn } = storeToRefs(authStore);

    if (!loggedIn.value) return navigateTo('/login')
})
