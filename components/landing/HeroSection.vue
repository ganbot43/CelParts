<template>
  <section class="hero" id="inicio">

    <!-- Fondo con imagen -->
    <div class="hero-bg">
      <NuxtImg src="/images/hero.jpg" alt="Arigumi — Amigurumis y tejidos" fetchpriority="high" format="webp"
        decoding="async" />
    </div>

    <!-- Overlay -->
    <div class="hero-overlay" aria-hidden="true" />

    <!-- Decoración geométrica -->
    <div class="hero-deco hero-deco--circle-1" aria-hidden="true" />
    <div class="hero-deco hero-deco--circle-2" aria-hidden="true" />
    <div class="hero-deco hero-deco--grid" aria-hidden="true" />

    <!-- Contenido -->
    <div class="hero-content">
      <div class="hero-container">

        <!-- Badge -->
        <div class="hero-chip">
          <span class="hero-chip__dot" aria-hidden="true" />
          <span class="hero-chip__text">ARIGUMI PERÚ</span>
          <span class="hero-chip__tag">OFICIAL</span>
        </div>

        <!-- Titular -->
        <div class="hero-copy">
          <h1 class="hero-title">
            Repuestos
            <span class="hero-title__accent">originales</span>
            <span class="hero-title__line">para tu celular.</span>
          </h1>
          <p class="hero-text">
            Pantallas, baterías, conectores y accesorios de alta calidad.
            Todo lo que necesitas para reparar y personalizar tu dispositivo,
            con garantía y envío a todo el Perú.
          </p>
        </div>

        <!-- CTAs -->
        <div class="hero-actions">
          <a href="#catalogo" class="hero-btn hero-btn--primary">
            Ver catálogo
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12H19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
              <path d="M13 6L19 12L13 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </a>
          <a href="#contacto" class="hero-btn hero-btn--ghost">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Cotizar ahora
          </a>
        </div>

      </div>
    </div>

    <!-- Stats — integradas al fondo de la imagen -->
  <!-- <div class="hero-stats-wrap">
      <div class="hero-stats">
        <div class="hero-stat">
          <strong>+500</strong>
          <span>Productos</span>
        </div>
        <div class="hero-stat-divider" aria-hidden="true" />
        <div class="hero-stat">
          <strong>2023</strong>
          <span>Fundados</span>
        </div>
        <div class="hero-stat-divider" aria-hidden="true" />
        <div class="hero-stat">
          <strong>100%</strong>
          <span>Garantía</span>
        </div>
        <div class="hero-stat-divider" aria-hidden="true" />
        <div class="hero-stat">
          <strong>Perú</strong>
          <span>Envío nacional</span>
        </div>
      </div>
    </div> -->

  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
/* ═══════════════════════════════════
   HERO — ARIGUMI
   100% tokens de main.css
═══════════════════════════════════ */

.hero {
  position: relative;
  width: 100%;
  background: var(--bg-page);
}

/* ── Imagen de fondo ── */
.hero-bg {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 680px;
  max-height: 920px;
  overflow: hidden;
}

.hero-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
  display: block;
}

/* ── Overlay ── */
.hero-overlay {
  position: absolute;
  inset: 0;
  height: 100vh;
  max-height: 920px;
  background: linear-gradient(105deg,
      rgba(7, 30, 82, 0.55) 0%,
      rgba(7, 30, 82, 0.35) 45%,
      rgba(7, 30, 82, 0.10) 100%);
  z-index: 1;
}

/* ── Decoración geométrica ── */
.hero-deco {
  position: absolute;
  pointer-events: none;
  z-index: 1;
}

.hero-deco--circle-1 {
  width: 640px;
  height: 640px;
  border-radius: var(--r-pill);
  right: -120px;
  top: -180px;
  background: radial-gradient(circle,
      var(--cp-ice) 0%,
      var(--cp-frost) 50%,
      transparent 75%);
  opacity: 0.12;
}

.hero-deco--circle-2 {
  width: 320px;
  height: 320px;
  border-radius: var(--r-pill);
  left: -80px;
  bottom: 80px;
  background: radial-gradient(circle,
      var(--cp-frost) 0%,
      transparent 70%);
  opacity: 0.10;
}

.hero-deco--grid {
  inset: 0;
  height: 100vh;
  max-height: 920px;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: linear-gradient(100deg,
      transparent 0%,
      transparent 50%,
      rgba(0, 0, 0, 0.30) 72%,
      rgba(0, 0, 0, 0.14) 100%);
}

/* ── Contenido ── */
.hero-content {
  position: absolute;
  inset: 0;
  height: 100vh;
  max-height: 920px;
  z-index: 3;
  display: flex;
  align-items: center;
  padding-top: var(--header-height); /* Evita que el navbar superponga el título */
}

.hero-container {
  width: 100%;
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 var(--space-16);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

/* ── Chip / badge ── */
.hero-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  height: 34px;
  padding: 0 var(--space-4);
  border-radius: var(--r-pill);
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: var(--card-shadow-sm);
  margin-bottom: var(--space-8);
}

.hero-chip__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--cp-electric);
  box-shadow: 0 0 0 2px rgba(0, 170, 255, 0.30);
  animation: pulse-dot 2.4s ease-in-out infinite;
  flex-shrink: 0;
}

@keyframes pulse-dot {

  0%,
  100% {
    box-shadow: 0 0 0 2px rgba(0, 170, 255, 0.30);
  }

  50% {
    box-shadow: 0 0 0 6px transparent;
  }
}

.hero-chip__text {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.hero-chip__tag {
  background: var(--cp-electric);
  color: var(--cp-navy);
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.10em;
  padding: 3px 9px;
  border-radius: var(--r-pill);
}

/* ── Titular ── */
.hero-copy {
  max-width: 680px;
}

.hero-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(3.2rem, 7vw, 6rem);
  line-height: 0.97;
  letter-spacing: -0.045em;
  font-weight: 800;
  color: var(--cp-white);
}

.hero-title__accent {
  display: block;
  background: linear-gradient(120deg, var(--cp-sky) 0%, var(--cp-electric) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-title__line {
  display: block;
  color: rgba(255, 255, 255, 0.88);
}

.hero-text {
  margin: var(--space-8) 0 0;
  max-width: 520px;
  color: rgba(255, 255, 255, 0.72);
  font-size: clamp(0.95rem, 1.15vw, 1.07rem);
  line-height: 1.80;
  font-weight: 400;
}

/* ── Botones CTA ── */
.hero-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-top: var(--space-10);
  flex-wrap: wrap;
}

.hero-btn {
  height: 50px;
  padding: 0 var(--space-6);
  border-radius: var(--r-md);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  text-decoration: none;
  font-family: var(--font-body);
  font-size: 0.90rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition:
    transform var(--t-fast) var(--ease-snappy),
    background var(--t-base) var(--ease-smooth),
    box-shadow var(--t-base) var(--ease-smooth),
    border-color var(--t-base) var(--ease-smooth);
}

.hero-btn:hover {
  transform: translateY(-2px);
}

.hero-btn:active {
  transform: translateY(0);
}

.hero-btn--primary {
  background: var(--cp-electric);
  color: var(--cp-navy);
  box-shadow: 0 4px 20px rgba(0, 170, 255, 0.40);
}

.hero-btn--primary:hover {
  background: var(--cp-sky);
  box-shadow: 0 6px 28px rgba(0, 170, 255, 0.55);
  color: var(--cp-navy);
}

.hero-btn--primary:focus-visible {
  outline: 3px solid var(--cp-sky-light);
  outline-offset: 3px;
}

.hero-btn--ghost {
  background: rgba(255, 255, 255, 0.12);
  border: 1.5px solid rgba(255, 255, 255, 0.30);
  color: var(--cp-white);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.hero-btn--ghost:hover {
  background: rgba(255, 255, 255, 0.22);
  border-color: rgba(255, 255, 255, 0.55);
  color: var(--cp-white);
}

.hero-btn--ghost:focus-visible {
  outline: 3px solid var(--cp-sky-light);
  outline-offset: 3px;
}

/* ── Stats — tarjeta centrada compacta ── */
.hero-stats-wrap {
  position: absolute;
  bottom: 40px;
  left: 0;
  width: 100%;
  z-index: 5;
  display: flex;
  justify-content: center;
  padding: 0 var(--space-8);
}

.hero-stats {
  display: inline-flex;
  align-items: stretch;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(200, 232, 248, 0.8);
  border-radius: var(--r-xl);
  box-shadow:
    0 4px 24px rgba(7, 30, 82, 0.10),
    0 1px 4px rgba(7, 30, 82, 0.06);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  overflow: hidden;
  flex-wrap: nowrap;
}

.hero-stat {
  padding: var(--space-5) var(--space-8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  min-width: 110px;
}

.hero-stat strong {
  display: block;
  color: var(--cp-navy);
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
}

.hero-stat span {
  color: var(--text-muted);
  font-size: 0.70rem;
  letter-spacing: 0.08em;
  font-weight: 600;
  text-transform: uppercase;
  text-align: center;
}

.hero-stat-divider {
  width: 1px;
  align-self: stretch;
  margin: var(--space-4) 0;
  background: var(--border-light);
  flex-shrink: 0;
}

/* ═══════════════════════════════════
   RESPONSIVE
═══════════════════════════════════ */
@media (max-width: 1100px) {
  .hero-bg {
    height: 90vh;
    min-height: 700px;
  }

  .hero-container {
    padding: 0 var(--space-10);
  }

  .hero-stats-wrap {
    padding: 0 var(--space-10);
  }

  .hero-deco--circle-1 {
    width: 460px;
    height: 460px;
    right: -80px;
    top: -100px;
  }
}

@media (max-width: 768px) {
  .hero-bg {
    height: 92vh;
    min-height: 720px;
  }

  .hero-bg img {
    object-position: 68% center;
  }

  .hero-overlay {
    background: linear-gradient(180deg,
        rgba(7, 30, 82, 0.30) 0%,
        rgba(7, 30, 82, 0.55) 55%,
        rgba(7, 30, 82, 0.75) 100%);
  }

  .hero-content {
    align-items: flex-end;
  }

  .hero-container {
    padding: 0 var(--space-5) var(--space-10);
  }

  .hero-chip {
    margin-bottom: var(--space-5);
  }

  .hero-title {
    font-size: clamp(2.6rem, 11.5vw, 4rem);
  }

  .hero-text {
    margin-top: var(--space-4);
    font-size: 0.93rem;
  }

  .hero-actions {
    width: 100%;
    margin-top: var(--space-8);
  }

  .hero-btn {
    flex: 1;
    min-width: 0;
    height: 48px;
    font-size: 0.87rem;
  }

  .hero-stats-wrap {
    padding: 0 var(--space-5);
    bottom: 24px;
  }

  .hero-stats {
    flex-wrap: wrap;
    border-radius: var(--r-lg);
  }

  .hero-stat {
    flex: 1;
    min-width: 120px;
    padding: var(--space-4) var(--space-5);
  }

  .hero-stat strong {
    font-size: 1.1rem;
  }

  .hero-stat-divider {
    margin: var(--space-3) 0;
  }

  .hero-deco--circle-1 {
    opacity: 0.08;
  }
}

@media (max-width: 520px) {
  .hero-bg {
    min-height: 780px;
  }

  .hero-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .hero-btn {
    width: 100%;
    flex: unset;
  }

  .hero-stats-wrap {
    bottom: 20px;
    padding: 0 var(--space-4);
  }

  .hero-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-radius: var(--r-lg);
    flex-wrap: unset;
  }

  .hero-stat-divider {
    display: none;
  }

  .hero-stat {
    min-width: unset;
    padding: var(--space-4);
  }

  .hero-stat:nth-child(1),
  .hero-stat:nth-child(3) {
    border-right: 1px solid var(--border-light);
  }

  .hero-stat:nth-child(3),
  .hero-stat:nth-child(5) {
    border-top: 1px solid var(--border-light);
  }
}
</style>