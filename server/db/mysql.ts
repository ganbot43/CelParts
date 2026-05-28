import { db } from './index'

export async function insertAndGetId(table: any, values: any): Promise<number> {
  const [header] = await db.insert(table).values(values).execute()
  const insertId = Number((header as { insertId?: number }).insertId ?? 0)
  if (!insertId) {
    throw new Error('No se pudo obtener insertId')
  }
  return insertId
}
