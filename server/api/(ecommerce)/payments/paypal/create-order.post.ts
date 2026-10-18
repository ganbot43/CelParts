import { db } from '~/server/db'
import { orders, orderItems, orderStatusLogs, products, paymentMethods } from '~/server/db/schema'
import { eq, inArray } from 'drizzle-orm'
import { validateBody } from '~/server/utils/validate'
import { generateOrderCode } from '~/server/utils/orderCode'
import { z } from 'zod'
import { enhanceOrders } from '~/server/utils/db'
import { sendOrderNotification } from '~/server/utils/automation'
import { changeStockTx } from '~/server/services/inventory'
import { createPayPalOrder, convertPenToPayPalCurrency } from '~/server/utils/paypal'

const createSchema = z.object({
  orderCode:         z.string().optional(),
  customerName:      z.string().min(2).optional(),
  customerPhone:     z.string().optional(),
  customerAddress:   z.string().optional(),
  customerReference: z.string().optional(),
  customerNotes:     z.string().optional(),
  paymentMethodId:   z.number().int().positive().optional(),
  items: z.array(z.object({
    productId: z.number().int().positive(),
    quantity:  z.number().int().min(1),
  })).min(1).optional(),
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  if (!user || user.role !== 'customer') {
    throw createError({ statusCode: 401, message: 'Debes iniciar sesión como cliente para comprar' })
  }

  const body = await readBody(event)
  const data = validateBody(createSchema, body)

  if (data.orderCode) {
    const existingOrder = await db.query.orders.findFirst({
      where: (o) => eq(o.orderCode, data.orderCode!),
    })

    if (!existingOrder) {
      throw createError({ statusCode: 404, message: 'Orden no encontrada' })
    }

    if (existingOrder.userId !== user.id) {
      throw createError({ statusCode: 403, message: 'No tienes permiso para pagar esta orden' })
    }

    const { amount, currency } = convertPenToPayPalCurrency(existingOrder.total)
    const paypalOrder = await createPayPalOrder({
      amount,
      currency,
      orderCode: existingOrder.orderCode,
      description: `Pedido ${existingOrder.orderCode} - CelParts`,
    })

    return {
      paypalOrderId: paypalOrder.id,
      orderId: existingOrder.id,
      orderCode: existingOrder.orderCode,
      totalPen: existingOrder.total,
      amountPayPal: amount,
      currency,
      isMock: paypalOrder.isMock,
    }
  }

  if (!data.items || !data.customerName || !data.paymentMethodId) {
    throw createError({
      statusCode: 400,
      message: 'Faltan datos requeridos (items, customerName, paymentMethodId) para crear el pedido',
    })
  }

  const productIds = data.items.map(i => Number(i.productId)).filter(n => Number.isFinite(n) && n > 0)
  const uniqueProductIds = Array.from(new Set(productIds))

  const dbProducts = await db.query.products.findMany({
    where: inArray(products.id, uniqueProductIds),
  })

  if (dbProducts.length !== uniqueProductIds.length) {
    throw createError({ statusCode: 400, message: 'Uno o más productos no existen' })
  }

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

  const subtotal = data.items.reduce((acc, item) => {
    const prod = dbProducts.find(p => Number(p.id) === Number(item.productId))!
    return acc + prod.price * item.quantity
  }, 0)
  const total = subtotal

  const paymentMethod = await db.query.paymentMethods.findFirst({
    where: (pm) => eq(pm.id, data.paymentMethodId!),
  })

  let createdOrderId = 0
  let finalOrderCode = ''

  await db.transaction(async (tx) => {
    const [hdr] = await tx.insert(orders).values({
      orderCode:                  'PED-TEMP',
      userId:                     user.id,
      paymentMethodId:            data.paymentMethodId,
      paymentMethodType:          paymentMethod?.type ?? 'paypal',
      paymentMethodLabel:         paymentMethod?.label ?? 'PayPal',
      paymentMethodQrUrl:         null,
      paymentMethodAccountNumber: null,
      paymentMethodAccountName:   null,
      customerName:               data.customerName!,
      customerPhone:              data.customerPhone,
      customerAddress:            data.customerAddress,
      customerReference:          data.customerReference,
      customerNotes:              data.customerNotes,
      subtotal,
      total,
      status:                     'pending',
      createdAt:                  new Date(),
    }).execute()

    createdOrderId = Number((hdr as any).insertId ?? 0)
    if (!createdOrderId) throw new Error('No se pudo crear la orden')

    finalOrderCode = generateOrderCode(createdOrderId)
    await tx.update(orders).set({ orderCode: finalOrderCode }).where(eq(orders.id, createdOrderId)).execute()

    for (const item of data.items!) {
      const prodRows: any[] = await tx.select().from(products).where(eq(products.id, item.productId)).limit(1)
      const prod = prodRows[0]

      await tx.insert(orderItems).values({
        orderId:     createdOrderId,
        productId:   prod.id,
        productName: prod.name,
        unitPrice:   prod.price,
        quantity:    item.quantity,
        subtotal:    prod.price * item.quantity,
      }).execute()

      if (config?.stockEnabled && prod.trackStock) {
        const delta = -Number(item.quantity ?? 0)
        await changeStockTx(tx, prod.id, delta, {
          movementType: 'exit',
          reason: `Salida por pedido ${finalOrderCode}`,
          relatedOrderId: createdOrderId,
          createdBy: null,
        })
      }
    }

    await tx.insert(orderStatusLogs).values({
      orderId: createdOrderId,
      status:  'pending',
      note:    'Pedido creado con método de pago PayPal (Pendiente de aprobación)',
    }).execute()
  })

  // Generar la orden en PayPal
  const { amount, currency } = convertPenToPayPalCurrency(total)
  const paypalOrder = await createPayPalOrder({
    amount,
    currency,
    orderCode: finalOrderCode,
    description: `Pedido ${finalOrderCode} - CelParts`,
  })

  // Notificación inicial (sin bloquear)
  try {
    const createdOrder = (await enhanceOrders(
      await db.select().from(orders).where(eq(orders.id, createdOrderId)).limit(1),
    ))[0]
    if (createdOrder) {
      await sendOrderNotification(createdOrder as any, 'created')
    }
  } catch (err: any) {
    console.error('Error al enviar notificación de orden:', err?.message || err)
  }

  return {
    paypalOrderId: paypalOrder.id,
    orderId: createdOrderId,
    orderCode: finalOrderCode,
    totalPen: total,
    amountPayPal: amount,
    currency,
    isMock: paypalOrder.isMock,
  }
})
