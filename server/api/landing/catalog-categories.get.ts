import { db } from '~/server/db'
import { categories } from '~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async () => {
  try {
    const data = await db.query.categories.findMany({
      where: eq(categories.isActive, 1),
      orderBy: (category, { asc }) => [asc(category.sortOrder)],
    })

    return {
      data: data.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
      })),
    }
  } catch (error) {
    handleApiError('/api/landing/catalog-categories', error, 'Error al cargar categorías del catálogo')
  }
})
