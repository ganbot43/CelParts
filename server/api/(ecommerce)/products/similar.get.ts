import { db } from '~/server/db'
import { enhanceProducts } from '~/server/utils/db'
import { products } from '~/server/db/schema'
import { eq, and, or, not, desc, sql } from 'drizzle-orm'

/**
 * Calculate Levenshtein distance between two strings
 * Returns similarity score 0-1
 */
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase()
  const s2 = str2.toLowerCase()
  const longer = s1.length > s2.length ? s1 : s2
  const shorter = s1.length > s2.length ? s2 : s1

  if (longer.length === 0) return 1.0

  const editDistance = levenshteinDistance(longer, shorter)
  return (longer.length - editDistance) / longer.length
}

function levenshteinDistance(s1: string, s2: string): number {
  const costs: number[] = []
  for (let i = 0; i <= s1.length; i++) {
    let lastDiag = i - 1
    for (let j = 0; j <= s2.length; j++) {
      let lastDiagTemp = costs[j] || 0
      costs[j] = Math.min(
        (costs[j - 1] || 0) + 1,
        (costs[j] || 0) + 1,
        (lastDiag || 0) + (s1[i - 1] === s2[j - 1] ? 0 : 1),
      )
      lastDiag = lastDiagTemp
    }
  }
  return costs[s2.length] || 0
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { productId } = query

  if (!productId) {
    throw createError({ statusCode: 400, message: 'productId es requerido' })
  }

  // Get the current product to check category/subcategory
  const currentProduct = await db.query.products.findFirst({
    where: eq(products.id, Number(productId)),
  })

  if (!currentProduct) {
    throw createError({ statusCode: 404, message: 'Producto no encontrado' })
  }

  // Get all active products except current one
  const rawProducts = await db.select().from(products)
    .where(and(
      eq(products.isActive, 1),
      not(eq(products.id, Number(productId))),
    ))
    .orderBy(desc(products.createdAt))
    .limit(100)

  const allProducts = await enhanceProducts(rawProducts)

  let itemsResult = allProducts
    .map((p) => {
      // Check if it's in the same category OR subcategory (only needs one)
      const isSameCategory =
        p.categoryId === currentProduct.categoryId
      const isSameSubcategory =
        p.subcategoryId === currentProduct.subcategoryId
      const isSameCategoryOrSub = isSameCategory || isSameSubcategory

      // Calculate name similarity (0-1)
      const nameSimilarity = calculateSimilarity(
        currentProduct.name,
        p.name,
      )

      return {
        product: p,
        isSameCategoryOrSub,
        nameSimilarity,
      }
    })
    // Filter: same category/subcategory OR have 30%+ name similarity (reduced threshold)
    .filter(
      (item) =>
        item.isSameCategoryOrSub || item.nameSimilarity >= 0.3,
    )
    // Sort by relevance: same category/subcategory first, then by name similarity
    .sort((a, b) => {
      // Priority 1: Same category or subcategory
      if (a.isSameCategoryOrSub !== b.isSameCategoryOrSub) {
        return a.isSameCategoryOrSub ? -1 : 1
      }
      // Priority 2: Higher name similarity
      return b.nameSimilarity - a.nameSimilarity
    })

  // Fallback: if no similar products found, get any active products
  if (itemsResult.length === 0) {
    itemsResult = allProducts
      .map((p) => ({
        product: p,
        isSameCategoryOrSub: false,
        nameSimilarity: 0,
      }))
      .sort(() => Math.random() - 0.5) // Random order as last resort
  }

  itemsResult = itemsResult
    .slice(0, 20) // Limit to 20
    .map((item) => {
      const p = item.product
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        stock: p.stock,
        trackStock: !!p.trackStock,
        isFeatured: !!p.isFeatured,
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
        images: (p.images ?? []).map((img) => ({
          id: img.id,
          url: img.url,
          isPrimary: !!img.isPrimary,
        })),
      }
    })

  return { data: itemsResult, count: itemsResult.length }
})
