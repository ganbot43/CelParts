import { db } from '~/server/db'
import { banners } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { validateBody } from '~/server/utils/validate'
import { z } from 'zod'

export default defineEventHandler(async () => {
  const items = await db.query.banners.findMany({ orderBy: (b, { asc }) => [asc(b.sortOrder)] })
  const data = items.map(b => ({ id: b.id, imageUrl: b.imageUrl, linkUrl: b.linkUrl, sortOrder: b.sortOrder, isActive: !!b.isActive, createdAt: b.createdAt }))
  return { data }
})
