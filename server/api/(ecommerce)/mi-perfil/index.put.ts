import { db } from '~/server/db'
import { users } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { validateBody } from '~/server/utils/validate'
import { z } from 'zod'

/**
 * El cliente edita sus propios datos desde /mi-cuenta.
 *
 * Solo se aceptan los campos de contacto y entrega. `email`, `role` e
 * `isActive` quedan fuera a propósito: el correo es el identificador de
 * acceso, y los otros dos decidirían permisos desde el navegador.
 */
const vacioANull = (max: number) =>
  z.string().trim().max(max).optional().nullable().transform((v) => v || null)

const schema = z.object({
  name: z.string().trim().min(2, 'Escribe tu nombre completo').max(120),
  /* Móvil peruano: 9 dígitos. Se aceptan espacios y prefijo y se cuenta
     solo lo numérico, porque la gente lo escribe de muchas formas. */
  phone: z
    .string()
    .trim()
    .refine((v) => !v || v.replace(/\D/g, '').length >= 9, {
      message: 'El teléfono debe tener al menos 9 dígitos',
    })
    .optional()
    .nullable()
    .transform((v) => v || null),
  address: vacioANull(255),
  addressReference: vacioANull(255),
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  if (user.role !== 'customer') {
    throw createError({
      statusCode: 403,
      message: 'Solo las cuentas de cliente pueden editar este perfil',
    })
  }

  const data = validateBody(schema, await readBody(event))

  await db.update(users).set(data).where(eq(users.id, user.id)).execute()

  const row = await db.query.users.findFirst({
    where: eq(users.id, user.id),
    columns: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      addressReference: true,
      role: true,
    },
  })

  if (!row) {
    throw createError({ statusCode: 404, message: 'Cuenta no encontrada' })
  }

  /* La sesión se refresca con los datos nuevos: si no, el saludo del
     portal y el nombre del checkout seguirían mostrando los viejos
     hasta el siguiente inicio de sesión. */
  await setUserSession(event, {
    user: {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      address: row.address,
      addressReference: row.addressReference,
      role: row.role,
    },
  })

  return row
})
