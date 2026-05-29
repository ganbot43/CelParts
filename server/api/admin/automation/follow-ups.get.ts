import { db } from '~/server/db'
import { orders } from '~/server/db/schema'
import { desc } from 'drizzle-orm'
import { enhanceOrders } from '~/server/utils/db'

const FOLLOW_UP_STATUSES = new Set(['pending', 'voucher_sent', 'payment_validated'])

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const hours = Math.max(1, Number(query.hours ?? 24) || 24)
  const now = new Date()
  const cutoff = now.getTime() - hours * 60 * 60 * 1000

  const rows = await enhanceOrders(
    await db.select().from(orders).orderBy(desc(orders.createdAt)),
  )

  const data = rows
    .filter((order) => FOLLOW_UP_STATUSES.has(String(order.status ?? '')))
    .filter((order) => {
      const createdAt = order.createdAt ? new Date(order.createdAt as any).getTime() : 0
      return createdAt > 0 && createdAt <= cutoff
    })
    .map((order) => ({
      id: order.id,
      orderCode: order.orderCode,
      status: order.status,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      total: order.total,
      createdAt: order.createdAt,
      hoursOpen: Math.max(0, Math.round((now.getTime() - new Date(order.createdAt as any).getTime()) / 36e5)),
    }))

  return {
    hours,
    total: data.length,
    data,
  }
})
