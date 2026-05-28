import { db } from '~/server/db'
import { subcategories } from '~/server/db/schema'
import { validateBody } from '~/server/utils/validate'
import { makeSlug } from '~/server/utils/slugify'
import { asc } from 'drizzle-orm'
import { z } from 'zod'
import { enhanceSubcategories } from '~/server/utils/db'

export default defineEventHandler(async () => {
  const items = await enhanceSubcategories(
    await db.select().from(subcategories).orderBy(asc(subcategories.sortOrder)),
  )

  const data = items.map(s => ({
    id: s.id,
    categoryId: s.categoryId,
    name: s.name,
    slug: s.slug,
    sortOrder: s.sortOrder,
    isActive: !!s.isActive,
    createdAt: s.createdAt,
    category: s.category ? { id: s.category.id, name: s.category.name, slug: s.category.slug } : null,
  }))

  return { data }
})
