import { db } from '~/server/db'
import { banners } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { validateBody } from '~/server/utils/validate'
import { z } from 'zod'

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().nullable().transform(v => v || null)

const linkSchema = z
  .string()
  .trim()
  .refine(v => !v || /^https?:\/\//i.test(v) || v.startsWith('/'), {
    message: 'El enlace debe ser una URL completa o una ruta interna que empiece con /',
  })
  .optional()
  .nullable()
  .transform(v => v || null)

const schema = z.object({
  imageUrl:  z.string().min(1).optional(),
  linkUrl:   linkSchema,
  eyebrow:   optionalText(80),
  title:     optionalText(160),
  subtitle:  optionalText(300),
  ctaLabel:  optionalText(60),
  align:     z.enum(['left', 'center', 'right']).optional(),
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
  return { ...b, isActive: !!b.isActive }
})
