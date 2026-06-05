import { db } from '~/server/db'
import { users } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { validateBody } from '~/server/utils/validate'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const schema = z.object({
  name:     z.string().min(2, "El nombre es muy corto"),
  lastName: z.string().optional(),
  email:    z.string().email("Correo electrónico inválido"),
  phone:    z.string().min(6, "El teléfono debe tener al menos 6 caracteres").optional(),
  dni:      z.string().optional(),
  address:  z.string().optional(),
  role:     z.string().optional(),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, lastName, email, phone, dni, address, role, password } = validateBody(schema, body)

  const fullName = lastName ? `${name} ${lastName}`.trim() : name;

  // Verificar si el email ya existe
  const existingUser = await db.query.users.findFirst({ where: eq(users.email, email) })
  if (existingUser) {
    throw createError({ statusCode: 400, message: 'El correo electrónico ya está registrado' })
  }

  // Hashear contraseña
  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(password, salt)

  const userRole = role || 'customer';

  // Insertar usuario
  const [{ insertId }] = await db.insert(users).values({
    name: fullName,
    email,
    phone,
    dni,
    address,
    passwordHash,
    role: userRole,
    isActive: 1,
  }).execute()

  const newUserId = Number(insertId)
  if (!newUserId) {
    throw createError({ statusCode: 500, message: 'No se pudo crear el usuario' })
  }

  // Iniciar sesión automáticamente
  await setUserSession(event, {
    user: { id: newUserId, name: fullName, email, phone, dni, address, role: userRole },
  })

  return { user: { id: newUserId, name: fullName, role: userRole } }
})
