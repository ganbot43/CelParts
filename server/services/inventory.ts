import { db } from '~/server/db'
import { products, inventoryMovements } from '~/server/db/schema'
import { eq } from 'drizzle-orm'

export interface ChangeOpts {
  movementType: 'entry' | 'exit' | 'adjustment'
  reason?: string | null
  relatedOrderId?: number | null
  createdBy?: number | null
}

// Uses an existing transaction object (tx) to update stock and insert movement
export async function changeStockTx(tx: any, productId: number, delta: number, opts: ChangeOpts) {
  const prodRows: any[] = await tx.select().from(products).where(eq(products.id, productId)).limit(1).execute()
  const prod = prodRows[0]
  if (!prod) throw new Error('Producto no encontrado')

  const oldStock = Number(prod.stock ?? 0)
  const newStock = oldStock + delta

  await tx.update(products).set({ stock: newStock }).where(eq(products.id, productId)).execute()

  await tx.insert(inventoryMovements).values({
    productId,
    movementType: opts.movementType,
    quantity: Math.abs(delta),
    delta,
    reason: opts.reason ?? null,
    relatedOrderId: opts.relatedOrderId ?? null,
    createdBy: opts.createdBy ?? null,
  }).execute()

  // Log for audit/debug (server-side)
  try {
    // eslint-disable-next-line no-console
    console.info(`[inventory] product=${productId} old=${oldStock} new=${newStock} delta=${delta} type=${opts.movementType} relatedOrder=${opts.relatedOrderId}`)
  } catch (e) {
    // ignore logging errors
  }

  return { productId, oldStock, newStock }
}

// Convenience wrapper that runs in its own transaction
export async function changeStockAtomic(productId: number, delta: number, opts: ChangeOpts) {
  return await db.transaction(async (tx) => {
    return await changeStockTx(tx, productId, delta, opts)
  })
}

export default changeStockAtomic
