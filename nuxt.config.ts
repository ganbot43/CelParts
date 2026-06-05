import "dotenv/config";
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  site: {
    url: "https://arigumi.pe",
    name: "Arigumi",
  },
  compatibilityDate: "2024-11-01",
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
      password: process.env.NUXT_SESSION_PASSWORD ?? "",
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
    s3RootPrefix: process.env.S3_ROOT_PREFIX ?? "arigumi",
    public: {
      recaptchaSiteKey: process.env.G_RECAPTCHA_SITE_KEY,
      appName: process.env.NUXT_PUBLIC_APP_NAME ?? "Arigumi",
      whatsapp: process.env.NUXT_PUBLIC_WHATSAPP ?? "+51996111303",
      companyName: process.env.NUXT_PUBLIC_COMPANY_NAME || "Arigumi",
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL ?? "https://arigumi.pe",
      siteName: process.env.NUXT_PUBLIC_SITE_NAME ?? "Arigumi",
    },
  },

  modules: [
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxtjs/sitemap",
    "@nuxt/ui",
    "nuxt-auth-utils",
    "nuxt-vitalizer",
    "@pinia/nuxt",
  ],
  sitemap: {
    autoLastmod: true,
    credits: false,
    exclude: ["/admin/**", "/login"],
  },
  pinia: {
    storesDirs: ["./stores/**"],
  },
  icon: {
    provider: "iconify", // Usar iconify como proveedor
  },
  vitalizer: {
    disablePrefetchLinks: false,
    disablePreloadLinks: false,
  },
  css: [
    "@fortawesome/fontawesome-svg-core/styles.css",
    "~/assets/css/transitions.css",
    "~/assets/css/tokens.css",
  ],
  imports: {
    dirs: ["composables"],
  },
  components: true,
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["@fortawesome/free-brands-svg-icons"],
    },
    server: {
      allowedHosts: [
        "localhost",
        ".ngrok-free.app",
        "5dd2-190-43-41-72.ngrok-free.app",
        ".trycloudflare.com",
        "octagonal-unspacious-kaylee.ngrok-free.dev",
      ],
    },
    cacheDir: ".vite-cache",
  },
  app: {
    head: {
      htmlAttrs: { lang: "es" },
      title: "Arigumi — Hilando Sonrisas",
      meta: [
        { charset: "utf-8" },
        {
          name: "description",
          content:
            "Arigumi: Amigurumis tejidos a mano con amor y dedicación. Productos duraderos y hermosos para ti y tus seres queridos.",
        },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "author", content: "Arigumi" },
        { name: "theme-color", content: "#FFA6C9" },
        {
          name: "keywords",
          content:
            "amigurumis, peluches, tejidos, a mano, crochet, regalos, personalizados, Perú",
        },
        {
          property: "og:title",
          content: "Arigumi — Hilando Sonrisas",
        },
        {
          property: "og:description",
          content:
            "Arigumi: Amigurumis personalizados y tejidos con mucho cariño. Descubre nuestro catálogo lleno de detalles únicos.",
        },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Arigumi" },
        { property: "og:locale", content: "es_PE" },
        {
          property: "og:image",
          content: "https://arigumi.pe/images/logo.png",
        },
        { property: "og:image:alt", content: "Logo de Arigumi" },
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content: "Arigumi — Hilando Sonrisas",
        },
        {
          name: "twitter:description",
          content:
            "Amigurumis y tejidos a mano llenos de magia. Encuentra el regalo perfecto en Perú.",
        },
        {
          name: "twitter:image",
          content: "https://arigumi.pe/images/logo.png",
        },
        { name: "robots", content: "index, follow" },
      ],
      link: [
        {
          rel: "icon",
          type: "image/png",
          sizes: "96x96",
          href: "/images/logo.png",
        },
        { rel: "icon", type: "image/webp", href: "/images/logo.png" },
        { rel: "manifest", href: "/site.webmanifest" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap",
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
    defaults: {},
  },
});
