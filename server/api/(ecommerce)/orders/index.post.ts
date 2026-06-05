import { db } from '~/server/db'
import { orders, orderItems, orderStatusLogs, products } from '~/server/db/schema'
import { eq, inArray } from 'drizzle-orm'
import { validateBody } from '~/server/utils/validate'
import { generateOrderCode } from '~/server/utils/orderCode'
import { z } from 'zod'
import { enhanceOrders } from '~/server/utils/db'
import { sendOrderNotification } from '~/server/utils/automation'

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
  const { user } = await requireUserSession(event)
  if (!user || user.role !== 'customer') {
    throw createError({ statusCode: 401, message: 'Debes iniciar sesión como cliente para comprar' })
  }

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

  // Insertar orden + items + actualizaciones de stock y movimientos en una transacción
  let createdOrderId = 0
  await db.transaction(async (tx) => {
    const [hdr] = await tx.insert(orders).values({
      orderCode:                  'PED-TEMP',
      userId:                     user.id,
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
      createdAt: new Date(),
    }).execute()

    createdOrderId = Number((hdr as any).insertId ?? 0)
    if (!createdOrderId) throw new Error('No se pudo crear la orden')

    const orderCode = generateOrderCode(createdOrderId)
    await tx.update(orders).set({ orderCode }).where(eq(orders.id, createdOrderId)).execute()

    for (const item of data.items) {
      const prodRows: any[] = await tx.select().from(products).where(eq(products.id, item.productId)).limit(1)
      const prod = prodRows[0]
      if (!prod) {
        throw createError({ statusCode: 400, message: `Producto ${item.productId} no encontrado` })
      }

      await tx.insert(orderItems).values({
        orderId: createdOrderId,
        productId:   prod.id,
        productName: prod.name,
        unitPrice:   prod.price,
        quantity:    item.quantity,
        subtotal:    prod.price * item.quantity,
      }).execute()

      // Descontar stock si aplica y registrar movimiento (usa helper para atomicidad)
      if (config?.stockEnabled && prod.trackStock) {
        const { changeStockTx } = await import('~/server/services/inventory')
        const delta = -Number(item.quantity ?? 0)
        // will throw if product not found or stock invalid inside helper
        await changeStockTx(tx, prod.id, delta, {
          movementType: 'exit',
          reason: `Salida por pedido ${orderCode}`,
          relatedOrderId: createdOrderId,
          createdBy: null,
        })
      }
    }

    await tx.insert(orderStatusLogs).values({
      orderId: createdOrderId,
      status: 'pending',
      note:   'Pedido creado',
    }).execute()
  })

  const order = (await enhanceOrders(
    await db.select().from(orders).where(eq(orders.id, createdOrderId)).limit(1),
  ))[0]

  await sendOrderNotification(order, 'created')

  return order
})
