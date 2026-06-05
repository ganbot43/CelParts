import 'dotenv/config'
import { db } from './index'
import * as schema from './schema'
import * as bcrypt from 'bcryptjs'
import slugifyLib from 'slugify'

function makeSlug(text: string): string {
  return slugifyLib(text, { lower: true, strict: true, locale: 'es' })
}

async function seed() {
  console.log('🌱 Iniciando seed de Arigumi (C2C Adultos Mayores)...')

  const hash = await bcrypt.hash('admin123', 10)

  // 1. BUSINESS CONFIG
  await db.insert(schema.businessConfig).values({
    id: 1,
    name: 'Arigumi',
    whatsapp: process.env.NUXT_PUBLIC_WHATSAPP ?? '+51940756166',
    plan: 'basic',
    socialLinks: JSON.stringify({ instagram: 'arigumi_pe', facebook: 'arigumipe' }),
  }).onDuplicateKeyUpdate({
    set: {
      name: 'Arigumi',
      whatsapp: process.env.NUXT_PUBLIC_WHATSAPP ?? '+51940756166',
    }
  }).execute()

  // 2. DATA DE USUARIOS DE PRUEBA
  // Abuela Clara
  await db.insert(schema.users).values({
    id: 1,
    name: 'Abuela Clara',
    email: 'clara@arigumi.pe',
    phone: '+51940756166',
    passwordHash: hash,
    role: 'vendedor_comprador',
    dni: '12345678',
    address: 'Miraflores, Lima',
  }).onDuplicateKeyUpdate({
    set: {
      name: 'Abuela Clara',
      role: 'vendedor_comprador',
      phone: '+51940756166',
      dni: '12345678',
      address: 'Miraflores, Lima'
    }
  }).execute()
  const usr_clara = 1

  // Don Ricardo
  await db.insert(schema.users).values({
    id: 2,
    name: 'Don Ricardo',
    email: 'ricardo@arigumi.pe',
    phone: '+51987654321',
    passwordHash: hash,
    role: 'vendedor_comprador',
    dni: '87654321',
    address: 'Cercado de Lima',
  }).onDuplicateKeyUpdate({
    set: {
      name: 'Don Ricardo',
      role: 'vendedor_comprador',
      phone: '+51987654321',
      dni: '87654321',
      address: 'Cercado de Lima'
    }
  }).execute()
  const usr_ricardo = 2

  // Administrador Global
  await db.insert(schema.users).values({
    id: 3,
    name: 'Administrador Global',
    email: 'admin@arigumi.pe',
    phone: '+51999999999',
    passwordHash: hash,
    role: 'superadmin',
  }).onDuplicateKeyUpdate({
    set: {
      name: 'Administrador Global',
      role: 'superadmin'
    }
  }).execute()
  // const usr_admin = 3

  // 3. TABLA DE CATEGORÍAS ARTESANALES
  const categories = [
    { id: 1, name: 'Tapetes y Carpetas', slug: 'tapetes', sortOrder: 1 },
    { id: 2, name: 'Amigurumis', slug: 'amigurumis', sortOrder: 2 },
    { id: 3, name: 'Mantas y Colchas', slug: 'mantas', sortOrder: 3 },
  ]
  for (const cat of categories) {
    await db.insert(schema.categories).values(cat).onDuplicateKeyUpdate({
      set: { name: cat.name, slug: cat.slug, sortOrder: cat.sortOrder }
    }).execute()
  }

  const cat_tapetes = 1
  const cat_amigurumis = 2
  const cat_mantas = 3

  // 4. TABLA DE PRODUCTOS (Ficha técnica C2C)
  // Amigurumi Oso "Beto" con Chalina Roja
  await db.insert(schema.products).values({
    id: 1,
    categoryId: cat_amigurumis,
    sellerId: usr_clara,
    name: 'Amigurumi Oso "Beto" con Chalina Roja',
    slug: makeSlug('Amigurumi Oso Beto con Chalina Roja'),
    price: 45.00,
    material: 'Lana de Alpaca Bebé',
    sizeLength: 30,
    sizeWidth: 20,
    sizeUnit: 'cm',
    offersPattern: 1,
    status: 'disponible',
    description: 'Hermoso osito tejido a crochet con lana de alpaca bebé. Incluye chalina roja removible.',
    stock: 1,
    isFeatured: 1,
    nuevoLanzamiento: 1,
  }).onDuplicateKeyUpdate({
    set: {
      categoryId: cat_amigurumis,
      sellerId: usr_clara,
      name: 'Amigurumi Oso "Beto" con Chalina Roja',
      price: 45.00,
      material: 'Lana de Alpaca Bebé',
      sizeLength: 30,
      sizeWidth: 20,
      sizeUnit: 'cm',
      offersPattern: 1,
      status: 'disponible',
      isFeatured: 1,
      nuevoLanzamiento: 1,
    }
  }).execute()

  await db.insert(schema.productImages).values({
    id: 1,
    productId: 1,
    url: 'https://picsum.photos/600/600?random=21',
    sortOrder: 0,
    isPrimary: 1,
  }).onDuplicateKeyUpdate({
    set: { url: 'https://picsum.photos/600/600?random=21' }
  }).execute()

  // Tapete Circular "Sol Cálido" de Girasoles
  await db.insert(schema.products).values({
    id: 2,
    categoryId: cat_tapetes,
    sellerId: usr_clara,
    name: 'Tapete Circular "Sol Cálido" de Girasoles',
    slug: makeSlug('Tapete Circular Sol Calido de Girasoles'),
    price: 85.00,
    material: 'Algodón 100% Orgánico',
    sizeLength: 80,
    sizeWidth: 80,
    sizeUnit: 'cm',
    offersPattern: 0,
    status: 'disponible',
    description: 'Tapete circular perfecto para la mesa de centro, tejido con hilos de algodón orgánico formando girasoles.',
    stock: 1,
    isFeatured: 1,
  }).onDuplicateKeyUpdate({
    set: {
      categoryId: cat_tapetes,
      sellerId: usr_clara,
      name: 'Tapete Circular "Sol Cálido" de Girasoles',
      price: 85.00,
      material: 'Algodón 100% Orgánico',
      sizeLength: 80,
      sizeWidth: 80,
      sizeUnit: 'cm',
      offersPattern: 0,
      status: 'disponible',
      isFeatured: 1,
    }
  }).execute()

  await db.insert(schema.productImages).values({
    id: 2,
    productId: 2,
    url: 'https://picsum.photos/600/600?random=22',
    sortOrder: 0,
    isPrimary: 1,
  }).onDuplicateKeyUpdate({
    set: { url: 'https://picsum.photos/600/600?random=22' }
  }).execute()

  // Alfombra de Sala "Pradera de Otoño"
  await db.insert(schema.products).values({
    id: 3,
    categoryId: cat_tapetes, // Usando tapetes para alfombra
    sellerId: usr_ricardo,
    name: 'Alfombra de Sala "Pradera de Otoño"',
    slug: makeSlug('Alfombra de Sala Pradera de Otono'),
    price: 140.00,
    material: 'Lana y Yute',
    sizeLength: 120,
    sizeWidth: 80,
    sizeUnit: 'cm',
    offersPattern: 1,
    status: 'disponible',
    description: 'Cálida alfombra de sala combinando lana gruesa y detalles en yute para mayor durabilidad.',
    stock: 1,
    isFeatured: 0,
    nuevoLanzamiento: 1,
  }).onDuplicateKeyUpdate({
    set: {
      categoryId: cat_tapetes,
      sellerId: usr_ricardo,
      name: 'Alfombra de Sala "Pradera de Otoño"',
      price: 140.00,
      material: 'Lana y Yute',
      sizeLength: 120,
      sizeWidth: 80,
      sizeUnit: 'cm',
      offersPattern: 1,
      status: 'disponible',
      isFeatured: 0,
      nuevoLanzamiento: 1,
    }
  }).execute()

  await db.insert(schema.productImages).values({
    id: 3,
    productId: 3,
    url: 'https://picsum.photos/600/600?random=23',
    sortOrder: 0,
    isPrimary: 1,
  }).onDuplicateKeyUpdate({
    set: { url: 'https://picsum.photos/600/600?random=23' }
  }).execute()

  // 5. TABLA DE BANNERS Y CONTENIDO GLOBAL (Gestión del Admin)
  await db.insert(schema.banners).values({
    id: 1,
    imageUrl: 'https://picsum.photos/1200/400?random=1',
    title: 'Uniendo generaciones paso a paso, hecho a mano y con el corazón.',
    subtitle: 'Arigumi es un espacio cálido y sin comisiones diseñado especialmente para que adultos mayores compren y vendan sus tapetes, mantas y bordados directamente a través de WhatsApp.',
    isActive: 1,
    sortOrder: 1,
  }).onDuplicateKeyUpdate({
    set: {
      title: 'Uniendo generaciones paso a paso, hecho a mano y con el corazón.',
      subtitle: 'Arigumi es un espacio cálido y sin comisiones diseñado especialmente para que adultos mayores compren y vendan sus tapetes, mantas y bordados directamente a través de WhatsApp.'
    }
  }).execute()

  // 6. GESTIÓN DE RECLAMOS (Muestra para testing del Admin)
  await db.insert(schema.complaints).values({
    id: 1,
    codigo: 'REC-2026-0001',
    customerName: 'María López',
    tipoDocumento: 'DNI',
    numeroDocumento: '76543210',
    direccion: 'Av. Las Camelias 123, San Isidro',
    telefono: '+51988888888',
    email: 'maria@example.com',
    tipoBien: 'Producto',
    descripcionBien: 'Amigurumi Oso "Beto" con Chalina Roja',
    monto: 45.00,
    tipoReclamo: 'Reclamo',
    descripcion: 'Quisiera saber si pueden tejer la chalina en color azul en lugar de roja para una próxima compra.',
    pedido: 'N/A', // Reclamo pre-compra o sugerencia
    estado: 'pendiente',
  }).onDuplicateKeyUpdate({
    set: {
      estado: 'pendiente',
      customerName: 'María López'
    }
  }).execute()

  console.log('✅ Seed completado para Arigumi.')
  console.log('📧 Administrador: admin@arigumi.pe / admin123')
  console.log('📧 Vendedor (Clara): clara@arigumi.pe / admin123')
  console.log('📧 Vendedor (Ricardo): ricardo@arigumi.pe / admin123')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Error en seed:', err)
  process.exit(1)
})