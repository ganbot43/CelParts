<template>
  <section class="joymar-section" id="nosotros">
    <!-- Blobs decorativos -->
    <span class="blob blob--tr" aria-hidden="true" />
    <span class="blob blob--bl" aria-hidden="true" />

    <div class="joymar-section__container">
      <!-- Columna izquierda: contenido -->
      <div class="joymar-section__content">

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
/* ── Tokens ──────────────────────────────────────────────────── */
.joymar-section {
  --clr-primary: #b01883;
  --clr-primary-dark: #7a0f5c;
  --clr-primary-light: #d94cb0;
  --clr-yellow: #f7d21e;
  --clr-yellow-vivid: #ffd735;
  --clr-bg: #ffffff;
  --clr-bg-soft: #f5f5f5;
  --clr-border: #e5e5e5;
  --clr-text: #2b2b2b;
  --clr-text-mid: #555555;
  --clr-text-muted: #777777;
  --clr-black: #121212;

  --shadow-card: 0 10px 30px rgba(176, 24, 131, 0.12);

  --radius-pill: 999px;
  --radius-lg: 20px;
  --radius-md: 12px;

  position: relative;
  overflow: hidden;
  background: var(--clr-bg);
  width: 100%;
  padding: 5rem 0;
}

/* ── Blobs ───────────────────────────────────────────────────── */
.blob {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.blob--tr {
  top: -120px;
  right: -120px;
  width: 500px;
  height: 500px;
  background: radial-gradient(
    circle,
    rgba(176, 24, 131, 0.07) 0%,
    transparent 65%
  );
}
.blob--bl {
  bottom: -100px;
  left: -100px;
  width: 400px;
  height: 400px;
  background: radial-gradient(
    circle,
    rgba(247, 210, 30, 0.09) 0%,
    transparent 65%
  );
}

/* ── Grid ────────────────────────────────────────────────────── */
.joymar-section__container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 3rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 5rem;
  justify-items: center;
}

/* ── Content ─────────────────────────────────────────────────── */
.joymar-section__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.6rem;
  text-align: center;
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}
.divider__line {
  flex: 1;
  height: 1.5px;
  background: var(--clr-border);
}
.divider__line--short {
  flex: 0 0 40px;
}
.divider__gem {
  font-size: 13px;
  color: var(--clr-primary-light);
}

/* Texto */
.welcome-text {
  font-size: 1.05rem;
  line-height: 1.9;
  color: var(--clr-text-mid);
  margin: 0;
}
.welcome-text__highlight {
  font-weight: 900;
  color: var(--clr-text-mid);
  font-style: normal;
}

/* Pillars */
.pillars {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.pillars__item {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: var(--clr-bg-soft);
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-pill);
  padding: 7px 16px;
}
.pillars__check {
  font-size: 11px;
  color: var(--clr-primary);
}
.pillars__label {
  font-size: 13px;
  font-weight: 500;
  color: var(--clr-text);
}

/* CTA */
.cta-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.btn {
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: var(--radius-pill);
  padding: 13px 32px;
  border: 2px solid transparent;
  display: inline-block;
  text-decoration: none;
  text-align: center;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.1s ease;
  white-space: nowrap;
}
.btn:active {
  transform: scale(0.97);
}

.btn--primary {
  background: var(--clr-primary);
  color: #fff;
  border-color: var(--clr-primary);
  box-shadow: 0 4px 16px rgba(176, 24, 131, 0.28);
}
.btn--primary:hover {
  background: var(--clr-primary-dark);
  border-color: var(--clr-primary-dark);
  box-shadow: 0 6px 22px rgba(176, 24, 131, 0.38);
}
.btn--secondary {
  background: transparent;
  color: var(--clr-primary);
  border-color: var(--clr-yellow);
}
.btn--secondary:hover {
  background: var(--clr-yellow);
  color: var(--clr-black);
}

/* Origin */
.origin-tag {
  margin: 0;
  font-size: 12px;
  color: var(--clr-text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
  letter-spacing: 0.4px;
}
.origin-tag__flag {
  font-size: 16px;
}

/* ── Responsive ──────────────────────────────────────────────── */
@media (max-width: 900px) {
  .joymar-section__container {
    grid-template-columns: 1fr;
    gap: 3rem;
    padding: 0 1.5rem;
  }
  .joymar-section {
    padding: 3.5rem 0;
  }
}

@media (max-width: 480px) {
  .brand-name {
    font-size: 3rem;
  }
  .cta-row {
    flex-direction: column;
  }
  .btn {
    width: 100%;
    text-align: center;
  }
  .joymar-section {
    padding: 2.5rem 0;
  }
}
</style>