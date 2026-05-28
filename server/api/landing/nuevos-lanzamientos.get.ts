import { enhanceProducts } from '~/server/utils/db'
import { db } from '~/server/db'
import { products } from '~/server/db/schema'
import { and, eq, sql, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const limitParam = Number(query.limit ?? 4)
    const limit = Number.isNaN(limitParam) || limitParam <= 0 ? 4 : limitParam

    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(and(eq(products.nuevoLanzamiento, 1), eq(products.isActive, 1)))

    const rawData = await db
      .select()
      .from(products)
      .where(and(eq(products.nuevoLanzamiento, 1), eq(products.isActive, 1)))
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
      total: totalResult[0]?.count ?? data.length,
    }
  } catch (error: any) {
    console.error('❌ Error en /api/landing/nuevos-lanzamientos:', error.message || error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Error al cargar nuevos lanzamientos',
    })
  }
})
