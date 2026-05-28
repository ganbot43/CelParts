import { z } from 'zod'

export function validateBody<T>(schema: z.ZodSchema<T>, body: unknown): T {
  const result = schema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 422,
      message: 'Datos inválidos',
      data: result.error.flatten(),
    })
  }
  return result.data
}
