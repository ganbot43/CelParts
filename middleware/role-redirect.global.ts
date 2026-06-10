export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, user, fetch } = useUserSession()
  
  // Solo ejecutar si está logueado y no está en una ruta de auth o admin/mi-cuenta
  if (loggedIn.value && user.value) {
    const isAuthPage = ['/login', '/registro'].includes(to.path)
    const isHomePage = to.path === '/'
    
    // 1. Si es Admin/Superadmin y está en el Home o Login, mandarlo a /admin
    if (user.value.role === 'admin' || user.value.role === 'superadmin') {
      if (isHomePage || isAuthPage) {
        return navigateTo('/admin')
      }
    }
    
    // 2. Si es Customer y está en el Home o Login, mandarlo a /mi-cuenta
    // Nota: Dejamos que el cliente vea el Home si quiere comprar, 
    // pero si intenta entrar a Login/Registro lo mandamos a su cuenta.
    if (user.value.role === 'customer') {
      if (isAuthPage) {
        return navigateTo('/mi-cuenta')
      }
    }
  }
})
