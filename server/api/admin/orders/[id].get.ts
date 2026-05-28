import { db } from '~/server/db'
import { orders } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { enhanceOrders } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (!Number.isFinite(id) || id <= 0) {
    throw createError({ statusCode: 400, message: 'ID de pedido inválido' })
  }

  const order = (await enhanceOrders(
    await db.select().from(orders).where(eq(orders.id, id)).limit(1),
  ))[0]

  if (!order) throw createError({ statusCode: 404, message: 'Pedido no encontrado' })
  return order
})
