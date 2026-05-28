import { db } from '~/server/db'
import { insertAndGetId } from '~/server/db/mysql'
import { categories } from '~/server/db/schema'
import { validateBody } from '~/server/utils/validate'
import { makeSlug } from '~/server/utils/slugify'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { enhanceCategories } from '~/server/utils/db'

const schema = z.object({
  name:         z.string().min(2),
  sortOrder:    z.number().int().min(0).default(0),
  isActive:     z.boolean().default(true),
  seccion:      z.number().int().nullable().optional(),
  idProducto:   z.number().int().nullable().optional(),
  imagenBanner: z.string().nullable().optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = validateBody(schema, body)
  const id = await insertAndGetId(categories, { ...data, slug: makeSlug(data.name) })
  const c = (await enhanceCategories(
    await db.select().from(categories).where(eq(categories.id, id)).limit(1),
  ))[0]
  if (!c) throw createError({ statusCode: 500, message: 'Error creating category' })
  return { id: c.id, name: c.name, slug: c.slug, sortOrder: c.sortOrder, isActive: !!c.isActive, seccion: c.seccion, idProducto: c.idProducto, imagenBanner: c.imagenBanner, subcategories: (c.subcategories ?? []).map(s => ({ id: s.id, name: s.name, slug: s.slug })) }
})
