import { db } from '~/server/db'
import { users } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { validateBody } from '~/server/utils/validate'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const schema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = validateBody(schema, body)

  const user = await db.query.users.findFirst({ where: eq(users.email, email) })
  if (!user || !user.isActive) {
    throw createError({ statusCode: 401, message: 'Credenciales inválidas' })
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    throw createError({ statusCode: 401, message: 'Credenciales inválidas' })
  }

  await setUserSession(event, {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  })

  return { user: { id: user.id, name: user.name, role: user.role } }
})
