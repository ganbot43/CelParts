import { db } from '~/server/db';
import { orders, products } from '~/server/db/schema';
import { desc } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  // Retornamos todos los pedidos y los productos para poder exportar ambos
  const allOrders = await db.query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
    with: {
      items: true
    }
  });
  
  const allProducts = await db.query.products.findMany({
    orderBy: [desc(products.createdAt)],
    with: {
      category: true
    }
  });

  return { orders: allOrders, products: allProducts };
});
