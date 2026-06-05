import { db } from '~/server/db'
import { orders, orderItems, products } from '~/server/db/schema'
import { desc } from 'drizzle-orm'
import { enhanceOrders, enhanceProducts } from '~/server/utils/db'

const CLOSED_STATUSES = new Set(['delivered', 'payment_validated'])
const ACTIVE_STATUSES = new Set(['pending', 'voucher_sent', 'payment_validated', 'in_preparation'])

function startOfDayLima(date: Date): Date {
  const limaOffset = -5 * 60 * 60 * 1000 // UTC-5 en ms
  const limaTime = new Date(date.getTime() + limaOffset)
  limaTime.setUTCHours(0, 0, 0, 0)
  return new Date(limaTime.getTime() - limaOffset)
}

export default defineEventHandler(async () => {
  const now = new Date()
  const dayStart = startOfDayLima(now)
  const weekStart = startOfDayLima(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000))

  const [rawOrders, rawProducts] = await Promise.all([
    enhanceOrders(await db.select().from(orders).orderBy(desc(orders.createdAt))),
    enhanceProducts(await db.select().from(products).orderBy(desc(products.updatedAt))),
  ])

  const orderItemsRows = await db.select().from(orderItems)
  const salesOrders = rawOrders.filter((order) => CLOSED_STATUSES.has(String(order.status ?? '')))
  const activeOrders = rawOrders.filter((order) => ACTIVE_STATUSES.has(String(order.status ?? '')))

  const totals = rawOrders.reduce(
    (acc, order) => {
      const createdAt = order.createdAt ? new Date(order.createdAt as any) : null
      const total = Number(order.total ?? 0)

      acc.orders += 1
      if (String(order.status ?? '') === 'cancelled') acc.cancelled += 1
      if (String(order.status ?? '') === 'delivered') acc.delivered += 1
      if (String(order.status ?? '') === 'pending') acc.pending += 1
      if (String(order.status ?? '') === 'voucher_sent') acc.voucherSent += 1
      if (String(order.status ?? '') === 'payment_validated') acc.paymentValidated += 1
      if (String(order.status ?? '') === 'in_preparation') acc.inPreparation += 1
      if (createdAt && createdAt >= dayStart) {
        acc.todayOrders += 1
        if (String(order.status ?? '') !== 'cancelled') acc.todaySales += total
      }
      if (createdAt && createdAt >= weekStart) {
        acc.weekOrders += 1
        if (String(order.status ?? '') !== 'cancelled') acc.weekSales += total
      }
      if (String(order.status ?? '') !== 'cancelled') {
        acc.grossSales += total
      }
      return acc
    },
    {
      orders: 0,
      cancelled: 0,
      delivered: 0,
      pending: 0,
      voucherSent: 0,
      paymentValidated: 0,
      inPreparation: 0,
      todayOrders: 0,
      weekOrders: 0,
      grossSales: 0,
      todaySales: 0,
      weekSales: 0,
    },
  )

  const lowStock = rawProducts.filter((product) => !!product.trackStock && Number(product.stock ?? 0) <= 10)

  const productMap = new Map<number, { id: number; name: string; slug: string; quantity: number; total: number }>()
  for (const item of orderItemsRows) {
    if (!item.productId) continue
    const current = productMap.get(item.productId) ?? { id: item.productId, name: item.productName, slug: '', quantity: 0, total: 0 }
    current.quantity += Number(item.quantity ?? 0)
    current.total += Number(item.subtotal ?? 0)
    productMap.set(item.productId, current)
  }

  const topProducts = [...productMap.values()]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10)

  return {
    generatedAt: now.toISOString(),
    totals,
    counts: {
      activeOrders: activeOrders.length,
      salesOrders: salesOrders.length,
      lowStock: lowStock.length,
      products: rawProducts.length,
    },
    topProducts,
    lowStock: lowStock.map((product) => ({
      id: product.id,
      name: product.name,
      stock: Number(product.stock ?? 0),
      category: product.category ? { id: product.category.id, name: product.category.name, slug: product.category.slug } : null,
    })),
  }
})
