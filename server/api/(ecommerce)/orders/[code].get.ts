import { db } from '~/server/db'
import { orders } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { enhanceOrders } from '~/server/utils/db'

/**
 * Pedido por código, para la página de confirmación tras la compra.
 *
 * Exige sesión y pertenencia. Antes era público: como los códigos son
 * correlativos (`PED-0001`, `PED-0002`, …), bastaba con recorrerlos para
 * descargar nombre, teléfono y dirección de todos los clientes.
 *
 * No rompe el flujo real: al checkout solo se llega con sesión de
 * cliente (middleware `auth-customer`), así que quien aterriza aquí
 * después de comprar ya está identificado.
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const code = getRouterParam(event, 'code')!

  const order = (await enhanceOrders(
    await db.select().from(orders).where(eq(orders.orderCode, code)).limit(1),
  ))[0]

  if (!order) {
    throw createError({ statusCode: 404, message: 'Pedido no encontrado' })
  }

  /* El personal de la tienda puede abrir cualquier pedido para dar
     soporte; un cliente, solo los suyos. */
  const esDelCliente = order.userId != null && order.userId === user.id
  const esPersonal = user.role === 'admin' || user.role === 'superadmin'

  if (!esDelCliente && !esPersonal) {
    /* 404 y no 403: confirmar que el código existe permitiría saber
       cuántos pedidos lleva la tienda. */
    throw createError({ statusCode: 404, message: 'Pedido no encontrado' })
  }

  return order
})
