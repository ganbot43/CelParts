<template>
  <section class="kite-section" id="nosotros">
    <!-- Blobs decorativos -->
    <span class="blob blob--tr" aria-hidden="true" />
    <span class="blob blob--bl" aria-hidden="true" />

    <div class="kite-section__container">
      <!-- Columna izquierda: contenido -->
      <div class="kite-section__content">

        <!-- Divisor -->
        <div class="divider" aria-hidden="true">
          <span class="divider__line" />
          <span class="divider__gem">✦</span>
          <span class="divider__line divider__line--short" />
        </div>

        <!-- Texto de bienvenida -->
        <p class="welcome-text">
          En <strong class="welcome-text__highlight">CelParts</strong> nos apasiona ofrecer repuestos y accesorios de alta calidad para celulares en Perú. Creemos que tu dispositivo merece lo mejor, y por eso nos esforzamos por brindarte productos confiables, duraderos y
          <strong class="welcome-text__highlight">al precio justo</strong>.
        </p>

        <!-- Valores / Pillars -->
        <ul class="pillars" aria-label="Nuestros valores">
          <li
            v-for="pillar in pillars"
            :key="pillar.label"
            class="pillars__item"
          >
            <span class="pillars__check" aria-hidden="true">✔</span>
            <span class="pillars__label">{{ pillar.label }}</span>
          </li>
        </ul>

        <!-- Botones -->
        <div class="cta-row">
          <NuxtLink to="/productos" class="btn btn--primary">
            Ver productos
          </NuxtLink>
          <NuxtLink to="/privacidad" class="btn btn--secondary">
            Conocer más
          </NuxtLink>
        </div>

        <!-- País de origen -->
        <p class="origin-tag">
          <span class="origin-tag__flag" aria-hidden="true">🇵🇪</span>
          Hecho en Peru - 2026
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Pillar {
  label: string;
}

const pillars: Pillar[] = [
  { label: "Repuestos de calidad" },
  { label: "Atención personalizada" },
  { label: "Precios competitivos" },
  { label: "Compatibilidad garantizada" },
];
</script>

<style scoped>
/* ═══════════════════════════════════
   ABOUT SECTION — CELPARTS
   100% tokens de main.css — sin hardcode
═══════════════════════════════════ */

.kite-section {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding: clamp(80px, 8vw, 120px) 0;
  background: var(--bg-alt);
  border-top: 1px solid var(--border-light);
  border-bottom: 1px solid var(--border-light);
}

/* Línea técnica superior */
.kite-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  display: none; /* background: var(--line-brand); */
  z-index: 1;
}

/* BLOBS / DECORACIÓN */
.blob {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(80px);
  z-index: 0;
}

.blob--tr {
  top: -150px;
  right: -150px;
  width: 420px;
  height: 420px;
  background: radial-gradient(circle, var(--cp-ice) 0%, transparent 60%);
}

.blob--bl {
  bottom: -150px;
  left: -150px;
  width: 380px;
  height: 380px;
  background: radial-gradient(circle, var(--cp-frost) 0%, transparent 60%);
}

/* CONTAINER */
.kite-section__container {
  position: relative;
  z-index: 2;
  max-width: 920px;
  margin: 0 auto;
  padding: 0 var(--space-8);
}

/* CONTENT */
.kite-section__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-8);
}

/* DIVIDER */
.divider {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  width: 100%;
  max-width: 520px;
}

.divider__line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border-mid));
}

.divider__line--short {
  flex: 0 0 60px;
}

.divider__gem {
  color: var(--cp-electric);
  font-size: 11px;
}

/* TEXT */
.welcome-text {
  max-width: 760px;
  margin: 0;
  color: var(--text-muted);
  font-size: clamp(1.05rem, 1.8vw, 1.2rem);
  line-height: 1.8;
}

.welcome-text__highlight {
  color: var(--text-primary);
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: -0.01em;
}

/* PILLS */
.pillars {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-3);
}

.pillars__item {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-5);
  border-radius: var(--r-pill);
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  box-shadow: var(--card-shadow-sm);
  transition:
    transform var(--t-fast) var(--ease-snappy),
    border-color var(--t-base) var(--ease-smooth),
    box-shadow var(--t-base) var(--ease-smooth),
    background var(--t-base) var(--ease-smooth);
}

.pillars__item:hover {
  transform: translateY(-2px);
  border-color: var(--border-mid);
  background: var(--cp-frost);
  box-shadow: var(--card-shadow);
}

.pillars__check {
  color: var(--cp-electric);
  font-size: 11px;
}

.pillars__label {
  color: var(--text-body);
  font-size: 0.85rem;
  font-weight: 600;
}

.pillars__item:hover .pillars__label {
  color: var(--text-primary);
}

/* CTA */
.cta-row {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
  justify-content: center;
  margin-top: var(--space-2);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 170px;
  padding: 0 var(--space-8);
  height: 48px;
  border-radius: var(--r-pill);
  text-decoration: none;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 700;
  transition:
    transform var(--t-fast) var(--ease-snappy),
    background var(--t-base) var(--ease-smooth),
    box-shadow var(--t-base) var(--ease-smooth),
    border-color var(--t-base) var(--ease-smooth);
}

.btn:hover {
  transform: translateY(-2px);
}

.btn--primary {
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
  border: none;
  box-shadow: 0 4px 14px rgba(7, 30, 82, 0.18);
}

.btn--primary:hover {
  background: var(--btn-primary-hover);
  box-shadow: 0 8px 24px rgba(7, 30, 82, 0.26);
  color: var(--btn-primary-text);
}

.btn--secondary {
  background: var(--bg-surface);
  color: var(--text-body);
  border: 1px solid var(--border-light);
  box-shadow: var(--card-shadow-sm);
}

.btn--secondary:hover {
  background: var(--bg-alt);
  border-color: var(--border-mid);
  color: var(--text-primary);
}

/* ORIGIN */
.origin-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-8);
  color: var(--text-faint);
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.origin-tag__flag {
  font-size: 14px;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .kite-section__container {
    padding: 0 var(--space-5);
  }
}

@media (max-width: 480px) {
  .cta-row {
    width: 100%;
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .welcome-text {
    font-size: 0.98rem;
  }
}
</style>