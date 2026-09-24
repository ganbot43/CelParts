import { db } from '~/server/db'
import { enhanceProducts } from '~/server/utils/db'
import { categories, products, subcategories } from '~/server/db/schema'
import { eq, desc, asc, and, or, like, sql } from 'drizzle-orm'

async function resolveCategoryId(queryValue: unknown) {
  if (queryValue == null) return null

  const raw = Array.isArray(queryValue) ? queryValue[0] : queryValue
  const value = String(raw).trim()
  if (!value) return null

  const categoryBySlug = await db.query.categories.findFirst({
    where: eq(categories.slug, value),
  })

  if (categoryBySlug) {
    return categoryBySlug.id
  }

  const numericId = Number(value)
  return Number.isNaN(numericId) ? null : numericId
}

async function resolveSubcategoryId(queryValue: unknown) {
  if (queryValue == null) return null

  const raw = Array.isArray(queryValue) ? queryValue[0] : queryValue
  const value = String(raw).trim()
  if (!value) return null

  if (value.toLowerCase() === 'otros') {
    return 'otros'
  }

  const subcategoryBySlug = await db.query.subcategories.findFirst({
    where: eq(subcategories.slug, value),
  })

  if (subcategoryBySlug) {
    return subcategoryBySlug.id
  }

  const numericId = Number(value)
  return Number.isNaN(numericId) ? null : numericId
}

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = Number(query.page ?? 1)
    const limit = Number(query.limit ?? 12)
    const offset = (page - 1) * limit
    const categoryId = await resolveCategoryId(query.categoria)
    const subcategoryId = await resolveSubcategoryId(query.subcategoria)
    const nuevoLanzamiento = query.nuevoLanzamiento
      ? String(query.nuevoLanzamiento) === '1' || String(query.nuevoLanzamiento) === 'true'
      : false
    const searchQuery = query.q ? String(query.q) : null
    const precioMin = query.precioMin ? Number(query.precioMin) : null
    const precioMax = query.precioMax ? Number(query.precioMax) : null
    const sortParam = query.sort ? String(query.sort) : null

    // Construir condiciones de filtrado
    const conditions: any[] = [eq(products.isActive, 1)]

    if (categoryId !== null) {
      if (subcategoryId === 'otros') {
        conditions.push(eq(products.categoryId, categoryId))
        conditions.push(sql`${products.subcategoryId} IS NULL`)
      } else if (subcategoryId !== null) {
        // If specific subcategory provided, filter by it
        conditions.push(eq(products.subcategoryId, subcategoryId))
      } else {
        // If only category provided, include products assigned directly to
        // the category OR those assigned to any subcategory of that category.
        conditions.push(
          sql`(${products.categoryId} = ${categoryId} OR ${products.subcategoryId} IN (select id from subcategories where category_id = ${categoryId}))`
        )
      }
    } else if (subcategoryId !== null && subcategoryId !== 'otros') {
      // category not specified but subcategory is
      conditions.push(eq(products.subcategoryId, subcategoryId))
    }
    if (nuevoLanzamiento) {
      conditions.push(eq(products.nuevoLanzamiento, 1))
    }

    if (searchQuery) {
      // Búsqueda por nombre o descripción
      const searchPattern = `%${searchQuery}%`
      conditions.push(
        or(
          like(products.name, searchPattern),
          like(products.description, searchPattern),
        ),
      )
    }

    if (precioMin !== null && !Number.isNaN(precioMin)) {
      conditions.push(sql`${products.price} >= ${precioMin}`)
    }

    if (precioMax !== null && !Number.isNaN(precioMax)) {
      conditions.push(sql`${products.price} <= ${precioMax}`)
    }

    // Obtener total de productos que coinciden
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(and(...conditions))

    const total = totalResult[0]?.count ?? 0

    // Determinar ordenamiento
    let orderByClause: any[] = [desc(products.createdAt)] // default
    
    if (sortParam === 'precio-asc') {
      orderByClause = [asc(products.price), desc(products.createdAt)]
    } else if (sortParam === 'precio-desc') {
      orderByClause = [desc(products.price), desc(products.createdAt)]
    } else if (sortParam === 'nombre-asc') {
      orderByClause = [asc(products.name), desc(products.createdAt)]
    } else if (sortParam === 'nombre-desc') {
      orderByClause = [desc(products.name), desc(products.createdAt)]
    }

    // Obtener productos paginados
    const rawProducts = await db.select().from(products)
      .where(and(...conditions))
      .orderBy(...orderByClause)
      .limit(limit)
      .offset(offset)

    const allProducts = await enhanceProducts(rawProducts)

    const data = allProducts.map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      comparePrice: p.comparePrice ?? null,
      category: p.category,
      subcategory: p.subcategory,
      images: p.images || [],
      // El catálogo necesita la disponibilidad para decidir la compra:
      // sin esto la tarjeta no puede distinguir "hay" de "agotado".
      stock: p.stock,
      trackStock: p.trackStock === 1,
      isFeatured: p.isFeatured === 1,
      nuevoLanzamiento: p.nuevoLanzamiento === 1,
    }))

    return { data, page, limit, total }
  } catch (error) {
    handleApiError('/api/products', error, 'Error al cargar productos')
  }
})
