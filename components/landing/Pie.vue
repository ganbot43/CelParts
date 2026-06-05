<template>
  <footer class="cp-footer">
    <!-- ═══════════════════════════════
         MAIN
    ═══════════════════════════════ -->
    <div class="cp-footer__main">

      <!-- BRAND -->
      <div class="cp-footer__brand">
        <NuxtLink to="/" class="cp-footer__logo" aria-label="Arigumi — Inicio">
          <div class="cp-footer__logo-img">
            <img :src="logoUrl" alt="Arigumi" width="58" height="58" />
          </div>

          <div class="cp-footer__logo-text">
            <span class="cp-footer__logo-name">
              {{ configName }}
            </span>

            <span class="cp-footer__logo-sub">
              Hilando sonrisas
            </span>
          </div>
        </NuxtLink>

        <p class="cp-footer__desc">
          Un espacio cálido y seguro para conectar a nuestros adultos mayores 
          con personas que valoran el arte hecho a mano. Sin comisiones, trato directo 
          y mucho corazón.
        </p>

        <!-- BADGES -->
        <div class="cp-footer__badges">
          <div class="cp-footer__badge">
            Sin Comisiones
          </div>

          <div class="cp-footer__badge">
            Trato Directo
          </div>
        </div>

        <!-- SOCIALS -->
        <div class="cp-footer__socials">

          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="cp-footer__social-btn"
            aria-label="Instagram">
            <Instagram class="cp-footer__social-icon" />
          </a>

          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="cp-footer__social-btn"
            aria-label="Facebook">
            <Facebook class="cp-footer__social-icon" />
          </a>

        </div>
      </div>

      <!-- LINKS -->
      <div class="cp-footer__col">
        <div class="cp-footer__col-title">
          Navegación
        </div>

        <ul class="cp-footer__links">
          <li>
            <NuxtLink to="/" class="cp-footer__link">
              Inicio
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/login" class="cp-footer__link">
              Ingresar a mi cuenta
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/registro" class="cp-footer__link">
              Unirme como Tejedor
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- CONTACT -->
      <div class="cp-footer__col">
        <div class="cp-footer__col-title">
          Contáctanos
        </div>

        <div class="cp-footer__contact-list">

          <div class="cp-footer__contact-item">
            <div class="cp-footer__contact-label">
              Email
            </div>
            <a href="mailto:hola@arigumi.pe" class="cp-footer__contact-val">
              hola@arigumi.pe
            </a>
          </div>

          <div class="cp-footer__contact-item">
            <div class="cp-footer__contact-label">
              WhatsApp
            </div>
            <a href="tel:+51999999999" class="cp-footer__contact-val">
              +51 999 999 999
            </a>
          </div>

          <div class="cp-footer__contact-item">
            <div class="cp-footer__contact-label">
              Ubicación
            </div>
            <span class="cp-footer__contact-val">
              Perú
            </span>
          </div>

        </div>
      </div>

    </div>

    <!-- ═══════════════════════════════
         BOTTOM
    ═══════════════════════════════ -->
    <div class="cp-footer__bottom">
      <span>
        © {{ currentYear }} Arigumi. Todos los derechos reservados.
      </span>

      <div class="cp-footer__legal-links">
        <NuxtLink to="/terminos" class="cp-footer__legal-link">Términos</NuxtLink>
        <span class="cp-footer__legal-sep">•</span>
        <NuxtLink to="/privacidad" class="cp-footer__legal-link">Privacidad</NuxtLink>
        <span class="cp-footer__legal-sep">•</span>
        <NuxtLink to="/libro-de-reclamaciones" class="cp-footer__legal-link">Libro de Reclamaciones</NuxtLink>
      </div>

      <span class="cp-footer__credit">
        Hecho con ♥️ en Perú
      </span>
    </div>
  </footer>
</template>

<script setup>
import { Instagram, Facebook } from "lucide-vue-next";
const businessConfig = useBusinessConfig()
const logoUrl = computed(() => businessConfig.value?.logoUrl || '/images/logo.png')
const configName = computed(() => businessConfig.value?.name || 'Arigumi')
const currentYear = new Date().getFullYear();
</script>

<style scoped>
/* ═══════════════════════════════
   FOOTER — ARIGUMI
═══════════════════════════════ */
.cp-footer {
  background: var(--cp-cream-card);
  color: var(--text-primary);
  border-top: 1px solid var(--border-light);
  position: relative;
  overflow: hidden;
}

/* Fondo decorativo sutil */
.cp-footer::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(var(--cp-border-mid) 0.75px, transparent 0.75px);
  background-size: 24px 24px;
  opacity: 0.5;
  pointer-events: none;
  z-index: 0;
}

/* ═══════════════════════════════
   MAIN GRID
═══════════════════════════════ */
.cp-footer__main {
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
.cp-footer__brand {
  display: flex;
  flex-direction: column;
}

.cp-footer__logo {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  text-decoration: none;
  margin-bottom: var(--space-5);
}

.cp-footer__logo-img {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: var(--bg-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--cp-sage);
  box-shadow: var(--card-shadow-sm);
  overflow: hidden;
}

.cp-footer__logo-img img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.cp-footer__logo-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cp-footer__logo-name {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--text-primary);
}

.cp-footer__logo-sub {
  font-size: 0.72rem;
  color: var(--cp-earth-mid);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 700;
}

.cp-footer__desc {
  font-size: 0.95rem;
  line-height: 1.8;
  color: var(--text-muted);
  max-width: 360px;
  margin-bottom: var(--space-6);
}

/* ═══════════════════════════════
   BADGES
═══════════════════════════════ */
.cp-footer__badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
}

.cp-footer__badge {
  padding: 8px 14px;
  border-radius: var(--r-pill);
  background: var(--cp-sage-light);
  border: 1px solid var(--cp-sage);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--cp-sage-dark);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  box-shadow: var(--card-shadow-sm);
}

/* ═══════════════════════════════
   SOCIALS
═══════════════════════════════ */
.cp-footer__socials {
  display: flex;
  gap: var(--space-3);
}

.cp-footer__social-btn {
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
  transition: all var(--t-fast);
}

.cp-footer__social-icon {
  width: 18px;
  height: 18px;
  stroke-width: 2;
}

.cp-footer__social-btn:hover {
  background: var(--cp-earth-mid);
  border-color: var(--cp-earth-mid);
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--card-shadow-sm);
}

/* ═══════════════════════════════
   COLS
═══════════════════════════════ */
.cp-footer__col-title {
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: var(--space-5);
  color: var(--text-primary);
}

.cp-footer__links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.cp-footer__link {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: color var(--t-fast), transform var(--t-fast);
  display: inline-block;
}

.cp-footer__link:hover {
  color: var(--cp-sage-dark);
  transform: translateX(4px);
}

/* ═══════════════════════════════
   CONTACT
═══════════════════════════════ */
.cp-footer__contact-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.cp-footer__contact-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.cp-footer__contact-label {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-faint);
  font-weight: 700;
}

.cp-footer__contact-val {
  color: var(--text-body);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: color var(--t-fast);
}

.cp-footer__contact-val:hover {
  color: var(--cp-sage-dark);
}

/* ═══════════════════════════════
   BOTTOM
═══════════════════════════════ */
.cp-footer__bottom {
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

.cp-footer__credit {
  color: var(--cp-earth-mid);
  font-weight: 700;
}

.cp-footer__legal-links {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
  justify-content: center;
}

.cp-footer__legal-link {
  color: var(--text-muted);
  text-decoration: none;
  transition: color var(--t-fast);
}

.cp-footer__legal-link:hover {
  color: var(--cp-sage-dark);
}

.cp-footer__legal-sep {
  color: var(--border-mid);
  font-size: 0.7em;
}

/* ═══════════════════════════════════
   RESPONSIVE
═══════════════════════════════════ */
@media (max-width: 960px) {
  .cp-footer__main {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-10);
  }

  .cp-footer__brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 640px) {
  .cp-footer__main {
    grid-template-columns: 1fr;
    padding: var(--space-12) var(--space-5) var(--space-8);
    text-align: center;
  }

  .cp-footer__brand {
    align-items: center;
  }

  .cp-footer__logo {
    justify-content: center;
    margin-bottom: var(--space-4);
  }

  .cp-footer__desc {
    margin: 0 auto var(--space-6);
  }

  .cp-footer__badges {
    justify-content: center;
  }

  .cp-footer__socials {
    justify-content: center;
  }

  .cp-footer__links {
    align-items: center;
  }

  .cp-footer__contact-item {
    align-items: center;
  }

  .cp-footer__bottom {
    padding: var(--space-5) var(--space-5);
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--space-2);
  }

  .cp-footer__logo-name {
    font-size: 1.4rem;
  }
}
</style>