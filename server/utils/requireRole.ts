export async function requireRole(
  event: Parameters<typeof getUserSession>[0],
  allowedRoles: Array<'superadmin' | 'admin'>
) {
  const session = await getUserSession(event)

  if (!session?.user) {
    throw createError({ statusCode: 401, message: 'No autenticado' })
  }

  const role = (session.user as { role?: string }).role
  if (!role || !allowedRoles.includes(role as 'superadmin' | 'admin')) {
    throw createError({ statusCode: 403, message: 'No autorizado' })
  }

  // Devuelve solo el objeto `user` (sin metadatos de sesión) para evitar
  // enviar estructuras circulares al cliente si se retorna por error.
  return session.user as { id: number; name: string; email?: string; role: string }
}