import { db } from '~/server/db'
import { inventoryMovements, products, users } from '~/server/db/schema'
import { desc, eq, sql, inArray, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const productId = query.productId ? Number(query.productId) : null
  const type = query.type ? String(query.type) : null
  const limit = Math.min(100, Math.max(1, Number(query.limit ?? 50)))
  const offset = Math.max(0, Number(query.offset ?? 0))

  const whereClauses: any[] = []
  if (productId) whereClauses.push(eq(inventoryMovements.productId, productId))
  if (type) whereClauses.push(eq(inventoryMovements.movementType, type))

  // total count
  let totalQ: any = db.select({ count: sql<number>`count(*)` }).from(inventoryMovements)
  let pageQ: any = db.select().from(inventoryMovements as any)
  
  if (whereClauses.length > 0) {
    totalQ = totalQ.where(and(...whereClauses))
    pageQ = pageQ.where(and(...whereClauses))
  }

  const totalResult = await totalQ.execute()
  const rows = await pageQ.orderBy(desc(inventoryMovements.createdAt)).limit(limit).offset(offset).execute()

  // Fetch related product names and user names for convenience
  const productIds = Array.from(new Set((rows as any[]).map((r: any) => r.productId).filter(Boolean))) as number[]
  const userIds = Array.from(new Set((rows as any[]).map((r: any) => r.createdBy).filter(Boolean))) as number[]
  const dbProducts = productIds.length ? await db.query.products.findMany({ where: inArray(products.id, productIds as number[]) }) : []
  const dbUsers = userIds.length ? await db.query.users.findMany({ where: inArray(users.id, userIds as number[]) }) : []
  const productsMap = new Map(dbProducts.map(p => [p.id, p]))
  const usersMap = new Map(dbUsers.map(u => [u.id, u]))

  const data = rows.map((r: any) => ({
    id: r.id,
    productId: r.productId,
    productName: productsMap.get(r.productId)?.name ?? null,
    movementType: r.movementType,
    quantity: Number(r.quantity ?? 0),
    delta: r.delta ?? null,
    reason: r.reason ?? null,
    relatedOrderId: r.relatedOrderId ?? null,
    createdBy: r.createdBy ?? null,
    createdByName: usersMap.get(r.createdBy)?.name ?? null,
    createdAt: r.createdAt,
  }))

  return { total: totalResult[0]?.count ?? data.length, data }
})
