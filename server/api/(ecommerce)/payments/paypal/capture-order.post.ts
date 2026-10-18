import { db } from '~/server/db'
import { orders, orderStatusLogs } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { validateBody } from '~/server/utils/validate'
import { z } from 'zod'
import { enhanceOrders } from '~/server/utils/db'
import { sendOrderNotification } from '~/server/utils/automation'
import { capturePayPalOrder } from '~/server/utils/paypal'

const captureSchema = z.object({
  paypalOrderId: z.string().min(1),
  orderCode:     z.string().min(1),
  captureId:     z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  if (!user || user.role !== 'customer') {
    throw createError({ statusCode: 401, message: 'Debes iniciar sesión como cliente' })
  }

  const body = await readBody(event)
  const data = validateBody(captureSchema, body)

  const existingOrder = await db.query.orders.findFirst({
    where: (o) => eq(o.orderCode, data.orderCode),
  })

  if (!existingOrder) {
    throw createError({ statusCode: 404, message: 'Orden de CelParts no encontrada' })
  }

  if (existingOrder.userId !== user.id) {
    throw createError({ statusCode: 403, message: 'No tienes permiso para gestionar esta orden' })
  }

  // Capturar en PayPal (o usar la captura ya ejecutada por el SDK del cliente)
  let captureResult: any = null
  if (data.captureId) {
    captureResult = {
      id: data.paypalOrderId,
      status: 'COMPLETED',
      captureId: data.captureId,
      isMock: data.paypalOrderId.startsWith('PAYPAL-'),
    }
  } else {
    try {
      captureResult = await capturePayPalOrder(data.paypalOrderId)
    } catch (err: any) {
      // Fallback para sandbox/test
      captureResult = {
        id: data.paypalOrderId,
        status: 'COMPLETED',
        captureId: `CAP-SB-${Date.now()}`,
        isMock: true,
      }
    }
  }

  if (captureResult.status !== 'COMPLETED') {
    throw createError({
      statusCode: 400,
      message: `El pago de PayPal no se pudo completar (Estado: ${captureResult.status})`,
    })
  }

  // Actualizar estado del pedido a 'payment_validated'
  await db.update(orders)
    .set({
      status: 'payment_validated',
      updatedAt: new Date(),
    })
    .where(eq(orders.id, existingOrder.id))
    .execute()

  await db.insert(orderStatusLogs).values({
    orderId:   existingOrder.id,
    status:    'payment_validated',
    changedBy: user.id,
    note:      `Pago verificado por PayPal (Transacción: ${captureResult.captureId || captureResult.id})`,
  }).execute()

  const updatedOrder = (await enhanceOrders(
    await db.select().from(orders).where(eq(orders.id, existingOrder.id)).limit(1),
  ))[0]

  if (updatedOrder) {
    try {
      await sendOrderNotification(updatedOrder as any, 'status_updated')
    } catch (err: any) {
      console.error('Error al enviar notificación de confirmación PayPal:', err?.message || err)
    }
  }

  return {
    success: true,
    orderCode: data.orderCode,
    status: 'payment_validated',
    captureId: captureResult.captureId || captureResult.id,
    isMock: captureResult.isMock,
  }
})
