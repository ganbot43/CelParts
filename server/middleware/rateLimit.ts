const cache = new Map<string, { count: number, lastRequest: number }>();

export default defineEventHandler((event) => {

  if (event.path === '/api/contacto' && event.method === 'POST') {
    const clientIP = getRequestIP(event, { xForwardedFor: true }) || 'unknown';
    const now = Date.now();
    const windowMs = 60 * 1000; // Ventana de 1 minuto
    const maxRequests = 20; // Máximo 3 intentos por minuto

    const userData = cache.get(clientIP) || { count: 0, lastRequest: now };

    // Reiniciar contador si ya pasó el minuto
    if (now - userData.lastRequest > windowMs) {
      userData.count = 0;
      userData.lastRequest = now;
    }

    userData.count++;
    cache.set(clientIP, userData);

    if (userData.count > maxRequests) {
      throw createError({
        statusCode: 429,
        statusMessage: 'Demasiadas solicitudes. Intente más tarde.',
      });
    }
  }
});