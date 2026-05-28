import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

function getS3BucketName() {
  const config = useRuntimeConfig()
  return String(config.s3Bucket ?? '').trim()
}

function getS3Region() {
  const config = useRuntimeConfig()
  return String(config.s3Region ?? '').trim()
}

export function buildPrivateImageUrl(key: string) {
  return `/api/media?key=${encodeURIComponent(key)}`
}

export function extractS3KeyFromUrl(rawUrl: string) {
  const bucket = getS3BucketName()
  if (!bucket || !rawUrl) return null

  let parsed: URL
  try {
    parsed = new URL(rawUrl)
  } catch {
    return null
  }

  const host = parsed.hostname.toLowerCase()
  const pathname = parsed.pathname.replace(/^\/+/, '')

  if (host === `${bucket}.s3.${getS3Region()}.amazonaws.com` || host === `${bucket}.s3.amazonaws.com`) {
    return decodeURIComponent(pathname)
  }

  const pathParts = pathname.split('/').filter(Boolean)
  if (host.startsWith('s3.') && pathParts[0] === bucket) {
    return decodeURIComponent(pathParts.slice(1).join('/'))
  }

  return null
}

export function normalizeStoredImageUrl(rawUrl: string) {
  const key = extractS3KeyFromUrl(rawUrl)
  return key ? buildPrivateImageUrl(key) : rawUrl
}

export async function getPrivateImageRedirectUrl(key: string) {
  const config = useRuntimeConfig()
  const bucket = String(config.s3Bucket ?? '').trim()
  const region = String(config.s3Region ?? '').trim()
  const accessKeyId = String(config.s3AccessKeyId ?? '').trim()
  const secretAccessKey = String(config.s3SecretAccessKey ?? '').trim()

  if (!bucket || !region || !accessKeyId || !secretAccessKey) {
    throw createError({ statusCode: 500, message: 'S3 no está configurado en el servidor' })
  }

  const s3 = new S3Client({
    region,
    credentials: { accessKeyId, secretAccessKey },
  })

  const command = new GetObjectCommand({ Bucket: bucket, Key: key })
  return getSignedUrl(s3, command, { expiresIn: 60 * 10 })
}
