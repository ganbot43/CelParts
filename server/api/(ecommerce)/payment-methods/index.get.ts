import { db } from '~/server/db'
import { paymentMethods } from '~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const itemsResult = await db.query.paymentMethods.findMany({
    where: query.active ? eq(paymentMethods.isActive, 1) : undefined,
    orderBy: (pm, { asc }) => [asc(pm.sortOrder)],
  })

  const data = itemsResult.map(pm => ({
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
