import { db } from '~/server/db'
import { categories, products, subcategories } from '~/server/db/schema'
import { eq, asc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const activeOnly = query.active === true || query.active === 'true'

    const rawCategories = await db
      .select()
      .from(categories)
      .where(activeOnly ? eq(categories.isActive, 1) : undefined)
      .orderBy(asc(categories.sortOrder))
      .execute()

    const rawSubcategories = await db
      .select()
      .from(subcategories)
      .where(activeOnly ? eq(subcategories.isActive, 1) : undefined)
      .orderBy(asc(subcategories.sortOrder))
      .execute()

    const categoryRows = rawCategories.map(cat => ({
      ...cat,
      subcategories: rawSubcategories.filter(sub => sub.categoryId === cat.id)
    }))

    const productRows = await db
      .select({
        id: products.id,
        categoryId: products.categoryId,
        subcategoryId: products.subcategoryId,
      })
      .from(products)
      .where(eq(products.isActive, 1))
      .execute()

    const subcategoryCategoryById = new Map<number, number>()
    const subcategoryCountById = new Map<number, number>()
    const directProductCountByCategoryId = new Map<number, number>()

    for (const category of categoryRows) {
      directProductCountByCategoryId.set(category.id, 0)
      for (const subcategory of category.subcategories ?? []) {
        subcategoryCategoryById.set(subcategory.id, category.id)
        subcategoryCountById.set(subcategory.id, 0)
      }
    }

    const seenProductIds = new Set<number | string>()
    for (const product of productRows) {
      // Evitar procesar el mismo producto más de una vez (por si la query devolviera duplicados)
      if (product.id != null) {
        if (seenProductIds.has(product.id)) continue
        seenProductIds.add(product.id)
      }

      // Solo contamos productos asignados a una subcategoría. Los productos
      // que estén asociados únicamente a la categoría raíz no se cuentan aquí
      // para evitar mostrar categorías vacías en el UI.
      if (product.subcategoryId != null) {
        subcategoryCountById.set(
          product.subcategoryId,
          (subcategoryCountById.get(product.subcategoryId) ?? 0) + 1,
        )
      } else if (product.categoryId != null) {
        directProductCountByCategoryId.set(
          product.categoryId,
          (directProductCountByCategoryId.get(product.categoryId) ?? 0) + 1,
        )
      }
    }

    const data = categoryRows
      .map((category) => {
        const filteredSubcategories = (category.subcategories ?? [])
          .filter((subcategory) => (subcategoryCountById.get(subcategory.id) ?? 0) > 0)
          .map((subcategory) => ({
            id: subcategory.id,
            name: subcategory.name,
            slug: subcategory.slug,
            sortOrder: subcategory.sortOrder,
            isActive: !!subcategory.isActive,
            productCount: subcategoryCountById.get(subcategory.id) ?? 0,
          }))

        const directProductCount = directProductCountByCategoryId.get(category.id) ?? 0

        const productCount = directProductCount + filteredSubcategories
          .reduce((total, subcategory) => total + (subcategory.productCount ?? 0), 0)

        const subcategoriesWithVirtualBucket =
          filteredSubcategories.length > 0 && directProductCount > 0
            ? [
                ...filteredSubcategories,
                {
                  id: -category.id,
                  name: 'Otros',
                  slug: 'otros',
                  sortOrder: Number.MAX_SAFE_INTEGER,
                  isActive: true,
                  productCount: directProductCount,
                },
              ]
            : filteredSubcategories

        return {
          id: category.id,
          name: category.name,
          slug: category.slug,
          sortOrder: category.sortOrder,
          isActive: !!category.isActive,
          createdAt: category.createdAt,
          directProductCount,
          productCount,
          subcategories: subcategoriesWithVirtualBucket,
        }
      })
      // NOTE: Do not filter out categories with zero productCount here.
      // The frontend can decide whether to hide empty categories.

    return { data }
  } catch (error: any) {
    console.error('❌ Error en /api/categories:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Error al cargar categorías',
    })
  }
})
