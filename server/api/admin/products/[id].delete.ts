import { db } from '~/server/db'
import { products } from '~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  await db.delete(products).where(eq(products.id, id)).execute()
  return { ok: true }
})
