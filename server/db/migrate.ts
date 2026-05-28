import 'dotenv/config'
import { migrate } from 'drizzle-orm/mysql2/migrator'
import { db } from './index'

async function main() {
  console.log('⏳ Aplicando migraciones...')
  await migrate(db, { migrationsFolder: './server/db/migrations' })
  console.log('✅ Migraciones aplicadas correctamente')
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Error en migración:', err)
  process.exit(1)
})
