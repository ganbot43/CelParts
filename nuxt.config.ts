import 'dotenv/config'
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  site: {
    url: 'https://joymarperu.com',
    name: 'Joymar Utensilios',
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  experimental: {
    appManifest: false,
  },
  runtimeConfig: {
    // ─── Existentes (landing) ────────────────────────────────────
    recaptchaSecretKey: process.env.G_RECAPTCHA_SECRET_KEY,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPassword: process.env.SMTP_PASSWORD,
    smtpSecure: process.env.SMTP_SECURE,
    smtpFrom: process.env.SMTP_FROM,
    // ─── Nuevos (ecommerce) ──────────────────────────────────────
    session: {
      password: process.env.NUXT_SESSION_PASSWORD ?? '',
    },
    // Database connection (MySQL)
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    // S3 configuration for uploads
    s3Bucket: process.env.S3_BUCKET,
    s3Region: process.env.S3_REGION,
    s3AccessKeyId: process.env.S3_ACCESS_KEY_ID,
    s3SecretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    s3RootPrefix: process.env.S3_ROOT_PREFIX ?? 'joymar_utensilios',
    public: {
      recaptchaSiteKey: process.env.G_RECAPTCHA_SITE_KEY,
      appName: process.env.NUXT_PUBLIC_APP_NAME ?? 'Joymar Utensilios',
      whatsapp: process.env.NUXT_PUBLIC_WHATSAPP ?? '+51996111303',
      companyName: process.env.NUXT_PUBLIC_COMPANY_NAME || 'Mi Empresa',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL ?? 'https://joymarperu.com',
      siteName: process.env.NUXT_PUBLIC_SITE_NAME ?? 'Joymar Peru',
    }
  },

  modules: ['@nuxt/icon', '@nuxt/image', '@nuxtjs/sitemap', '@nuxt/ui', 'nuxt-auth-utils', 'nuxt-vitalizer', '@pinia/nuxt'],
  sitemap: {
    autoLastmod: true,
    credits: false,
    exclude: ['/admin/**', '/login'],
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
  icon: {
    provider: 'iconify', // Usar iconify como proveedor
  },
  vitalizer: {
    disablePrefetchLinks: false,
    disablePreloadLinks: false,
  },
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css',
    '~/assets/css/transitions.css',
    '~/assets/css/tokens.css'
  ],
  imports: {
    dirs: ['composables'],
  },
  components: true,
  vite: {
    plugins: [
      tailwindcss(),
    ],
    optimizeDeps: {
      include: ["@fortawesome/free-brands-svg-icons"],
    },
    server: {
      allowedHosts: ['localhost', '.ngrok-free.app', '5dd2-190-43-41-72.ngrok-free.app', '.trycloudflare.com', 'octagonal-unspacious-kaylee.ngrok-free.dev'],
    },
    cacheDir: '.vite-cache',
  },
  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      title: 'Joymar Utensilios — Utensilios de Cocina Premium en Perú',
      meta: [
        { charset: 'utf-8' },
        { name: 'description', content: 'Joymar Utensilios: artículos de cocina de alta calidad, probados y certificados. Productos duraderos y funcionales para tu hogar. Tienda en Villa El Salvador, Lima.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'author', content: 'Joymar Utensilios' },
        { name: 'theme-color', content: '#E31E24' },
        { name: 'keywords', content: 'utensilios de cocina, menaje de hogar, ollas, sartenes, productos de cocina, artículos para el hogar, menaje, Lima, Perú' },
        { property: 'og:title', content: 'Joymar Utensilios — Utensilios de Cocina Premium en Perú' },
        { property: 'og:description', content: 'Joymar Utensilios: productos de cocina premium, probados y certificados. Menaje de hogar de alta calidad con garantía. Visita nuestro showroom en Villa El Salvador, Lima.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Joymar Utensilios' },
        { property: 'og:locale', content: 'es_PE' },
        { property: 'og:image', content: 'https://joymarperu.com/images/logo.png' },
        { property: 'og:image:alt', content: 'Logo de Joymar Utensilios' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Joymar Utensilios — Utensilios de Cocina Premium en Perú' },
        { name: 'twitter:description', content: 'Productos de cocina de alta calidad en Lima, Peru. Ollas, sartenes y mas para tu hogar.' },
        { name: 'twitter:image', content: 'https://joymarperu.com/images/logo.png' },
        { name: 'robots', content: 'index, follow' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/images/logo.png' },
        { rel: 'icon', type: 'image/webp', href: '/images/logo.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap',
        },
      ],
    },
    pageTransition: {
      name: "page",
      mode: "out-in",
    },

  },
  ssr: true,

  fonts: {
    defaults: {
    }
  },

})