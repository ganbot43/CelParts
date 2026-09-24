import { db } from '~/server/db'

export default defineEventHandler(async () => {
  const items = await db.query.banners.findMany({
    orderBy: (b, { asc }) => [asc(b.sortOrder)],
  })

  const data = items.map(b => ({
    id: b.id,
    imageUrl: b.imageUrl,
    linkUrl: b.linkUrl,
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
