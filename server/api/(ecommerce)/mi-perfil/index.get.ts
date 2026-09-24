import { db } from '~/server/db'
import { users } from '~/server/db/schema'
import { eq } from 'drizzle-orm'

/**
 * Datos del cliente para el formulario de "Mis datos".
 *
 * No se leen de la sesión: la cookie guarda una foto del momento del
 * login y no incluye la dirección. Se consulta la base para que el
 * formulario abra siempre con lo que está guardado de verdad.
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const row = await db.query.users.findFirst({
    where: eq(users.id, user.id),
    columns: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      addressReference: true,
    },
  })

  if (!row) {
    throw createError({ statusCode: 404, message: 'Cuenta no encontrada' })
  }

  return row
})
