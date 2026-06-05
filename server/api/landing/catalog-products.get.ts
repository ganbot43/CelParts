import { enhanceProducts } from '~/server/utils/db'
import { db } from '~/server/db'
import { categories, products } from '~/server/db/schema'
import { and, eq, desc, asc, like, or } from 'drizzle-orm'

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
    const limit = 40 // Increased limit to allow more products in filtering

    const conditions = [eq(products.isActive, 1)]

    if (categoryId !== null) {
      conditions.push(eq(products.categoryId, categoryId))
    }

    // 1. Search Query
    if (query.q) {
      const searchTerm = `%${String(query.q).trim()}%`
      conditions.push(
        or(
          like(products.name, searchTerm),
          like(products.description, searchTerm)
        )
      )
    }

    // 2. Material
    if (query.material) {
      conditions.push(like(products.material, `%${String(query.material)}%`))
    }

    // 3. Pattern
    if (query.pattern === 'si') {
      conditions.push(eq(products.offersPattern, 1))
    }

    // 4. Size Range
    if (query.size) {
      // Pequeno: < 20cm, Mediano: 20-50cm, Grande: > 50cm
      // Drizzle ORM doesn't easily support dynamic where builders with lt/gt without explicit column refs. 
      // Instead we fetch all matching other conditions and filter size in JS for complexity, 
      // or we just build raw SQL. Given sizeLength/Width can be null, doing it in JS is safer for now.
    }

    const whereClause = and(...conditions)

    // 5. Sorting
    let orderByClause = desc(products.createdAt)
    if (query.sort === 'precio_menor') {
      orderByClause = asc(products.price)
    } else if (query.sort === 'precio_mayor') {
      orderByClause = desc(products.price)
    }

    let rawData = await db.select().from(products)
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .execute()

    // Post-filter size if provided
    if (query.size) {
      const sizeType = String(query.size)
      rawData = rawData.filter(p => {
        const maxDimension = Math.max(p.sizeLength || 0, p.sizeWidth || 0)
        if (sizeType === 'pequeno') return maxDimension > 0 && maxDimension < 20
        if (sizeType === 'mediano') return maxDimension >= 20 && maxDimension <= 50
        if (sizeType === 'grande') return maxDimension > 50
        return true
      })
    }

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
        sellerName: product.seller?.name || null,
        sellerPhone: product.seller?.phone || null,
        sellerId: product.sellerId || null,
        material: product.material,
        sizeLength: product.sizeLength,
        sizeWidth: product.sizeWidth,
        sizeUnit: product.sizeUnit,
        offersPattern: product.offersPattern === 1,
        description: product.description,
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
