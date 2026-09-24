import { db } from '~/server/db'
import { insertAndGetId } from '~/server/db/mysql'
import { subcategories } from '~/server/db/schema'
import { validateBody } from '~/server/utils/validate'
import { makeSlug } from '~/server/utils/slugify'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { enhanceSubcategories } from '~/server/utils/db'

const schema = z.object({
  categoryId: z.number().int().positive(),
  name:       z.string().min(2),
  sortOrder:  z.number().int().min(0).default(0),
  isActive:   z.boolean().default(true),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = validateBody(schema, body)
  const id = await insertAndGetId(subcategories, { ...data, slug: makeSlug(data.name) })
  const s = (await enhanceSubcategories(
    await db.select().from(subcategories).where(eq(subcategories.id, id)).limit(1),
  ))[0]
  if (!s) throw createError({ statusCode: 500, message: 'Error creating subcategory' })
  return created(event, { id: s.id, categoryId: s.categoryId, name: s.name, slug: s.slug, sortOrder: s.sortOrder, isActive: !!s.isActive, category: s.category ? { id: s.category.id, name: s.category.name } : null })
})
