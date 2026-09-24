import { db } from '~/server/db'
import { enhanceProducts } from '~/server/utils/db'
import { products } from '~/server/db/schema'
import { eq, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const tab = String(query.tab ?? 'nuevos')

    const formatProducts = (prods: any[]) =>
      prods.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        comparePrice: p.comparePrice ?? null,
        stock: p.stock,
        trackStock: !!p.trackStock,
        isFeatured: !!p.isFeatured,
        nuevoLanzamiento: !!p.nuevoLanzamiento,
        isActive: !!p.isActive,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        category: p.category
          ? {
              id: p.category.id,
              name: p.category.name,
              slug: p.category.slug,
            }
          : null,
        subcategory: p.subcategory
          ? {
              id: p.subcategory.id,
              name: p.subcategory.name,
              slug: p.subcategory.slug,
            }
          : null,
        images: (p.images ?? []).map((img: any) => ({
          id: img.id,
          url: img.url,
          isPrimary: !!img.isPrimary,
        })),
      }))

    const getProductsByTab = async (tabName: string) => {
      if (tabName === 'destacados') {
        return await db.select().from(products)
          .where(eq(products.isActive, 1))
          .orderBy(desc(products.isFeatured), desc(products.createdAt))
          .limit(20)
      }

      if (tabName === 'masVendidos') {
        return await db.select().from(products)
          .where(eq(products.isActive, 1))
          .orderBy(desc(products.isFeatured), desc(products.updatedAt))
          .limit(20)
      }

      return await db.select().from(products)
        .where(eq(products.isActive, 1))
        .orderBy(desc(products.createdAt))
        .limit(20)
    }

    const productsByTab = await enhanceProducts(await getProductsByTab(tab))

    return {
      data: formatProducts(productsByTab),
    }
  } catch (error) {
    console.error('[API] Error en principales:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al obtener productos principales',
    })
  }
})
