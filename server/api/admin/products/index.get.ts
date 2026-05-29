import { db } from '~/server/db'
import { enhanceProducts } from '~/server/utils/db'
import { products } from '~/server/db/schema'
import { desc, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = Math.min(100, Math.max(1, Number(query.limit ?? 10)))
  const offset = Math.max(0, Number(query.offset ?? 0))

  // Total count
  const countResult = await db.select({ count: sql<number>`count(*)` }).from(products).execute()
  const total = countResult[0]?.count ?? 0

  const rawItems = await db.select().from(products)
    .orderBy(desc(products.createdAt))
    .limit(limit)
    .offset(offset)

  const items = await enhanceProducts(rawItems)
  const data = items.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    stock: p.stock,
    trackStock: !!p.trackStock,
    isFeatured: !!p.isFeatured,
    nuevoLanzamiento: !!p.nuevoLanzamiento,
    isActive: !!p.isActive,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    categoryId: p.category?.id ?? null,
    subcategoryId: p.subcategory?.id ?? null,
    category: p.category ? { id: p.category.id, name: p.category.name, slug: p.category.slug } : null,
    subcategory: p.subcategory ? { id: p.subcategory.id, name: p.subcategory.name, slug: p.subcategory.slug } : null,
    images: (p.images ?? []).map(img => ({ id: img.id, url: img.url, isPrimary: !!img.isPrimary, sortOrder: img.sortOrder })),
  }))

  return { total, data }
})
