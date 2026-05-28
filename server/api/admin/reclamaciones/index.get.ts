import { db } from '~/server/db'
import { complaints } from '~/server/db/schema'

export default defineEventHandler(async () => {
  const items = await db.query.complaints.findMany({
    orderBy: (c, { desc }) => [desc(c.createdAt)],
  })

  return items.map(i => ({
    id: i.id,
    codigo: i.codigo,
    nombre: i.customerName,
    tipo: i.tipoReclamo,
    estado: i.estado,
    createdAt: i.createdAt,
  }))
})
