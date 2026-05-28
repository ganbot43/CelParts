# SISTEMA ECOMMERCE SMART CS — ESPECIFICACIÓN TÉCNICA COMPLETA
# Stack: Nuxt 3 + Vue 3 + SQLite + Drizzle ORM + Nuxt UI

---

## STACK TECNOLÓGICO

- Runtime: Node.js 20 LTS (en VPS Linux, servido con PM2)
- Framework: Nuxt 3 (última versión estable, modo SSR)
- UI Components: Nuxt UI v2 (basado en Tailwind + Headless UI)
- Estilos: TailwindCSS (incluido con Nuxt UI)
- Estado global: Pinia + pinia-plugin-persistedstate
- Base de datos: SQLite (archivo local en el VPS)
- ORM: Drizzle ORM (drizzle-orm/better-sqlite3)
- Driver SQLite: better-sqlite3 (síncrono, ideal para Nuxt server)
- Auth: nuxt-auth-utils (sesiones con cookies httpOnly firmadas)
- Validación: zod
- HTTP: $fetch nativo de Nuxt + useFetch / useAsyncData
- Upload de imágenes: bucket s3 aws
- Deploy: PM2 + Nginx reverse proxy en VPS Linux

## ROLES Y ALCANCE

- `superadmin`: configura todo el negocio, administra usuarios, productos, categorías, subcategorías, banners, métodos de pago, límites y parámetros globales.
- `admin`: gestiona pedidos y catálogo operativo, pero no puede cambiar la configuración global ni los límites del negocio.
- Las pasarelas activas para checkout se controlan desde la configuración del negocio, no desde un enum fijo.
- Si una pasarela como `culqi` está habilitada, el checkout debe mostrarla como opción disponible.
- Los límites de usuarios, productos, categorías y subcategorías deben ser configurables por `superadmin`.

---

## INSTALACIÓN INICIAL

```bash
npx nuxi@latest init smartcs
cd smartcs

# Dependencias principales
npm install drizzle-orm better-sqlite3
npm install -D drizzle-kit @types/better-sqlite3

# Nuxt modules
npx nuxi module add ui
npx nuxi module add @pinia/nuxt
npm install pinia-plugin-persistedstate @pinia/nuxt

# Auth y validación
npm install nuxt-auth-utils zod bcryptjs
npm install -D @types/bcryptjs

# Utilidades
npm install slugify
```

---

## ESTRUCTURA DE CARPETAS

```
smartcs/
├── app.vue
├── assets/css/main.css
├── components/
│   ├── admin/
│   │   ├── AdminSidebar.vue
│   │   ├── AdminTopbar.vue
│   │   ├── OrderStatusBadge.vue
│   │   ├── OrderStatusTimeline.vue
│   │   └── DataTable.vue
│   ├── catalog/
│   │   ├── ProductCard.vue
│   │   ├── ProductGrid.vue
│   │   └── CatalogFilters.vue
│   ├── cart/
│   │   ├── CartDrawer.vue
│   │   ├── CartItem.vue
│   │   └── CartSummary.vue
│   ├── checkout/
│   │   ├── CheckoutForm.vue
│   │   └── PaymentMethodSelector.vue
│   └── ui/
│       ├── AppBanner.vue
│       └── WhatsLandingAppButton.vue
├── composables/
│   ├── useCart.ts
│   ├── useBusinessConfig.ts
│   └── useFormatPrice.ts
├── layouts/
│   ├── default.vue
│   └── admin.vue
├── middleware/
│   ├── auth.ts
│   └── guest.ts
├── pages/
│   ├── index.vue
│   ├── catalogo/
│   │   ├── index.vue
│   │   └── [slug].vue
│   ├── carrito.vue
│   ├── checkout.vue
│   ├── pedido/[code].vue
│   ├── login.vue
│   └── admin/
│       ├── index.vue
│       ├── productos/
│       │   ├── index.vue
│       │   ├── crear.vue
│       │   └── [id]/editar.vue
│       ├── categorias/index.vue
│       ├── pedidos/
│       │   ├── index.vue
│       │   └── [id].vue
│       ├── metodos-pago/index.vue
│       ├── banners/index.vue
│       └── configuracion/index.vue
├── server/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login.post.ts
│   │   │   ├── logout.post.ts
│   │   │   └── me.get.ts
│   │   ├── business-config/
│   │   │   ├── index.get.ts
│   │   │   └── index.put.ts
│   │   ├── categories/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   ├── [id].put.ts
│   │   │   └── [id].delete.ts
│   │   ├── subcategories/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   ├── [id].put.ts
│   │   │   └── [id].delete.ts
│   │   ├── products/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   ├── [slug].get.ts
│   │   │   ├── [id].put.ts
│   │   │   └── [id].delete.ts
│   │   ├── orders/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   ├── [code].get.ts
│   │   │   └── [id]/status.put.ts
│   │   ├── payment-methods/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   ├── [id].put.ts
│   │   │   └── [id].delete.ts
│   │   ├── banners/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   ├── [id].put.ts
│   │   │   └── [id].delete.ts
│   │   └── upload/
│   │       └── image.post.ts
│   ├── db/
│   │   ├── index.ts
│   │   ├── schema.ts
│   │   └── seed.ts
│   ├── middleware/
│   │   └── admin-guard.ts
│   └── utils/
│       ├── validate.ts
│       ├── orderCode.ts
│       └── slugify.ts
├── stores/
│   ├── cart.ts
│   └── auth.ts
├── types/
│   └── index.ts
├── drizzle.config.ts
├── nuxt.config.ts
├── .env
└── ecosystem.config.cjs   ← configuración PM2
```

---

## CONFIGURACIÓN PRINCIPAL

- `superadmin` administra esta sección completa.
- `admin` no puede editar configuración global del negocio.
- La sección de métodos de pago debe permitir activar/desactivar pasarelas por negocio.
- El checkout consume esa configuración y lista solo métodos activos.
- Los límites del sistema deben vivir en configuración del negocio para poder restringir usuarios, productos, categorías y subcategorías.

### `nuxt.config.ts`
```typescript
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    'nuxt-auth-utils',
  ],
  pinia: {
    storesDirs: ['./stores/**'],
  },
  runtimeConfig: {
    sessionPassword: process.env.NUXT_SESSION_PASSWORD ?? '',
    dbPath: process.env.DB_PATH ?? './data/smartcs.db',
    s3Bucket: process.env.S3_BUCKET,
    s3Region: process.env.S3_REGION,
    s3AccessKeyId: process.env.S3_ACCESS_KEY_ID,
    s3SecretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    projectName: process.env.PROJECT_NAME ?? 'joymar_utensilios',
    public: {
      appName:  process.env.NUXT_PUBLIC_APP_NAME ?? 'SMART CS',
      whatsapp: process.env.NUXT_PUBLIC_WHATSAPP ?? '',
    },
  },
  ui: {
    global: true,
  },
})
```

### `.env`
```env
NUXT_SESSION_PASSWORD=una-clave-secreta-de-al-menos-32-caracteres-aqui
DB_PATH=./data/smartcs.db
S3_BUCKET=your-bucket-name
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=your-access-key-id
S3_SECRET_ACCESS_KEY=your-secret-access-key
PROJECT_NAME=joymar_utensilios
NUXT_PUBLIC_APP_NAME="Mi Tienda"
NUXT_PUBLIC_WHATSAPP="+51996111303"
```

### `drizzle.config.ts`
```typescript
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema:    './server/db/schema.ts',
  out:       './server/db/migrations',
  dialect:   'sqlite',
  dbCredentials: {
    url: process.env.DB_PATH ?? './data/smartcs.db',
  },
})
```

---

## BASE DE DATOS — ESQUEMA COMPLETO

### `server/db/schema.ts`

```typescript
import {
  sqliteTable, integer, text, real, blob
} from 'drizzle-orm/sqlite-core'
import { relations, sql } from 'drizzle-orm'

// ─── NOTAS SQLite ───────────────────────────────────────────────
// - No hay tipo BOOLEAN nativo → usar integer (0/1)
// - No hay DECIMAL nativo → usar real para precios
// - No hay ENUM nativo → validar con zod en server routes
// - AUTOINCREMENT se declara como .primaryKey()
// - Timestamps como text en formato ISO (defaultNow via sql`(datetime('now'))`)
// ────────────────────────────────────────────────────────────────

// 1. business_config — siempre 1 sola fila
export const businessConfig = sqliteTable('business_config', {
  id:                 integer('id').primaryKey({ autoIncrement: true }),
  name:               text('name').notNull(),
  logoUrl:            text('logo_url'),
  whatsapp:           text('whatsapp').notNull(),
  address:            text('address'),
  plan:               text('plan', { enum: ['basic','intermediate','advanced'] })
                        .notNull().default('basic'),
  enabledPaymentMethods: text('enabled_payment_methods'),  // JSON: ['yape','plin','culqi',...]
  limits:             text('limits'),                     // JSON con topes de usuarios/productos/categorías/subcategorías
  socialLinks:        text('social_links'),           // JSON serializado
  stockEnabled:       integer('stock_enabled', { mode: 'boolean' }).notNull().default(false),
  autoPaymentEnabled: integer('auto_payment_enabled', { mode: 'boolean' }).notNull().default(false),
  couponsEnabled:     integer('coupons_enabled', { mode: 'boolean' }).notNull().default(false),
  multiuserEnabled:   integer('multiuser_enabled', { mode: 'boolean' }).notNull().default(false),
  updatedAt:          text('updated_at').default(sql`(datetime('now'))`),
})

// 2. users
export const users = sqliteTable('users', {
  id:           integer('id').primaryKey({ autoIncrement: true }),
  name:         text('name').notNull(),
  email:        text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role:         text('role', { enum: ['superadmin','admin'] }).notNull().default('admin'),
  isActive:     integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt:    text('created_at').default(sql`(datetime('now'))`),
})

// 3. categories
export const categories = sqliteTable('categories', {
  id:        integer('id').primaryKey({ autoIncrement: true }),
  name:      text('name').notNull(),
  slug:      text('slug').notNull().unique(),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive:  integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
})

// 4. subcategories
export const subcategories = sqliteTable('subcategories', {
  id:         integer('id').primaryKey({ autoIncrement: true }),
  categoryId: integer('category_id').notNull()
                .references(() => categories.id, { onDelete: 'cascade' }),
  name:       text('name').notNull(),
  slug:       text('slug').notNull().unique(),
  sortOrder:  integer('sort_order').notNull().default(0),
  isActive:   integer('is_active', { mode: 'boolean' }).notNull().default(true),
})

// 5. products
export const products = sqliteTable('products', {
  id:            integer('id').primaryKey({ autoIncrement: true }),
  categoryId:    integer('category_id')
                   .references(() => categories.id, { onDelete: 'set null' }),
  subcategoryId: integer('subcategory_id')
                   .references(() => subcategories.id, { onDelete: 'set null' }),
  name:          text('name').notNull(),
  slug:          text('slug').notNull().unique(),
  description:   text('description'),
  price:         real('price').notNull(),
  stock:         integer('stock').notNull().default(0),
  trackStock:    integer('track_stock', { mode: 'boolean' }).notNull().default(false),
  isFeatured:    integer('is_featured', { mode: 'boolean' }).notNull().default(false),
  isActive:      integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt:     text('created_at').default(sql`(datetime('now'))`),
  updatedAt:     text('updated_at').default(sql`(datetime('now'))`),
})

// 6. product_images
export const productImages = sqliteTable('product_images', {
  id:        integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id').notNull()
               .references(() => products.id, { onDelete: 'cascade' }),
  url:       text('url').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  isPrimary: integer('is_primary', { mode: 'boolean' }).notNull().default(false),
})

// 7. payment_methods
export const paymentMethods = sqliteTable('payment_methods', {
  id:            integer('id').primaryKey({ autoIncrement: true }),
  type:          text('type').notNull(), // provider key configurable: yape, plin, bank_transfer, culqi, mercado_pago, etc.
  label:         text('label').notNull(),
  qrUrl:         text('qr_url'),
  accountNumber: text('account_number'),
  accountName:   text('account_name'),
  isActive:      integer('is_active', { mode: 'boolean' }).notNull().default(true),
  sortOrder:     integer('sort_order').notNull().default(0),
})

// 8. orders
export const orders = sqliteTable('orders', {
  id:                integer('id').primaryKey({ autoIncrement: true }),
  orderCode:         text('order_code').notNull().unique(),
  paymentMethodId:   integer('payment_method_id')
                       .references(() => paymentMethods.id, { onDelete: 'set null' }),
  customerName:      text('customer_name').notNull(),
  customerPhone:     text('customer_phone'),
  customerAddress:   text('customer_address'),
  customerReference: text('customer_reference'),
  customerNotes:     text('customer_notes'),
  subtotal:          real('subtotal').notNull(),
  total:             real('total').notNull(),
  voucherUrl:        text('voucher_url'),
  status:            text('status', {
                       enum: [
                         'pending',
                         'voucher_sent',
                         'payment_validated',
                         'in_preparation',
                         'delivered',
                         'cancelled',
                       ]
                     }).notNull().default('pending'),
  createdAt:         text('created_at').default(sql`(datetime('now'))`),
  updatedAt:         text('updated_at').default(sql`(datetime('now'))`),
})

// 9. order_items
export const orderItems = sqliteTable('order_items', {
  id:          integer('id').primaryKey({ autoIncrement: true }),
  orderId:     integer('order_id').notNull()
                 .references(() => orders.id, { onDelete: 'cascade' }),
  productId:   integer('product_id')
                 .references(() => products.id, { onDelete: 'set null' }),
  productName: text('product_name').notNull(),   // snapshot al momento del pedido
  unitPrice:   real('unit_price').notNull(),      // snapshot al momento del pedido
  quantity:    integer('quantity').notNull(),
  subtotal:    real('subtotal').notNull(),
})

// 10. order_status_logs
export const orderStatusLogs = sqliteTable('order_status_logs', {
  id:        integer('id').primaryKey({ autoIncrement: true }),
  orderId:   integer('order_id').notNull()
               .references(() => orders.id, { onDelete: 'cascade' }),
  status:    text('status', {
               enum: [
                 'pending','voucher_sent','payment_validated',
                 'in_preparation','delivered','cancelled',
               ]
             }).notNull(),
  changedBy: integer('changed_by')
               .references(() => users.id, { onDelete: 'set null' }),
  note:      text('note'),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
})

// 11. banners
export const banners = sqliteTable('banners', {
  id:        integer('id').primaryKey({ autoIncrement: true }),
  imageUrl:  text('image_url').notNull(),
  linkUrl:   text('link_url'),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive:  integer('is_active', { mode: 'boolean' }).notNull().default(true),
})

// ─── RELACIONES ──────────────────────────────────────────────────

export const categoriesRelations = relations(categories, ({ many }) => ({
  subcategories: many(subcategories),
  products:      many(products),
}))

export const subcategoriesRelations = relations(subcategories, ({ one, many }) => ({
  category: one(categories, {
    fields: [subcategories.categoryId], references: [categories.id],
  }),
  products: many(products),
}))

export const productsRelations = relations(products, ({ one, many }) => ({
  category:    one(categories,    { fields: [products.categoryId],    references: [categories.id] }),
  subcategory: one(subcategories, { fields: [products.subcategoryId], references: [subcategories.id] }),
  images:      many(productImages),
  orderItems:  many(orderItems),
}))

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, { fields: [productImages.productId], references: [products.id] }),
}))

export const ordersRelations = relations(orders, ({ one, many }) => ({
  paymentMethod: one(paymentMethods, {
    fields: [orders.paymentMethodId], references: [paymentMethods.id],
  }),
  items:      many(orderItems),
  statusLogs: many(orderStatusLogs),
}))

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order:   one(orders,   { fields: [orderItems.orderId],   references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}))

export const orderStatusLogsRelations = relations(orderStatusLogs, ({ one }) => ({
  order:     one(orders, { fields: [orderStatusLogs.orderId],   references: [orders.id] }),
  changedBy: one(users,  { fields: [orderStatusLogs.changedBy], references: [users.id] }),
}))
```

---

## INSTANCIA DE BASE DE DATOS

### `server/db/index.ts`
```typescript
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'
import { mkdirSync } from 'fs'
import { dirname } from 'path'

const dbPath = process.env.DB_PATH ?? './data/smartcs.db'

// Crear directorio si no existe (importante en VPS)
mkdirSync(dirname(dbPath), { recursive: true })

const sqlite = new Database(dbPath)

// Activar WAL mode para mejor concurrencia en SQLite
sqlite.pragma('journal_mode = WAL')
sqlite.pragma('foreign_keys = ON')

export const db = drizzle(sqlite, { schema })
```

---

## SEED DE BASE DE DATOS

### `server/db/seed.ts`
```typescript
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'
import { mkdirSync } from 'fs'
import bcrypt from 'bcryptjs'
import slugify from 'slugify'

const dbPath = process.env.DB_PATH ?? './data/smartcs.db'
mkdirSync('./data', { recursive: true })

const sqlite = new Database(dbPath)
sqlite.pragma('journal_mode = WAL')
sqlite.pragma('foreign_keys = ON')
const db = drizzle(sqlite, { schema })

async function seed() {
  console.log('Iniciando seed...')

  // 1. business_config
  db.insert(schema.businessConfig).values({
    name:        'Mi Tienda Demo',
    whatsapp:    '+51996111303',
    plan:        'basic',
    socialLinks: JSON.stringify({ instagram: 'mitienda', facebook: 'mitienda', tiktok: '' }),
  }).run()

  // 2. users
  const hash = await bcrypt.hash('admin123', 10)
  db.insert(schema.users).values([
    { name: 'Super Admin', email: 'joymar.peru@gmail.com', passwordHash: hash, role: 'superadmin' },
    { name: 'Admin Tienda', email: 'joymar.peru@gmail.com', passwordHash: hash, role: 'admin' },
  ]).run()

  // 3. categories
  const cats = [
    { name: 'Ropa', slug: 'ropa' },
    { name: 'Calzado', slug: 'calzado' },
    { name: 'Accesorios', slug: 'accesorios' },
    { name: 'Ofertas', slug: 'ofertas' },
  ]
  for (const [i, cat] of cats.entries()) {
    db.insert(schema.categories).values({ ...cat, sortOrder: i }).run()

    // 2 subcategorías por categoría
    db.insert(schema.subcategories).values([
      { categoryId: i + 1, name: `${cat.name} Hombre`, slug: `${cat.slug}-hombre`, sortOrder: 0 },
      { categoryId: i + 1, name: `${cat.name} Mujer`,  slug: `${cat.slug}-mujer`,  sortOrder: 1 },
    ]).run()
  }

  // 4. payment_methods
  db.insert(schema.paymentMethods).values([
    { type: 'yape',          label: 'Yape - 999 999 999',     isActive: true, sortOrder: 1 },
    { type: 'plin',          label: 'Plin - 999 999 999',     isActive: true, sortOrder: 2 },
    { type: 'bank_transfer', label: 'BCP - Cta. 123-456789',  isActive: true, sortOrder: 3,
      accountName: 'Mi Tienda SAC', accountNumber: '123-456789-0-12' },
  ]).run()

  // 5. banners
  db.insert(schema.banners).values([
    { imageUrl: 'https://picsum.photos/1200/400?random=1', sortOrder: 0, isActive: true },
    { imageUrl: 'https://picsum.photos/1200/400?random=2', sortOrder: 1, isActive: true },
  ]).run()

  // 6. products (12 productos)
  const productData = Array.from({ length: 12 }, (_, i) => ({
    categoryId:    (i % 4) + 1,
    subcategoryId: (i % 8) + 1,
    name:          `Producto Demo ${i + 1}`,
    slug:          `producto-demo-${i + 1}`,
    description:   `Descripción del producto demo número ${i + 1}.`,
    price:         parseFloat((Math.random() * 150 + 20).toFixed(2)),
    stock:         Math.floor(Math.random() * 50) + 5,
    isFeatured:    i < 4,
    isActive:      true,
  }))

  for (const p of productData) {
    const result = db.insert(schema.products).values(p).run()
    const productId = Number(result.lastInsertRowid)

    db.insert(schema.productImages).values({
      productId,
      url:       `https://picsum.photos/600/600?random=${productId}`,
      sortOrder: 0,
      isPrimary: true,
    }).run()
  }

  console.log('Seed completado.')
  process.exit(0)
}

seed().catch(console.error)
```

---

## SERVER UTILS

### `server/utils/validate.ts`
```typescript
import { z } from 'zod'

export function validateBody<T>(schema: z.ZodSchema<T>, body: unknown): T {
  const result = schema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 422,
      message: 'Datos inválidos',
      data: result.error.flatten(),
    })
  }
  return result.data
}
```

### `server/utils/orderCode.ts`
```typescript
// Se llama DESPUÉS de insertar el pedido, pasando el ID retornado
export function generateOrderCode(id: number): string {
  return `PED-${id.toString().padStart(4, '0')}`
}
```

### `server/utils/slugify.ts`
```typescript
import slugifyLib from 'slugify'

export function makeSlug(text: string): string {
  return slugifyLib(text, { lower: true, strict: true, locale: 'es' })
}
```

---

## SERVER MIDDLEWARE (protección de rutas API admin)

### `server/middleware/admin-guard.ts`
```typescript
export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  // Solo proteger rutas que empiecen con /api/admin/
  if (!path.startsWith('/api/admin/')) return

  const session = await getUserSession(event)
  if (!session?.user) {
    throw createError({ statusCode: 401, message: 'No autorizado' })
  }
})
```

---

## SERVER ROUTES — EJEMPLOS CLAVE

Todas las rutas **públicas** viven en `/server/api/`.
Todas las rutas **de administración** viven en `/server/api/admin/`.

### `server/api/auth/login.post.ts`
```typescript
import { db } from '~/server/db'
import { users } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { validateBody } from '~/server/utils/validate'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const schema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = validateBody(schema, body)

  const user = db.query.users.findFirst({ where: eq(users.email, email) })
  if (!user || !user.isActive) {
    throw createError({ statusCode: 401, message: 'Credenciales inválidas' })
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    throw createError({ statusCode: 401, message: 'Credenciales inválidas' })
  }

  await setUserSession(event, {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  })

  return { user: { id: user.id, name: user.name, role: user.role } }
})
```

### `server/api/auth/logout.post.ts`
```typescript
export default defineEventHandler(async (event) => {
  await clearUserSession(event)
  return { ok: true }
})
```

### `server/api/products/index.get.ts`
```typescript
import { db } from '~/server/db'
import { products, productImages } from '~/server/db/schema'
import { eq, and, like, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { categoria, subcategoria, q, featured, page = 1, limit = 12 } = query

  // Construir where dinámicamente
  const conditions = [eq(products.isActive, true)]
  if (categoria)     conditions.push(eq(products.categoryId,    Number(categoria)))
  if (subcategoria)  conditions.push(eq(products.subcategoryId, Number(subcategoria)))
  if (featured)      conditions.push(eq(products.isFeatured,    true))
  if (q)             conditions.push(like(products.name, `%${q}%`))

  const offset = (Number(page) - 1) * Number(limit)

  const items = db.query.products.findMany({
    where: and(...conditions),
    with: {
      images: {
        where: eq(productImages.isPrimary, true),
        limit: 1,
      },
      category:    true,
      subcategory: true,
    },
    orderBy: [desc(products.createdAt)],
    limit:   Number(limit),
    offset,
  })

  return { data: items, page: Number(page), limit: Number(limit) }
})
```

### `server/api/orders/index.post.ts` (flujo completo de checkout)
```typescript
import { db } from '~/server/db'
import { orders, orderItems, orderStatusLogs, products } from '~/server/db/schema'
import { eq, inArray } from 'drizzle-orm'
import { validateBody } from '~/server/utils/validate'
import { generateOrderCode } from '~/server/utils/orderCode'
import { z } from 'zod'

const schema = z.object({
  customerName:      z.string().min(2),
  customerPhone:     z.string().optional(),
  customerAddress:   z.string().optional(),
  customerReference: z.string().optional(),
  customerNotes:     z.string().optional(),
  paymentMethodId:   z.number().int().positive(),
  items: z.array(z.object({
    productId: z.number().int().positive(),
    quantity:  z.number().int().min(1),
  })).min(1),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = validateBody(schema, body)

  // Obtener productos de la BD para verificar precios y stock
  const productIds = data.items.map(i => i.productId)
  const dbProducts = db.query.products.findMany({
    where: inArray(products.id, productIds),
  })

  if (dbProducts.length !== productIds.length) {
    throw createError({ statusCode: 400, message: 'Uno o más productos no existen' })
  }

  // Verificar stock si aplica
  const config = db.query.businessConfig.findFirst()
  for (const item of data.items) {
    const prod = dbProducts.find(p => p.id === item.productId)!
    if (config?.stockEnabled && prod.trackStock && prod.stock < item.quantity) {
      throw createError({
        statusCode: 400,
        message: `Stock insuficiente para "${prod.name}"`,
      })
    }
  }

  // Calcular totales con precios de BD (nunca confiar en el cliente)
  const subtotal = data.items.reduce((acc, item) => {
    const prod = dbProducts.find(p => p.id === item.productId)!
    return acc + prod.price * item.quantity
  }, 0)
  const total = subtotal

  // INSERT orden
  const result = db.insert(orders).values({
    orderCode:         'PED-TEMP',   // temporal, se actualiza en el siguiente paso
    paymentMethodId:   data.paymentMethodId,
    customerName:      data.customerName,
    customerPhone:     data.customerPhone,
    customerAddress:   data.customerAddress,
    customerReference: data.customerReference,
    customerNotes:     data.customerNotes,
    subtotal,
    total,
    status: 'pending',
  }).run()

  const orderId    = Number(result.lastInsertRowid)
  const orderCode  = generateOrderCode(orderId)

  // Actualizar con order_code real
  db.update(orders)
    .set({ orderCode })
    .where(eq(orders.id, orderId))
    .run()

  // INSERT items con snapshot de nombre y precio
  for (const item of data.items) {
    const prod = dbProducts.find(p => p.id === item.productId)!
    db.insert(orderItems).values({
      orderId,
      productId:   prod.id,
      productName: prod.name,
      unitPrice:   prod.price,
      quantity:    item.quantity,
      subtotal:    prod.price * item.quantity,
    }).run()

    // Descontar stock si aplica
    if (config?.stockEnabled && prod.trackStock) {
      db.update(products)
        .set({ stock: prod.stock - item.quantity })
        .where(eq(products.id, prod.id))
        .run()
    }
  }

  // INSERT log inicial
  db.insert(orderStatusLogs).values({
    orderId,
    status: 'pending',
    note:   'Pedido creado',
  }).run()

  // Retornar orden completa
  const order = db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: { items: true, paymentMethod: true },
  })

  return order
})
```

### `server/api/admin/orders/[id]/status.put.ts`
```typescript
import { db } from '~/server/db'
import { orders, orderStatusLogs } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { validateBody } from '~/server/utils/validate'
import { z } from 'zod'

const schema = z.object({
  status: z.enum([
    'pending','voucher_sent','payment_validated',
    'in_preparation','delivered','cancelled',
  ]),
  note: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const id   = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const data = validateBody(schema, body)
  const session = await getUserSession(event)

  db.update(orders)
    .set({ status: data.status, updatedAt: new Date().toISOString() })
    .where(eq(orders.id, id))
    .run()

  db.insert(orderStatusLogs).values({
    orderId:   id,
    status:    data.status,
    changedBy: session.user.id,
    note:      data.note,
  }).run()

  return db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: { items: true, paymentMethod: true, statusLogs: true },
  })
})
```

### `server/api/upload/image.post.ts`
```typescript
import { extname } from 'path'
import { randomUUID } from 'crypto'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session?.user) throw createError({ statusCode: 401 })

  const formData = await readFormData(event)
  const file = formData.get('file') as File

  if (!file) throw createError({ statusCode: 400, message: 'No se recibió archivo' })

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    throw createError({ statusCode: 400, message: 'Tipo de archivo no permitido' })
  }

  const config = useRuntimeConfig()
  const bucket = config.s3Bucket
  const region = config.s3Region
  const accessKeyId = config.s3AccessKeyId
  const secretAccessKey = config.s3SecretAccessKey
  const projectName = config.projectName

  if (!bucket || !region || !accessKeyId || !secretAccessKey) {
    throw createError({ statusCode: 500, message: 'S3 no está configurado' })
  }

  const s3 = new S3Client({
    region,
    credentials: { accessKeyId, secretAccessKey },
  })

  const ext      = extname(file.name) || '.jpg'
  const filename = `${randomUUID()}${ext}`
  const key = `${projectName}/${filename}`

  const buffer = Buffer.from(await file.arrayBuffer())
  await s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: file.type,
    ACL: 'public-read',
  }))

  const base = `https://${bucket}.s3.${region}.amazonaws.com`
  return { url: `${base}/${key}` }
})
```

---

## PINIA STORES

### `stores/cart.ts`
```typescript
import { defineStore } from 'pinia'

export interface CartItem {
  id:       number
  name:     string
  price:    number
  quantity: number
  image:    string | null
  slug:     string
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items:  [] as CartItem[],
    isOpen: false,
  }),
  getters: {
    total:     (s) => s.items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    itemCount: (s) => s.items.reduce((acc, i) => acc + i.quantity, 0),
    isEmpty:   (s) => s.items.length === 0,
  },
  actions: {
    add(product: CartItem) {
      const existing = this.items.find(i => i.id === product.id)
      if (existing) {
        existing.quantity += product.quantity
      } else {
        this.items.push({ ...product })
      }
      this.isOpen = true
    },
    remove(id: number) {
      this.items = this.items.filter(i => i.id !== id)
    },
    updateQty(id: number, qty: number) {
      const item = this.items.find(i => i.id === id)
      if (item) item.quantity = Math.max(1, qty)
    },
    clear() {
      this.items  = []
      this.isOpen = false
    },
  },
  persist: true,   // pinia-plugin-persistedstate → localStorage
})
```

### `stores/auth.ts`
```typescript
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as { id: number; name: string; role: string } | null,
  }),
  getters: {
    isLoggedIn: (s) => !!s.user,
  },
  actions: {
    async login(email: string, password: string) {
      const data = await $fetch<{ user: any }>('/api/auth/login', {
        method: 'POST',
        body:   { email, password },
      })
      this.user = data.user
      await navigateTo('/admin')
    },
    async logout() {
      await $fetch('/api/auth/logout', { method: 'POST' })
      this.user = null
      await navigateTo('/login')
    },
  },
  persist: true,
})
```

---

## PLUGINS — persistedstate

### `plugins/pinia-persistedstate.client.ts`
```typescript
import { createPersistedState } from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin(({ $pinia }) => {
  $pinia.use(createPersistedState())
})
```

---

## MIDDLEWARE DE RUTAS (pages)

### `middleware/auth.ts`
```typescript
export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn } = useUserSession()
  if (!loggedIn.value) return navigateTo('/login')
})
```

### `middleware/guest.ts`
```typescript
export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn } = useUserSession()
  if (loggedIn.value) return navigateTo('/admin')
})
```

---

## LAYOUTS

### `layouts/default.vue` (público)
```vue
<template>
  <div class="min-h-screen flex flex-col">
    <header class="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <NuxtLink to="/" class="font-bold text-xl text-primary">
          {{ config.public.appName }}
        </NuxtLink>
        <nav class="hidden md:flex gap-6 text-sm">
          <NuxtLink to="/catalogo">Catálogo</NuxtLink>
        </nav>
        <button @click="cartStore.isOpen = true" class="relative">
          <UIcon name="i-heroicons-shopping-bag" class="w-6 h-6" />
          <span v-if="cartStore.itemCount > 0"
            class="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {{ cartStore.itemCount }}
          </span>
        </button>
      </div>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="bg-gray-50 border-t py-8 text-center text-sm text-gray-500">
      © {{ new Date().getFullYear() }} {{ config.public.appName }}
    </footer>

    <!-- Cart Drawer -->
    <CartDrawer />

    <!-- WhatsApp flotante -->
    <WhatsLandingAppButton />
  </div>
</template>

<script setup lang="ts">
const config     = useRuntimeConfig()
const cartStore  = useCartStore()
</script>
```

### `layouts/admin.vue`
```vue
<template>
  <div class="min-h-screen flex bg-gray-50">
    <AdminSidebar />
    <div class="flex-1 flex flex-col min-w-0">
      <AdminTopbar />
      <main class="flex-1 p-6 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
</script>
```

---

## PÁGINAS — COMPORTAMIENTO ESPERADO

### `pages/index.vue`
```vue
<script setup lang="ts">
const { data: banners }    = await useFetch('/api/banners')
const { data: categories } = await useFetch('/api/categories', { query: { active: true } })
const { data: featured }   = await useFetch('/api/products', { query: { featured: true, limit: 8 } })
</script>
```
Secciones: AppBanner (slider) → Categorías (grid 2x2) → Productos destacados (ProductGrid)

### `pages/catalogo/index.vue`
```vue
<script setup lang="ts">
const route = useRoute()
const query = reactive({
  categoria:    route.query.categoria,
  subcategoria: route.query.subcategoria,
  q:            route.query.q,
  page:         route.query.page ?? 1,
})
const { data, refresh } = await useFetch('/api/products', { query })
watch(query, () => refresh())
</script>
```
Layout: sidebar filtros + grid de ProductCard con paginación (UPagination de Nuxt UI)

### `pages/catalogo/[slug].vue`
```vue
<script setup lang="ts">
const { slug } = useRoute().params
const { data: product } = await useFetch(`/api/products/${slug}`)
if (!product.value) throw createError({ statusCode: 404 })
</script>
```
Galería de imágenes, precio formateado, selector de cantidad, botón "Agregar al carrito"

### `pages/checkout.vue`
```vue
<script setup lang="ts">
definePageMeta({ middleware: [] })
const cart = useCartStore()
if (cart.isEmpty) await navigateTo('/carrito')

const { data: paymentMethods } = await useFetch('/api/payment-methods', { query: { active: true } })

async function submitOrder() {
  const order = await $fetch('/api/orders', {
    method: 'POST',
    body: {
      ...formData,
      items: cart.items.map(i => ({ productId: i.id, quantity: i.quantity })),
    },
  })
  cart.clear()
  await navigateTo(`/pedido/${order.orderCode}`)
}
</script>
```
Formulario con UForm + UFormGroup de Nuxt UI, validación con zod en cliente. Solo muestra métodos activos y habilitados en la configuración del negocio.

### `pages/pedido/[code].vue`
```vue
<script setup lang="ts">
const { code } = useRoute().params
const { data: order } = await useFetch(`/api/orders/${code}`)

const config    = useRuntimeConfig()
const waMessage = computed(() =>
  encodeURIComponent(
    `Hola! Realicé el pedido *${order.value?.orderCode}* por S/ ${order.value?.total.toFixed(2)}. Adjunto comprobante.`
  )
)
const waUrl = computed(() => `https://wa.me/${config.public.whatsapp}?text=${waMessage.value}`)
</script>
```
Muestra resumen de items, total, métodos de pago con QRs, botón WhatsApp

### `pages/admin/productos/index.vue`
```vue
<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'admin' })
const { data, refresh } = await useFetch('/api/admin/products')

const columns = [
  { key: 'image', label: '' },
  { key: 'name', label: 'Producto', sortable: true },
  { key: 'price', label: 'Precio' },
  { key: 'stock', label: 'Stock' },
  { key: 'isActive', label: 'Activo' },
  { key: 'actions', label: '' },
]
</script>
```
Usar UTable de Nuxt UI con columna de acciones (editar/toggle activo/eliminar)

### `pages/admin/pedidos/[id].vue`
```vue
<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'admin' })
const { id } = useRoute().params
const { data: order, refresh } = await useFetch(`/api/admin/orders/${id}`)

async function changeStatus(newStatus: string) {
  await $fetch(`/api/admin/orders/${id}/status`, {
    method: 'PUT',
    body: { status: newStatus },
  })
  await refresh()
}
</script>
```
Detalle completo del pedido + USelect para cambiar estado + OrderStatusTimeline

### `pages/admin/configuracion/index.vue`
```vue
<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'admin' })
const { data: config, refresh } = await useFetch('/api/business-config')

async function save() {
  await $fetch('/api/admin/business-config', {
    method: 'PUT',
    body: formData,
  })
  await refresh()
  useToast().add({ title: 'Configuración guardada', color: 'green' })
}
</script>
```
Formulario solo para `superadmin` con toggles para módulos del negocio, límites y pasarelas de pago habilitadas.

---

## COMPONENTES CLAVE

### `components/cart/CartDrawer.vue`
- USlideover de Nuxt UI
- Lista de CartItem con selector de cantidad
- Total + botón "Ir al checkout"
- Se abre/cierra con `cartStore.isOpen`

### `components/admin/OrderStatusBadge.vue`
```vue
<template>
  <UBadge :color="color" :label="label" />
</template>
<script setup lang="ts">
const props = defineProps<{ status: string }>()
const map: Record<string, { color: string; label: string }> = {
  pending:             { color: 'yellow',  label: 'Pendiente' },
  voucher_sent:        { color: 'blue',    label: 'Comprobante enviado' },
  payment_validated:   { color: 'teal',    label: 'Pago validado' },
  in_preparation:      { color: 'orange',  label: 'En preparación' },
  delivered:           { color: 'green',   label: 'Entregado' },
  cancelled:           { color: 'red',     label: 'Cancelado' },
}
const { color, label } = map[props.status] ?? { color: 'gray', label: props.status }
</script>
```

### `components/ui/WhatsLandingAppButton.vue`
```vue
<template>
  <a :href="`https://wa.me/${config.public.whatsapp}`"
     target="_blank"
     class="fixed bottom-6 right-6 bg-green-500 text-white rounded-full p-4 shadow-lg z-50">
    <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="w-6 h-6" />
  </a>
</template>
<script setup lang="ts">
const config = useRuntimeConfig()
</script>
```

---

## COMPOSABLES

### `composables/useFormatPrice.ts`
```typescript
export const useFormatPrice = () => ({
  format: (n: number) => `S/ ${n.toFixed(2)}`,
})
```

### `composables/useBusinessConfig.ts`
```typescript
export const useBusinessConfig = () => {
  return useState('businessConfig', () => null)
}
```
En `app.vue` cargar 1 vez con `useFetch('/api/business-config')` y asignar al state.

---

## TYPES GLOBALES

### `types/index.ts`
```typescript
export type OrderStatus =
  | 'pending' | 'voucher_sent' | 'payment_validated'
  | 'in_preparation' | 'delivered' | 'cancelled'

export type UserRole = 'superadmin' | 'admin'

export type Plan = 'basic' | 'intermediate' | 'advanced'

export interface Product {
  id:            number
  name:          string
  slug:          string
  price:         number
  description:   string | null
  stock:         number
  trackStock:    boolean
  isFeatured:    boolean
  isActive:      boolean
  images:        ProductImage[]
  category?:     Category
  subcategory?:  Subcategory
}

export interface ProductImage {
  id:        number
  url:       string
  isPrimary: boolean
  sortOrder: number
}

export interface Category {
  id:            number
  name:          string
  slug:          string
  sortOrder:     number
  subcategories?: Subcategory[]
}

export interface Subcategory {
  id:         number
  categoryId: number
  name:       string
  slug:       string
}

export interface Order {
  id:                number
  orderCode:         string
  customerName:      string
  customerPhone:     string | null
  total:             number
  status:            OrderStatus
  paymentMethod?:    PaymentMethod
  items:             OrderItem[]
  statusLogs?:       OrderStatusLog[]
  createdAt:         string
}

export interface OrderItem {
  id:          number
  productName: string
  unitPrice:   number
  quantity:    number
  subtotal:    number
}

export interface OrderStatusLog {
  id:        number
  status:    OrderStatus
  note:      string | null
  createdAt: string
}

export interface PaymentMethod {
  id:            number
  type:          string
  label:         string
  qrUrl:         string | null
  accountNumber: string | null
  accountName:   string | null
}
```

---

## SCRIPTS DE package.json

```json
{
  "scripts": {
    "dev":          "nuxt dev",
    "build":        "nuxt build",
    "preview":      "nuxt preview",
    "db:generate":  "drizzle-kit generate",
    "db:migrate":   "drizzle-kit migrate",
    "db:seed":      "tsx server/db/seed.ts",
    "db:studio":    "drizzle-kit studio",
    "start":        "node .output/server/index.mjs"
  }
}
```

---

## DEPLOY EN VPS LINUX

### Estructura en el servidor:
```
/var/www/smartcs/
├── .output/          ← build de Nuxt
├── data/
│   └── smartcs.db   ← archivo SQLite (fuera del build)
├── public/
│   └── uploads/     ← imágenes subidas
├── .env
└── ecosystem.config.cjs
```

### `ecosystem.config.cjs` (PM2):
```javascript
module.exports = {
  apps: [{
    name:   'smartcs',
    script: '.output/server/index.mjs',
    env: {
      NODE_ENV:               'production',
      PORT:                   '3000',
      DB_PATH:                '/var/www/smartcs/data/smartcs.db',
      S3_BUCKET:              'your-bucket-name',
      S3_REGION:              'us-east-1',
      S3_ACCESS_KEY_ID:       'your-access-key-id',
      S3_SECRET_ACCESS_KEY:   'your-secret-access-key',
      PROJECT_NAME:           'joymar_utensilios',
      NUXT_SESSION_PASSWORD:  'CAMBIAR-POR-CLAVE-SEGURA-DE-32-CHARS',
      NUXT_PUBLIC_APP_NAME:   'Mi Tienda',
      NUXT_PUBLIC_WHATSAPP:   '+51996111303',
    },
  }],
}
```

### Nginx config (reverse proxy):
```nginx
server {
    listen 80;
    server_name tudominio.com;

    # Servir uploads estáticos directamente (sin pasar por Node)
    location /uploads/ {
        alias /var/www/smartcs/public/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        proxy_pass         http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Comandos de deploy:
```bash
npm run build
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup   # para que inicie con el sistema
```

---

## REGLAS DE IMPLEMENTACIÓN — OBLIGATORIAS

1. Usar siempre `<script setup lang="ts">` en todos los componentes y páginas
2. better-sqlite3 es **síncrono** — NO usar async/await en las llamadas a `db`. Usar `.run()`, `.all()`, `.get()` directamente
3. Los precios son `real` en SQLite → llegan como `number` en JS. Siempre mostrar con `.toFixed(2)`, nunca operar con ellos para mostrar sin formatear
4. `order_code` se genera DESPUÉS del INSERT usando `lastInsertRowid`
5. Serializar `socialLinks` a JSON string antes de guardar y parsear al leer (SQLite no tiene tipo JSON nativo)
6. Habilitar `PRAGMA foreign_keys = ON` al inicializar la conexión (ya incluido en `server/db/index.ts`)
7. Habilitar `PRAGMA journal_mode = WAL` para evitar locks en SQLite con múltiples lecturas concurrentes
8. El archivo `smartcs.db` debe estar en `/var/www/smartcs/data/` en producción, NUNCA dentro del directorio del build
9. Agregar `/data/*.db` y `/public/uploads/` al `.gitignore`
10. Cada cambio de estado de pedido SIEMPRE crea un registro en `order_status_logs`
11. Todo CRUD del admin debe ir en rutas `/api/admin/*` protegidas por el server middleware
12. Las rutas de configuración global, límites y usuarios deben exigir `superadmin`
13. Validar con zod tanto en cliente (UForm) como en servidor (validateBody) — nunca confiar solo en uno
14. Las imágenes se guardan en s3 via url
15. Sin autenticación de clientes finales en esta versión — solo panel admin
16. Usar `useToast()` de Nuxt UI para todos los mensajes de éxito/error en el admin