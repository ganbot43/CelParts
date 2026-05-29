import { db } from '~/server/db'
import { products } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { validateBody } from '~/server/utils/validate'

const schema = z.object({
  productId:     z.number().int().positive(),
  movementType:  z.enum(['entry', 'exit', 'adjustment']),
  quantity:      z.number().int().min(0).default(0),
  delta:         z.number().int().optional(),
  reason:        z.string().max(1000).optional(),
  relatedOrderId: z.number().int().positive().optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = validateBody(schema, body)

  // Use helper changeStockTx to centralize stock changes and movement creation
  const { changeStockTx } = await import('~/server/services/inventory')

  const result = await db.transaction(async (tx) => {
    const prodRows: any[] = await tx.select().from(products).where(eq(products.id, data.productId)).limit(1)
    const prod = prodRows[0]
    if (!prod) {
      throw createError({ statusCode: 404, message: 'Producto no encontrado' })
    }

    let delta = 0
    if (data.movementType === 'entry') {
      delta = Number(data.quantity ?? 0)
    } else if (data.movementType === 'exit') {
      delta = -Number(data.quantity ?? 0)
    } else if (data.movementType === 'adjustment') {
      delta = typeof data.delta === 'number' ? Number(data.delta) : Number(data.quantity ?? 0)
    }

    const change = await changeStockTx(tx, data.productId, delta, {
      movementType: data.movementType,
      reason: data.reason ?? null,
      relatedOrderId: data.relatedOrderId ?? null,
      createdBy: null,
    })

    // The helper already inserted the movement; fetch its id is not returned here,
    // so return new stock computed by helper.
    return { newStock: change.newStock }
  })

  return { ok: true, movementId: null, newStock: result.newStock }
})
