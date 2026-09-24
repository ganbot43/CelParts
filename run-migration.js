import 'dotenv/config'
import mysql from 'mysql2/promise'

async function run() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'celparts',
  })

  // Cada paso va aislado: un fallo (tabla ya creada, columna existente,
  // sintaxis no soportada por la versión del motor) no debe impedir que
  // corran los siguientes.
  const step = async (label, sql) => {
    try {
      await conn.execute(sql)
      console.log(`✅ ${label}`)
    } catch (e) {
      console.log(`↷ ${label} — omitido (${e.code ?? e.message})`)
    }
  }

  try {
    await step('Tabla complaints', `
CREATE TABLE IF NOT EXISTS \`complaints\` (
  \`id\` int PRIMARY KEY AUTO_INCREMENT NOT NULL,
  \`codigo\` varchar(64) DEFAULT '' NOT NULL,
  \`customer_name\` text NOT NULL,
  \`tipo_documento\` text NOT NULL,
  \`numero_documento\` text NOT NULL,
  \`direccion\` text,
  \`telefono\` text NOT NULL,
  \`email\` text NOT NULL,
  \`tipo_bien\` text NOT NULL,
  \`descripcion_bien\` text NOT NULL,
  \`monto\` double,
  \`tipo_reclamo\` text NOT NULL,
  \`descripcion\` text NOT NULL,
  \`pedido\` text NOT NULL,
  \`estado\` text DEFAULT 'pendiente' NOT NULL,
  \`respuesta\` text,
  \`fecha_respuesta\` text,
  \`archivo_url\` text,
  \`created_at\` text DEFAULT (CURRENT_TIMESTAMP)
);
    `)

    await step('orders.payment_method_type', "ALTER TABLE `orders` ADD COLUMN `payment_method_type` text;")
    await step('orders.payment_method_label', "ALTER TABLE `orders` ADD COLUMN `payment_method_label` text;")
    await step('orders.payment_method_qr_url', "ALTER TABLE `orders` ADD COLUMN `payment_method_qr_url` text;")
    await step('orders.payment_method_account_number', "ALTER TABLE `orders` ADD COLUMN `payment_method_account_number` text;")
    await step('orders.payment_method_account_name', "ALTER TABLE `orders` ADD COLUMN `payment_method_account_name` text;")

    // Precio "antes" para descuentos reales. Nullable: sin rebaja no hay
    // valor y la tarjeta no pinta badge de porcentaje.
    await step('products.compare_price', "ALTER TABLE `products` ADD COLUMN `compare_price` double;")

    // Texto del banner editable desde el panel: antes el carrusel solo
    // podía mostrar la imagen tal cual, sin titular ni llamada a la acción.
    await step('banners.eyebrow', "ALTER TABLE `banners` ADD COLUMN `eyebrow` varchar(80);")
    await step('banners.title', "ALTER TABLE `banners` ADD COLUMN `title` varchar(160);")
    await step('banners.subtitle', "ALTER TABLE `banners` ADD COLUMN `subtitle` varchar(300);")
    await step('banners.cta_label', "ALTER TABLE `banners` ADD COLUMN `cta_label` varchar(60);")
    await step('banners.align', "ALTER TABLE `banners` ADD COLUMN `align` varchar(10) NOT NULL DEFAULT 'left';")

    // Dirección habitual del cliente, editable desde /mi-cuenta y usada
    // como valor por defecto en el checkout.
    await step('users.address', "ALTER TABLE `users` ADD COLUMN `address` text;")
    await step('users.address_reference', "ALTER TABLE `users` ADD COLUMN `address_reference` text;")

    console.log('✅ Migration applied successfully!')
  } catch (err) {
    console.error('❌ Migration failed:', err.message)
    process.exit(1)
  } finally {
    await conn.end()
  }
}

run()
