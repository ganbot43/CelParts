import { getPrivateImageRedirectUrl } from '~/server/utils/s3'

export default defineEventHandler(async (event) => {
  const key = String(getQuery(event).key ?? '').trim()

  if (!key) {
    throw createError({ statusCode: 400, message: 'Falta la key de la imagen' })
  }

  const url = await getPrivateImageRedirectUrl(key)
  return sendRedirect(event, url, 302)
})
