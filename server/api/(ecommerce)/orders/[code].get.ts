import { db } from '~/server/db'
import { orders } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { enhanceOrders } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')!

  const order = (await enhanceOrders(
    await db.select().from(orders).where(eq(orders.orderCode, code)).limit(1),
  ))[0]

  if (!order) {
    throw createError({ statusCode: 404, message: 'Pedido no encontrado' })
  }

  return order
})
