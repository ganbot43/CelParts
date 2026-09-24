import { db } from '~/server/db'
import { categories } from '~/server/db/schema'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const sectionId = Number(query.sectionId)

    if (!Number.isFinite(sectionId)) {
      throw createError({ statusCode: 400, message: 'sectionId inválido' })
    }

    const rows = await db.query.categories.findMany({
      where: (category, { and, eq }) => and(eq(category.isActive, 1), eq(category.seccion, sectionId)),
      orderBy: (category, { asc }) => [asc(category.sortOrder)],
    })

    const data = rows.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      image: category.imagenBanner || '',
      href: `/productos?categoria=${category.slug}&page=1&limit=24`,
    }))

    return { data }
  } catch (error) {
    handleApiError('/api/landing/category-grid', error, 'Error al cargar categorías del grid')
  }
})
