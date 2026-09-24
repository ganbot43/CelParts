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
        comparePrice: product.comparePrice ?? null,
        category: product.category,
        subcategory: product.subcategory,
        images: product.images || [],
        /* La tarjeta decide "En stock" / "Agotado" con estos dos campos.
           Sin ellos interpretaba stock = 0 y marcaba todo sin stock. */
        stock: product.stock,
        trackStock: product.trackStock === 1,
        isFeatured: product.isFeatured === 1,
        nuevoLanzamiento: product.nuevoLanzamiento === 1,
      })),
      total: totalResult[0]?.count ?? data.length,
    }
  } catch (error) {
    handleApiError('/api/landing/nuevos-lanzamientos', error, 'Error al cargar nuevos lanzamientos')
  }
})
