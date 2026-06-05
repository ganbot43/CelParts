import { db } from '~/server/db'
import { orders } from '~/server/db/schema'
import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  if (user.role !== 'customer') {
    throw createError({ statusCode: 403, message: 'Acceso denegado' })
  }

  const code = getRouterParam(event, 'code')
  if (!code) {
    throw createError({ statusCode: 400, message: 'Código de pedido requerido' })
  }

  const order = await db.query.orders.findFirst({
    where: and(
      eq(orders.orderCode, code),
      eq(orders.userId, user.id)
    ),
    with: {
      items: true,
      statusLogs: {
        orderBy: (logs, { desc }) => [desc(logs.createdAt)],
        with: {
          changedBy: { columns: { name: true } }
        }
      }
    }
  })

  if (!order) {
    throw createError({ statusCode: 404, message: 'Pedido no encontrado' })
  }

  return order
})
