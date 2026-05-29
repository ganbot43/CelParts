import { db } from '~/server/db'
import { insertAndGetId } from '~/server/db/mysql'
import { categories, productImages, products, subcategories } from '~/server/db/schema'
import { validateBody } from '~/server/utils/validate'
import { makeSlug } from '~/server/utils/slugify'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const categorySchema = z.object({
  name: z.string().min(2),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  subcategories: z.array(z.string().min(2)).optional(),
})

const productSchema = z.object({
  name: z.string().min(2),
  categoryName: z.string().min(2),
  subcategoryName: z.string().min(2).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  price: z.number().positive(),
  stock: z.number().int().min(0).optional().default(0),
  trackStock: z.boolean().optional().default(false),
  isFeatured: z.boolean().optional().default(false),
  nuevoLanzamiento: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  imageUrl: z.string().url().optional().nullable(),
})

const schema = z.object({
  categories: z.array(categorySchema).optional(),
  products: z.array(productSchema).optional(),
})

async function upsertCategory(name: string, sortOrder = 0, isActive = true) {
  const slug = makeSlug(name)
  const existing = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1)

  if (existing[0]) {
    await db.update(categories)
      .set({ name, sortOrder, isActive: isActive ? 1 : 0 })
      .where(eq(categories.id, existing[0].id))
      .execute()
    return existing[0].id
  }

  return insertAndGetId(categories, {
    name,
    slug,
    sortOrder,
    isActive: isActive ? 1 : 0,
  })
}

async function upsertSubcategory(categoryId: number, name: string, sortOrder = 0) {
  const slug = makeSlug(name)
  const existing = await db.select().from(subcategories).where(eq(subcategories.slug, slug)).limit(1)

  if (existing[0]) {
    await db.update(subcategories)
      .set({ name, categoryId, sortOrder, isActive: 1 })
      .where(eq(subcategories.id, existing[0].id))
      .execute()
    return existing[0].id
  }

  return insertAndGetId(subcategories, {
    categoryId,
    name,
    slug,
    sortOrder,
    isActive: 1,
  })
}

async function upsertProduct(input: z.infer<typeof productSchema>, categoryId: number, subcategoryId: number | null) {
  const slug = makeSlug(input.name)
  const existing = await db.select().from(products).where(eq(products.slug, slug)).limit(1)

  const payload = {
    categoryId,
    subcategoryId,
    name: input.name,
    slug,
    description: input.description ?? null,
    price: input.price,
    stock: input.stock ?? 0,
    trackStock: input.trackStock ? 1 : 0,
    isFeatured: input.isFeatured ? 1 : 0,
    nuevoLanzamiento: input.nuevoLanzamiento ? 1 : 0,
    isActive: input.isActive ? 1 : 0,
  }

  let productId = existing[0]?.id ?? null
  if (productId) {
    await db.update(products)
      .set({ ...payload, updatedAt: new Date() })
      .where(eq(products.id, productId))
      .execute()
  } else {
    productId = await insertAndGetId(products, payload)
  }

  if (input.imageUrl) {
    await db.delete(productImages).where(eq(productImages.productId, productId)).execute()
    await db.insert(productImages).values({
      productId,
      url: input.imageUrl,
      sortOrder: 0,
      isPrimary: 1,
    }).execute()
  }

  return productId
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = validateBody(schema, body)

  const summary = {
    categories: 0,
    subcategories: 0,
    products: 0,
  }

  for (const [index, categoryInput] of (data.categories ?? []).entries()) {
    const categoryId = await upsertCategory(categoryInput.name, categoryInput.sortOrder ?? index, categoryInput.isActive ?? true)
    summary.categories += 1

    for (const [subIndex, subcategoryName] of (categoryInput.subcategories ?? []).entries()) {
      await upsertSubcategory(categoryId, subcategoryName, subIndex)
      summary.subcategories += 1
    }
  }

  for (const productInput of data.products ?? []) {
    const categoryId = await upsertCategory(productInput.categoryName)
    let subcategoryId: number | null = null
    if (productInput.subcategoryName) {
      subcategoryId = await upsertSubcategory(categoryId, productInput.subcategoryName)
    }
    await upsertProduct(productInput, categoryId, subcategoryId)
    summary.products += 1
  }

  return {
    ok: true,
    summary,
  }
})
