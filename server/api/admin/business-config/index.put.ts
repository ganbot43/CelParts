import { db } from '~/server/db'
import { businessConfig } from '~/server/db/schema'
import { validateBody } from '~/server/utils/validate'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const schema = z.object({
  name:               z.string().min(2).optional(),
  ruc:                z.string().optional().nullable(),
  logoUrl:            z.string().url().optional().nullable(),
  whatsapp:           z.string().optional(),
  address:            z.string().optional().nullable(),
  socialLinks:        z.record(z.string()).optional(),
  stockEnabled:       z.boolean().optional(),
  autoPaymentEnabled: z.boolean().optional(),
  couponsEnabled:     z.boolean().optional(),
  multiuserEnabled:   z.boolean().optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = validateBody(schema, body)

  const config = await db.query.businessConfig.findFirst()
  if (!config) throw createError({ statusCode: 404, message: 'Configuración no encontrada' })

  const update: any = {
    ...data,
    updatedAt: new Date().toISOString(),
  }
  if (data.socialLinks) {
    update.socialLinks = JSON.stringify(data.socialLinks)
  }

  await db.update(businessConfig).set(update).where(eq(businessConfig.id, config.id)).execute()

  const updated = await db.query.businessConfig.findFirst()
  return { ...updated, socialLinks: updated?.socialLinks ? JSON.parse(updated.socialLinks) : {} }
})
