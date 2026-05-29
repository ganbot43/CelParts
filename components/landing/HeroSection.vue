<template>
  <section class="hero" id="inicio">
    <!-- Fondo -->
    <div class="hero-bg">
      <img
        src="/images/hero2.jpeg"
        alt="Utensilios Kite"
        fetchpriority="high"
        decoding="async"
      />

      <!-- glow -->
      <div class="hero-glow hero-glow--1" />
      <div class="hero-glow hero-glow--2" />
    </div>

    <!-- overlay -->
    <div class="hero-overlay" aria-hidden="true" />

    <!-- contenido -->
    <div class="hero-content">
      <div class="hero-container">

        <!-- top badge -->
        <div class="hero-chip">
          <span class="hero-chip__line" />
          KITE
        </div>

        <!-- headline -->
        <div class="hero-copy">
          <h1 class="hero-title">
            Cocina con
            <span>nivel profesional.</span>
          </h1>

          <p class="hero-text">
            Descubre utensilios de cocina de alta calidad, seleccionados y
            probados para ofrecerte solo lo mejor. Transforma tu experiencia
            culinaria con nuestros productos premium.
          </p>
        </div>

        <!-- actions -->
        <div class="hero-actions">
          <a href="#nuevos-lanzamientos" class="hero-btn hero-btn--primary">
            Explorar catálogo

            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 12H19"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M13 6L19 12L13 18"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </a>

          <!-- <a href="#nosotros" class="hero-btn hero-btn--ghost">
            Nuestra historia
          </a> -->
        </div>

        <!-- bottom stats -->
        <div class="hero-stats">
          <div class="hero-stat">
            <strong>+500</strong>
            <span>Productos</span>
          </div>

          <div class="hero-stat">
            <strong>2023</strong>
            <span>Desde</span>
          </div>

          <div class="hero-stat">
            <strong>Perú</strong>
            <span>Distribución</span>
          </div>
        </div>
      </div>
    </div>

    <!-- fade -->
    <div class="hero-fade" aria-hidden="true" />
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
/* ═══════════════════════════════════
   HERO — KITE STYLE
═══════════════════════════════════ */
.hero {
  --hero-bg: #0f1110;
  --hero-green: #2d6a4f;
  --hero-green-light: #52a17a;
  --hero-yellow: #e9c46a;
  --hero-white: #ffffff;
  --hero-text: rgba(255, 255, 255, 0.72);
  --hero-border: rgba(255, 255, 255, 0.12);

  position: relative;
  width: 100%;
  overflow: hidden;
  background: var(--hero-bg);
}

/* ═══════════════════════════════════
   BG
═══════════════════════════════════ */
.hero-bg {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 680px;
  max-height: 980px;
}

.hero-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;

  transform: scale(1.02);
  filter:
    saturate(1.05)
    contrast(1.02)
    brightness(0.82);
}

/* glow */
.hero-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(120px);
  opacity: 0.45;
  pointer-events: none;
}

.hero-glow--1 {
  width: 420px;
  height: 420px;
  background: rgba(45, 106, 79, 0.45);

  top: -80px;
  right: -80px;
}

.hero-glow--2 {
  width: 320px;
  height: 320px;
  background: rgba(233, 196, 106, 0.22);

  bottom: -120px;
  left: -80px;
}

/* ═══════════════════════════════════
   OVERLAY
═══════════════════════════════════ */
.hero-overlay {
  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      90deg,
      rgba(5, 5, 5, 0.86) 0%,
      rgba(5, 5, 5, 0.58) 42%,
      rgba(5, 5, 5, 0.18) 100%
    );

  z-index: 1;
}

/* ═══════════════════════════════════
   CONTENT
═══════════════════════════════════ */
.hero-content {
  position: absolute;
  inset: 0;
  z-index: 2;

  display: flex;
  align-items: center;
}

.hero-container {
  width: 100%;
  max-width: 1320px;

  margin: 0 auto;
  padding: 0 48px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

/* ═══════════════════════════════════
   CHIP
═══════════════════════════════════ */
.hero-chip {
  display: inline-flex;
  align-items: center;
  gap: 12px;

  height: 38px;
  padding: 0 18px;

  border-radius: 999px;
  border: 1px solid var(--hero-border);

  background: rgba(255, 255, 255, 0.06);

  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  color: rgba(255, 255, 255, 0.88);

  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;

  margin-bottom: 30px;
}

.hero-chip__line {
  width: 18px;
  height: 2px;
  border-radius: 999px;
  background: var(--hero-yellow);
}

/* ═══════════════════════════════════
   COPY
═══════════════════════════════════ */
.hero-copy {
  max-width: 720px;
}

.hero-title {
  margin: 0;

  color: var(--hero-white);

  font-size: clamp(3.5rem, 8vw, 7rem);
  line-height: 0.95;
  letter-spacing: -0.06em;
  font-weight: 800;
}

.hero-title span {
  display: block;
  color: var(--hero-yellow);
}

.hero-text {
  margin: 28px 0 0;

  max-width: 580px;

  color: var(--hero-text);

  font-size: clamp(1rem, 1.3vw, 1.12rem);
  line-height: 1.75;
  font-weight: 400;
}

/* ═══════════════════════════════════
   ACTIONS
═══════════════════════════════════ */
.hero-actions {
  display: flex;
  align-items: center;
  gap: 14px;

  margin-top: 42px;
  flex-wrap: wrap;
}

.hero-btn {
  height: 54px;
  padding: 0 24px;

  border-radius: 14px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  text-decoration: none;

  font-size: 0.92rem;
  font-weight: 700;
  letter-spacing: 0.01em;

  transition:
    transform 0.16s ease,
    background 0.16s ease,
    border-color 0.16s ease,
    color 0.16s ease,
    box-shadow 0.16s ease;
}

.hero-btn:hover {
  transform: translateY(-2px);
}

.hero-btn--primary {
  background: var(--hero-white);
  color: #111111;

  border: 1.5px solid var(--hero-white);

  box-shadow:
    0 10px 30px rgba(255, 255, 255, 0.12),
    0 4px 12px rgba(0, 0, 0, 0.2);
}

.hero-btn--primary:hover {
  background: var(--hero-yellow);
  border-color: var(--hero-yellow);

  box-shadow:
    0 14px 40px rgba(233, 196, 106, 0.28);
}

.hero-btn--ghost {
  border: 1.5px solid rgba(255, 255, 255, 0.18);

  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.9);

  backdrop-filter: blur(10px);
}

.hero-btn--ghost:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.35);
}

/* ═══════════════════════════════════
   STATS
═══════════════════════════════════ */
.hero-stats {
  display: flex;
  align-items: center;
  gap: 18px;

  margin-top: 58px;
  flex-wrap: wrap;
}

.hero-stat {
  min-width: 130px;

  padding: 18px 20px;

  border-radius: 18px;

  background: rgba(255, 255, 255, 0.06);

  border: 1px solid rgba(255, 255, 255, 0.08);

  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.hero-stat strong {
  display: block;

  color: var(--hero-white);

  font-size: 1.15rem;
  font-weight: 800;

  margin-bottom: 6px;
}

.hero-stat span {
  color: rgba(255, 255, 255, 0.64);

  font-size: 0.8rem;
  letter-spacing: 0.04em;
}

/* ═══════════════════════════════════
   FADE
═══════════════════════════════════ */
.hero-fade {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;

  height: 180px;

  background:
    linear-gradient(
      to bottom,
      rgba(15, 17, 16, 0) 0%,
      rgba(15, 17, 16, 0.82) 100%
    );

  z-index: 3;
  pointer-events: none;
}

/* ═══════════════════════════════════
   RESPONSIVE
═══════════════════════════════════ */
@media (max-width: 1100px) {
  .hero-bg {
    height: 90vh;
    min-height: 720px;
  }

  .hero-container {
    padding: 0 32px;
  }

  .hero-title {
    max-width: 700px;
  }
}

@media (max-width: 768px) {
  .hero-bg {
    height: 92vh;
    min-height: 720px;
  }

  .hero-bg img {
    object-position: center;
  }

  .hero-overlay {
    background:
      linear-gradient(
        180deg,
        rgba(5, 5, 5, 0.28) 0%,
        rgba(5, 5, 5, 0.68) 45%,
        rgba(5, 5, 5, 0.9) 100%
      );
  }

  .hero-container {
    padding: 0 22px;
    justify-content: flex-end;
  }

  .hero-chip {
    margin-bottom: 22px;

    font-size: 0.64rem;
    letter-spacing: 0.12em;
  }

  .hero-title {
    font-size: clamp(2.8rem, 12vw, 4.2rem);
    line-height: 0.98;
  }

  .hero-text {
    margin-top: 20px;

    font-size: 0.96rem;
    line-height: 1.7;
  }

  .hero-actions {
    width: 100%;
    margin-top: 34px;
  }

  .hero-btn {
    flex: 1;
    min-width: 0;
    height: 50px;

    font-size: 0.88rem;
  }

  .hero-stats {
    gap: 12px;
    margin-top: 42px;
    width: 100%;
  }

  .hero-stat {
    flex: 1;
    min-width: 0;

    padding: 16px;
  }

  .hero-stat strong {
    font-size: 1rem;
  }
}

@media (max-width: 520px) {
  .hero-bg {
    min-height: 760px;
  }

  .hero-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .hero-btn {
    width: 100%;
  }

  .hero-stats {
    display: grid;
    grid-template-columns: 1fr;
  }

  .hero-stat {
    width: 100%;
  }
}
</style>