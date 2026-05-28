import { db } from '~/server/db'
import { enhanceProducts } from '~/server/utils/db'
import { products } from '~/server/db/schema'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const rawItems = await db.select().from(products)
    .orderBy(desc(products.createdAt))

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

  return { data }
})
