import { db } from '~/server/db'
import { categories } from '~/server/db/schema'
import { validateBody } from '~/server/utils/validate'
import { makeSlug } from '~/server/utils/slugify'
import { asc } from 'drizzle-orm'
import { z } from 'zod'
import { enhanceCategories } from '~/server/utils/db'

const schema = z.object({
  name:      z.string().min(2),
  sortOrder: z.number().int().min(0).default(0),
  isActive:  z.boolean().default(true),
})

export default defineEventHandler(async () => {
  const items = await enhanceCategories(
    await db.select().from(categories).orderBy(asc(categories.sortOrder)),
  )

  const data = items.map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    sortOrder: c.sortOrder,
    isActive: !!c.isActive,
    seccion: c.seccion,
    idProducto: c.idProducto,
    imagenBanner: c.imagenBanner,
    createdAt: c.createdAt,
    subcategories: (c.subcategories ?? []).map(s => ({ id: s.id, name: s.name, slug: s.slug, sortOrder: s.sortOrder, isActive: !!s.isActive })),
  }))

  return { data }
})
