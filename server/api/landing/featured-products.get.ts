import { enhanceProducts } from '~/server/utils/db'
import { db } from '~/server/db'
import { products } from '~/server/db/schema'
import { eq, desc, asc, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const categoryId = query.categoryId as string | undefined
    const type = query.type as string | undefined
    /* El límite era fijo en 3: servía a un bloque de tres tarjetas que
       ya no existe. Ahora la fila de portada pide cuantas necesite. */
    const requested = Number(query.limit ?? 3)
    const limit = Number.isFinite(requested) ? Math.min(24, Math.max(1, requested)) : 3

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
      comparePrice: p.comparePrice ?? null,
      description: p.description,
      category: p.category,
      subcategory: p.subcategory,
      images: p.images || [],
      stock: p.stock,
      trackStock: p.trackStock === 1,
      isFeatured: p.isFeatured === 1,
      nuevoLanzamiento: p.nuevoLanzamiento === 1,
    }))

    return { data: mappedData }
  } catch (error) {
    handleApiError('/api/landing/featured-products', error, 'Error al cargar productos destacados')
  }
})
