import { db } from '~/server/db'
import { insertAndGetId } from '~/server/db/mysql'
import { complaints } from '~/server/db/schema'
import { validateBody } from '~/server/utils/validate'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { extname } from 'path'
import { randomUUID } from 'crypto'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { writeFileSync, mkdirSync } from 'fs'
import { dirname } from 'path'

const schema = z.object({
  nombre_completo: z.string().min(2),
  tipo_documento: z.enum(['DNI', 'CE', 'Pasaporte']),
  numero_documento: z.string().min(3),
  direccion: z.string().optional(),
  telefono: z.string().min(6),
  email: z.string().email(),

  tipo_bien: z.enum(['Producto', 'Servicio']),
  descripcion_bien: z.string().min(3),
  monto_reclamado: z.number().optional(),

  tipo_reclamo: z.enum(['Reclamo', 'Queja']),
  descripcion: z.string().min(5),
  pedido_cliente: z.string().min(1),

  declara: z.boolean().refine(v => v === true, { message: 'Debe declarar que la información es verídica' }),
})

export default defineEventHandler(async (event) => {
  try {
    const contentType = getRequestHeader(event, 'content-type') || ''
    let data: any = {}
    let fileUrl: string | undefined

    if (contentType.startsWith('multipart/')) {
      const parts = await readMultipartFormData(event)

      // Map text fields
      for (const part of parts || []) {
        if (!part.name || part.name === 'adjunto') continue
        const value = part.data?.toString('utf8') || ''
        if (part.name === 'declara') {
          data[part.name] = value === 'true'
        } else {
          data[part.name] = value
        }
      }

      const file = (parts || []).find((part) => part.name === 'adjunto' && part.filename)
      if (file && file.data && file.data.length > 0) {
        // Validate size (limit 5MB)
        const MAX = 5 * 1024 * 1024
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
        if (file.data.length > MAX) throw createError({ statusCode: 400, message: 'Adjunto demasiado grande (max 5MB)' })
        if (!file.type || !allowed.includes(file.type)) throw createError({ statusCode: 400, message: 'Tipo de archivo no permitido' })

        const config = useRuntimeConfig()
        const bucket = config.s3Bucket
        if (bucket && config.s3Region && config.s3AccessKeyId && config.s3SecretAccessKey) {
          // upload to S3 using root prefix pattern
          const s3 = new S3Client({ region: config.s3Region, credentials: { accessKeyId: config.s3AccessKeyId, secretAccessKey: config.s3SecretAccessKey } })
          const ext = extname(file.filename || '') || (file.type === 'application/pdf' ? '.pdf' : '.jpg')
          const rawRootPrefix = config.s3RootPrefix
          const rootPrefix = String(rawRootPrefix).replace(/^\/+|\/+$/g, '')
          const now = new Date()
          const year = now.getUTCFullYear()
          const month = String(now.getUTCMonth() + 1).padStart(2, '0')
          const day = String(now.getUTCDate()).padStart(2, '0')
          const filename = `${rootPrefix}/complaints/${year}/${month}/${day}/${randomUUID()}${ext}`
          const buffer = file.data
          const cmd = new PutObjectCommand({ Bucket: bucket, Key: filename, Body: buffer, ContentType: file.type })
          await s3.send(cmd)
          fileUrl = `/api/media?key=${encodeURIComponent(filename)}`
        } else {
          // fallback: save locally to ./public/uploads/complaints
          const buffer = file.data
          const ext = extname(file.filename || '') || (file.type === 'application/pdf' ? '.pdf' : '.jpg')
          const dir = './public/uploads/complaints'
          mkdirSync(dir, { recursive: true })
          const filename = `${Date.now()}-${randomUUID()}${ext}`
          const p = `${dir}/${filename}`
          writeFileSync(p, buffer)
          fileUrl = `/uploads/complaints/${filename}`
        }
      }

    } else {
      const body = await readBody(event)
      data = body
    }

    // Convert monto_reclamado if present
    if (typeof data.monto_reclamado === 'string' && data.monto_reclamado.trim() !== '') {
      const n = Number(data.monto_reclamado)
      if (!isNaN(n)) data.monto_reclamado = n
    }

    // Validate
    const valid = validateBody(schema, data)

    // Insert row (initially without codigo)
    const id = await insertAndGetId(complaints, {
      codigo: '',
      customerName: valid.nombre_completo,
      tipoDocumento: valid.tipo_documento,
      numeroDocumento: valid.numero_documento,
      direccion: valid.direccion ?? null,
      telefono: valid.telefono,
      email: valid.email,
      tipoBien: valid.tipo_bien,
      descripcionBien: valid.descripcion_bien,
      monto: typeof valid.monto_reclamado === 'number' ? valid.monto_reclamado : null,
      tipoReclamo: valid.tipo_reclamo,
      descripcion: valid.descripcion,
      pedido: valid.pedido_cliente,
      archivoUrl: fileUrl ?? null,
      estado: 'pendiente',
    })
    const year = new Date().getFullYear()
    const codigo = `REC-${year}-${id.toString().padStart(6, '0')}`
    await db.update(complaints).set({ codigo }).where(eq(complaints.id, id)).execute()

    return {
      status: 200,
      message: 'Reclamo registrado correctamente',
      codigo,
      id,
      plazo_respuesta: '15 días hábiles'
    }

  } catch (err: any) {
    console.error('[reclamaciones.post]', err)
    throw createError({ statusCode: err.statusCode ?? 500, statusMessage: err.statusMessage ?? err.message ?? 'Error interno' })
  }
})
