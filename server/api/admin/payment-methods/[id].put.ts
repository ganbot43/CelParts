import { db } from '~/server/db'
import { paymentMethods } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { validateBody } from '~/server/utils/validate'
import { z } from 'zod'

const schema = z.object({
  label:         z.string().min(2).optional(),
  qrUrl:         z.string().optional().nullable(),
  accountNumber: z.string().optional().nullable(),
  accountName:   z.string().optional().nullable(),
  isActive:      z.boolean().optional(),
  sortOrder:     z.number().int().min(0).optional(),
})

export default defineEventHandler(async (event) => {
  const id   = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const data = validateBody(schema, body)
  const updatePayload: Record<string, any> = { ...data }
  if (data.isActive !== undefined) {
    updatePayload.isActive = data.isActive ? 1 : 0
  }
  await db.update(paymentMethods).set(updatePayload).where(eq(paymentMethods.id, id)).execute()
  const pm = await db.query.paymentMethods.findFirst({ where: eq(paymentMethods.id, id) })
  if (!pm) throw createError({ statusCode: 404, message: 'Método no encontrado' })
  return { id: pm.id, type: pm.type, label: pm.label, qrUrl: pm.qrUrl, accountNumber: pm.accountNumber, accountName: pm.accountName, isActive: !!pm.isActive, sortOrder: pm.sortOrder }
})
