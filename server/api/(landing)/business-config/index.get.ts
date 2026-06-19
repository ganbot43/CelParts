import { db } from '~/server/db'

export default defineEventHandler(async () => {
  const config = await db.query.businessConfig.findFirst()
  if (!config) {
    throw createError({ statusCode: 404, message: 'Configuración no encontrada' })
  }

  // Construir y devolver un objeto plano serializable (evitar metadatos circulares)
  return {
    id: config.id,
    name: config.name,
    ruc: config.ruc,
    email: config.email,
    logoUrl: config.logoUrl,
    whatsapp: config.whatsapp,
    address: config.address,
    plan: config.plan,
    enabledPaymentMethods: config.enabledPaymentMethods ? JSON.parse(config.enabledPaymentMethods) : [],
    limits: config.limits ? JSON.parse(config.limits) : {},
    socialLinks: config.socialLinks ? JSON.parse(config.socialLinks) : {},
    stockEnabled: !!config.stockEnabled,
    autoPaymentEnabled: !!config.autoPaymentEnabled,
    couponsEnabled: !!config.couponsEnabled,
    multiuserEnabled: !!config.multiuserEnabled,
    updatedAt: config.updatedAt,
  }
})
