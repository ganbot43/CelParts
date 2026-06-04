<template>
  <section class="hero" id="inicio">
    <!-- Fondo -->
    <div class="hero-bg">
      <img
        src="/images/hero2.jpeg"
        alt="CelParts — Repuestos y accesorios para celulares"
        fetchpriority="high"
        decoding="async"
      />

      <!-- glows -->
      <div class="hero-glow hero-glow--1" />
      <div class="hero-glow hero-glow--2" />
      <div class="hero-glow hero-glow--3" />
    </div>

    <!-- overlay -->
    <div class="hero-overlay" aria-hidden="true" />

    <!-- grid lines decorativas -->
    <div class="hero-grid" aria-hidden="true" />

    <!-- contenido -->
    <div class="hero-content">
      <div class="hero-container">

        <!-- top badge -->
        <div class="hero-chip">
          <span class="hero-chip__dot" />
          <span class="hero-chip__text">CELPARTS PERÚ</span>
          <span class="hero-chip__tag">OFICIAL</span>
        </div>

        <!-- headline -->
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

        <!-- actions -->
        <div class="hero-actions">
          <a href="#catalogo" class="hero-btn hero-btn--primary">
            Ver catálogo
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12H19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
              <path d="M13 6L19 12L13 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>

          <a href="#contacto" class="hero-btn hero-btn--ghost">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Cotizar ahora
          </a>
        </div>

        <!-- stats -->
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

      </div>
    </div>

    <!-- scan line animada -->
    <div class="hero-scan" aria-hidden="true" />

    <!-- fade bottom -->
    <div class="hero-fade" aria-hidden="true" />
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
/* ═══════════════════════════════════
   HERO — CELPARTS TECH DARK
═══════════════════════════════════ */
.hero {
  --cp-bg:           #0A0A0A;
  --cp-cyan:         #00AEEF;
  --cp-cyan-dark:    #0077C8;
  --cp-cyan-deep:    #003F8A;
  --cp-cyan-light:   #50D0FF;
  --cp-ice:          #A8EDFF;
  --cp-fog:          #C0E8FF;
  --cp-white:        #FFFFFF;
  --cp-text:         rgba(168, 237, 255, 0.82);
  --cp-border:       rgba(0, 174, 239, 0.20);
  --cp-border-light: rgba(0, 174, 239, 0.10);

  position: relative;
  width: 100%;
  overflow: hidden;
  background: var(--cp-bg);
}

/* ═══════════════════════════════════
   BG IMAGE
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
  transform: scale(1.04);
  filter:
    saturate(0.6)
    contrast(1.1)
    brightness(0.45)
    hue-rotate(190deg);
}

/* ═══════════════════════════════════
   GLOWS
═══════════════════════════════════ */
.hero-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(110px);
  pointer-events: none;
}

.hero-glow--1 {
  width: 500px;
  height: 500px;
  background: rgba(0, 174, 239, 0.30);
  top: -120px;
  right: -100px;
  opacity: 0.7;
}

.hero-glow--2 {
  width: 360px;
  height: 360px;
  background: rgba(0, 63, 138, 0.45);
  bottom: -100px;
  left: -80px;
  opacity: 0.8;
}

.hero-glow--3 {
  width: 280px;
  height: 280px;
  background: rgba(80, 208, 255, 0.18);
  top: 50%;
  left: 55%;
  transform: translate(-50%, -50%);
  opacity: 0.5;
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
      rgba(10, 10, 10, 0.92) 0%,
      rgba(10, 10, 10, 0.70) 46%,
      rgba(10, 10, 10, 0.28) 100%
    );
  z-index: 1;
}

/* ═══════════════════════════════════
   GRID DECORATIVO
═══════════════════════════════════ */
.hero-grid {
  position: absolute;
  inset: 0;
  z-index: 1;
  background-image:
    linear-gradient(rgba(0, 174, 239, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 174, 239, 0.055) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image:
    linear-gradient(
      90deg,
      transparent 0%,
      rgba(0,0,0,0.4) 25%,
      rgba(0,0,0,0.15) 70%,
      transparent 100%
    );
  pointer-events: none;
}

/* ═══════════════════════════════════
   SCAN LINE
═══════════════════════════════════ */
.hero-scan {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  overflow: hidden;
}

.hero-scan::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(0, 174, 239, 0.0) 20%,
    rgba(0, 174, 239, 0.55) 50%,
    rgba(80, 208, 255, 0.30) 80%,
    transparent 100%
  );
  animation: scanline 5s linear infinite;
  opacity: 0.6;
}

@keyframes scanline {
  0%   { top: -2px; }
  100% { top: 100%; }
}

/* ═══════════════════════════════════
   CONTENT
═══════════════════════════════════ */
.hero-content {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  align-items: center;
}

.hero-container {
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 56px;
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
  gap: 10px;
  height: 36px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid var(--cp-border);
  background: rgba(0, 174, 239, 0.08);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  margin-bottom: 32px;
}

.hero-chip__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--cp-cyan);
  box-shadow: 0 0 8px rgba(0, 174, 239, 0.9);
  animation: pulse-dot 2s ease-in-out infinite;
  flex-shrink: 0;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(0, 174, 239, 0.9); }
  50%       { opacity: 0.6; box-shadow: 0 0 14px rgba(0, 174, 239, 0.5); }
}

.hero-chip__text {
  color: var(--cp-ice);
  font-size: 0.70rem;
  font-weight: 700;
  letter-spacing: 0.18em;
}

.hero-chip__tag {
  background: var(--cp-cyan);
  color: var(--cp-bg);
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  padding: 2px 8px;
  border-radius: 999px;
}

/* ═══════════════════════════════════
   COPY
═══════════════════════════════════ */
.hero-copy {
  max-width: 740px;
}

.hero-title {
  margin: 0;
  color: var(--cp-white);
  font-size: clamp(3.4rem, 7.5vw, 6.6rem);
  line-height: 0.96;
  letter-spacing: -0.055em;
  font-weight: 800;
}

.hero-title__accent {
  display: block;
  background: linear-gradient(135deg, var(--cp-cyan) 0%, var(--cp-cyan-light) 60%, var(--cp-ice) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 24px rgba(0, 174, 239, 0.45));
}

.hero-title__line {
  display: block;
  color: rgba(255,255,255,0.88);
}

.hero-text {
  margin: 30px 0 0;
  max-width: 560px;
  color: var(--cp-text);
  font-size: clamp(0.97rem, 1.2vw, 1.1rem);
  line-height: 1.78;
  font-weight: 400;
}

/* ═══════════════════════════════════
   ACTIONS
═══════════════════════════════════ */
.hero-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 44px;
  flex-wrap: wrap;
}

.hero-btn {
  height: 52px;
  padding: 0 26px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-decoration: none;
  font-size: 0.92rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition:
    transform 0.16s ease,
    background 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.hero-btn:hover {
  transform: translateY(-2px);
}

.hero-btn--primary {
  background: linear-gradient(135deg, var(--cp-cyan), var(--cp-cyan-dark));
  border: 1.5px solid rgba(80, 208, 255, 0.28);
  color: var(--cp-white);
  box-shadow:
    0 10px 32px rgba(0, 174, 239, 0.35),
    inset 0 1px 0 rgba(255,255,255,0.15);
}

.hero-btn--primary:hover {
  box-shadow:
    0 16px 48px rgba(0, 174, 239, 0.55),
    0 0 0 1px rgba(0, 174, 239, 0.6),
    inset 0 1px 0 rgba(255,255,255,0.20);
}

.hero-btn--ghost {
  border: 1.5px solid var(--cp-border);
  background: rgba(0, 174, 239, 0.07);
  color: var(--cp-ice);
  backdrop-filter: blur(10px);
}

.hero-btn--ghost:hover {
  background: rgba(0, 174, 239, 0.14);
  border-color: rgba(0, 174, 239, 0.40);
  box-shadow: 0 0 18px rgba(0, 174, 239, 0.18);
}

/* ═══════════════════════════════════
   STATS
═══════════════════════════════════ */
.hero-stats {
  display: flex;
  align-items: center;
  gap: 0;
  margin-top: 60px;
  background: rgba(0, 174, 239, 0.06);
  border: 1px solid var(--cp-border);
  border-radius: 18px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  overflow: hidden;
  flex-wrap: wrap;
}

.hero-stat {
  padding: 20px 28px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.hero-stat strong {
  display: block;
  color: var(--cp-cyan-light);
  font-size: 1.22rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1;
}

.hero-stat span {
  color: rgba(168, 237, 255, 0.55);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  font-weight: 500;
}

.hero-stat-divider {
  width: 1px;
  height: 40px;
  background: var(--cp-border);
  flex-shrink: 0;
}

/* ═══════════════════════════════════
   FADE
═══════════════════════════════════ */
.hero-fade {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 200px;
  background:
    linear-gradient(
      to bottom,
      transparent 0%,
      rgba(10, 10, 10, 0.85) 100%
    );
  z-index: 4;
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
    padding: 0 36px;
  }
}

@media (max-width: 768px) {
  .hero-bg {
    height: 92vh;
    min-height: 720px;
  }

  .hero-bg img {
    object-position: 65% center;
  }

  .hero-overlay {
    background:
      linear-gradient(
        180deg,
        rgba(10, 10, 10, 0.35) 0%,
        rgba(10, 10, 10, 0.72) 48%,
        rgba(10, 10, 10, 0.94) 100%
      );
  }

  .hero-container {
    padding: 0 22px;
    justify-content: flex-end;
    padding-bottom: 24px;
  }

  .hero-chip {
    margin-bottom: 22px;
  }

  .hero-title {
    font-size: clamp(2.8rem, 12vw, 4.2rem);
    line-height: 0.98;
  }

  .hero-text {
    margin-top: 18px;
    font-size: 0.94rem;
  }

  .hero-actions {
    width: 100%;
    margin-top: 32px;
  }

  .hero-btn {
    flex: 1;
    min-width: 0;
    height: 50px;
    font-size: 0.88rem;
  }

  .hero-stats {
    margin-top: 40px;
    width: 100%;
    border-radius: 14px;
  }

  .hero-stat {
    flex: 1;
    min-width: 0;
    padding: 16px 18px;
  }

  .hero-stat strong {
    font-size: 1.05rem;
  }

  .hero-stat-divider {
    height: 32px;
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
  }

  .hero-stats {
    display: grid;
    grid-template-columns: 1fr 1px 1fr;
    grid-template-rows: auto auto;
  }

  .hero-stat-divider:nth-child(4) {
    display: none;
  }

  .hero-stat:nth-child(5) {
    grid-column: 1;
  }

  .hero-stat:nth-child(7) {
    grid-column: 3;
  }
}
</style>