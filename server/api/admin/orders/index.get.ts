import { db } from '~/server/db'
import { orders } from '~/server/db/schema'
import { desc, sql } from 'drizzle-orm'
import { enhanceOrders } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = Math.min(100, Math.max(1, Number(query.limit ?? 10)))
  const offset = Math.max(0, Number(query.offset ?? 0))

  // Total count
  const countResult = await db.select({ count: sql<number>`count(*)` }).from(orders).execute()
  const total = countResult[0]?.count ?? 0

  const items = await enhanceOrders(
    await db.select().from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset),
  )

  // Mapear a objetos planos serializables
  const data = items.map((o) => ({
    id: o.id,
    orderCode: o.orderCode,
    paymentMethod: o.paymentMethod
      ? {
          id: o.paymentMethod.id,
          type: o.paymentMethod.type,
          label: o.paymentMethod.label,
          qrUrl: o.paymentMethod.qrUrl,
          accountNumber: o.paymentMethod.accountNumber,
          accountName: o.paymentMethod.accountName,
        }
      : null,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    customerAddress: o.customerAddress,
    subtotal: o.subtotal,
    total: o.total,
    status: o.status,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
    items: (o.items ?? []).map((it) => ({
      id: it.id,
      productId: it.productId,
      productName: it.productName,
      unitPrice: it.unitPrice,
      quantity: it.quantity,
      subtotal: it.subtotal,
    })),
  }))

  return { total, data }
})
