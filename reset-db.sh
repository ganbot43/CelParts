#!/bin/bash
set -e

echo "🗑️  Eliminando todas las tablas..."

node -e "
import('dotenv/config').then(async () => {
  const mysql = await import('mysql2/promise');
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'joymar',
  });
  
  try {
    await conn.execute('SET FOREIGN_KEY_CHECKS = 0');
    const [tables] = await conn.execute(\"SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?\", [process.env.DB_NAME ?? 'joymar']);
    
    for (const table of tables) {
      console.log(\`   Dropping \${table.TABLE_NAME}...\`);
      await conn.execute(\`DROP TABLE IF EXISTS \\\`\${table.TABLE_NAME}\\\`\`);
    }
    
    await conn.execute('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✅ Base de datos limpiada');
  } finally {
    await conn.end();
  }
}).catch(e => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
"

echo ""
echo "🔄 Generando migraciones..."
npm run db:generate

echo ""
echo "🚀 Ejecutando migraciones..."
npm run db:migrate

echo ""
echo "🌱 Cargando datos iniciales (seed)..."
npm run db:seed

echo ""
echo "✅ Base de datos lista para producción"
