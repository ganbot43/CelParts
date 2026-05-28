import { db } from '~/server/db'
import { complaints } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { validateBody } from '~/server/utils/validate'

const schema = z.object({
  estado: z.enum(['pendiente','en_proceso','respondido','cerrado']).optional(),
  respuesta: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (!id) throw createError({ statusCode: 400, message: 'ID inválido' })

  const body = await readBody(event)
  const data = validateBody(schema, body)

  const updateData: any = {}
  if (data.estado) updateData.estado = data.estado
  if (typeof data.respuesta === 'string') {
    updateData.respuesta = data.respuesta
    updateData.fechaRespuesta = new Date().toISOString()
  }

  await db.update(complaints).set(updateData).where(eq(complaints.id, id)).execute()

  return { status: 200, message: 'Actualizado' }
})
