import 'dotenv/config'
import { db } from './index'
import * as schema from './schema'
import bcrypt from 'bcryptjs'
import slugifyLib from 'slugify'

function makeSlug(text: string): string {
  return slugifyLib(text, { lower: true, strict: true, locale: 'es' })
}

async function insertAndGetId<TTable>(table: TTable, values: Record<string, unknown> | Record<string, unknown>[]) {
  const [header] = await db.insert(table as never).values(values as never).execute()
  const insertId = Number((header as { insertId?: number }).insertId ?? 0)
  if (!insertId) {
    throw new Error('No se pudo obtener insertId durante el seed')
  }
  return insertId
}

function isMissingTableError(error: any): boolean {
  return error?.code === 'ER_NO_SUCH_TABLE' || /doesn't exist/i.test(String(error?.message ?? ''))
}

async function clearSeedData() {
  const tables = [
    schema.productImages,
    schema.orderStatusLogs,
    schema.orderItems,
    schema.orders,
    schema.complaints,
    schema.products,
    schema.subcategories,
    schema.categories,
    schema.paymentMethods,
    schema.banners,
    schema.users,
    schema.businessConfig,
  ]

  for (const table of tables) {
    try {
      await db.delete(table as never).execute()
    } catch (error: any) {
      if (isMissingTableError(error)) {
        throw new Error(
          'La base de datos no tiene las tablas creadas. Ejecuta primero npm run db:migrate o ./reset-db.sh antes de npm run db:seed.'
        )
      }
      throw error
    }
  }
}

async function seed() {
  console.log('🌱 Iniciando seed de Joymar Utensilios...')

  await clearSeedData()

  // 1. business_config
  await db.insert(schema.businessConfig).values({
    name:        'Joymar Utensilios',
    whatsapp:    process.env.NUXT_PUBLIC_WHATSAPP ?? '+51996111303',
    plan:        'basic',
    socialLinks: JSON.stringify({ instagram: 'joymarutensilios', facebook: 'joymarutensilios', tiktok: 'joymarutensilios' }),
  }).execute()

  // 2. users
  const hash = await bcrypt.hash('admin123', 10)
  await db.insert(schema.users).values([
    { name: 'Super Admin', email: 'joymar.peru@gmail.com', passwordHash: hash, role: 'superadmin' },
    { name: 'Admin Joymar', email: 'joymar.peru+admin@gmail.com', passwordHash: hash, role: 'admin' },
  ]).execute()

  // 3. categories de utensilios de cocina
  const cats = [
    { name: 'Ollas y Sartenes',        slug: makeSlug('Ollas y Sartenes') },
    { name: 'Utensilios de Cocina',    slug: makeSlug('Utensilios de Cocina') },
    { name: 'Accesorios de Cocina',    slug: makeSlug('Accesorios de Cocina') },
    { name: 'Menaje de Hogar',         slug: makeSlug('Menaje de Hogar') },
  ]

  const categoryIds: number[] = []
  const subcategoryIds: number[] = []
  for (const [i, cat] of cats.entries()) {
    const categoryId = await insertAndGetId(schema.categories, { ...cat, sortOrder: i })
    categoryIds.push(categoryId)

    const subcategoryPremiumId = await insertAndGetId(schema.subcategories, { categoryId, name: `${cat.name} Premium`, slug: `${cat.slug}-premium`, sortOrder: 0 })
    const subcategoryStandardId = await insertAndGetId(schema.subcategories, { categoryId, name: `${cat.name} Estándar`, slug: `${cat.slug}-estandar`, sortOrder: 1 })
    subcategoryIds.push(subcategoryPremiumId, subcategoryStandardId)
  }

  // 4. payment_methods
  await db.insert(schema.paymentMethods).values([
    { type: 'yape',          label: 'Yape',                          isActive: 1, sortOrder: 1 },
    { type: 'plin',          label: 'Plin',                          isActive: 1, sortOrder: 2 },
    { type: 'bank_transfer', label: 'Transferencia Bancaria (BCP)',   isActive: 1, sortOrder: 3,
      accountName: 'Joymar Utensilios SAC', accountNumber: '123-456789-0-12' },
  ]).execute()

  // 5. banners
  await db.insert(schema.banners).values([
    { imageUrl: 'https://picsum.photos/1200/400?random=10', sortOrder: 0, isActive: 1 },
    { imageUrl: 'https://picsum.photos/1200/400?random=11', sortOrder: 1, isActive: 1 },
  ]).execute()

  // 6. products (12 productos de utensilios de cocina)
  const productNames = [
    'Set de Ollas Premium 5 Piezas', 'Sartén Antiadherente Profesional', 'Juego de Cucharas de Madera',
    'Tabla de Corte Profesional Bamboo', 'Coladores y Cernidores Juego', 'Cuchillos de Acero Inoxidable Set',
    'Set de Bowls de Almacenamiento', 'Batidora de Mano Profesional', 'Tabla de Corte de Vidrio Templado',
    'Set de Peladoras Multiusos', 'Recipientes de Vidrio Templado 6 piezas', 'Set Utensilios Cocina Rojo Premium',
  ]

  for (const [i, name] of productNames.entries()) {
    const slug = makeSlug(name)
    const productId = await insertAndGetId(schema.products, {
      categoryId:    categoryIds[i % categoryIds.length],
      subcategoryId: subcategoryIds[i % subcategoryIds.length],
      name,
      slug,
      description:   `${name}: producto de cocina de alta calidad, previamente probado y certificado. Durabilidad garantizada para tu hogar.`,
      price:         parseFloat((Math.random() * 180 + 30).toFixed(2)),
      stock:         50,
      isFeatured:    i < 4 ? 1 : 0,
      isActive:      1,
    })

    await db.insert(schema.productImages).values({
      productId,
      url:       `https://picsum.photos/600/600?random=${productId + 20}`,
      sortOrder: 0,
      isPrimary: 1,
    }).execute()
  }

  console.log('✅ Seed completado.')
  console.log('📧 Admin: joymar.peru@gmail.com / admin123')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Error en seed:', err)
  process.exit(1)
})
