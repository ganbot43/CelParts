/**
 * Utilidades para integración con la API REST de PayPal v2
 */

export interface PayPalConfig {
  clientId: string
  clientSecret: string
  mode: 'sandbox' | 'live'
  currency: string
  exchangeRate: number
}

export function getPayPalConfig(): PayPalConfig {
  const config = useRuntimeConfig()
  return {
    clientId: (config.paypalClientId || process.env.PAYPAL_CLIENT_ID || '').trim(),
    clientSecret: (config.paypalClientSecret || process.env.PAYPAL_CLIENT_SECRET || '').trim(),
    mode: ((config.paypalMode || process.env.PAYPAL_MODE || 'sandbox') as 'sandbox' | 'live'),
    currency: (config.public?.paypalCurrency || process.env.PAYPAL_CURRENCY || 'USD').trim().toUpperCase(),
    exchangeRate: Number(config.public?.paypalExchangeRate || process.env.PAYPAL_EXCHANGE_RATE || 3.75),
  }
}

function getBaseUrl(mode: 'sandbox' | 'live'): string {
  return mode === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'
}

/**
 * Obtiene token de acceso OAuth2 de PayPal
 */
export async function getPayPalAccessToken(config?: PayPalConfig): Promise<string | null> {
  const cfg = config || getPayPalConfig()
  if (!cfg.clientId || !cfg.clientSecret || cfg.clientId === 'sb') {
    return null
  }

  const auth = Buffer.from(`${cfg.clientId}:${cfg.clientSecret}`).toString('base64')
  const baseUrl = getBaseUrl(cfg.mode)

  const res = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!res.ok) {
    const errorText = await res.text()
    console.error('Error al obtener token de PayPal:', errorText)
    throw new Error(`Error de autenticación con PayPal (${res.status})`)
  }

  const data = (await res.json()) as { access_token: string }
  return data.access_token
}

/**
 * Convierte un monto en PEN a la moneda configurada de PayPal (típicamente USD)
 */
export function convertPenToPayPalCurrency(amountPen: number, config?: PayPalConfig): { amount: number; currency: string } {
  const cfg = config || getPayPalConfig()
  if (cfg.currency === 'PEN') {
    return { amount: Math.round(amountPen * 100) / 100, currency: 'PEN' }
  }
  // Conversión a USD según tipo de cambio
  const rate = cfg.exchangeRate > 0 ? cfg.exchangeRate : 3.75
  const usd = Math.round((amountPen / rate) * 100) / 100
  return { amount: usd, currency: 'USD' }
}

/**
 * Crea una orden en PayPal
 */
export async function createPayPalOrder(params: {
  amount: number
  currency?: string
  orderCode?: string
  description?: string
}): Promise<{ id: string; status: string; isMock?: boolean }> {
  const cfg = getPayPalConfig()
  const token = await getPayPalAccessToken(cfg)
  const currency = params.currency || cfg.currency || 'USD'
  const formattedAmount = Number(params.amount).toFixed(2)

  // Si no hay credenciales completas configuradas, proveer fallback para modo prueba local
  if (!token) {
    console.warn('PayPal funcionando en modo sandbox/prueba sin API secret configurado')
    return {
      id: `PAYPAL-TEST-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: 'CREATED',
      isMock: true,
    }
  }

  const baseUrl = getBaseUrl(cfg.mode)
  const res = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: params.orderCode || undefined,
          description: params.description || `Pedido CelParts ${params.orderCode || ''}`.trim(),
          amount: {
            currency_code: currency,
            value: formattedAmount,
          },
        },
      ],
    }),
  })

  if (!res.ok) {
    const errorData = await res.text()
    console.error('Error al crear orden en PayPal:', errorData)
    throw new Error(`PayPal no pudo crear la orden (${res.status}): ${errorData}`)
  }

  const data = (await res.json()) as { id: string; status: string }
  return { id: data.id, status: data.status, isMock: false }
}

/**
 * Captura el pago de una orden previamente aprobada por el usuario
 */
export async function capturePayPalOrder(paypalOrderId: string): Promise<{
  id: string
  status: string
  captureId?: string
  payer?: Record<string, unknown>
  isMock?: boolean
}> {
  const cfg = getPayPalConfig()

  // Manejo de orden mock/prueba local
  if (paypalOrderId.startsWith('PAYPAL-TEST-')) {
    return {
      id: paypalOrderId,
      status: 'COMPLETED',
      captureId: `CAP-${Date.now()}`,
      payer: { email: 'sandbox-customer@celparts.com' },
      isMock: true,
    }
  }

  const token = await getPayPalAccessToken(cfg)
  if (!token) {
    throw new Error('No se pueden capturar órdenes de PayPal sin credenciales de servidor.')
  }

  const baseUrl = getBaseUrl(cfg.mode)
  const res = await fetch(`${baseUrl}/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
  })

  if (!res.ok) {
    const errText = await res.text()
    console.error('Error al capturar orden en PayPal:', errText)
    throw new Error(`PayPal no pudo capturar el pago (${res.status}): ${errText}`)
  }

  const data = (await res.json()) as {
    id: string
    status: string
    purchase_units?: Array<{
      payments?: {
        captures?: Array<{ id: string; status: string }>
      }
    }>
    payer?: Record<string, unknown>
  }

  const captureId = data.purchase_units?.[0]?.payments?.captures?.[0]?.id

  return {
    id: data.id,
    status: data.status,
    captureId,
    payer: data.payer,
    isMock: false,
  }
}
