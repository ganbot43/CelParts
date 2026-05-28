import 'dotenv/config'
import mysql from 'mysql2/promise'

async function run() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'joymar',
  })

  try {
    // Create complaints table (MySQL syntax)
    await conn.execute(`
CREATE TABLE IF NOT EXISTS \`complaints\` (
  \`id\` int PRIMARY KEY AUTO_INCREMENT NOT NULL,
  \`codigo\` text DEFAULT '' NOT NULL,
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
    console.log('✅ Complaints table created or exists')

    // Try to add columns to orders if they don't exist (MySQL will error if exists)
    const addIfNotExists = async (sql) => {
      try {
        await conn.execute(sql)
      } catch (e) {
        // ignore existing column errors
      }
    }

    await addIfNotExists("ALTER TABLE `orders` ADD COLUMN `payment_method_type` text;")
    await addIfNotExists("ALTER TABLE `orders` ADD COLUMN `payment_method_label` text;")
    await addIfNotExists("ALTER TABLE `orders` ADD COLUMN `payment_method_qr_url` text;")
    await addIfNotExists("ALTER TABLE `orders` ADD COLUMN `payment_method_account_number` text;")
    await addIfNotExists("ALTER TABLE `orders` ADD COLUMN `payment_method_account_name` text;")

    console.log('✅ Migration applied successfully!')
  } catch (err) {
    console.error('❌ Migration failed:', err.message)
    process.exit(1)
  } finally {
    await conn.end()
  }
}

run()
