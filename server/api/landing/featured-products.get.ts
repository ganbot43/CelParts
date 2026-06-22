import { enhanceProducts } from '~/server/utils/db'
import { db } from '~/server/db'
import { products } from '~/server/db/schema'
import { eq, desc, asc, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const categoryId = query.categoryId as string | undefined
    const type = query.type as string | undefined
    const limit = 3

    let conditions = [eq(products.isActive, 1)]
    if (categoryId && categoryId !== 'all') {
      conditions.push(eq(products.categoryId, Number(categoryId)))
    }

    let orderByClause: any = desc(products.createdAt)
    if (type === 'bestsellers') {
      orderByClause = desc(products.isFeatured)
    } else if (type === 'newest') {
      orderByClause = desc(products.createdAt)
    } else if (type === 'offers') {
      orderByClause = asc(products.price)
    }

    let rawData = await db.select().from(products)
      .where(and(...conditions))
      .orderBy(orderByClause)
      .limit(limit)
      .execute()

    // If no products found for category, fallback to any active products just to not break layout
    if (rawData.length === 0) {
      rawData = await db.select().from(products)
        .where(eq(products.isActive, 1))
        .orderBy(desc(products.createdAt))
        .limit(limit)
        .execute()
    }

    const data = await enhanceProducts(rawData)

    const mappedData = data.map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      description: p.description,
      category: p.category,
      images: p.images || [],
      isFeatured: p.isFeatured === 1,
    }))

    return { data: mappedData }
  } catch (error: any) {
    console.error('❌ Error en /api/landing/featured-products:', error.message || error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Error al cargar productos destacados',
    })
  }
})
