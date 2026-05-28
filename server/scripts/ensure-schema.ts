import mysql from 'mysql2/promise'
import 'dotenv/config'

// =======================
// ENV VALIDATION
// =======================
const dbHost = process.env.DB_HOST
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD
const dbName = process.env.DB_NAME
const dbPort = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306

if (!dbHost || !dbUser || !dbPassword || !dbName) {
  throw new Error(
    'Missing required DB env vars: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME'
  )
}

// =======================
// MYSQL CONNECTION
// =======================
const pool = mysql.createPool({
  host: dbHost,
  port: dbPort,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONN_LIMIT ?? 10),
})

// =======================
// HELPERS
// =======================
async function columnExists(
  tableName: string,
  columnName: string
): Promise<boolean> {
  const [rows] = await pool.query<any[]>(
    `SELECT COUNT(*) AS count
     FROM information_schema.columns
     WHERE table_schema = ?
       AND table_name = ?
       AND column_name = ?`,
    [dbName, tableName, columnName]
  )

  return Number(rows?.[0]?.count ?? 0) > 0
}

async function ensureColumn(
  tableName: string,
  columnSql: string,
  columnName: string
) {
  const exists = await columnExists(tableName, columnName)

  if (exists) {
    console.log(`✔ Column already exists: ${tableName}.${columnName}`)
    return
  }

  console.log(`➕ Adding column: ${tableName}.${columnName}`)

  await pool.query(
    `ALTER TABLE \`${tableName}\` ADD COLUMN ${columnSql}`
  )

  console.log(`✔ Column added: ${tableName}.${columnName}`)
}

// =======================
// MIGRATIONS
// =======================
async function ensureSchemaCompatibility() {
  console.log('🚀 Starting schema check...')

  await ensureColumn(
    'categories',
    '`seccion` int NULL',
    'seccion'
  )

  await ensureColumn(
    'categories',
    '`id_producto` int NULL',
    'id_producto'
  )

  await ensureColumn(
    'categories',
    '`imagen_banner` text NULL',
    'imagen_banner'
  )

  await ensureColumn(
    'products',
    '`nuevo_lanzamiento` int NOT NULL DEFAULT 0',
    'nuevo_lanzamiento'
  )

  console.log('🎉 Schema check completed')
}

// =======================
// RUN SCRIPT
// =======================
ensureSchemaCompatibility()
  .then(async () => {
    await pool.end()
    console.log('✅ Done')
    process.exit(0)
  })
  .catch(async (err) => {
    console.error('❌ Error running migrations:', err)
    await pool.end()
    process.exit(1)
  })