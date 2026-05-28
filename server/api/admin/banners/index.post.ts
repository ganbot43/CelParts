import { db } from '~/server/db'
import { insertAndGetId } from '~/server/db/mysql'
import { banners } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { validateBody } from '~/server/utils/validate'
import { z } from 'zod'

const schema = z.object({
  imageUrl:  z.string().url(),
  linkUrl:   z.string().url().optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
  isActive:  z.boolean().default(true),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = validateBody(schema, body)
  const id = await insertAndGetId(banners, data)
  const b = await db.query.banners.findFirst({ where: eq(banners.id, id) })
  if (!b) throw createError({ statusCode: 500, message: 'Error creating banner' })
  return { id: b.id, imageUrl: b.imageUrl, linkUrl: b.linkUrl, sortOrder: b.sortOrder, isActive: !!b.isActive }
})
