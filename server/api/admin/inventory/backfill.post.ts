import runInventoryBackfill from '~/server/services/inventory-backfill'

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => ({})) as any
  const { orderId, fromDate, toDate } = body || {}
  const res = await runInventoryBackfill({ orderId, fromDate, toDate })
  return res
})
