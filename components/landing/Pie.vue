<template>
  <footer class="jm-footer">
    <!-- ═══════════════════════════════
         MAIN
    ═══════════════════════════════ -->
    <div class="jm-footer__main">

      <!-- BRAND -->
      <div class="jm-footer__brand">
        <NuxtLink
          to="/"
          class="jm-footer__logo"
          aria-label="Kite — Inicio"
        >
          <div class="jm-footer__logo-img">
            <img
              src="/images/logo.png"
              alt="Kite"
              width="58"
              height="58"
            />
          </div>

          <div class="jm-footer__logo-text">
            <span class="jm-footer__logo-name">
              Kite
            </span>

            <span class="jm-footer__logo-sub">
              Plataforma moderna
            </span>
          </div>
        </NuxtLink>

        <p class="jm-footer__desc">
          Creamos experiencias digitales modernas, rápidas y visualmente
          atractivas para negocios y marcas que buscan destacar.
        </p>

        <!-- BADGES -->
        <div class="jm-footer__badges">
          <div class="jm-footer__badge">
            Experiencia premium
          </div>

          <div class="jm-footer__badge">
            Diseño moderno
          </div>
        </div>

        <!-- SOCIALS -->
        <div class="jm-footer__socials">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            class="jm-footer__social-btn"
            aria-label="Instagram"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" class="jm-footer__social-icon">
              <path
                d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Z"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              />
              <circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" stroke-width="1.8" />
              <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" />
            </svg>
          </a>

          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            class="jm-footer__social-btn"
            aria-label="Facebook"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" class="jm-footer__social-icon">
              <path
                d="M14.5 8.5H17V5h-2.5C11.57 5 10 6.57 10 9v2H7v3.5h3V19h3.5v-4.5H16l.5-3.5h-3V9c0-.28.22-.5.5-.5Z"
                fill="currentColor"
              />
            </svg>
          </a>

          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            class="jm-footer__social-btn"
            aria-label="X"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" class="jm-footer__social-icon">
              <path
                d="M5 5h3.2l4.2 5.5L16.6 5H19l-5.3 6.8L19.5 19h-3.2l-4.5-5.9L7.4 19H5l5.8-7.4L5 5Z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
      </div>

      <!-- LINKS -->
      <div class="jm-footer__col">
        <div class="jm-footer__col-title">
          Navegación
        </div>

        <ul class="jm-footer__links">
          <li>
            <NuxtLink to="/" class="jm-footer__link">
              Inicio
            </NuxtLink>
          </li>

          <li>
            <NuxtLink to="/productos" class="jm-footer__link">
              Productos
            </NuxtLink>
          </li>

          <!-- <li>
            <NuxtLink to="/sobre-nosotros" class="jm-footer__link">
              Nosotros
            </NuxtLink>
          </li> -->

          <li>
            <NuxtLink to="/contacto" class="jm-footer__link">
              Contacto
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- CONTACT -->
      <div class="jm-footer__col">
        <div class="jm-footer__col-title">
          Contáctanos
        </div>

        <div class="jm-footer__contact-list">

          <div class="jm-footer__contact-item">
            <div class="jm-footer__contact-label">
              Email
            </div>

            <a
              href="mailto:hola@kite.com"
              class="jm-footer__contact-val"
            >
              hola@kite.com
            </a>
          </div>

          <div class="jm-footer__contact-item">
            <div class="jm-footer__contact-label">
              Teléfono
            </div>

            <a
              href="tel:+51999999999"
              class="jm-footer__contact-val"
            >
              +51 999 999 999
            </a>
          </div>

          <div class="jm-footer__contact-item">
            <div class="jm-footer__contact-label">
              Ubicación
            </div>

            <span class="jm-footer__contact-val">
              Lima, Perú
            </span>
          </div>

        </div>
      </div>

    </div>

    <!-- ═══════════════════════════════
         BOTTOM
    ═══════════════════════════════ -->
    <div class="jm-footer__bottom">
      <span>
        © {{ currentYear }} Kite · Todos los derechos reservados
      </span>

      <a
        href="https://smartcsperu.com"
        target="_blank"
        rel="noopener noreferrer"
        class="jm-footer__credit"
      >
        Desarrollada por <strong>Smart CS</strong>
      </a>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>

<style scoped>
/* ═══════════════════════════════
   TOKENS
═══════════════════════════════ */
.jm-footer {
  --bg: #111111;
  --surface: #1A1A1A;

  --primary: #2D6A4F;
  --primary-soft: rgba(45, 106, 79, 0.12);

  --border: rgba(255,255,255,0.08);

  --text: #FFFFFF;
  --text-soft: rgba(255,255,255,0.72);
  --text-faint: rgba(255,255,255,0.45);

  background: var(--bg);
  color: var(--text);

  border-top: 1px solid var(--border);

  position: relative;
  overflow: hidden;
}

/* ═══════════════════════════════
   MAIN GRID
═══════════════════════════════ */
.jm-footer__main {
  max-width: 1200px;

  margin: 0 auto;

  padding: 70px 40px 50px;

  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;

  gap: 50px;
}

/* ═══════════════════════════════
   BRAND
═══════════════════════════════ */
.jm-footer__logo {
  display: flex;
  align-items: center;
  gap: 16px;

  text-decoration: none;

  margin-bottom: 22px;
}

.jm-footer__logo-img {
  width: 58px;
  height: 58px;

  border-radius: 16px;

  background: var(--surface);

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid var(--border);
}

.jm-footer__logo-img img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.jm-footer__logo-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.jm-footer__logo-name {
  font-size: 1.6rem;
  font-weight: 800;

  letter-spacing: -0.04em;

  color: var(--text);
}

.jm-footer__logo-sub {
  font-size: 0.8rem;
  color: var(--text-faint);

  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.jm-footer__desc {
  font-size: 0.95rem;

  line-height: 1.8;

  color: var(--text-soft);

  max-width: 360px;

  margin-bottom: 24px;
}

/* ═══════════════════════════════
   BADGES
═══════════════════════════════ */
.jm-footer__badges {
  display: flex;
  flex-wrap: wrap;

  gap: 10px;

  margin-bottom: 24px;
}

.jm-footer__badge {
  padding: 8px 14px;

  border-radius: 999px;

  background: var(--primary-soft);

  border: 1px solid rgba(45, 106, 79, 0.2);

  font-size: 0.75rem;
  font-weight: 700;

  color: #E9C46A;

  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* ═══════════════════════════════
   SOCIALS
═══════════════════════════════ */
.jm-footer__socials {
  display: flex;
  gap: 10px;
}

.jm-footer__social-btn {
  width: 40px;
  height: 40px;

  border-radius: 12px;

  background: var(--surface);

  border: 1px solid var(--border);

  color: var(--text-soft);

  text-decoration: none;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 0.78rem;
  font-weight: 700;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease,
    color 0.2s ease;
}

.jm-footer__social-icon {
  width: 18px;
  height: 18px;
  display: block;
}

.jm-footer__social-btn:hover {
  background: var(--primary-soft);

  border-color: rgba(45, 106, 79, 0.4);

  color: white;

  transform: translateY(-2px);
}

/* ═══════════════════════════════
   COLS
═══════════════════════════════ */
.jm-footer__col-title {
  font-size: 0.8rem;
  font-weight: 800;

  text-transform: uppercase;
  letter-spacing: 0.15em;

  margin-bottom: 22px;

  color: white;
}

.jm-footer__links {
  list-style: none;

  margin: 0;
  padding: 0;

  display: flex;
  flex-direction: column;

  gap: 14px;
}

.jm-footer__link {
  color: var(--text-soft);

  text-decoration: none;

  font-size: 0.95rem;

  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

.jm-footer__link:hover {
  color: white;

  transform: translateX(4px);
}

/* ═══════════════════════════════
   CONTACT
═══════════════════════════════ */
.jm-footer__contact-list {
  display: flex;
  flex-direction: column;

  gap: 18px;
}

.jm-footer__contact-item {
  display: flex;
  flex-direction: column;

  gap: 4px;
}

.jm-footer__contact-label {
  font-size: 0.72rem;

  text-transform: uppercase;
  letter-spacing: 0.12em;

  color: var(--text-faint);

  font-weight: 700;
}

.jm-footer__contact-val {
  color: var(--text-soft);

  text-decoration: none;

  font-size: 0.95rem;

  transition: color 0.2s ease;
}

.jm-footer__contact-val:hover {
  color: white;
}

/* ═══════════════════════════════
   BOTTOM
═══════════════════════════════ */
.jm-footer__bottom {
  border-top: 1px solid var(--border);

  padding: 20px 40px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 12px;

  flex-wrap: wrap;

  max-width: 1200px;
  margin: 0 auto;

  color: var(--text-faint);

  font-size: 0.82rem;
}

.jm-footer__credit {
  color: var(--text-faint);

  text-decoration: none;

  transition: color 0.2s ease;
}

.jm-footer__credit:hover {
  color: white;
}

.jm-footer__credit strong {
  color: var(--text-soft);
}

/* ═══════════════════════════════
   RESPONSIVE
═══════════════════════════════ */
@media (max-width: 960px) {
  .jm-footer__main {
    grid-template-columns: 1fr 1fr;

    gap: 40px;
  }

  .jm-footer__brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 640px) {
  .jm-footer__main {
    grid-template-columns: 1fr;

    padding: 50px 22px 36px;
  }

  .jm-footer__bottom {
    padding: 18px 22px;

    flex-direction: column;
    align-items: flex-start;
  }

  .jm-footer__logo-name {
    font-size: 1.4rem;
  }
}
</style>