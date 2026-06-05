<template>
  <footer class="jm-footer">
    <!-- ═══════════════════════════════
         MAIN
    ═══════════════════════════════ -->
    <div class="jm-footer__main">

      <!-- BRAND -->
      <div class="jm-footer__brand">
        <NuxtLink to="/" class="jm-footer__logo" aria-label="Kite — Inicio">
          <div class="jm-footer__logo-img">
            <img src="/images/logo.png" alt="Kite" width="58" height="58" />
          </div>

          <div class="jm-footer__logo-text">
            <span class="jm-footer__logo-name">
              CelParts
            </span>

            <span class="jm-footer__logo-sub">
              Repuestos & Accesorios
            </span>
          </div>
        </NuxtLink>

        <p class="jm-footer__desc">
          Tu tienda de confianza para repuestos y accesorios de celulares.
          Encuentra pantallas, baterías, cargadores, cases y mucho más
          para las principales marcas del mercado.
        </p>

        <!-- BADGES -->
        <div class="jm-footer__badges">
          <div class="jm-footer__badge">
            Repuestos originales
          </div>

          <div class="jm-footer__badge">
            Envios seguros
          </div>
        </div>

        <!-- SOCIALS -->
        <div class="jm-footer__socials">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="jm-footer__social-btn"
            aria-label="Instagram">
            <svg viewBox="0 0 24 24" aria-hidden="true" class="jm-footer__social-icon">
              <path
                d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Z"
                fill="none" stroke="currentColor" stroke-width="1.8" />
              <circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" stroke-width="1.8" />
              <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" />
            </svg>
          </a>

          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="jm-footer__social-btn"
            aria-label="Facebook">
            <svg viewBox="0 0 24 24" aria-hidden="true" class="jm-footer__social-icon">
              <path d="M14.5 8.5H17V5h-2.5C11.57 5 10 6.57 10 9v2H7v3.5h3V19h3.5v-4.5H16l.5-3.5h-3V9c0-.28.22-.5.5-.5Z"
                fill="currentColor" />
            </svg>
          </a>

          <a href="https://x.com" target="_blank" rel="noopener noreferrer" class="jm-footer__social-btn"
            aria-label="X">
            <svg viewBox="0 0 24 24" aria-hidden="true" class="jm-footer__social-icon">
              <path d="M5 5h3.2l4.2 5.5L16.6 5H19l-5.3 6.8L19.5 19h-3.2l-4.5-5.9L7.4 19H5l5.8-7.4L5 5Z"
                fill="currentColor" />
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

            <a href="mailto:ventas@celparts.pe" class="jm-footer__contact-val">
              ventas@celparts.pe
            </a>
          </div>

          <div class="jm-footer__contact-item">
            <div class="jm-footer__contact-label">
              Teléfono
            </div>

            <a href="tel:+51923821520" class="jm-footer__contact-val">
              +51 923 821 520
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
        © {{ currentYear }} CelParts. Todos los derechos reservados.
      </span>

      <a href="https://smartcsperu.com" target="_blank" rel="noopener noreferrer" class="jm-footer__credit">
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
   FOOTER — CELPARTS
   100% tokens de main.css — sin hardcode
═══════════════════════════════ */
.jm-footer {
  background: var(--bg-alt);
  color: var(--text-primary);
  border-top: 1px solid var(--border-light);
  position: relative;
  overflow: hidden;
}

/* Fondo decorativo sutil */
.jm-footer::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top right, var(--cp-ice) 0%, transparent 40%),
    radial-gradient(circle at bottom left, var(--cp-frost) 0%, transparent 40%);
  opacity: 0.8;
  pointer-events: none;
  z-index: 0;
}

/* ═══════════════════════════════
   MAIN GRID
═══════════════════════════════ */
.jm-footer__main {
  position: relative;
  z-index: 2;
  max-width: var(--container-width);
  margin: 0 auto;
  padding: clamp(60px, 6vw, 80px) var(--space-8);
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: var(--space-10);
}

/* ═══════════════════════════════
   BRAND
═══════════════════════════════ */
.jm-footer__brand {
  display: flex;
  flex-direction: column;
}

.jm-footer__logo {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  text-decoration: none;
  margin-bottom: var(--space-5);
}

.jm-footer__logo-img {
  width: 58px;
  height: 58px;
  border-radius: var(--r-md);
  background: var(--bg-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-light);
  box-shadow: var(--card-shadow-sm);
}

.jm-footer__logo-img img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.jm-footer__logo-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.jm-footer__logo-name {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--text-primary);
}

.jm-footer__logo-sub {
  font-size: 0.72rem;
  color: var(--text-muted);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 700;
}

.jm-footer__desc {
  font-size: 0.95rem;
  line-height: 1.8;
  color: var(--text-muted);
  max-width: 360px;
  margin-bottom: var(--space-6);
}

/* ═══════════════════════════════
   BADGES
═══════════════════════════════ */
.jm-footer__badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
}

.jm-footer__badge {
  padding: 8px 14px;
  border-radius: var(--r-pill);
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-body);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  box-shadow: var(--card-shadow-sm);
}

/* ═══════════════════════════════
   SOCIALS
═══════════════════════════════ */
.jm-footer__socials {
  display: flex;
  gap: var(--space-3);
}

.jm-footer__social-btn {
  width: 44px;
  height: 44px;
  border-radius: var(--r-md);
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  color: var(--text-muted);
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background var(--t-base) var(--ease-smooth),
    border-color var(--t-base) var(--ease-smooth),
    transform var(--t-base) var(--ease-snappy),
    color var(--t-base) var(--ease-smooth),
    box-shadow var(--t-base) var(--ease-smooth);
}

.jm-footer__social-icon {
  width: 20px;
  height: 20px;
  display: block;
}

.jm-footer__social-btn:hover {
  background: var(--cp-navy);
  border-color: var(--cp-navy);
  color: var(--cp-white);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(7, 30, 82, 0.15);
}

/* ═══════════════════════════════
   COLS
═══════════════════════════════ */
.jm-footer__col-title {
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: var(--space-5);
  color: var(--text-primary);
}

.jm-footer__links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.jm-footer__link {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: color var(--t-fast) var(--ease-smooth), transform var(--t-fast) var(--ease-smooth);
  display: inline-block;
}

.jm-footer__link:hover {
  color: var(--cp-electric);
  transform: translateX(4px);
}

/* ═══════════════════════════════
   CONTACT
═══════════════════════════════ */
.jm-footer__contact-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.jm-footer__contact-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.jm-footer__contact-label {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-faint);
  font-weight: 700;
}

.jm-footer__contact-val {
  color: var(--text-body);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: color var(--t-fast) var(--ease-smooth);
}

.jm-footer__contact-val:hover {
  color: var(--cp-electric);
}

/* ═══════════════════════════════
   BOTTOM
═══════════════════════════════ */
.jm-footer__bottom {
  position: relative;
  z-index: 2;
  border-top: 1px solid var(--border-light);
  padding: var(--space-5) var(--space-8);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  flex-wrap: wrap;
  max-width: var(--container-width);
  margin: 0 auto;
  color: var(--text-muted);
  font-size: 0.82rem;
}

.jm-footer__credit {
  color: var(--text-muted);
  text-decoration: none;
  transition: color var(--t-fast) var(--ease-smooth);
}

.jm-footer__credit:hover {
  color: var(--cp-electric);
}

.jm-footer__credit strong {
  color: var(--text-primary);
  font-weight: 700;
}

/* ═══════════════════════════════
   RESPONSIVE
═══════════════════════════════ */
@media (max-width: 960px) {
  .jm-footer__main {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-10);
  }

  .jm-footer__brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 640px) {
  .jm-footer__main {
    grid-template-columns: 1fr;
    padding: var(--space-12) var(--space-5) var(--space-8);
  }

  .jm-footer__bottom {
    padding: var(--space-4) var(--space-5);
    flex-direction: column;
    align-items: flex-start;
  }

  .jm-footer__logo-name {
    font-size: 1.4rem;
  }
}
</style>