import 'dotenv/config'
import mysql from 'mysql2/promise'
import { drizzle } from 'drizzle-orm/mysql2'
import * as schema from './schema'

/* Contrato de fechas: TODAS las columnas timestamp viven en UTC.
   drizzle escribe `toISOString()` y lee los strings como UTC, así que la
   sesión de MySQL también debe estar en UTC: si no, los DEFAULT
   CURRENT_TIMESTAMP se graban con la hora local del servidor de BD y el
   panel muestra esas fechas corridas (5 h en Perú). La UI convierte a
   America/Lima al momento de formatear (useFormatDateTime). */
const pool = mysql.createPool({
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  port: Number(process.env.DB_PORT ?? 3306),
  decimalNumbers: true,
  timezone: 'Z',
})

/* Se encola antes de que la conexión salga del pool, así cualquier query
   que la use ya corre con time_zone UTC. */
pool.on('connection', (connection: any) => {
  connection.query("SET time_zone = '+00:00'", (err: unknown) => {
    if (err) console.error('[db] No se pudo fijar time_zone UTC en la conexión:', err)
  })
})

export const db = drizzle(pool, { schema, mode: 'default' })
