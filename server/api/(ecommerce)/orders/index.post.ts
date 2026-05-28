import { db } from '~/server/db'
import { insertAndGetId } from '~/server/db/mysql'
import { orders, orderItems, orderStatusLogs, products } from '~/server/db/schema'
import { eq, inArray } from 'drizzle-orm'
import { validateBody } from '~/server/utils/validate'
import { generateOrderCode } from '~/server/utils/orderCode'
import { z } from 'zod'
import { enhanceOrders } from '~/server/utils/db'

const schema = z.object({
  customerName:      z.string().min(2),
  customerPhone:     z.string().optional(),
  customerAddress:   z.string().optional(),
  customerReference: z.string().optional(),
  customerNotes:     z.string().optional(),
  paymentMethodId:   z.number().int().positive(),
  items: z.array(z.object({
    productId: z.number().int().positive(),
    quantity:  z.number().int().min(1),
  })).min(1),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = validateBody(schema, body)

  const productIds = data.items.map(i => Number(i.productId)).filter(n => Number.isFinite(n) && n > 0)
  const uniqueProductIds = Array.from(new Set(productIds))

  const dbProducts = await db.query.products.findMany({
    where: inArray(products.id, uniqueProductIds),
  })

  if (dbProducts.length !== uniqueProductIds.length) {
    throw createError({
      statusCode: 400,
      message: 'Uno o más productos no existen',
      data: {
        requested: uniqueProductIds,
        found: dbProducts.map(p => p.id),
      },
    })
  }

  // Verificar stock si aplica
  const config = await db.query.businessConfig.findFirst()
  for (const item of data.items) {
    const prod = dbProducts.find(p => Number(p.id) === Number(item.productId))!
    if (config?.stockEnabled && prod.trackStock && prod.stock < item.quantity) {
      throw createError({
        statusCode: 400,
        message: `Stock insuficiente para "${prod.name}"`,
      })
    }
  }

  // Calcular totales con precios de BD (nunca confiar en el cliente)
  const subtotal = data.items.reduce((acc, item) => {
    const prod = dbProducts.find(p => Number(p.id) === Number(item.productId))!
    return acc + prod.price * item.quantity
  }, 0)
  const total = subtotal

  // Obtener el método de pago para guardar snapshot
  const paymentMethod = await db.query.paymentMethods.findFirst({
    where: (pm) => eq(pm.id, data.paymentMethodId),
  })

  // INSERT orden con snapshots del método de pago
  const orderId = await insertAndGetId(orders, {
    orderCode:                  'PED-TEMP',
    paymentMethodId:            data.paymentMethodId,
    paymentMethodType:          paymentMethod?.type ?? null,
    paymentMethodLabel:         paymentMethod?.label ?? null,
    paymentMethodQrUrl:         paymentMethod?.qrUrl ?? null,
    paymentMethodAccountNumber: paymentMethod?.accountNumber ?? null,
    paymentMethodAccountName:   paymentMethod?.accountName ?? null,
    customerName:               data.customerName,
    customerPhone:              data.customerPhone,
    customerAddress:            data.customerAddress,
    customerReference:          data.customerReference,
    customerNotes:              data.customerNotes,
    subtotal,
    total,
    status: 'pending',
  })
  const orderCode = generateOrderCode(orderId)

  // Actualizar con orderCode real
  db.update(orders)
    .set({ orderCode })
    .where(eq(orders.id, orderId))
    .execute()

  // INSERT items con snapshot de nombre y precio
  for (const item of data.items) {
    const prod = dbProducts.find(p => p.id === item.productId)!
    db.insert(orderItems).values({
      orderId,
      productId:   prod.id,
      productName: prod.name,
      unitPrice:   prod.price,
      quantity:    item.quantity,
      subtotal:    prod.price * item.quantity,
    }).execute()

    // Descontar stock si aplica
    if (config?.stockEnabled && prod.trackStock) {
      db.update(products)
        .set({ stock: prod.stock - item.quantity })
        .where(eq(products.id, prod.id))
        .execute()
    }
  }

  // INSERT log inicial
  await db.insert(orderStatusLogs).values({
    orderId,
    status: 'pending',
    note:   'Pedido creado',
  }).execute()

  const order = (await enhanceOrders(
    await db.select().from(orders).where(eq(orders.id, orderId)).limit(1),
  ))[0]

  return order
})
