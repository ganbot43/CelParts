import type { H3Error } from 'h3'

/**
 * Manejo uniforme de errores en los endpoints.
 *
 * Existe por tres problemas que tenía la API:
 *
 *  1. Los `catch` genéricos relanzaban TODO como 500. Un `createError`
 *     de 400 o 404 lanzado dentro del `try` llegaba al cliente como
 *     "error del servidor", de modo que una petición mal formada se
 *     veía igual que una caída de la base.
 *
 *  2. Se devolvía `error.message` al cliente. Cuando fallaba una
 *     consulta, el navegador recibía el SQL completo con nombres de
 *     tabla y de columna: información que no debe salir del servidor.
 *
 *  3. Se mezclaba `message` y `statusMessage`. h3 ya avisa de que
 *     `statusMessage` será saneado y recomienda `message`.
 */

/** Un error de h3 ya trae su código; no hay que reclasificarlo. */
function isH3Error(error: unknown): error is H3Error {
  return Boolean(error) && typeof error === 'object' && 'statusCode' in (error as any)
}

/**
 * Relanza el error respetando su código si ya venía tipado, y en
 * cualquier otro caso registra el detalle en el servidor y devuelve un
 * 500 con un mensaje que se puede enseñar.
 *
 * @param context  De dónde viene, para localizarlo en los logs.
 * @param error    Lo capturado.
 * @param publicMessage  Lo que puede leer el cliente.
 */
export function handleApiError(
  context: string,
  error: unknown,
  publicMessage = 'No se pudo completar la operación. Inténtalo nuevamente.',
): never {
  /* Errores ya clasificados (validación, no encontrado, sin permiso):
     pasan tal cual, con su código y su mensaje. */
  if (isH3Error(error) && typeof error.statusCode === 'number' && error.statusCode < 500) {
    throw error
  }

  /* Lo inesperado se registra completo —ahí sí hace falta el SQL— y se
     responde con un mensaje neutro. */
  console.error(`❌ [${context}]`, error)

  throw createError({
    statusCode: 500,
    message: publicMessage,
  })
}

/**
 * Marca la respuesta como 201 y devuelve el recurso creado.
 * Un POST que crea algo no debería responder 200: el código dice si
 * hubo creación, y hay clientes (y caches) que se apoyan en eso.
 */
export function created<T>(event: any, resource: T): T {
  setResponseStatus(event, 201)
  return resource
}
