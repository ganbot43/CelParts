import { db } from '~/server/db'
import { orders, orderStatusLogs, orderItems, products, inventoryMovements } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { validateBody } from '~/server/utils/validate'
import { z } from 'zod'
import { enhanceOrders } from '~/server/utils/db'
import { sendOrderNotification } from '~/server/utils/automation'

const schema = z.object({
  status: z.enum([
    'pending', 'voucher_sent', 'payment_validated',
    'in_preparation', 'delivered', 'cancelled',
  ]),
  note: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const id      = Number(getRouterParam(event, 'id'))
  const body    = await readBody(event)
  const data    = validateBody(schema, body)
  const session = await getUserSession(event)

  await db.update(orders)
    .set({ status: data.status, updatedAt: new Date() })
    .where(eq(orders.id, id))
    .execute()

  await db.insert(orderStatusLogs).values({
    orderId:   id,
    status:    data.status,
    changedBy: (session.user as any)?.id,
    note:      data.note,
  }).execute()

  // If order was cancelled, attempt to revert stock for items that had exit movements
  if (data.status === 'cancelled') {
    const orderRow = (await db.select().from(orders).where(eq(orders.id, id)).limit(1))[0]
    const { changeStockTx } = await import('~/server/services/inventory')
    await db.transaction(async (tx) => {
      const items: any[] = await tx.select().from(orderItems).where(eq(orderItems.orderId, id)).execute()
      for (const it of items) {
        const exits = await tx.select().from(inventoryMovements).where(
          eq(inventoryMovements.relatedOrderId, id),
          eq(inventoryMovements.productId, it.productId),
          eq(inventoryMovements.movementType, 'exit'),
        ).limit(1).execute()

        if ((exits || []).length > 0) {
          await changeStockTx(tx, it.productId, Number(it.quantity ?? 0), {
            movementType: 'entry',
            reason: `Reversión por cancelación pedido ${orderRow?.orderCode ?? id}`,
            relatedOrderId: id,
            createdBy: (session.user as any)?.id,
          })
        }
      }
    })
  }

  const order = (await enhanceOrders(
    await db.select().from(orders).where(eq(orders.id, id)).limit(1),
  ))[0]

  /* Mismo criterio que al crear: el estado ya cambió en la base. Si el
     correo falla, el panel no debe mostrar un error sobre una operación
     que sí se aplicó. */
  try {
    await sendOrderNotification(order, data.status, data.note)
  } catch (err: any) {
    console.error(
      `⚠️  Estado de ${order?.orderCode ?? id} actualizado, pero falló la notificación:`,
      err?.message || err,
    )
  }

  return order
})
