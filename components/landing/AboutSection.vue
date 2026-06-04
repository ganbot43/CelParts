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
.kite-section {
  position: relative;
  overflow: hidden;

  width: 100%;

  padding: 120px 0;

  background:
    radial-gradient(circle at top right,
      rgba(0,174,239,.10),
      transparent 35%),
    radial-gradient(circle at bottom left,
      rgba(0,63,138,.15),
      transparent 40%),
    #0A0A0A;
}

/* BLOBS */

.blob {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(100px);
}

.blob--tr {
  top: -220px;
  right: -220px;

  width: 520px;
  height: 520px;

  background:
    rgba(0,174,239,.15);
}

.blob--bl {
  bottom: -180px;
  left: -180px;

  width: 440px;
  height: 440px;

  background:
    rgba(0,119,200,.15);
}

/* CONTAINER */

.kite-section__container {
  position: relative;
  z-index: 2;

  max-width: 920px;

  margin: 0 auto;
  padding: 0 32px;
}

/* CONTENT */

.kite-section__content {
  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;

  gap: 28px;
}

/* DIVIDER */

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
      rgba(0,174,239,.25)
    );
}

.divider__line--short {
  flex: 0 0 60px;
}

.divider__gem {
  color: #00AEEF;
  font-size: 11px;
}

/* TEXT */

.welcome-text {
  max-width: 760px;

  margin: 0;

  color: rgba(168,237,255,.82);

  font-size: clamp(1.02rem,1.6vw,1.16rem);

  line-height: 1.95;
}

.welcome-text__highlight {
  color: #FFFFFF;
  font-weight: 700;
}

/* PILLS */

.pillars {
  list-style: none;

  margin: 0;
  padding: 0;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  gap: 12px;
}

.pillars__item {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 10px 18px;

  border-radius: 999px;

  background:
    rgba(0,174,239,.06);

  border:
    1px solid rgba(0,174,239,.18);

  backdrop-filter: blur(12px);

  transition: .2s ease;
}

.pillars__item:hover {
  transform: translateY(-2px);

  border-color:
    rgba(0,174,239,.45);

  box-shadow:
    0 0 24px rgba(0,174,239,.15);
}

.pillars__check {
  color: #00AEEF;
  font-size: 11px;
}

.pillars__label {
  color: #A8EDFF;

  font-size: 12px;
  font-weight: 600;
}

/* CTA */

.cta-row {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 170px;

  padding: .95rem 1.6rem;

  border-radius: 12px;

  text-decoration: none;

  font-size: .88rem;
  font-weight: 700;

  transition: .2s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn--primary {
  background:
    linear-gradient(
      135deg,
      #00AEEF,
      #0077C8
    );

  color: white;

  border: 1px solid rgba(80,208,255,.2);

  box-shadow:
    0 10px 30px rgba(0,174,239,.25);
}

.btn--primary:hover {
  box-shadow:
    0 16px 40px rgba(0,174,239,.45);
}

.btn--secondary {
  background:
    rgba(0,174,239,.06);

  color: #A8EDFF;

  border:
    1px solid rgba(0,174,239,.18);

  backdrop-filter: blur(12px);
}

.btn--secondary:hover {
  border-color:
    rgba(0,174,239,.4);
}

/* ORIGIN */

.origin-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  color:
    rgba(168,237,255,.55);

  font-size: 11px;

  text-transform: uppercase;

  letter-spacing: .08em;
}

.origin-tag__flag {
  font-size: 14px;
}

/* RESPONSIVE */

@media (max-width:768px) {
  .kite-section {
    padding: 84px 0;
  }

  .kite-section__container {
    padding: 0 20px;
  }

  .welcome-text {
    font-size: .98rem;
  }
}

@media (max-width:480px) {
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
    font-size: .95rem;
    line-height: 1.8;
  }
}
</style>