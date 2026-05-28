import nodemailer from "nodemailer";

// ══════════════════════════════════════════════════════
//  CONFIGURACIÓN — cambiar aquí para cada proyecto
// ══════════════════════════════════════════════════════
const CONFIG = {
    // Nombre del remitente que aparece en el correo
    senderName: "A & D Estudio Contable y de Auditoría",

    // Asunto del correo (el nombre del lead se agrega automáticamente)
    emailSubject: "Nuevo lead web",

    // Score mínimo de reCAPTCHA para aceptar la solicitud (0.0 - 1.0)
    recaptchaMinScore: 0.5,

    // Campos obligatorios del formulario
    requiredFields: ["nombre", "correo", "telefono", "tipo_servicio", "mensaje"] as const,
} as const;

// ══════════════════════════════════════════════════════
//  TIPOS
// ══════════════════════════════════════════════════════
type FormBody = {
    nombre: string;
    correo: string;
    telefono: string;
    tipo_servicio: string;
    mensaje: string;
    honeypot?: string;
    recaptchaToken?: string;
};

type RecaptchaResponse = {
    success: boolean;
    score: number;
};

// ══════════════════════════════════════════════════════
//  FUNCIONES
// ══════════════════════════════════════════════════════

/** Escapa caracteres HTML para evitar inyección */
function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

/** Verifica que todos los campos requeridos estén presentes y no vacíos */
function validateBody(body: Record<string, unknown>): FormBody {
    for (const field of CONFIG.requiredFields) {
        const value = body[field];
        if (typeof value !== "string" || value.trim() === "") {
            throw createError({
                statusCode: 400,
                statusMessage: `El campo "${field}" es obligatorio`,
            });
        }
    }
    return body as FormBody;
}

/** Valida el token de reCAPTCHA contra la API de Google */
async function validateRecaptcha(token: string, secretKey: string): Promise<void> {
    const verification = await $fetch<RecaptchaResponse>(
        "https://www.google.com/recaptcha/api/siteverify",
        {
            method: "POST",
            params: {
                secret: secretKey,
                response: token,
            },
        }
    );

    if (!verification.success || verification.score < CONFIG.recaptchaMinScore) {
        throw createError({
            statusCode: 403,
            statusMessage: "Verificación reCAPTCHA fallida",
        });
    }
}

/** Valida que la configuración SMTP esté completa */
function validateSmtpConfig(config: ReturnType<typeof useRuntimeConfig>): void {
    const required = ["smtpHost", "smtpPort", "smtpUser", "smtpPassword", "smtpFrom"] as const;
    for (const key of required) {
        if (!config[key]) {
            throw createError({
                statusCode: 500,
                statusMessage: `Variable de entorno "${key}" no configurada`,
            });
        }
    }
}

/** Crea el transporter de nodemailer */
function createTransporter(config: ReturnType<typeof useRuntimeConfig>) {
    const port = Number(config.smtpPort);
    return nodemailer.createTransport({
        host: config.smtpHost as string,
        port,
        secure: port === 465,
        auth: {
            user: config.smtpUser as string,
            pass: config.smtpPassword as string,
        },
    });
}

/** Construye el cuerpo HTML del correo con diseño profesional */
function buildHtml(body: FormBody): string {
    const nombre = escapeHtml(body.nombre);
    const correo = escapeHtml(body.correo);
    const telefono = escapeHtml(body.telefono);
    const servicio = escapeHtml(body.tipo_servicio);
    const mensaje = escapeHtml(body.mensaje).replace(/\n/g, "<br>");
    const year = new Date().getFullYear();
    const senderEmail = CONFIG.adminEmail;

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Nuevo contacto — ${CONFIG.senderName}</title>
</head>
<body style="margin:0;padding:0;background:#E8E4DF;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#E8E4DF;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
 
  <!-- ── HEADER oscuro ── -->
  <tr>
    <td style="background:#1A1A1A;border-radius:6px 6px 0 0;padding:0;overflow:hidden;">
      <!-- Línea dorada -->
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="height:4px;background:linear-gradient(90deg,#C9A86A,#E0C48A,#C9A86A);font-size:0;">&nbsp;</td>
      </tr></table>
      <!-- Logo -->
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="padding:26px 36px 22px;">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="border-right:1px solid rgba(201,168,106,0.35);padding-right:20px;vertical-align:middle;">
              <span style="font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:700;color:#E0C48A;letter-spacing:0.12em;">A &amp; D</span>
            </td>
            <td style="padding-left:20px;vertical-align:middle;">
              <div style="font-size:11px;font-weight:700;letter-spacing:0.26em;text-transform:uppercase;color:#E0C48A;line-height:1.3;">Estudio Contable</div>
              <div style="font-size:9px;font-weight:500;letter-spacing:0.22em;text-transform:uppercase;color:#555;margin-top:2px;">y de Auditoría</div>
            </td>
          </tr></table>
        </td>
      </tr></table>
    </td>
  </tr>
 
  <!-- ── BANNER nombre + servicio ── -->
  <tr>
    <td style="background:#222222;padding:22px 36px 20px;border-left:1px solid #2A2A2A;border-right:1px solid #2A2A2A;">
      <div style="font-size:10px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;color:#C9A86A;margin-bottom:6px;">Nuevo contacto desde la web</div>
      <div style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:0.02em;margin-bottom:12px;">${nombre}</div>
      <span style="display:inline-block;background:rgba(201,168,106,0.12);border:1px solid rgba(201,168,106,0.3);padding:4px 14px;font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#C9A86A;border-radius:2px;">${servicio}</span>
    </td>
  </tr>
 
  <!-- ── DATOS DE CONTACTO ── -->
  <tr>
    <td style="background:#ffffff;padding:28px 36px 8px;border-left:1px solid #E8E2D9;border-right:1px solid #E8E2D9;">
      <div style="font-size:10px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;color:#C9A86A;margin-bottom:18px;">Datos de contacto</div>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="50%" style="padding-bottom:16px;vertical-align:top;padding-right:12px;">
            <div style="font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#AAAAAA;margin-bottom:4px;">Nombre</div>
            <div style="font-size:15px;font-weight:600;color:#1A1A1A;">${nombre}</div>
          </td>
          <td width="50%" style="padding-bottom:16px;vertical-align:top;">
            <div style="font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#AAAAAA;margin-bottom:4px;">Teléfono</div>
            <div style="font-size:15px;font-weight:600;color:#1A1A1A;">${telefono}</div>
          </td>
        </tr>
        <tr>
          <td width="50%" style="padding-bottom:16px;vertical-align:top;padding-right:12px;">
            <div style="font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#AAAAAA;margin-bottom:4px;">Correo</div>
            <div style="font-size:15px;font-weight:600;color:#C9A86A;">${correo}</div>
          </td>
          <td width="50%" style="padding-bottom:16px;vertical-align:top;">
            <div style="font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#AAAAAA;margin-bottom:4px;">Servicio solicitado</div>
            <div style="font-size:15px;font-weight:600;color:#1A1A1A;">${servicio}</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
 
  <!-- ── SEPARADOR ── -->
  <tr>
    <td style="background:#ffffff;padding:0 36px;border-left:1px solid #E8E2D9;border-right:1px solid #E8E2D9;">
      <div style="height:1px;background:#F0EAE0;font-size:0;">&nbsp;</div>
    </td>
  </tr>
 
  <!-- ── MENSAJE ── -->
  <tr>
    <td style="background:#ffffff;padding:22px 36px 32px;border-left:1px solid #E8E2D9;border-right:1px solid #E8E2D9;">
      <div style="font-size:10px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;color:#C9A86A;margin-bottom:12px;">Mensaje</div>
      <div style="background:#F7F5F2;border-left:3px solid #C9A86A;padding:16px 18px;font-size:14px;font-weight:400;color:#3A3A3A;line-height:1.78;border-radius:0 3px 3px 0;">${mensaje}</div>
    </td>
  </tr>
 
  <!-- ── CTA RESPONDER ── -->
  <tr>
    <td style="background:#F7F5F2;padding:18px 36px;border:1px solid #E8E2D9;border-top:none;">
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="vertical-align:middle;">
          <div style="font-size:13px;font-weight:500;color:#888;line-height:1.4;">Responder este correo contactará directamente al cliente.</div>
        </td>
        <td align="right" style="vertical-align:middle;white-space:nowrap;padding-left:16px;">
          <a href="mailto:${correo}"
             style="display:inline-block;background:linear-gradient(135deg,#C9A86A,#E0C48A);color:#1A1A1A;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;padding:11px 22px;border-radius:4px;text-decoration:none;">
            Responder
          </a>
        </td>
      </tr></table>
    </td>
  </tr>
 
  <!-- ── FOOTER ── -->
  <tr>
    <td style="background:#111111;padding:18px 36px;border-radius:0 0 6px 6px;">
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="vertical-align:middle;">
          <div style="font-size:11px;font-weight:500;color:#444;letter-spacing:0.06em;">© ${year} ${CONFIG.senderName} · Lima, Perú</div>
        </td>
        <td align="right" style="vertical-align:middle;">
          <div style="font-size:11px;color:#333;letter-spacing:0.06em;">${senderEmail}</div>
        </td>
      </tr></table>
    </td>
  </tr>
 
</table>
</td></tr>
</table>
</body>
</html>`;
}

/** Construye el cuerpo en texto plano del correo */
function buildText(body: FormBody): string {
    return [
        `Nombre:   ${body.nombre}`,
        `Correo:   ${body.correo}`,
        `Teléfono: ${body.telefono}`,
        `Servicio: ${body.tipo_servicio}`,
        `Mensaje:  ${body.mensaje}`,
    ].join("\n");
}

/** Envía el correo al administrador */
async function sendEmail(
    body: FormBody,
    config: ReturnType<typeof useRuntimeConfig>
): Promise<void> {
    const transporter = createTransporter(config);
    const from = config.smtpFrom as string;

    await transporter.sendMail({
        from: `${CONFIG.senderName} <${from}>`,
        to: from,
        replyTo: body.correo,
        subject: `${CONFIG.emailSubject} - ${body.nombre}`,
        text: buildText(body),
        html: buildHtml(body),
    });
}

// ══════════════════════════════════════════════════════
//  HANDLER PRINCIPAL
// ══════════════════════════════════════════════════════
export default defineEventHandler(async (event) => {
    try {
        const rawBody = await readBody(event);
        const config = useRuntimeConfig();

        // 1. Honeypot anti-spam
        if (typeof rawBody.honeypot === "string" && rawBody.honeypot.trim() !== "") {
            return { status: 200, message: "Solicitud procesada" };
        }

        // 2. reCAPTCHA (solo en producción)
        if (process.env.NODE_ENV !== "development") {
            if (typeof rawBody.recaptchaToken !== "string" || rawBody.recaptchaToken.trim() === "") {
                throw createError({ statusCode: 400, statusMessage: "Token reCAPTCHA requerido" });
            }
            await validateRecaptcha(rawBody.recaptchaToken, config.recaptchaSecretKey as string);
        }

        // 3. Validar campos del formulario
        const body = validateBody(rawBody);

        // 4. Validar configuración SMTP
        validateSmtpConfig(config);

        // 5. Enviar correo
        await sendEmail(body, config);

        return { status: 200, message: "Mensaje enviado correctamente" };

    } catch (error: any) {
        console.error("[sendEmail]", error);
        throw createError({
            statusCode: error.statusCode ?? 500,
            statusMessage: error.statusMessage ?? "Error interno del servidor",
        });
    }
});