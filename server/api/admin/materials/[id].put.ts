import { db } from '~/server/db'
import { materials } from '~/server/db/schema'
import { validateBody } from '~/server/utils/validate'
import { makeSlug } from '~/server/utils/slugify'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const schema = z.object({
  name:     z.string().min(2),
  isActive: z.boolean(),
})

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'ID inválido' })

  const body = await readBody(event)
  const data = validateBody(schema, body)
  const slug = makeSlug(data.name)

  await db.update(materials).set({
    name: data.name,
    slug,
    isActive: data.isActive ? 1 : 0,
  }).where(eq(materials.id, id))

  const items = await db.select().from(materials).where(eq(materials.id, id)).limit(1)
  return items[0]
})
