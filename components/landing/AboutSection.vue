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
          Nacimos en el Perú con un propósito claro: llevar a cada hogar
          utensilios de cocina de alta calidad y con garantía comprobada.
          Creemos firmemente que las familias peruanas merecen cocinar con lo
          mejor sin tener que pagar de más. Por eso, seleccionamos
          cuidadosamente cada producto para ofrecerte la máxima durabilidad y
          funcionalidad
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
          Hecho con orgullo en Perú · Desde 2023
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
  { label: "Alta calidad" },
  { label: "Garantía comprobada" },
  { label: "Precio justo" },
];
</script>

<style scoped>
/* ═══════════════════════════════════
   KITE ABOUT SECTION
═══════════════════════════════════ */
.kite-section {
  position: relative;
  overflow: hidden;

  width: 100%;

  padding: 120px 0;

  background:
    linear-gradient(
      to bottom,
      #ffffff 0%,
      var(--brand-bg) 100%
    );
}

/* ═══════════════════════════════════
   DECORATIVE BLOBS
═══════════════════════════════════ */
.blob {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(10px);
}

.blob--tr {
  top: -220px;
  right: -220px;

  width: 520px;
  height: 520px;

  background:
    radial-gradient(
      circle,
      rgba(45,106,79,0.08) 0%,
      transparent 72%
    );
}

.blob--bl {
  bottom: -180px;
  left: -180px;

  width: 440px;
  height: 440px;

  background:
    radial-gradient(
      circle,
      rgba(231,111,81,0.06) 0%,
      transparent 70%
    );
}

/* ═══════════════════════════════════
   CONTAINER
═══════════════════════════════════ */
.kite-section__container {
  position: relative;
  z-index: 2;

  max-width: 920px;

  margin: 0 auto;
  padding: 0 32px;
}

/* ═══════════════════════════════════
   CONTENT
═══════════════════════════════════ */
.kite-section__content {
  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;

  gap: 28px;
}

/* ═══════════════════════════════════
   DIVIDER
═══════════════════════════════════ */
.divider {
  display: flex;
  align-items: center;
  gap: 14px;

  width: 100%;
  max-width: 520px;
}

.divider__line {
  flex: 1;
  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(17,17,17,0.12)
    );
}

.divider__line--short {
  flex: 0 0 60px;
}

.divider__gem {
  font-size: 11px;
  color: var(--brand-accent);
  opacity: 0.9;
}

/* ═══════════════════════════════════
   TEXT
═══════════════════════════════════ */
.welcome-text {
  max-width: 760px;

  margin: 0;

  font-size: clamp(1.02rem, 1.6vw, 1.16rem);
  line-height: 1.95;
  letter-spacing: -0.01em;

  color: var(--brand-text-muted);

  font-weight: 400;
}

.welcome-text__highlight {
  color: var(--brand-black);
  font-weight: 700;
}

/* ═══════════════════════════════════
   PILLARS
═══════════════════════════════════ */
.pillars {
  list-style: none;

  margin: 0;
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  gap: 12px;
}

.pillars__item {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 10px 18px;

  border-radius: 999px;

  background: rgba(255,255,255,0.7);

  border: 1px solid rgba(17,17,17,0.08);

  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}

.pillars__item:hover {
  transform: translateY(-2px);

  border-color: rgba(45,106,79,0.18);

  background: rgba(255,255,255,0.92);
}

.pillars__check {
  font-size: 11px;
  color: var(--brand-primary);
}

.pillars__label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;

  color: var(--brand-text);
}

/* ═══════════════════════════════════
   CTA
═══════════════════════════════════ */
.cta-row {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 14px;
  flex-wrap: wrap;

  padding-top: 4px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 170px;

  padding: 0.9rem 1.5rem;

  border-radius: 10px;

  font-size: 0.88rem;
  font-weight: 600;
  letter-spacing: -0.01em;

  text-decoration: none;

  transition:
    transform 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn--primary {
  background: var(--brand-black);

  color: white;

  border: 1px solid var(--brand-black);

  box-shadow:
    0 8px 24px rgba(17,17,17,0.10);
}

.btn--primary:hover {
  background: var(--brand-primary);
  border-color: var(--brand-primary);

  box-shadow:
    0 12px 30px rgba(45,106,79,0.18);
}

.btn--secondary {
  background: rgba(255,255,255,0.78);

  color: var(--brand-text);

  border: 1px solid var(--brand-border);

  backdrop-filter: blur(10px);
}

.btn--secondary:hover {
  background: white;
  border-color: rgba(17,17,17,0.2);
}

/* ═══════════════════════════════════
   ORIGIN TAG
═══════════════════════════════════ */
.origin-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  margin: 0;

  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;

  color: var(--brand-text-faint);
}

.origin-tag__flag {
  font-size: 14px;
}

/* ═══════════════════════════════════
   RESPONSIVE
═══════════════════════════════════ */
@media (max-width: 768px) {
  .kite-section {
    padding: 84px 0;
  }

  .kite-section__container {
    padding: 0 20px;
  }

  .kite-section__content {
    gap: 24px;
  }

  .welcome-text {
    font-size: 0.98rem;
    line-height: 1.85;
  }

  .pillars {
    gap: 10px;
  }

  .pillars__item {
    padding: 9px 14px;
  }

  .btn {
    min-width: 150px;
  }
}

@media (max-width: 480px) {
  .kite-section {
    padding: 72px 0;
  }

  .cta-row {
    width: 100%;
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .welcome-text {
    font-size: 0.95rem;
    line-height: 1.8;
  }

  .pillars {
    justify-content: center;
  }

  .origin-tag {
    text-align: center;
    line-height: 1.6;
  }
}
</style>