import { db } from '~/server/db'
import { materials } from '~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const all = query.all === 'true' || query.all === true
  
  const conditions = all ? undefined : eq(materials.isActive, 1)
  
  const data = await db.select().from(materials).where(conditions)
  return { data }
})
