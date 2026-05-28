import { db } from '~/server/db'
import { banners } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { validateBody } from '~/server/utils/validate'
import { z } from 'zod'

const schema = z.object({
  imageUrl:  z.string().url().optional(),
  linkUrl:   z.string().url().optional().nullable(),
  sortOrder: z.number().int().min(0).optional(),
  isActive:  z.boolean().optional(),
})

export default defineEventHandler(async (event) => {
  const id   = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const data = validateBody(schema, body)
  await db.update(banners).set(data).where(eq(banners.id, id)).execute()
  const b = await db.query.banners.findFirst({ where: eq(banners.id, id) })
  if (!b) throw createError({ statusCode: 404, message: 'Banner no encontrado' })
  return { id: b.id, imageUrl: b.imageUrl, linkUrl: b.linkUrl, sortOrder: b.sortOrder, isActive: !!b.isActive }
})
