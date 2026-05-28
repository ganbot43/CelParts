import { db } from '~/server/db'
import { paymentMethods } from '~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  await db.delete(paymentMethods).where(eq(paymentMethods.id, id)).execute()
  return { ok: true }
})
