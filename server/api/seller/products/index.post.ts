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
  description:   z.string().max(2000).optional().nullable(),
  price:         z.number().positive(),
  material:      z.string().optional().nullable(),
  sizeLength:    z.number().positive().optional().nullable(),
  sizeWidth:     z.number().positive().optional().nullable(),
  sizeUnit:      z.string().default('cm'),
  offersPattern: z.boolean().default(false),
  isActive:      z.boolean().default(true),
  images:        z.array(z.object({ url: z.string().min(1), isPrimary: z.boolean().default(false) })).optional(),
})

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session?.user) throw createError({ statusCode: 401, message: 'No autorizado' })
  const sellerId = session.user.id

  const body = await readBody(event)
  const data = validateBody(schema, body)

  const slug = makeSlug(data.name)

  const productId = await insertAndGetId(products, {
    name: data.name,
    description: data.description,
    price: data.price,
    material: data.material,
    sizeLength: data.sizeLength,
    sizeWidth: data.sizeWidth,
    sizeUnit: data.sizeUnit,
    offersPattern: data.offersPattern ? 1 : 0,
    isActive: data.isActive ? 1 : 0,
    slug,
    sellerId
  })

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

  return (await enhanceProducts(
    await db.select().from(products).where(eq(products.id, productId)).limit(1),
  ))[0]
})
