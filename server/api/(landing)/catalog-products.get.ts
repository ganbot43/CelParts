import { db } from '~/server/db'
import { enhanceProducts } from '~/server/utils/db'
import { products } from '~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const categoryId = query.categoryId ? Number(query.categoryId) : null
    const limit = 10

    // Filtrar por categoría si se especifica
    const allProducts = await enhanceProducts(
      await db.select().from(products).where(eq(products.isActive, 1)),
    )

    const filtered =
      categoryId === null
        ? allProducts
        : allProducts.filter((p: any) => p.categoryId === categoryId)

    const data = filtered.slice(0, 10).map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      category: p.category,
      images: p.images || [],
      isFeatured: p.isFeatured,
    }))

    return {
      data,
      total: filtered.length,
    }
  } catch (error: any) {
    console.error('❌ Error en /api/landing/catalog-products:', error.message || error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Error al cargar productos del catálogo',
    })
  }
})
