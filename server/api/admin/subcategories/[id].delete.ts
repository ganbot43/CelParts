import { db } from '~/server/db'
import { subcategories } from '~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  await db.delete(subcategories).where(eq(subcategories.id, id)).execute()
  return { ok: true }
})
