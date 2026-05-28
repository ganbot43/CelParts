export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  // Solo proteger rutas que empiecen con /api/admin/
  if (!path.startsWith('/api/admin/')) return

  const session = await getUserSession(event)
  if (!session?.user) {
    throw createError({ statusCode: 401, message: 'No autorizado' })
  }

  const role = (session.user as { role?: string }).role
  const requiresSuperadmin =
    path.startsWith('/api/admin/business-config') ||
    path.startsWith('/api/admin/payment-methods')

  if (requiresSuperadmin && role !== 'superadmin') {
    throw createError({ statusCode: 403, message: 'No autorizado' })
  }
})
