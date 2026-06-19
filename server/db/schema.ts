import {
  mysqlTable, int, text, double, varchar, timestamp
} from 'drizzle-orm/mysql-core'
import { relations, sql } from 'drizzle-orm'

// Esquema adaptado para MySQL 5.7 (drizzle-orm mysql-core)
// NOTA: MySQL 5.7 no soporta DEFAULT en columnas text/blob
// → campos con default usan varchar en lugar de text

// 1. business_config — siempre 1 sola fila
export const businessConfig = mysqlTable('business_config', {
  id:                 int('id').autoincrement().primaryKey(),
  name:               text('name').notNull(),
  ruc:                varchar('ruc', { length: 20 }),
  email:              varchar('email', { length: 255 }),
  logoUrl:            text('logo_url'),
  whatsapp:           text('whatsapp').notNull(),
  address:            text('address'),
  plan:               varchar('plan', { length: 20 })
                        .notNull().default('basic'),
  socialLinks:        text('social_links'),           // JSON serializado
  stockEnabled:       int('stock_enabled').notNull().default(1),
  autoPaymentEnabled: int('auto_payment_enabled').notNull().default(0),
  couponsEnabled:     int('coupons_enabled').notNull().default(0),
  multiuserEnabled:   int('multiuser_enabled').notNull().default(0),
  updatedAt:          timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
})

// 2. users
export const users = mysqlTable('users', {
  id:           int('id').autoincrement().primaryKey(),
  name:         text('name').notNull(),
  email:        varchar('email', { length: 191 }).notNull().unique(),
  phone:        varchar('phone', { length: 20 }),
  passwordHash: text('password_hash').notNull(),
  role:         varchar('role', { length: 20 }).notNull().default('admin'),
  isActive:     int('is_active').notNull().default(1),
  createdAt:    timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
})

// 3. categories
export const categories = mysqlTable('categories', {
  id:            int('id').autoincrement().primaryKey(),
  name:          text('name').notNull(),
  slug:          varchar('slug', { length: 191 }).notNull().unique(),
  sortOrder:     int('sort_order').notNull().default(0),
  isActive:      int('is_active').notNull().default(1),
  seccion:       int('seccion'),
  idProducto:    int('id_producto'),
  imagenBanner:  text('imagen_banner'),
  createdAt:     timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
})

// 4. subcategories
export const subcategories = mysqlTable('subcategories', {
  id:         int('id').autoincrement().primaryKey(),
  categoryId: int('category_id').notNull()
                .references(() => categories.id, { onDelete: 'cascade' }),
  name:       text('name').notNull(),
  slug:       varchar('slug', { length: 191 }).notNull().unique(),
  sortOrder:  int('sort_order').notNull().default(0),
  isActive:   int('is_active').notNull().default(1),
  createdAt:  timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt:  timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
})

// 5. products
export const products = mysqlTable('products', {
  id:            int('id').autoincrement().primaryKey(),
  categoryId:    int('category_id')
                   .references(() => categories.id, { onDelete: 'set null' }),
  subcategoryId: int('subcategory_id')
                   .references(() => subcategories.id, { onDelete: 'set null' }),
  name:          text('name').notNull(),
  slug:          varchar('slug', { length: 191 }).notNull().unique(),
  description:   text('description'),
  price:         double('price').notNull(),
  stock:         int('stock').notNull().default(0),
  trackStock:    int('track_stock').notNull().default(1),
  isFeatured:    int('is_featured').notNull().default(0),
  nuevoLanzamiento: int('nuevo_lanzamiento').notNull().default(0),
  isActive:      int('is_active').notNull().default(1),
  createdAt:     timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt:     timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
})

// 6. product_images
export const productImages = mysqlTable('product_images', {
  id:        int('id').autoincrement().primaryKey(),
  productId: int('product_id').notNull()
               .references(() => products.id, { onDelete: 'cascade' }),
  url:       text('url').notNull(),
  sortOrder: int('sort_order').notNull().default(0),
  isPrimary: int('is_primary').notNull().default(0),
})

// 7. payment_methods
export const paymentMethods = mysqlTable('payment_methods', {
  id:            int('id').autoincrement().primaryKey(),
  type:          varchar('type', { length: 30 }).notNull(),
  label:         text('label').notNull(),
  qrUrl:         text('qr_url'),
  accountNumber: text('account_number'),
  accountName:   text('account_name'),
  isActive:      int('is_active').notNull().default(1),
  sortOrder:     int('sort_order').notNull().default(0),
})

// 8. orders
export const orders = mysqlTable('orders', {
  id:                     int('id').autoincrement().primaryKey(),
  orderCode:              varchar('order_code', { length: 191 }).notNull().unique(),
  userId:                 int('user_id').references(() => users.id, { onDelete: 'set null' }),
  paymentMethodId:        int('payment_method_id')
                            .references(() => paymentMethods.id, { onDelete: 'set null' }),
  paymentMethodType:      text('payment_method_type'),
  paymentMethodLabel:     text('payment_method_label'),
  paymentMethodQrUrl:     text('payment_method_qr_url'),
  paymentMethodAccountNumber: text('payment_method_account_number'),
  paymentMethodAccountName: text('payment_method_account_name'),
  customerName:           text('customer_name').notNull(),
  customerPhone:          text('customer_phone'),
  customerAddress:        text('customer_address'),
  customerReference:      text('customer_reference'),
  customerNotes:          text('customer_notes'),
  subtotal:               double('subtotal').notNull(),
  total:                  double('total').notNull(),
  voucherUrl:             text('voucher_url'),
  status:                 varchar('status', { length: 30 }).notNull().default('pending'),
  createdAt:              timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt:              timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
})

// 9. order_items
export const orderItems = mysqlTable('order_items', {
  id:          int('id').autoincrement().primaryKey(),
  orderId:     int('order_id').notNull()
                 .references(() => orders.id, { onDelete: 'cascade' }),
  productId:   int('product_id')
                 .references(() => products.id, { onDelete: 'set null' }),
  productName: text('product_name').notNull(),
  unitPrice:   double('unit_price').notNull(),
  quantity:    int('quantity').notNull(),
  subtotal:    double('subtotal').notNull(),
})

// 10. order_status_logs
export const orderStatusLogs = mysqlTable('order_status_logs', {
  id:        int('id').autoincrement().primaryKey(),
  orderId:   int('order_id').notNull()
               .references(() => orders.id, { onDelete: 'cascade' }),
  status:    varchar('status', { length: 30 }).notNull(),
  changedBy: int('changed_by')
               .references(() => users.id, { onDelete: 'set null' }),
  note:      text('note'),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
})

// 13. inventory_movements
export const inventoryMovements = mysqlTable('inventory_movements', {
  id:            int('id').autoincrement().primaryKey(),
  productId:     int('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  movementType:  varchar('movement_type', { length: 20 }).notNull(), // 'entry' | 'exit' | 'adjustment'
  quantity:      int('quantity').notNull().default(0),
  delta:         int('delta'), // signed change (for adjustments or convenience)
  reason:        text('reason'),
  relatedOrderId: int('related_order_id').references(() => orders.id, { onDelete: 'set null' }),
  createdBy:     int('created_by').references(() => users.id, { onDelete: 'set null' }),
  metadata:      text('metadata'),
  createdAt:     timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
})

// 11. banners
export const banners = mysqlTable('banners', {
  id:        int('id').autoincrement().primaryKey(),
  imageUrl:  text('image_url').notNull(),
  linkUrl:   text('link_url'),
  sortOrder: int('sort_order').notNull().default(0),
  isActive:  int('is_active').notNull().default(1),
})

// 12. complaints / libro de reclamaciones
export const complaints = mysqlTable('complaints', {
  id:               int('id').autoincrement().primaryKey(),
  codigo:           varchar('codigo', { length: 100 }).notNull().default(''),

  // Datos del cliente
  customerName:     text('customer_name').notNull(),
  tipoDocumento:    text('tipo_documento').notNull(),
  numeroDocumento:  text('numero_documento').notNull(),
  direccion:        text('direccion'),
  telefono:         text('telefono').notNull(),
  email:            text('email').notNull(),

  // Detalle del bien
  tipoBien:         text('tipo_bien').notNull(),
  descripcionBien:  text('descripcion_bien').notNull(),
  monto:            double('monto'),

  // Detalle del reclamo
  tipoReclamo:      text('tipo_reclamo').notNull(),
  descripcion:      text('descripcion').notNull(),
  pedido:           text('pedido').notNull(),

  // Sistema
  estado:           varchar('estado', { length: 20 }).notNull().default('pendiente'),
  respuesta:        text('respuesta'),
  fechaRespuesta:   text('fecha_respuesta'),
  archivoUrl:       text('archivo_url'),
  createdAt:        timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
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
  inventoryMovements: many(inventoryMovements),
}))

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, { fields: [productImages.productId], references: [products.id] }),
}))

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId], references: [users.id],
  }),
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

export const inventoryMovementsRelations = relations(inventoryMovements, ({ one }) => ({
  product: one(products, { fields: [inventoryMovements.productId], references: [products.id] }),
  relatedOrder: one(orders, { fields: [inventoryMovements.relatedOrderId], references: [orders.id] }),
  createdByUser: one(users, { fields: [inventoryMovements.createdBy], references: [users.id] }),
}))