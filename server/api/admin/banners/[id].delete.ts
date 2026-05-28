import { db } from '~/server/db'
import { banners } from '~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  await db.delete(banners).where(eq(banners.id, id)).execute()
  return { ok: true }
})
