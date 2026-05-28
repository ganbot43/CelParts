# ESPECIFICACIONES TÉCNICAS - Joymar Utensilios

## 📋 STACK TECNOLÓGICO

| Componente | Versión | Propósito |
|-----------|---------|----------|
| **Nuxt** | 3.16.0 | Framework SSR/SSG |
| **Vue** | 3.5.13 | Framework frontend |
| **TypeScript** | 5.8.2 | Tipado estático |
| **Tailwind CSS** | 4.0.14 | Estilos utility-first |
| **Node.js** | - | Runtime backend |

---

## 📦 DEPENDENCIAS PRINCIPALES

### UI & Componentes
- `@nuxt/ui@3.0.0` - Componentes UI prebuilts
- `@nuxt/icon@1.11.0` - Iconos con Iconify
- `@nuxt/image@1.9.0` - Optimización de imágenes
- `@nuxt/fonts@0.11.0` - Google Fonts automáticas
- `@nuxtjs/google-fonts@3.2.0` - Gestor de fuentes

### Íconos
- `@fortawesome/fontawesome-svg-core@6.7.2`
- `@fortawesome/free-brands-svg-icons@6.7.2`
- `@fortawesome/vue-fontawesome@3.0.8`

### Base de Datos & ORM
- `drizzle-orm@0.44.2` - Type-safe ORM
- `drizzle-kit@0.31.0` - CLI & migrations
- `better-sqlite3@11.10.0` - SQLite

### Autenticación & Seguridad
- `nuxt-auth-utils@0.5.29` - Auth integrada
- `bcryptjs@3.0.2` - Hash de contraseñas
- `@types/bcryptjs@2.4.6` - Tipos TypeScript

### Email & Notificaciones
- `nodemailer@8.0.5` - Envío de emails

### SEO
- `@nuxtjs/sitemap@7.6.0` - Sitemap automático

### Validación & Utilidades
- `zod@3.25.76` - Validación de esquemas
- `dotenv@17.3.1` - Gestión de env vars

### Optimización
- `nuxt-vitalizer@0.10.0` - Optimización de Web Vitals
- `@tailwindcss/vite@4.0.14` - Tailwind con Vite

### Desarrollo
- `tsx@4.20.5` - Ejecutar TypeScript

---

## 🔧 CONFIGURACIÓN & VARIABLES DE ENTORNO

### Google reCAPTCHA
```env
G_RECAPTCHA_SITE_KEY=6LfGjJIsAAAAAPARDuI6_tHcF-lHKjFMaE2jLMny
G_RECAPTCHA_SECRET_KEY=6LfGjJIsAAAAACVqxB1LrIHo7Is-vh3i__i3njo2
```

### SMTP (Gmail)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=joymar.peru@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_SECURE=false
SMTP_FROM="Joymar Utensilios <joymar.peru@gmail.com>"
```



### Sesiones
```env
NUXT_SESSION_PASSWORD=ef06df054e634f978ad13d721c30bc07
```

---

## 📁 ESTRUCTURA DE CARPETAS

```
├── components/          → 10 componentes Vue reutilizables
├── pages/              → 3 rutas (index, privacidad, terminos)
├── layouts/            → 1 layout default
├── assets/css/         → 4 archivos CSS (main, carousel, page, transitions)
├── public/
│   ├── images/         → 3 imágenes (logo, hero, hero-fuegos)
│   ├── robots.txt      → SEO
│   └── site.webmanifest→ PWA
├── server/
│   ├── api/            → Endpoints (contacto.post.ts)
│   ├── middleware/     → Rate limiting
│   └── utils/          → Utilidades DB
├── composables/        → Composables Vue (useWhatsappLink)
├── data/               → Carpeta vacía (para datos estáticos)
└── docs/               → Documentación
```

---

## 🚀 SCRIPTS NPM

```bash
npm run dev        # Desarrollo en http://localhost:3000
npm run build      # Build producción
npm run generate   # SSG (generación estática)
npm run preview    # Preview del build
npm run db:seed    # Ejecutar seed de BD
npm run postinstall→ Preparar Nuxt automáticamente
```

---

## 🔐 CARACTERÍSTICAS DE SEGURIDAD

✅ Rate limiting en APIs
✅ Hashing de contraseñas con bcryptjs
✅ reCAPTCHA en formularios
✅ SMTP seguro para emails
✅ Validación con Zod
✅ Sesiones seguras con password

---

## 📊 COMPONENTES PRINCIPALES

| Componente | Función |
|-----------|---------|
| Header | Navegación principal |
| Footer | Pie de página |
| PrincipalSection | Hero/Portada |
| QuienesSomos | About us |
| ServiciosSection | Servicios |
| MisionVision | Misión y visión |
| EquipoSection | Equipo |
| MapaSection | Ubicación |
| ContactoSection | Formulario contacto |
| WhatsAppBotton | Botón flotante WhatsApp |

---

## 🎨 FUENTES CONFIGURADAS

- **Teko**: weights 400, 500, 600, 700
- **Nunito Sans**: weights 400, 500, 600, 700, 800
- Display: swap | Preload: true

---

## 📱 SEO & PWA

✅ Sitemap automático
✅ robots.txt configurado
✅ Web manifest para PWA
✅ Google Analytics 4 integrado
✅ Debug mode activado en GA4

---

## 💾 BASE DE DATOS

- Driver: SQLite
- ORM: Drizzle con type-safety
- Seed: Script disponible en `server/db/seed.ts`
- Utils: Funciones en `server/utils/db.ts`

---

## 📧 ENDPOINTS API

**POST /api/contacto**
- Recibe formulario de contacto
- Rate limiting activado
- Valida con reCAPTCHA
- Envía email con Nodemailer

---

## ⚙️ CONFIG NUXT

- `compatibilityDate`: 2024-11-01
- `devtools`: enabled
- CSS: main.css, fontawesome, transitions.css
- Modules: 8 módulos activados
- Tailwind Vite integrado

---

## 🔍 VALIDACIÓN

Schema validation con Zod para:
- Formularios
- Variables de entorno
- Requests/Responses

---

## 🎯 PRÓXIMOS PASOS / NOTAS

- `/data` vacío → preparado para datos estáticos o seeding
- DB no configurada (comentado en runtimeConfig)
- Middleware de rate limiting activo
- Google Analytics en debug mode

---

**Última actualización**: 30/04/2026
**Proyecto**: Landing Corporativo Fuegos Artificiales Vulcano
