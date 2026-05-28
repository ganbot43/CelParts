<template>
  <footer class="jm-footer">
    <!-- ══ CUERPO PRINCIPAL ══ -->
    <div class="jm-footer__main">
      <!-- COL 1 — MARCA -->
      <div class="jm-footer__brand">
        <NuxtLink
          to="/"
          class="jm-footer__logo"
          aria-label="Joymar Utensilios — Inicio"
        >
          <div class="jm-footer__logo-img">
            <img
              src="/images/logo.png"
              alt="Joymar Utensilios"
              width="60"
              height="56"
            />
          </div>
          <!-- <div class="jm-footer__logo-sep" aria-hidden="true" /> -->
          <!-- <div class="jm-footer__logo-text">
            <span class="jm-footer__logo-name">Joymar Utensilios</span>
            <span class="jm-footer__logo-sub">Lima, Perú · Desde 2023</span>
          </div> -->
        </NuxtLink>

        <p class="jm-footer__desc">
          Tienda especializada en utensilios de cocina y menaje del hogar.
          <!-- Cada
          producto que ofrecemos pasa por un estricto control de calidad para
          garantizarte durabilidad y rendimiento en tu cocina. -->
        </p>

        <!-- Badges -->
        <div class="jm-footer__badges">
          <div class="jm-footer__badge">
            <svg
              width="11"
              height="11"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M10 2L17 5V10C17 14 13.5 17.5 10 18.5C6.5 17.5 3 14 3 10V5L10 2Z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
              <path
                d="M7 10L9 12L13 8"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Calidad garantizada
          </div>
          <!-- <div class="jm-footer__badge">
            <svg
              width="11"
              height="11"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M10 2l1.5 4.5L16 8l-3.8 2.8 1.4 4.5L10 12.2l-3.6 3.1 1.4-4.5L4 8l4.5-1.5z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
            </svg>
            Venta al por mayor
          </div> -->
        </div>

        <!-- Sociales -->
        <div class="jm-footer__socials">
          <a
            href="https://www.instagram.com/joymarutensilios/"
            target="_blank"
            rel="noopener noreferrer"
            class="jm-footer__social-btn"
            aria-label="Instagram"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.69.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"
              />
              <path
                d="M12 5.838a6.162 6.162 0 110 12.324 6.162 6.162 0 010-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110 2.881 1.44 1.44 0 010-2.881z"
              />
            </svg>
          </a>

          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            class="jm-footer__social-btn"
            aria-label="Facebook"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
              />
            </svg>
          </a>

          <a
            href="https://maps.app.goo.gl/cwBR1t1hZ3EgeUQU9"
            target="_blank"
            rel="noopener noreferrer"
            class="jm-footer__social-btn"
            aria-label="Ver en mapa"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"
              />
            </svg>
          </a>

          <a
            :href="whatsappLink"
            target="_blank"
            rel="noopener noreferrer"
            class="jm-footer__social-btn"
            aria-label="WhatsApp"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M20.52 3.48A11.93 11.93 0 0012 0C5.37 0 0 5.37 0 12c0 2.12.55 4.1 1.5 5.83L0 24l6.35-1.66A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.23-3.48-8.52zM12 22c-1.85 0-3.6-.5-5.1-1.36l-.37-.22-3.77.99 1-3.68-.24-.38A9.97 9.97 0 012 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm5.44-7.5c-.3-.15-1.76-.87-2.03-.97s-.47-.15-.67.15-.77.97-.94 1.17-.35.22-.64.07a8.1 8.1 0 01-2.38-1.47 8.94 8.94 0 01-1.65-2.06c-.17-.3-.02-.46.13-.6l.43-.5c.14-.17.18-.3.27-.5s.05-.37-.02-.52-.67-1.6-.91-2.2c-.24-.57-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.48 1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.5 1.7.64.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.42s.25-1.29.17-1.42c-.07-.13-.27-.2-.57-.35z"
              />
            </svg>
          </a>
        </div>
      </div>

      <!-- COL 2 — CATÁLOGO (comentado, disponible para activar) -->
      <!-- <div class="jm-footer__col">
        <div class="jm-footer__col-title">Catálogo</div>
        <ul class="jm-footer__links">
          <li v-for="link in catalogLinks" :key="link.label">
            <a :href="link.href" class="jm-footer__link">
              <span class="jm-footer__link-arrow" aria-hidden="true">›</span>
              {{ link.label }}
            </a>
          </li>
        </ul>
      </div> -->

      <!-- COL 2 — INFORMACIÓN -->
      <div class="jm-footer__col">
        <div class="jm-footer__col-title">Información</div>
        <ul class="jm-footer__links">
          <li v-for="link in infoLinks" :key="link.label">
            <a :href="link.href" class="jm-footer__link">
              <span class="jm-footer__link-arrow" aria-hidden="true">›</span>
              {{ link.label }}
            </a>
          </li>
        </ul>
      </div>

      <!-- COL 3 — CONTACTO -->
      <div class="jm-footer__col">
        <div class="jm-footer__col-title">Contáctanos</div>
        <div class="jm-footer__contact-list">
          <div
            class="jm-footer__contact-item"
            v-for="c in contactItems"
            :key="c.label"
          >
            <div
              class="jm-footer__contact-ico"
              v-html="c.icon"
              aria-hidden="true"
            />
            <div>
              <div class="jm-footer__contact-label">{{ c.label }}</div>
              <component
                :is="c.href ? 'a' : 'div'"
                :href="c.href || undefined"
                class="jm-footer__contact-val"
                :class="{ 'jm-footer__contact-val--link': c.href }"
                >{{ c.value }}</component
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ BARRA INFERIOR ══ -->
    <div class="jm-footer__bottom-wrap">
      <div class="jm-footer__bottom">
        <span class="jm-footer__copy">
          &copy; {{ currentYear }} Joymar Utensilios · Todos los derechos
          reservados
        </span>
        <div class="jm-footer__bottom-center" />

        <a
          href="https://smartcsperu.com"
          target="_blank"
          rel="noopener noreferrer"
          class="jm-footer__dev-credit"
        >
          Desarrollada por <strong>Smart CS</strong>
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from "vue";

const currentYear = ref(new Date().getFullYear());
const { whatsappLink } = useWhatsappLink();

// const catalogLinks = [
//   { label: "Ollas y Sartenes", href: "/productos?categoria=1" },
//   { label: "Utensilios de Cocina", href: "/productos?categoria=2" },
//   { label: "Menaje de Hogar", href: "/productos?categoria=menaje-de-hogar" },
//   { label: "Accesorios de Cocina", href: "/productos?categoria=accesorios-de-cocina" },
//   { label: "Ofertas Especiales", href: "/productos?oferta=true" },
//   { label: "Ver todo el catálogo", href: "/productos" },
// ];

const infoLinks = [
  { label: "Nuevos lanzamientos", href: "/#nuevos-lanzamientos" },
  { label: "Sobre joymar", href: "/sobre-joymar" },
  { label: "Libro de Reclamaciones", href: "/libro-de-reclamaciones" },
];

const contactItems = [
  {
    label: "Teléfono",
    value: "+51 996 111 303",
    href: "tel:+51996111303",
    icon: `<svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2.5 2h2l1 3-1.5 1.5a8 8 0 004.5 4.5L10 9.5l3 1v2A1.5 1.5 0 0111.5 14C5.7 14 0 8.3 0 2.5A1.5 1.5 0 012.5 2z" fill="currentColor"/></svg>`,
  },
  {
    label: "Email",
    value: "joymar.peru@gmail.com",
    href: "mailto:joymar.peru@gmail.com",
    icon: `<svg width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="12" height="9" rx="1.5" stroke="currentColor" stroke-width="1.2"/><path d="M1 5l6 4 6-4" stroke="currentColor" stroke-width="1.2"/></svg>`,
  },
  {
    label: "Ubicación",
    value: "Villa El Salvador, Lima",
    href: "https://maps.app.goo.gl/cwBR1t1hZ3EgeUQU9",
    icon: `<svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M7 1C4.79 1 3 2.79 3 5c0 3.25 4 8 4 8s4-4.75 4-8c0-2.21-1.79-4-4-4zm0 5.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="currentColor"/></svg>`,
  },
  {
    label: "Horario",
    value: "Lun – Sáb, 9:00 – 18:00",
    href: null,
    icon: `<svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.2"/><path d="M7 4v3.5l2 1.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  },
];
</script>

<style scoped>
/* ════════════════════════════════════════
   TOKENS — PALETA JOYMAR UTENSILIOS
════════════════════════════════════════ */
.jm-footer {
  --jm-magenta: #b01883;
  --jm-magenta-dark: #7a0f5c;
  --jm-magenta-soft: rgba(176, 24, 131, 0.1);
  --jm-magenta-line: rgba(176, 24, 131, 0.22);
  --jm-magenta-glow: rgba(176, 24, 131, 0.35);
  --jm-yellow: #f7d21e;
  --jm-yellow-dim: rgba(247, 210, 30, 0.65);
  --jm-yellow-soft: rgba(247, 210, 30, 0.08);
  --jm-black: #050505;
  --jm-surface: #0f0f0f;
  --jm-surface-2: #181818;
  --jm-surface-3: #222222;
  --jm-border: rgba(255, 255, 255, 0.06);
  --jm-border-2: rgba(255, 255, 255, 0.04);
  --jm-txt: rgba(217, 217, 217, 0.55);
  --jm-txt-light: rgba(217, 217, 217, 0.8);

  background: var(--jm-black);
  color: #fff;
  font-family: var(--font-body, "DM Sans", "Segoe UI", sans-serif);
}

/* ════════════════════════════════════════
   GRID PRINCIPAL — 3 COLUMNAS
════════════════════════════════════════ */
.jm-footer__main {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1.4fr;
  gap: 48px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 36px 40px 28px;
}

/* ════════════════════════════════════════
   COL 1 — MARCA
════════════════════════════════════════ */
.jm-footer__logo {
  display: inline-flex;
  align-items: center;
  gap: 13px;
  text-decoration: none;
  margin-bottom: 16px;
}
.jm-footer__logo-img {
  height: 56px;
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.jm-footer__logo-img img {
  height: 56px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 2px 10px var(--jm-magenta-glow));
  transition: filter 0.3s;
}
.jm-footer__logo:hover .jm-footer__logo-img img {
  filter: drop-shadow(0 2px 20px rgba(176, 24, 131, 0.6));
}
.jm-footer__logo-sep {
  width: 1px;
  height: 36px;
  background: linear-gradient(
    to bottom,
    transparent,
    var(--jm-magenta-line),
    transparent
  );
  flex-shrink: 0;
}
.jm-footer__logo-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.jm-footer__logo-name {
  font-family: var(--font-display, "Bebas Neue", "Impact", sans-serif);
  font-size: 1.3rem;
  letter-spacing: 0.1em;
  color: #fff;
  line-height: 1;
  text-transform: uppercase;
}
.jm-footer__logo-sub {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--jm-yellow-dim);
}

.jm-footer__desc {
  font-size: 13px;
  color: var(--jm-txt);
  line-height: 1.8;
  max-width: 300px;
  margin-bottom: 18px;
}

/* Badges */
.jm-footer__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}
.jm-footer__badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--jm-yellow-dim);
  background: var(--jm-yellow-soft);
  border: 1px solid rgba(247, 210, 30, 0.2);
  padding: 5px 11px;
  border-radius: 3px;
}

/* Sociales */
.jm-footer__socials {
  display: flex;
  gap: 8px;
}
.jm-footer__social-btn {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  border: 1px solid var(--jm-magenta-line);
  background: var(--jm-magenta-soft);
  color: rgba(255, 255, 255, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition:
    border-color 0.2s,
    background 0.2s,
    color 0.2s,
    box-shadow 0.2s;
}
.jm-footer__social-btn:hover {
  border-color: var(--jm-magenta);
  background: rgba(176, 24, 131, 0.18);
  color: #fff;
  box-shadow: 0 0 14px var(--jm-magenta-glow);
}

/* ════════════════════════════════════════
   TÍTULOS DE COLUMNA
════════════════════════════════════════ */
.jm-footer__col-title {
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #fff;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 10px;
  position: relative;
}
.jm-footer__col-title::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 14px;
  background: var(--jm-magenta);
  border-radius: 2px;
}
.jm-footer__col-title::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--jm-border);
}

/* ════════════════════════════════════════
   LINKS DE COLUMNA
════════════════════════════════════════ */
.jm-footer__links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.jm-footer__link {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--jm-txt);
  text-decoration: none;
  letter-spacing: 0.01em;
  transition:
    color 0.18s,
    padding-left 0.18s;
}
.jm-footer__link:hover {
  color: var(--jm-txt-light);
  padding-left: 4px;
}
.jm-footer__link:hover .jm-footer__link-arrow {
  color: var(--jm-magenta);
}
.jm-footer__link-arrow {
  font-size: 15px;
  line-height: 1;
  color: var(--jm-magenta-line);
  transition: color 0.18s;
  flex-shrink: 0;
}

/* ════════════════════════════════════════
   COL 3 — CONTACTO
════════════════════════════════════════ */
.jm-footer__contact-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.jm-footer__contact-item {
  display: flex;
  align-items: flex-start;
  gap: 11px;
}
.jm-footer__contact-ico {
  width: 32px;
  height: 32px;
  border-radius: 7px;
  background: var(--jm-magenta-soft);
  border: 1px solid var(--jm-magenta-line);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--jm-magenta);
  transition:
    background 0.18s,
    box-shadow 0.18s;
}
.jm-footer__contact-item:hover .jm-footer__contact-ico {
  background: rgba(176, 24, 131, 0.18);
  box-shadow: 0 0 10px var(--jm-magenta-glow);
}
.jm-footer__contact-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.28);
  margin-bottom: 2px;
}
.jm-footer__contact-val {
  font-size: 13px;
  font-weight: 500;
  color: var(--jm-txt-light);
  text-decoration: none;
  line-height: 1.4;
}
.jm-footer__contact-val--link {
  transition: color 0.18s;
}
.jm-footer__contact-val--link:hover {
  color: var(--jm-yellow);
}

/* ════════════════════════════════════════
   BARRA INFERIOR
════════════════════════════════════════ */
.jm-footer__bottom-wrap {
  border-top: 1px solid var(--jm-border);
  background: rgba(0, 0, 0, 0.4);
}
.jm-footer__bottom {
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.jm-footer__copy {
  font-size: 10.5px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.2);
}
.jm-footer__bottom-center {
  display: flex;
  align-items: center;
  gap: 12px;
}
.jm-footer__dev-credit {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.15);
  text-decoration: none;
  letter-spacing: 0.06em;
  transition: color 0.2s;
}
.jm-footer__dev-credit:hover {
  color: rgba(255, 255, 255, 0.35);
}
.jm-footer__dev-credit strong {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.22);
}
.jm-footer__dev-credit:hover strong {
  color: rgba(255, 255, 255, 0.45);
}

/* ════════════════════════════════════════
   RESPONSIVE — TABLET
════════════════════════════════════════ */
@media (max-width: 1100px) {
  .jm-footer__main {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    padding: 28px 28px 24px;
  }
  .jm-footer__brand {
    grid-column: 1 / -1;
  }
  .jm-footer__desc {
    max-width: 100%;
  }
}

/* ════════════════════════════════════════
   RESPONSIVE — MÓVIL
════════════════════════════════════════ */
@media (max-width: 640px) {
  .jm-footer__main {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 24px 20px 20px;
  }
  .jm-footer__bottom {
    flex-direction: column;
    align-items: flex-start;
    padding: 14px 20px;
    gap: 8px;
  }
}
</style>
