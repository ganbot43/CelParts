import { db } from '~/server/db'
import { products } from '~/server/db/schema'
import { eq, and } from 'drizzle-orm'
import { enhanceProducts } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session?.user) throw createError({ statusCode: 401, message: 'No autorizado' })
  const sellerId = session.user.id

  const productId = parseInt(event.context.params?.id || '0', 10)
  if (!productId) throw createError({ statusCode: 400, message: 'ID inválido' })

  const result = await db.select().from(products).where(and(eq(products.id, productId), eq(products.sellerId, sellerId))).limit(1)
  
  if (!result.length) {
    throw createError({ statusCode: 404, message: 'Producto no encontrado o no te pertenece' })
  }

  const enhanced = await enhanceProducts(result)
  return enhanced[0]
})
