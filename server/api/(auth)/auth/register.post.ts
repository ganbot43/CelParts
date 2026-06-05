import { db } from '~/server/db'
import { users } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { validateBody } from '~/server/utils/validate'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const schema = z.object({
  name:     z.string().min(2, "El nombre es muy corto"),
  email:    z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, email, password } = validateBody(schema, body)

  // Verificar si el email ya existe
  const existingUser = await db.query.users.findFirst({ where: eq(users.email, email) })
  if (existingUser) {
    throw createError({ statusCode: 400, message: 'El correo electrónico ya está registrado' })
  }

  // Hashear contraseña
  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(password, salt)

  // Insertar usuario como 'customer'
  const [{ insertId }] = await db.insert(users).values({
    name,
    email,
    passwordHash,
    role: 'customer',
    isActive: 1,
  }).execute()

  const newUserId = Number(insertId)
  if (!newUserId) {
    throw createError({ statusCode: 500, message: 'No se pudo crear el usuario' })
  }

  // Iniciar sesión automáticamente
  await setUserSession(event, {
    user: { id: newUserId, name, email, role: 'customer' },
  })

  return { user: { id: newUserId, name, role: 'customer' } }
})
