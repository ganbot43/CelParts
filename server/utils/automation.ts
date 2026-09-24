import nodemailer from 'nodemailer'

type OrderLine = {
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

type OrderLike = {
  orderCode?: string | null
  customerName?: string | null
  customerPhone?: string | null
  customerAddress?: string | null
  customerNotes?: string | null
  status?: string | null
  total?: number | null
  subtotal?: number | null
  userId?: number | null
  createdAt?: string | Date | null
  paymentMethod?: {
    label?: string | null
    type?: string | null
  } | null
  items?: OrderLine[]
}

type LowStockItem = {
  id: number
  name: string
  stock: number
  slug?: string | null
  category?: {
    name?: string | null
  } | null
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatCurrency(value: number | null | undefined): string {
  const amount = Number(value ?? 0)
  return `S/ ${amount.toFixed(2)}`
}

function formatStatusLabel(value?: string | null): string {
  const normalized = (value ?? '').trim().toLowerCase().replace(/[_-]+/g, ' ')

  const labels: Record<string, string> = {
    created: 'Creado',
    pending: 'Pendiente',
    'payment pending': 'Pago pendiente',
    processing: 'En preparación',
    confirmed: 'Confirmado',
    paid: 'Pagado',
    packed: 'Empacado',
    shipped: 'Enviado',
    'in transit': 'En camino',
    delivered: 'Entregado',
    completed: 'Completado',
    cancelled: 'Cancelado',
    canceled: 'Cancelado',
    rejected: 'Rechazado',
    refunded: 'Reembolsado',
    returned: 'Devuelto',
    failed: 'Fallido',
    'on hold': 'En espera',
    hold: 'En espera',
  }

  if (labels[normalized]) {
    return labels[normalized]
  }

  if (!normalized) {
    return '-'
  }

  return normalized
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatEventLabel(value: string) {
  return formatStatusLabel(value)
}

function getMailerConfig() {
  const config = useRuntimeConfig()
  const required = ['smtpHost', 'smtpPort', 'smtpUser', 'smtpPassword', 'smtpFrom'] as const
  const missing = required.filter((key) => !config[key])

  if (missing.length > 0) {
    return null
  }

  return {
    host: config.smtpHost as string,
    port: Number(config.smtpPort),
    user: config.smtpUser as string,
    password: config.smtpPassword as string,
    from: config.smtpFrom as string,
  }
}

function createTransporter() {
  const mailer = getMailerConfig()
  if (!mailer) return null

  return {
    mailer,
    transporter: nodemailer.createTransport({
      host: mailer.host,
      port: mailer.port,
      secure: mailer.port === 465,
      auth: {
        user: mailer.user,
        pass: mailer.password,
      },
      tls: {
        rejectUnauthorized: false
      }
    }),
  }
}

function buildOrderRows(order: OrderLike): string {
  const lines = order.items ?? []
  if (!lines.length) {
    return '<p style="margin:0;color:#666;">No se registraron productos en el pedido.</p>'
  }

  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-size:13px;color:#475569;">
      <thead>
        <tr>
          <th align="left" style="padding:12px 10px;border-bottom:1px solid #f1f5f9;font-weight:700;color:#64748b;">Producto</th>
          <th align="center" style="padding:12px 10px;border-bottom:1px solid #f1f5f9;font-weight:700;color:#64748b;">Cant.</th>
          <th align="right" style="padding:12px 10px;border-bottom:1px solid #f1f5f9;font-weight:700;color:#64748b;">Precio</th>
          <th align="right" style="padding:12px 10px;border-bottom:1px solid #f1f5f9;font-weight:700;color:#64748b;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${lines.map((line) => `
          <tr>
            <td style="padding:14px 10px;border-bottom:1px solid #f8fafc;">${escapeHtml(line.productName)}</td>
            <td align="center" style="padding:14px 10px;border-bottom:1px solid #f8fafc;">${line.quantity}</td>
            <td align="right" style="padding:14px 10px;border-bottom:1px solid #f8fafc;">${formatCurrency(line.unitPrice)}</td>
            <td align="right" style="padding:14px 10px;border-bottom:1px solid #f8fafc;">${formatCurrency(line.subtotal)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `
}

function buildOrderEmailHtml(order: OrderLike, title: string, note?: string, bConfig?: any, isCustomer: boolean = false) {
  const customerName = escapeHtml(order.customerName ?? 'Cliente')
  const customerAddress = escapeHtml(order.customerAddress ?? '-')
  const statusRaw = order.status ?? 'pending'
  const status = escapeHtml(formatStatusLabel(statusRaw))
  const paymentMethod = escapeHtml(order.paymentMethod?.label ?? order.paymentMethod?.type ?? '-')
  const orderCode = escapeHtml(order.orderCode ?? 'PED-TEMP')
  const total = formatCurrency(order.total ?? order.subtotal ?? 0)
  
  const isNegativeStatus = /cancel|reject|fail|refunded|returned/i.test(statusRaw)
  const isPositiveStatus = /deliver|complete|paid|shipped/i.test(statusRaw)
  
  // Use sky blue by default for the example design
  const primaryColor = '#0ea5e9'
  
  const statusBg = isNegativeStatus ? '#ef4444' : isPositiveStatus ? '#22c55e' : primaryColor
  const noteBlock = note ? `<div style="margin-top:20px;padding:14px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:6px;color:#0369a1;font-size:13px;line-height:1.5;"><strong>Nota:</strong> ${escapeHtml(note).replace(/\n/g, '<br>')}</div>` : ''

  const businessName = bConfig?.name ? escapeHtml(bConfig.name) : 'CelParts'
  
  const bodyMessage = isCustomer 
    ? '¡Gracias por tu preferencia! A continuación te mostramos los detalles de tu pedido.'
    : 'Se ha registrado un nuevo pedido en el sistema.'

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:20px 10px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td align="center" style="background:${primaryColor};padding:24px;">
              <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;">${escapeHtml(title)}</h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding:32px 24px;">
              <p style="margin:0 0 20px 0;font-size:14px;color:#475569;">${bodyMessage}</p>
              
              <!-- Detalles Box -->
              <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:20px;margin-bottom:24px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:14px;line-height:1.6;color:#334155;">
                  <tr>
                    <td style="padding-bottom:8px;"><strong>Código de Pedido:</strong> <span style="color:${primaryColor};">${orderCode}</span></td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:8px;"><strong>Cliente:</strong> ${customerName}</td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:8px;"><strong>Dirección:</strong> ${customerAddress}</td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:8px;"><strong>Método de Pago:</strong> ${paymentMethod}</td>
                  </tr>
                  <tr>
                    <td><strong>Estado:</strong> <span style="display:inline-block;background:${statusBg};color:#ffffff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:600;margin-left:4px;">${status}</span></td>
                  </tr>
                </table>
              </div>
              
              <!-- Items Table -->
              ${buildOrderRows(order)}
              
              <!-- Total -->
              <div style="margin-top:24px;padding-top:24px;border-top:1px solid #e2e8f0;text-align:right;">
                <span style="font-size:13px;color:#64748b;margin-right:12px;">TOTAL A PAGAR:</span>
                <span style="font-size:24px;font-weight:800;color:${primaryColor};">${total}</span>
              </div>
              
              ${noteBlock}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="background:#f8fafc;padding:24px;border-top:1px solid #e2e8f0;">
              <p style="margin:0 0 8px 0;font-size:12px;color:#94a3b8;">${businessName} — Repuestos & Accesorios para Celulares</p>
              <p style="margin:0;font-size:11px;color:#cbd5e1;">Este es un correo automático, por favor no respondas a este mensaje.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

import { db } from '~/server/db'
import { businessConfig, users } from '~/server/db/schema'
import { eq } from 'drizzle-orm'

async function sendAutomationEmail(subject: string, html: string, configEmailOverride?: string) {
  const transporter = createTransporter()
  if (!transporter) {
    console.warn(`[automation] SMTP no configurado, se omite correo: ${subject}`)
    return false
  }
  
  const toEmail = configEmailOverride || transporter.mailer.from

  await transporter.transporter.sendMail({
    from: transporter.mailer.from,
    to: toEmail,
    subject,
    html,
  })
  return true
}

export async function sendOrderNotification(order: OrderLike, eventLabel: string, note?: string) {
  const label = formatEventLabel(eventLabel)
  const isCreated = eventLabel === 'created'
  
  const adminTitle = isCreated
    ? 'Nuevo Pedido Recibido'
    : `Pedido actualizado: ${label}`

  const customerTitle = isCreated
    ? 'Confirmación de Compra'
    : `Tu pedido ha sido actualizado`

  const orderCode = order.orderCode ?? 'PED-TEMP'

  const bConfig = await db.select().from(businessConfig).limit(1)
  const config = bConfig[0]

  // Enviar a Admin
  await sendAutomationEmail(
    `${adminTitle} - ${orderCode}`, 
    buildOrderEmailHtml(order, adminTitle, note, config, false),
    config?.email || undefined
  )

  // Enviar a Cliente si está logueado y tiene correo
  if (order.userId) {
    const userRows = await db.select().from(users).where(eq(users.id, order.userId)).limit(1)
    const customerEmail = userRows[0]?.email
    if (customerEmail) {
      await sendAutomationEmail(
        `${customerTitle} - ${orderCode}`, 
        buildOrderEmailHtml(order, customerTitle, note, config, true),
        customerEmail
      )
    }
  }
  
  return true
}

export async function sendLowStockNotification(items: LowStockItem[]) {
  const bConfig = await db.select().from(businessConfig).limit(1)
  const config = bConfig[0]
  const businessName = config?.name ? escapeHtml(config.name) : 'Smart Panel'
  const logoUrl = config?.logoUrl ? escapeHtml(config.logoUrl) : ''
  const toEmail = config?.email || undefined

  const rows = items.length
    ? items.map((item) => `
        <tr>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0;color:#0f172a;">${escapeHtml(item.name)}</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0;color:#64748b;">${escapeHtml(item.category?.name ?? '-')}</td>
          <td align="center" style="padding:10px;border-bottom:1px solid #e2e8f0;color:#ef4444;font-weight:700;">${item.stock}</td>
        </tr>
      `).join('')
    : '<tr><td colspan="3" style="padding:12px;color:#64748b;">No hay productos bajo el umbral configurado.</td></tr>'

  const html = `<!DOCTYPE html>
  <html lang="es">
  <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
  <body style="margin:0;padding:24px;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:720px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.05);">
      <div style="padding:22px 28px;background:linear-gradient(135deg, #071e52, #0077c8);border-bottom:3px solid #00aeef;color:#fff;">
        ${logoUrl ? `<img src="${logoUrl}" alt="${businessName}" style="max-height:40px;margin-bottom:15px;display:block;" />` : ''}
        <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#dbeafe;font-weight:700;">Alerta de inventario</div>
        <div style="font-size:22px;font-weight:700;margin-top:8px;">Productos con stock bajo</div>
      </div>
      <div style="padding:20px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:13px;">
          <thead>
            <tr>
              <th align="left" style="padding:10px;border-bottom:1px solid #e2e8f0;color:#64748b;text-transform:uppercase;font-size:11px;">Producto</th>
              <th align="left" style="padding:10px;border-bottom:1px solid #e2e8f0;color:#64748b;text-transform:uppercase;font-size:11px;">Categoría</th>
              <th align="center" style="padding:10px;border-bottom:1px solid #e2e8f0;color:#64748b;text-transform:uppercase;font-size:11px;">Stock</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  </body>
  </html>`

  return sendAutomationEmail('Alerta de stock bajo', html, toEmail)
}
