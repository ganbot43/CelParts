import { enhanceProducts } from '~/server/utils/db'
import { db } from '~/server/db'
import { categories, products } from '~/server/db/schema'
import { and, eq, desc } from 'drizzle-orm'

async function resolveCategoryId(queryValue: unknown) {
  if (queryValue == null) return null

  const raw = Array.isArray(queryValue) ? queryValue[0] : queryValue
  const value = String(raw).trim()
  if (!value) return null

  const categoryResult = await db.select().from(categories)
    .where(eq(categories.slug, value))
    .limit(1)
    .execute()

  if (categoryResult[0]) {
    return categoryResult[0].id
  }

  const numericId = Number(value)
  return Number.isNaN(numericId) ? null : numericId
}

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const categoryId = await resolveCategoryId(
      query.categorySlug ?? query.categoryId ?? query.category,
    )
    const limit = 10

    const whereClause =
      categoryId === null
        ? eq(products.isActive, 1)
        : and(eq(products.isActive, 1), eq(products.categoryId, categoryId))

    const rawData = await db.select().from(products)
      .where(whereClause)
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .execute()

    const data = await enhanceProducts(rawData)

    return {
      data: data.map((product: any) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        category: product.category,
        images: product.images || [],
        isFeatured: product.isFeatured === 1,
      })),
      total: data.length,
    }
  } catch (error: any) {
    console.error('❌ Error en /api/landing/catalog-products:', error.message || error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Error al cargar productos del catálogo',
    })
  }
})
