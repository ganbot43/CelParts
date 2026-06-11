import { db } from '~/server/db'
import { insertAndGetId } from '~/server/db/mysql'
import { materials } from '~/server/db/schema'
import { validateBody } from '~/server/utils/validate'
import { makeSlug } from '~/server/utils/slugify'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const schema = z.object({
  name:     z.string().min(2),
  isActive: z.boolean().default(true),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = validateBody(schema, body)
  
  const slug = makeSlug(data.name)

  const newId = await insertAndGetId(materials, {
    name: data.name,
    slug,
    isActive: data.isActive ? 1 : 0,
  })

  const items = await db.select().from(materials).where(eq(materials.id, newId)).limit(1)
  return items[0]
})
