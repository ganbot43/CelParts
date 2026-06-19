import { db } from '~/server/db';
import { orders } from '~/server/db/schema';
import { sql, gte } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const result = await db.select({
    date: sql<string>`DATE(${orders.createdAt})`,
    totalSales: sql<number>`SUM(${orders.total})`,
    orderCount: sql<number>`COUNT(${orders.id})`
  })
  .from(orders)
  .where(gte(orders.createdAt, thirtyDaysAgo))
  .groupBy(sql`DATE(${orders.createdAt})`)
  .orderBy(sql`DATE(${orders.createdAt})`);

  return result;
});
