import { db } from '~/server/db';
import { orders } from '~/server/db/schema';
import { sql, gte } from 'drizzle-orm';

/* Las columnas timestamp están en UTC: el agrupado por día se hace sobre la
   fecha de Lima, si no los pedidos de la noche caen en el día siguiente. */
const limaDate = sql<string>`DATE(CONVERT_TZ(${orders.createdAt}, '+00:00', '-05:00'))`;

export default defineEventHandler(async (event) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const result = await db.select({
    date: limaDate,
    totalSales: sql<number>`SUM(${orders.total})`,
    orderCount: sql<number>`COUNT(${orders.id})`
  })
  .from(orders)
  .where(gte(orders.createdAt, thirtyDaysAgo))
  .groupBy(limaDate)
  .orderBy(limaDate);

  return result;
});
