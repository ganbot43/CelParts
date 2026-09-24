import { db } from '~/server/db'
import { insertAndGetId } from '~/server/db/mysql'
import { banners } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { validateBody } from '~/server/utils/validate'
import { z } from 'zod'

/* El texto va vacío o no va: una cadena en blanco guardada haría que la
   portada pinte un titular invisible que empuja el resto del bloque. */
const optionalText = (max: number) =>
  z.string().trim().max(max).optional().nullable().transform(v => v || null)

/* El enlace admite ruta interna ("/productos?...") además de URL
   absoluta: la mayoría de banners apuntan al propio catálogo. */
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
  imageUrl:  z.string().min(1),
  linkUrl:   linkSchema,
  eyebrow:   optionalText(80),
  title:     optionalText(160),
  subtitle:  optionalText(300),
  ctaLabel:  optionalText(60),
  align:     z.enum(['left', 'center', 'right']).default('left'),
  sortOrder: z.number().int().min(0).default(0),
  isActive:  z.boolean().default(true),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = validateBody(schema, body)
  const id = await insertAndGetId(banners, data)
  const b = await db.query.banners.findFirst({ where: eq(banners.id, id) })
  if (!b) throw createError({ statusCode: 500, message: 'Error creating banner' })
  return created(event, { ...b, isActive: !!b.isActive })
})
