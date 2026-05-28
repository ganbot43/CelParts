import { db } from '~/server/db'
import { paymentMethods } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { validateBody } from '~/server/utils/validate'
import { z } from 'zod'

const schema = z.object({
  type:          z.enum(['yape', 'plin', 'bank_transfer', 'culqi', 'mercado_pago']),
  label:         z.string().min(2),
  qrUrl:         z.string().url().optional().nullable(),
  accountNumber: z.string().optional().nullable(),
  accountName:   z.string().optional().nullable(),
  isActive:      z.boolean().default(true),
  sortOrder:     z.number().int().min(0).default(0),
})

export default defineEventHandler(async () => {
  const items = await db.query.paymentMethods.findMany({
    orderBy: (pm, { asc }) => [asc(pm.sortOrder)],
  })

  const data = items.map(pm => ({
    id: pm.id,
    type: pm.type,
    label: pm.label,
    qrUrl: pm.qrUrl,
    accountNumber: pm.accountNumber,
    accountName: pm.accountName,
    isActive: !!pm.isActive,
    sortOrder: pm.sortOrder,
  }))

  return { data }
})
