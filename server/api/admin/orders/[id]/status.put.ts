import { db } from '~/server/db'
import { orders, orderStatusLogs } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { validateBody } from '~/server/utils/validate'
import { z } from 'zod'
import { enhanceOrders } from '~/server/utils/db'

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

  return (await enhanceOrders(
    await db.select().from(orders).where(eq(orders.id, id)).limit(1),
  ))[0]
})
