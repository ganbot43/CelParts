import { extname } from 'path'
import { randomUUID } from 'crypto'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { buildPrivateImageUrl } from '~/server/utils/s3'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session?.user) throw createError({ statusCode: 401, message: 'No autorizado' })

  const parts = await readMultipartFormData(event)
  const file = parts?.find((part) => part.name === 'file')

  if (!file) throw createError({ statusCode: 400, message: 'No se recibió archivo' })

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!file.type || !allowedTypes.includes(file.type)) {
    throw createError({ statusCode: 400, message: 'Tipo de archivo no permitido (jpg, png, webp)' })
  }




  const config = useRuntimeConfig()

  // Expected runtime config / .env variables:
  // S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_ROOT_PREFIX
  const bucket = config.s3Bucket
  const region = config.s3Region
  const accessKeyId = config.s3AccessKeyId
  const secretAccessKey = config.s3SecretAccessKey
  const rawRootPrefix = config.s3RootPrefix
  const rootPrefix = String(rawRootPrefix).replace(/^\/+|\/+$/g, '')

  if (!bucket || !region || !accessKeyId || !secretAccessKey) {
    throw createError({ statusCode: 500, message: 'S3 no está configurado en el servidor' })
  }

  const s3 = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })

  const ext = extname(file.filename || '') || '.jpg'
  const filename = `${randomUUID()}${ext}`
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = String(now.getUTCMonth() + 1).padStart(2, '0')
  const day = String(now.getUTCDate()).padStart(2, '0')

  const folderPart = parts?.find((part) => part.name === 'folder')
  const folderStr = folderPart ? folderPart.data.toString().replace(/[^a-zA-Z0-9_-]/g, '') : 'general'

  const key = rootPrefix
    ? `${rootPrefix}/${folderStr}/${year}/${month}/${day}/${filename}`
    : `${folderStr}/${year}/${month}/${day}/${filename}`

  const buffer = file.data

  const putCmd = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: file.type,
  })

  try {
    await s3.send(putCmd)
  } catch (err: any) {
    console.error('S3 upload error:', {
      message: err?.message,
      code: err?.Code || err?.code,
      name: err?.name,
      region,
      bucket,
      key,
    })
    throw createError({
      statusCode: 500,
      message: `Error subiendo a S3: ${err?.message || err?.code || 'desconocido'}`
    })
  }

  return { url: buildPrivateImageUrl(key) }
})
