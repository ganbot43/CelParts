import { db } from '~/server/db'
import { categories } from '~/server/db/schema'
import { validateBody } from '~/server/utils/validate'
import { makeSlug } from '~/server/utils/slugify'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { enhanceCategories } from '~/server/utils/db'

const schema = z.object({
  name:         z.string().min(2).optional(),
  sortOrder:    z.number().int().min(0).optional(),
  isActive:     z.boolean().optional(),
  seccion:      z.number().int().nullable().optional(),
  idProducto:   z.number().int().nullable().optional(),
  imagenBanner: z.string().nullable().optional(),
})

export default defineEventHandler(async (event) => {
  const id   = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const data = validateBody(schema, body)
  const update: any = { ...data }
  if (data.isActive !== undefined) update.isActive = data.isActive ? 1 : 0
  if (data.name) update.slug = makeSlug(data.name)
  await db.update(categories).set(update).where(eq(categories.id, id)).execute()
  const c = (await enhanceCategories(
    await db.select().from(categories).where(eq(categories.id, id)).limit(1),
  ))[0]
  if (!c) throw createError({ statusCode: 404, message: 'Categoría no encontrada' })
  return { id: c.id, name: c.name, slug: c.slug, sortOrder: c.sortOrder, isActive: !!c.isActive, seccion: c.seccion, idProducto: c.idProducto, imagenBanner: c.imagenBanner, subcategories: (c.subcategories ?? []).map(s => ({ id: s.id, name: s.name, slug: s.slug })) }
})
