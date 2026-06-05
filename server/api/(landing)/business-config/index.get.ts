import { db } from '~/server/db'
import { normalizeStoredImageUrl } from '~/server/utils/s3'

export default defineEventHandler(async () => {
  const config = await db.query.businessConfig.findFirst()
  if (!config) {
    throw createError({ statusCode: 404, message: 'Configuración no encontrada' })
  }

  // Construir y devolver un objeto plano serializable (evitar metadatos circulares)
  return {
    id: config.id,
    name: config.name,
    logoUrl: config.logoUrl ? normalizeStoredImageUrl(config.logoUrl) : null,
    whatsapp: config.whatsapp,
    address: config.address,
    plan: config.plan,
    socialLinks: config.socialLinks ? JSON.parse(config.socialLinks) : {},
    stockEnabled: !!config.stockEnabled,
    autoPaymentEnabled: !!config.autoPaymentEnabled,
    couponsEnabled: !!config.couponsEnabled,
    multiuserEnabled: !!config.multiuserEnabled,
    updatedAt: config.updatedAt,
  }
})
