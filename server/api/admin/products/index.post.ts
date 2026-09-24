import { db } from '~/server/db'
import { insertAndGetId } from '~/server/db/mysql'
import { products, productImages } from '~/server/db/schema'
import { validateBody } from '~/server/utils/validate'
import { makeSlug } from '~/server/utils/slugify'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { enhanceProducts } from '~/server/utils/db'

const schema = z.object({
  name:          z.string().min(2),
  categoryId:    z.number().int().positive().optional().nullable(),
  subcategoryId: z.number().int().positive().optional().nullable(),
  description:   z.string().max(1000).optional().nullable(),
  price:         z.number().positive(),
  /* Precio tachado. Solo cuenta si es mayor que price: la validación
     evita publicar un "descuento" del 0% o negativo. */
  comparePrice:  z.number().positive().nullable().optional(),
  stock:         z.number().int().min(0).default(0),
  trackStock:    z.boolean().default(false),
  isFeatured:    z.boolean().default(false),
  nuevoLanzamiento: z.boolean().default(false),
  isActive:      z.boolean().default(true),
  images:        z.array(z.object({ url: z.string().min(1), isPrimary: z.boolean().default(false) })).optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = validateBody(schema, body)

  const slug = makeSlug(data.name)
  const initialStock = data.stock ?? 0

  const productId = await insertAndGetId(products, {
    ...data,
    stock: initialStock,
    slug,
    images: undefined as any,
  })

  // Insertar movimiento inicial de inventario
  if (data.trackStock && initialStock > 0) {
    const { inventoryMovements } = await import('~/server/db/schema')
    const session = await getUserSession(event)
    await db.insert(inventoryMovements).values({
      productId,
      movementType: 'entry',
      quantity: initialStock,
      delta: initialStock,
      reason: 'Inventario inicial (producto nuevo)',
      createdBy: (session.user as any)?.id || null,
    }).execute()
  }

  // Insertar imágenes si vienen
  if (data.images?.length) {
    for (const [i, img] of data.images.entries()) {
      await db.insert(productImages).values({
        productId,
        url:       img.url,
        sortOrder: i,
        isPrimary: img.isPrimary || i === 0 ? 1 : 0,
      }).execute()
    }
  }

  return created(event, (await enhanceProducts(
    await db.select().from(products).where(eq(products.id, productId)).limit(1),
  ))[0])
})
