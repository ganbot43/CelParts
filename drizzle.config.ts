import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

const dbHost = process.env.DB_HOST
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD
const dbName = process.env.DB_NAME
const dbPort = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306

if (!dbHost || !dbUser || !dbPassword || !dbName) {
  throw new Error('Missing required DB env vars: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME')
}

export default defineConfig({
  schema:    './server/db/schema.ts',
  out:       './server/db/migrations',
  dialect:   'mysql',
  dbCredentials: {
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbName,
  },
})
