import mysql from 'mysql2/promise';

async function run() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'mysql',
    database: 'celparts'
  });

  try {
    await connection.execute("ALTER TABLE business_config ADD COLUMN ruc VARCHAR(20)");
    console.log("RUC column added successfully");
  } catch(e) {
    console.error("Error adding RUC column:", e.message);
  }

  await connection.end();
}

run().catch(console.error);
