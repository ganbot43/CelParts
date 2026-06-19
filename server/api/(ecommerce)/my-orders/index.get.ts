import { db } from '~/server/db'
import { orders } from '~/server/db/schema'
import { eq, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  if (user.role !== 'customer') {
    throw createError({ statusCode: 403, message: 'Acceso denegado' })
  }

  const userOrders = await db.query.orders.findMany({
    where: eq(orders.userId, user.id),
    orderBy: [desc(orders.createdAt)],
    with: {
      items: true
    }
  })

  // Retornamos sin los campos de pagos/cuentas para mayor limpieza (opcional)
  return userOrders
})
