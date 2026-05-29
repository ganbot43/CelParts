import { db } from '~/server/db'
import { orders, orderItems, inventoryMovements } from '~/server/db/schema'
import { eq, and, sql } from 'drizzle-orm'

export interface BackfillOptions {
  orderId?: number | string
  fromDate?: string | Date
  toDate?: string | Date
}

export async function runInventoryBackfill(opts: BackfillOptions = {}) {
  const { orderId, fromDate, toDate } = opts

  let orderRows: any[] = []

  if (orderId) {
    const o = await db.select().from(orders).where(eq(orders.id, Number(orderId))).limit(1).execute()
    if (o.length) orderRows = o as any[]
  } else {
    const from = fromDate ? new Date(fromDate) : new Date(Date.now() - 7 * 24 * 3600 * 1000)
    const to = toDate ? new Date(toDate) : new Date()
    orderRows = await db.select().from(orders).where(and(sql`${orders.createdAt} >= ${from.toISOString()}`, sql`${orders.createdAt} <= ${to.toISOString()}`)).execute()
  }

  if (!orderRows.length) return { created: 0, processedOrders: 0 }

  let created = 0
  for (const o of orderRows) {
    const items: any[] = await db.select().from(orderItems).where(eq(orderItems.orderId, o.id)).execute()
    for (const it of items) {
      const exists: any[] = await db.select().from(inventoryMovements).where(and(eq(inventoryMovements.relatedOrderId, o.id), eq(inventoryMovements.productId, it.productId))).limit(1).execute()
      if (exists.length) continue

      await db.insert(inventoryMovements).values({
        productId: it.productId,
        movementType: 'exit',
        quantity: it.quantity,
        delta: -it.quantity,
        reason: `Salida por pedido ${o.orderCode}`,
        relatedOrderId: o.id,
        createdBy: null,
      }).execute()
      created++
    }
  }

  return { created, processedOrders: orderRows.length }
}

export default runInventoryBackfill
