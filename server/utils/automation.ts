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
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
      <thead>
        <tr>
          <th align="left" style="padding:10px;border-bottom:1px solid #e5e5e5;font-size:12px;">Producto</th>
          <th align="center" style="padding:10px;border-bottom:1px solid #e5e5e5;font-size:12px;">Cant.</th>
          <th align="right" style="padding:10px;border-bottom:1px solid #e5e5e5;font-size:12px;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${lines.map((line) => `
          <tr>
            <td style="padding:10px;border-bottom:1px solid #f1f1f1;font-size:13px;">${escapeHtml(line.productName)}</td>
            <td align="center" style="padding:10px;border-bottom:1px solid #f1f1f1;font-size:13px;">${line.quantity}</td>
            <td align="right" style="padding:10px;border-bottom:1px solid #f1f1f1;font-size:13px;">${formatCurrency(line.subtotal)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `
}

function buildOrderEmailHtml(order: OrderLike, title: string, note?: string) {
  const customerName = escapeHtml(order.customerName ?? 'Cliente')
  const customerPhone = escapeHtml(order.customerPhone ?? '-')
  const customerAddress = escapeHtml(order.customerAddress ?? '-')
  const statusRaw = order.status ?? 'pending'
  const status = escapeHtml(formatStatusLabel(statusRaw))
  const paymentMethod = escapeHtml(order.paymentMethod?.label ?? order.paymentMethod?.type ?? '-')
  const orderCode = escapeHtml(order.orderCode ?? 'PED-TEMP')
  const total = formatCurrency(order.total ?? order.subtotal ?? 0)
  const customerNotes = order.customerNotes ? escapeHtml(order.customerNotes).replace(/\n/g, '<br>') : ''
  const isNegativeStatus = /cancel|reject|fail|refunded|returned/i.test(statusRaw)
  const isPositiveStatus = /deliver|complete|paid|shipped/i.test(statusRaw)
  const statusTone = isNegativeStatus
    ? 'rgba(214, 106, 106, 0.12)'
    : isPositiveStatus
      ? 'rgba(45, 106, 79, 0.12)'
      : 'rgba(233, 196, 106, 0.18)'
  const statusBorder = isNegativeStatus
    ? '#D66A6A'
    : isPositiveStatus
      ? '#2D6A4F'
      : '#E9C46A'
  const noteBlock = note ? `<div style="margin-top:14px;padding:12px 14px;background:rgba(45,106,79,0.06);border-left:4px solid #2D6A4F;color:#333;font-size:13px;line-height:1.6;border-radius:10px;">${escapeHtml(note).replace(/\n/g, '<br>')}</div>` : ''

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)} - ${orderCode}</title>
</head>
  <body style="margin:0;padding:0;background:linear-gradient(180deg,#F8F7F4 0%,#F1EFEA 100%);font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:24px 12px;">
    <tr>
      <td align="center">
        <table width="640" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:640px;background:rgba(255,255,255,0.78);border:1px solid rgba(226,224,217,0.5);border-radius:12px;overflow:hidden;box-shadow:0 16px 36px rgba(17,17,17,0.06);">
          <tr>
            <td style="background:linear-gradient(135deg,#101010,#141414 55%,#111111);padding:22px 28px;border-bottom:3px solid #E9C46A;">
              <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#E9C46A;font-weight:700;">${escapeHtml(title)}</div>
              <div style="font-size:22px;font-weight:700;color:#ffffff;margin-top:8px;">Pedido ${orderCode}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px 8px;">
              <div style="font-size:13px;color:#666;line-height:1.6;">Se registró un nuevo movimiento de pedido en el sistema.</div>
              <div style="margin-top:18px;display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                <div><div style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#9E9A91;font-weight:700;">Cliente</div><div style="font-size:14px;color:#111;font-weight:600;margin-top:4px;">${customerName}</div></div>
                <div><div style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#9E9A91;font-weight:700;">Estado</div><div style="display:inline-flex;align-items:center;gap:8px;margin-top:4px;padding:8px 10px;background:${statusTone};border:1px solid ${statusBorder};border-radius:999px;font-size:13px;color:#111;font-weight:700;line-height:1;">${status}</div></div>
                <div><div style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#9E9A91;font-weight:700;">Teléfono</div><div style="font-size:14px;color:#111;font-weight:600;margin-top:4px;">${customerPhone}</div></div>
                <div><div style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#9E9A91;font-weight:700;">Pago</div><div style="font-size:14px;color:#111;font-weight:600;margin-top:4px;">${paymentMethod}</div></div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px 4px;">${buildOrderRows(order)}</td>
          </tr>
          <tr>
            <td style="padding:16px 28px 24px;">
              <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;background:rgba(255,255,255,0.72);border:1px solid rgba(226,224,217,0.5);border-radius:10px;padding:14px 16px;">
                <div>
                  <div style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#9E9A91;font-weight:700;">Total</div>
                  <div style="font-size:22px;color:#2D6A4F;font-weight:800;margin-top:4px;">${total}</div>
                </div>
                <div style="text-align:right;font-size:12px;color:#66625A;line-height:1.5;max-width:260px;">${customerAddress}</div>
              </div>
              ${customerNotes ? `<div style="margin-top:14px;font-size:13px;color:#444;line-height:1.7;"><strong>Notas del cliente:</strong><br>${customerNotes}</div>` : ''}
              ${noteBlock}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

async function sendAutomationEmail(subject: string, html: string) {
  const transporter = createTransporter()
  if (!transporter) {
    console.warn(`[automation] SMTP no configurado, se omite correo: ${subject}`)
    return false
  }

  await transporter.transporter.sendMail({
    from: transporter.mailer.from,
    to: transporter.mailer.from,
    subject,
    html,
  })
  return true
}

export async function sendOrderNotification(order: OrderLike, eventLabel: string, note?: string) {
  const label = formatEventLabel(eventLabel)
  const title = eventLabel === 'created'
    ? 'Nuevo pedido creado'
    : `Pedido actualizado: ${label}`
  const orderCode = order.orderCode ?? 'PED-TEMP'
  return sendAutomationEmail(`${title} - ${orderCode}`, buildOrderEmailHtml(order, title, note))
}

export async function sendLowStockNotification(items: LowStockItem[]) {
  const rows = items.length
    ? items.map((item) => `
        <tr>
          <td style="padding:10px;border-bottom:1px solid rgba(226,224,217,0.5);">${escapeHtml(item.name)}</td>
          <td style="padding:10px;border-bottom:1px solid rgba(226,224,217,0.5);">${escapeHtml(item.category?.name ?? '-')}</td>
          <td align="center" style="padding:10px;border-bottom:1px solid rgba(226,224,217,0.5);">${item.stock}</td>
        </tr>
      `).join('')
    : '<tr><td colspan="3" style="padding:12px;color:#66625A;">No hay productos bajo el umbral configurado.</td></tr>'

  const html = `<!DOCTYPE html>
  <html lang="es">
  <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
  <body style="margin:0;padding:24px;background:linear-gradient(180deg,#F8F7F4 0%,#F1EFEA 100%);font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:720px;margin:0 auto;background:rgba(255,255,255,0.78);border:1px solid rgba(226,224,217,0.5);border-radius:12px;overflow:hidden;box-shadow:0 16px 36px rgba(17,17,17,0.06);">
      <div style="padding:20px 24px;background:linear-gradient(135deg,#101010,#141414 55%,#111111);border-bottom:3px solid #E9C46A;color:#fff;">
        <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#E9C46A;font-weight:700;">Alerta de inventario</div>
        <div style="font-size:22px;font-weight:700;margin-top:8px;">Productos con stock bajo</div>
      </div>
      <div style="padding:20px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          <thead>
            <tr>
              <th align="left" style="padding:10px;border-bottom:1px solid rgba(226,224,217,0.5);">Producto</th>
              <th align="left" style="padding:10px;border-bottom:1px solid rgba(226,224,217,0.5);">Categoría</th>
              <th align="center" style="padding:10px;border-bottom:1px solid rgba(226,224,217,0.5);">Stock</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  </body>
  </html>`

  return sendAutomationEmail('Alerta de stock bajo', html)
}
