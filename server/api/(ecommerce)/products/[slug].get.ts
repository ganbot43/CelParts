import { db } from '~/server/db'
import { products } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { enhanceProducts } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')!

  const product = (await enhanceProducts(
    await db.select().from(products).where(eq(products.slug, slug)).limit(1),
  ))[0]

  if (!product || !product.isActive) {
    throw createError({ statusCode: 404, message: 'Producto no encontrado' })
  }

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    stock: product.stock,
    trackStock: !!product.trackStock,
    isFeatured: !!product.isFeatured,
    isActive: !!product.isActive,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    category: product.category ? { id: product.category.id, name: product.category.name, slug: product.category.slug } : null,
    subcategory: product.subcategory ? { id: product.subcategory.id, name: product.subcategory.name, slug: product.subcategory.slug } : null,
    images: (product.images ?? []).map(img => ({ id: img.id, url: img.url, isPrimary: !!img.isPrimary })),
  }
})
