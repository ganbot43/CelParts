import { db } from '~/server/db'
import { products, productImages } from '~/server/db/schema'
import { validateBody } from '~/server/utils/validate'
import { makeSlug } from '~/server/utils/slugify'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { enhanceProducts } from '~/server/utils/db'

const schema = z.object({
  name:          z.string().min(2).optional(),
  categoryId:    z.number().int().positive().optional().nullable(),
  subcategoryId: z.number().int().positive().optional().nullable(),
  description:   z.string().max(1000).optional().nullable(),
  price:         z.number().positive().optional(),
  stock:         z.number().int().min(0).optional(),
  trackStock:    z.boolean().optional(),
  isFeatured:    z.boolean().optional(),
  nuevoLanzamiento: z.boolean().optional(),
  isActive:      z.boolean().optional(),
  images:        z.array(z.object({ url: z.string().min(1), isPrimary: z.boolean().default(false) })).optional(),
})

export default defineEventHandler(async (event) => {
  const id   = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const data = validateBody(schema, body)

  const updateData: any = { ...data, updatedAt: new Date() }
  if (data.name) updateData.slug = makeSlug(data.name)

  // Remover imágenes del objeto de actualización del producto
  const images = updateData.images
  delete updateData.images

  await db.update(products)
    .set(updateData)
    .where(eq(products.id, id))
    .execute()

  // Si hay imágenes, actualizar la tabla product_images
  if (images && Array.isArray(images)) {
    // Eliminar imágenes anteriores
    await db.delete(productImages)
      .where(eq(productImages.productId, id))
      .execute()

    // Insertar las nuevas imágenes
    for (const [i, img] of images.entries()) {
      await db.insert(productImages).values({
        productId: id,
        url:       img.url,
        sortOrder: i,
        isPrimary: img.isPrimary || i === 0 ? 1 : 0,
      }).execute()
    }
  }

  return (await enhanceProducts(
    await db.select().from(products).where(eq(products.id, id)).limit(1),
  ))[0]
})
