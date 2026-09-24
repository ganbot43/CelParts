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
  console.log('🌱 Iniciando seed de Cel Parts...')

  await clearSeedData()

  // 1. business_config
  await db.insert(schema.businessConfig).values({
    name:        'Cel Parts',
    whatsapp:    process.env.NUXT_PUBLIC_WHATSAPP ?? '+51923821520',
    plan:        'basic',
    socialLinks: JSON.stringify({ instagram: 'celparts', facebook: 'celparts', tiktok: 'celparts' }),
  }).execute()

  // 2. users
  const hash = await bcrypt.hash('admin123', 10)
  await db.insert(schema.users).values([
    { name: 'Gerente de tienda',    email: 'owner@celparts.com', passwordHash: hash, role: 'superadmin' },
    { name: 'Encargado de tienda', email: 'admin@celparts.com',  passwordHash: hash, role: 'admin' },
  ]).execute()

  // 3. categorías de repuestos y accesorios de celulares
  const cats = [
    { name: 'Pantallas y Displays',      slug: makeSlug('Pantallas y Displays') },
    { name: 'Baterías y Cargadores',     slug: makeSlug('Baterías y Cargadores') },
    { name: 'Carcasas y Protectores',    slug: makeSlug('Carcasas y Protectores') },
    { name: 'Accesorios y Cables',       slug: makeSlug('Accesorios y Cables') },
  ]

  const categoryIds: number[] = []
  const subcategoryIds: number[] = []
  for (const [i, cat] of cats.entries()) {
    const categoryId = await insertAndGetId(schema.categories, { ...cat, sortOrder: i })
    categoryIds.push(categoryId)

    const subcategoryPremiumId  = await insertAndGetId(schema.subcategories, { categoryId, name: `${cat.name} Premium`,   slug: `${cat.slug}-premium`,  sortOrder: 0 })
    const subcategoryStandardId = await insertAndGetId(schema.subcategories, { categoryId, name: `${cat.name} Estándar`,  slug: `${cat.slug}-estandar`, sortOrder: 1 })
    subcategoryIds.push(subcategoryPremiumId, subcategoryStandardId)
  }

  // 4. payment_methods
  await db.insert(schema.paymentMethods).values([
    { type: 'yape',          label: 'Yape',                         isActive: 1, sortOrder: 1 },
    { type: 'plin',          label: 'Plin',                         isActive: 1, sortOrder: 2 },
    { type: 'bank_transfer', label: 'Transferencia Bancaria (BCP)', isActive: 1, sortOrder: 3,
      accountName: 'Cel Parts SAC', accountNumber: '123-456789-0-12' },
  ]).execute()

  // 5. banners
  await db.insert(schema.banners).values([
    /* Imágenes de relleno de picsum: loremflickr dejó de servir peticiones
       anónimas (responde 401) y toda la portada quedaba con recuadros
       rotos. Sustituir por las imágenes reales desde /admin/banners. */
    {
      imageUrl: 'https://picsum.photos/seed/celparts-banner-1/1680/720',
      linkUrl: '/productos',
      eyebrow: 'Repuestos con garantía',
      title: 'La pieza correcta, a la primera',
      subtitle: 'Catálogo ordenado por modelo, con el stock tal como está.',
      ctaLabel: 'Ver catálogo',
      align: 'left',
      sortOrder: 0,
      isActive: 1,
    },
    {
      imageUrl: 'https://picsum.photos/seed/celparts-banner-2/1680/720',
      linkUrl: '/productos?nuevoLanzamiento=1',
      eyebrow: 'Novedades',
      title: 'Lo último que entró al almacén',
      subtitle: 'Pantallas, baterías y accesorios de los equipos que más se reparan.',
      ctaLabel: 'Ver novedades',
      align: 'left',
      sortOrder: 1,
      isActive: 1,
    },
  ]).execute()

  // 6. products (12 productos de repuestos y accesorios de celulares)
  const productNames = [
    'Pantalla LCD iPhone 13 Original',
    'Pantalla OLED Samsung S22 Premium',
    'Batería iPhone 12 3110mAh',
    'Batería Samsung A52 4500mAh',
    'Cargador Rápido 65W USB-C',
    'Cable USB-C a Lightning 1m Trenzado',
    'Carcasa iPhone 14 Pro Antigolpes',
    'Carcasa Samsung S23 Ultra Transparente',
    'Vidrio Templado iPhone 15 Full Cover',
    'Kit Herramientas Reparación Celular 20 piezas',
    'Auriculares Bluetooth 5.0 In-Ear',
    'Cargador Inalámbrico 15W MagSafe Compatible',
  ]

  for (const [i, name] of productNames.entries()) {
    const slug = makeSlug(name)
    const productId = await insertAndGetId(schema.products, {
      categoryId:    categoryIds[i % categoryIds.length],
      subcategoryId: subcategoryIds[i % subcategoryIds.length],
      name,
      slug,
      description:   `${name}: repuesto o accesorio de alta calidad, compatible garantizado y probado. Ideal para técnicos y usuarios finales.`,
      price:         parseFloat((Math.random() * 180 + 15).toFixed(2)),
      stock:         Math.floor(Math.random() * 60) + 10,
      isFeatured:    i < 4 ? 1 : 0,
      isActive:      1,
    })

    await db.insert(schema.productImages).values({
      productId,
      url:       `https://picsum.photos/seed/celparts-prod-${productId}/600/600`,
      sortOrder: 0,
      isPrimary: 1,
    }).execute()
  }

  console.log('✅ Seed completado.')
  console.log('📧 Superadmin: owner@celparts.com / admin123')
  console.log('📧 Admin:      admin@celparts.com / admin123')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Error en seed:', err)
  process.exit(1)
})