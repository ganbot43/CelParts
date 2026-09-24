import { db } from '~/server/db'
import { banners } from '~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const itemsResult = await db.query.banners.findMany({
    where: query.active ? eq(banners.isActive, 1) : undefined,
    orderBy: (b, { asc }) => [asc(b.sortOrder)],
  })

  const data = itemsResult.map(b => ({
    id: b.id,
    imageUrl: b.imageUrl,
    linkUrl: b.linkUrl,
    // El texto se compone sobre la imagen en el carrusel de portada.
    eyebrow: b.eyebrow,
    title: b.title,
    subtitle: b.subtitle,
    ctaLabel: b.ctaLabel,
    align: b.align ?? 'left',
    sortOrder: b.sortOrder,
    isActive: !!b.isActive,
  }))

  return { data }
})
