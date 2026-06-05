import { db } from '~/server/db'
import { complaints } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { normalizeStoredImageUrl } from '~/server/utils/s3'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (!id) throw createError({ statusCode: 400, message: 'ID inválido' })

  const r = await db.query.complaints.findFirst({ where: eq(complaints.id, id) })
  if (!r) throw createError({ statusCode: 404, message: 'Reclamo no encontrado' })

  if (r.archivoUrl) {
    r.archivoUrl = normalizeStoredImageUrl(r.archivoUrl)
  }

  return r
})
