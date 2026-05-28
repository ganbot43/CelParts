import { db } from '~/server/db'
import { categories, products, subcategories } from '~/server/db/schema'
import { asc, eq, sql, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const activeOnly = query.active === true || query.active === 'true'

  const conditions: any[] = []
  if (activeOnly)       conditions.push(eq(subcategories.isActive,   true))
  if (query.categoryId) conditions.push(eq(subcategories.categoryId, Number(query.categoryId)))

  const itemsResult = await db
    .select({
      id: subcategories.id,
      categoryId: subcategories.categoryId,
      name: subcategories.name,
      slug: subcategories.slug,
      sortOrder: subcategories.sortOrder,
      isActive: subcategories.isActive,
      categoryIdRef: categories.id,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(subcategories)
    .leftJoin(categories, eq(categories.id, subcategories.categoryId))
    .leftJoin(products, eq(products.subcategoryId, subcategories.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .groupBy(subcategories.id)
    .having(sql`count(${products.id}) > 0`)
    .orderBy(asc(subcategories.sortOrder))

  const data = itemsResult.map(s => ({
    id: s.id,
    categoryId: s.categoryId,
    name: s.name,
    slug: s.slug,
    sortOrder: s.sortOrder,
    isActive: !!s.isActive,
    category: s.categoryIdRef
      ? { id: s.categoryIdRef, name: s.categoryName, slug: s.categorySlug }
      : null,
  }))

  return { data }
})
