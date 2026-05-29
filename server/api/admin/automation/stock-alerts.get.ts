import { db } from '~/server/db'
import { products } from '~/server/db/schema'
import { desc, eq } from 'drizzle-orm'
import { enhanceProducts } from '~/server/utils/db'
import { sendLowStockNotification } from '~/server/utils/automation'

function toBool(value: unknown): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase())
  if (typeof value === 'number') return value === 1
  return false
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const threshold = Math.max(0, Number(query.threshold ?? 10) || 10)
  const notify = toBool(query.notify)

  const rawItems = await db.select().from(products).orderBy(desc(products.stock), desc(products.updatedAt))
  const items = (await enhanceProducts(rawItems)).filter((product) => {
    const stock = Number(product.stock ?? 0)
    return !!product.trackStock && stock <= threshold
  })

  const data = items.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    stock: Number(product.stock ?? 0),
    trackStock: !!product.trackStock,
    category: product.category ? { id: product.category.id, name: product.category.name, slug: product.category.slug } : null,
    subcategory: product.subcategory ? { id: product.subcategory.id, name: product.subcategory.name, slug: product.subcategory.slug } : null,
    image: (product.images?.[0] as any)?.url ?? null,
  }))

  if (notify && data.length > 0) {
    await sendLowStockNotification(data)
  }

  return {
    threshold,
    total: data.length,
    data,
  }
})
