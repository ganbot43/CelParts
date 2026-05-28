import { db } from '~/server/db'
import { subcategories } from '~/server/db/schema'
import { validateBody } from '~/server/utils/validate'
import { makeSlug } from '~/server/utils/slugify'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { enhanceSubcategories } from '~/server/utils/db'

const schema = z.object({
  name:       z.string().min(2).optional(),
  categoryId: z.number().int().positive().optional(),
  sortOrder:  z.number().int().min(0).optional(),
  isActive:   z.boolean().optional(),
})

export default defineEventHandler(async (event) => {
  const id   = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const data = validateBody(schema, body)
  const update: any = { ...data }
  if (data.name) update.slug = makeSlug(data.name)
  await db.update(subcategories).set(update).where(eq(subcategories.id, id)).execute()
  const s = (await enhanceSubcategories(
    await db.select().from(subcategories).where(eq(subcategories.id, id)).limit(1),
  ))[0]
  if (!s) throw createError({ statusCode: 404, message: 'Subcategoría no encontrada' })
  return { id: s.id, categoryId: s.categoryId, name: s.name, slug: s.slug, sortOrder: s.sortOrder, isActive: !!s.isActive, category: s.category ? { id: s.category.id, name: s.category.name } : null }
})
