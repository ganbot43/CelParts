<script setup lang="ts">
const { waLink } = useKite();

const details = [
  {
    icon: "ti-map-pin",
    title: "Dirección",
    content:
      "Villa El Salvador, Lima, Perú\nAv. [Nombre de la avenida], [número], VES",
  },
  {
    icon: "ti-clock-hour-4",
    title: "Horario de atención",
    content: "Lunes a Sábado: 9:00 am – 7:00 pm\nDomingos: 10:00 am – 3:00 pm",
  },
  {
    icon: "ti-brand-whatsapp",
    title: "WhatsApp / Llamadas",
    content: "+51 XXX XXX XXX\nTambién atendemos pedidos por WhatsApp",
  },
  {
    icon: "ti-package",
    title: "Envíos",
    content: "Delivery a todo Lima.\nCoordina tu pedido por WhatsApp.",
  },
];
</script>

<template>
  <section class="location" id="tienda">
    <div class="location-glow location-glow--1" aria-hidden="true" />
    <div class="location-glow location-glow--2" aria-hidden="true" />
    <div class="location-grid-bg" aria-hidden="true" />

    <div class="container">
      <!-- Intro -->
      <div class="section-intro">
        <div class="section-chip">
          <span class="section-chip__dot" />
          <span class="section-chip__text">ENCUÉNTRANOS</span>
        </div>

        <h2 class="section-title">
          Visita nuestra
          <span class="section-title__accent">tienda</span>
        </h2>

        <p class="section-subtitle">
          Estamos ubicados en Villa El Salvador, Lima. Ven a conocernos y
          descubre nuestra selección de productos de calidad.
        </p>
      </div>

      <!-- Grid principal -->
      <div class="location-layout">

        <!-- Card de info -->
        <div class="info-card">
          <div class="info-card__header">
            <span class="info-badge">Atención en tienda</span>
            <h3>Estamos cerca de ti</h3>
            <p>
              Coordina tu visita, consulta disponibilidad o realiza tu pedido
              directamente por WhatsApp.
            </p>
          </div>

          <div class="details-list">
            <div v-for="detail in details" :key="detail.title" class="detail-item">
              <div class="detail-icon">
                <i :class="`ti ${detail.icon}`" aria-hidden="true" />
              </div>
              <div class="detail-text">
                <strong>{{ detail.title }}</strong>
                <!-- eslint-disable-next-line vue/no-v-html -->
                <span v-html="detail.content.replace(/\n/g, '<br>')" />
              </div>
            </div>
          </div>

          <div class="info-actions">
            <!-- Botón de WhatsApp corregido -->
            <button @click="waLink('Hola, estoy interesado en visitar la tienda, ¿podrían brindarme más información?')"
              class="action-btn action-btn--primary">
              <i class="ti ti-brand-whatsapp" aria-hidden="true"></i> Escribirnos
            </button>

            <!-- Botón de Google Maps corregido con enlace estático -->
            <a href="https://maps.google.com/?q=Villa+El+Salvador+Lima" target="_blank"
              class="action-btn action-btn--outline">
              <i class="ti ti-map-pin" aria-hidden="true"></i> Ver en Google Maps
            </a>
          </div>


          <!-- Card del mapa -->
          <div class="map-card">
            <div class="map-topbar">
              <span class="map-status" />
              <span>Ubicación Cel Parts</span>
            </div>

            <div class="map-frame">
              <div class="map-placeholder">
                <div class="map-placeholder__icon">
                  <i class="ti ti-map-2" aria-hidden="true" />
                </div>

                <h4>Mapa de Google Maps</h4>
                <p>Inserta aquí el iframe real de la ubicación.</p>

                <a class="map-open-btn" href="https://maps.app.goo.gl/AJnmGdDDr7a4dvPT7" target="_blank"
                  rel="noopener noreferrer">
                  <i class="ti ti-external-link" aria-hidden="true" />
                  Abrir ubicación
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ═══════════════════════════════════
   SECTION
═══════════════════════════════════ */
.location {
  position: relative;
  overflow: hidden;
  padding: clamp(80px, 10vw, 128px) 0;
  background: var(--k-bg);
}

/* ═══════════════════════════════════
   GLOWS
═══════════════════════════════════ */
.location-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(120px);
  pointer-events: none;
  z-index: 0;
}

.location-glow--1 {
  width: 520px;
  height: 520px;
  background: rgba(0, 174, 239, 0.12);
  top: -140px;
  left: -100px;
}

.location-glow--2 {
  width: 400px;
  height: 400px;
  background: rgba(0, 63, 138, 0.22);
  bottom: -100px;
  right: -80px;
}

/* ═══════════════════════════════════
   GRID DECORATIVO
═══════════════════════════════════ */
.location-grid-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image:
    linear-gradient(rgba(0, 174, 239, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 174, 239, 0.045) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(ellipse 80% 80% at center, black 30%, transparent 100%);
  pointer-events: none;
}

/* ═══════════════════════════════════
   CONTAINER
═══════════════════════════════════ */
.container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: var(--container-width);
  margin-inline: auto;
  padding-inline: 32px;
}

/* ═══════════════════════════════════
   INTRO
═══════════════════════════════════ */
.section-intro {
  max-width: 680px;
  margin: 0 auto clamp(40px, 5vw, 64px);
  text-align: center;
}

.section-chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 36px;
  padding: 0 16px;
  margin-bottom: 28px;
  border-radius: 999px;
  border: 1px solid rgba(0, 174, 239, 0.22);
  background: rgba(0, 174, 239, 0.08);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.section-chip__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--k-cyan);
  box-shadow: 0 0 8px rgba(0, 174, 239, 0.9);
  animation: pulse-dot 2s ease-in-out infinite;
  flex-shrink: 0;
}

@keyframes pulse-dot {

  0%,
  100% {
    opacity: 1;
    box-shadow: 0 0 8px rgba(0, 174, 239, 0.9);
  }

  50% {
    opacity: 0.6;
    box-shadow: 0 0 14px rgba(0, 174, 239, 0.5);
  }
}

.section-chip__text {
  color: var(--k-ice);
  font-size: 0.70rem;
  font-weight: 700;
  letter-spacing: 0.18em;
}

.section-title {
  margin: 0;
  color: var(--k-white);
  font-size: clamp(2.2rem, 4.5vw, 3.4rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.05em;
}

.section-title__accent {
  background: linear-gradient(135deg, var(--k-cyan) 0%, var(--k-cyan-light) 60%, var(--k-ice) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 20px rgba(0, 174, 239, 0.4));
}

.section-subtitle {
  max-width: 560px;
  margin: 16px auto 0;
  color: rgba(168, 237, 255, 0.65);
  font-size: clamp(0.94rem, 1.4vw, 1.05rem);
  line-height: 1.75;
}

/* ═══════════════════════════════════
   LAYOUT
═══════════════════════════════════ */
.location-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: clamp(20px, 3vw, 36px);
  align-items: stretch;
}

/* ═══════════════════════════════════
   INFO CARD
═══════════════════════════════════ */
.info-card {
  position: relative;
  overflow: hidden;
  padding: clamp(22px, 3vw, 32px);
  border-radius: 32px;
  background: linear-gradient(135deg, rgba(0, 174, 239, 0.1), rgba(0, 63, 138, 0.07));
  border: 1px solid rgba(0, 174, 239, 0.18);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(0, 174, 239, 0.18);
}

.info-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 174, 239, 0.07), transparent 40%);
  pointer-events: none;
}

.info-card__header {
  position: relative;
  margin-bottom: 22px;
  padding-bottom: 22px;
  border-bottom: 1px solid rgba(0, 174, 239, 0.12);
}

.info-badge {
  display: inline-flex;
  align-items: center;
  margin-bottom: 14px;
  padding: 5px 14px;
  border-radius: 999px;
  background: rgba(0, 174, 239, 0.14);
  border: 1px solid rgba(0, 174, 239, 0.22);
  color: var(--k-cyan-light);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.info-card__header h3 {
  margin: 0;
  color: var(--k-white);
  font-size: clamp(1.3rem, 2.2vw, 1.7rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.1;
}

.info-card__header p {
  margin: 10px 0 0;
  color: rgba(168, 237, 255, 0.6);
  font-size: 0.93rem;
  line-height: 1.65;
}

/* ═══════════════════════════════════
   DETAIL ITEMS
═══════════════════════════════════ */
.details-list {
  position: relative;
  display: grid;
  gap: 10px;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px;
  border: 1px solid rgba(0, 174, 239, 0.12);
  border-radius: 18px;
  background: rgba(0, 174, 239, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.detail-item:hover {
  transform: translateY(-2px);
  border-color: rgba(0, 174, 239, 0.28);
  background: rgba(0, 174, 239, 0.1);
  box-shadow: 0 0 18px rgba(0, 174, 239, 0.15);
}

.detail-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 44px;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(0, 174, 239, 0.12);
  border: 1px solid rgba(0, 174, 239, 0.22);
  color: var(--k-cyan-light);
  font-size: 1.2rem;
}

.detail-text {
  min-width: 0;
  padding-top: 2px;
}

.detail-text strong {
  display: block;
  margin-bottom: 4px;
  color: var(--k-white);
  font-size: 0.92rem;
  font-weight: 700;
}

.detail-text span {
  display: block;
  color: rgba(168, 237, 255, 0.6);
  font-size: 0.87rem;
  line-height: 1.6;
}

/* ═══════════════════════════════════
   ACTIONS
═══════════════════════════════════ */
.info-actions {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 22px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  padding: 0 22px;
  border-radius: 999px;
  font-size: 0.88rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 0.16s ease,
    background 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.action-btn--primary {
  background: linear-gradient(135deg, var(--k-cyan), var(--k-cyan-dark));
  border: 1px solid rgba(80, 208, 255, 0.22);
  color: #ffffff;
  box-shadow: 0 10px 28px rgba(0, 174, 239, 0.3);
}

.action-btn--primary:hover {
  box-shadow: 0 0 18px 6px rgba(0, 174, 239, 0.45);
}

.action-btn--outline {
  background: rgba(0, 174, 239, 0.08);
  border: 1px solid rgba(0, 174, 239, 0.28);
  color: var(--k-cyan-light);
  backdrop-filter: blur(10px);
}

.action-btn--outline:hover {
  background: rgba(0, 174, 239, 0.16);
  border-color: var(--k-cyan);
}

/* ═══════════════════════════════════
   MAP CARD
═══════════════════════════════════ */
.map-card {
  position: relative;
  overflow: hidden;
  padding: 14px;
  border-radius: 32px;
  background: linear-gradient(135deg, rgba(0, 174, 239, 0.1), rgba(0, 63, 138, 0.07));
  border: 1px solid rgba(0, 174, 239, 0.18);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(0, 174, 239, 0.18);
  display: flex;
  flex-direction: column;
}

.map-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 174, 239, 0.07), transparent 40%);
  pointer-events: none;
}

.map-topbar {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 6px 12px;
  color: rgba(168, 237, 255, 0.55);
  font-size: 0.84rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  flex-shrink: 0;
}

.map-status {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--k-cyan);
  box-shadow: 0 0 0 5px rgba(0, 174, 239, 0.15);
  animation: pulse-dot 2s ease-in-out infinite;
  flex-shrink: 0;
}

.map-frame {
  position: relative;
  flex: 1;
  overflow: hidden;
  min-height: 420px;
  border: 1px solid rgba(0, 174, 239, 0.22);
  border-radius: 22px;
  background: rgba(0, 0, 0, 0.4);
}

.map-frame iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}

.map-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  min-height: 420px;
  padding: 32px;
  text-align: center;
  background: radial-gradient(ellipse at center, rgba(0, 174, 239, 0.08) 0%, transparent 70%);
}

.map-placeholder__icon {
  display: grid;
  place-items: center;
  width: 80px;
  height: 80px;
  margin-bottom: 18px;
  border-radius: 22px;
  background: rgba(0, 174, 239, 0.12);
  border: 1px solid rgba(0, 174, 239, 0.22);
  color: var(--k-cyan-light);
  font-size: 2rem;
  box-shadow: 0 0 18px rgba(0, 174, 239, 0.2);
}

.map-placeholder h4 {
  margin: 0;
  color: var(--k-white);
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.map-placeholder p {
  max-width: 280px;
  margin: 10px 0 0;
  color: rgba(168, 237, 255, 0.55);
  font-size: 0.9rem;
  line-height: 1.6;
}

.map-open-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 22px;
  min-height: 44px;
  padding: 0 20px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--k-cyan), var(--k-cyan-dark));
  border: 1px solid rgba(80, 208, 255, 0.22);
  color: #ffffff;
  font-size: 0.88rem;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 10px 24px rgba(0, 174, 239, 0.28);
  transition:
    transform 0.16s ease,
    box-shadow 0.18s ease;
}

.map-open-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 18px 6px rgba(0, 174, 239, 0.4);
}

/* ═══════════════════════════════════
   RESPONSIVE
═══════════════════════════════════ */
@media (max-width: 960px) {
  .location-layout {
    grid-template-columns: 1fr;
  }

  .map-frame,
  .map-placeholder {
    min-height: 340px;
  }
}

@media (max-width: 768px) {
  .container {
    padding-inline: 20px;
  }
}

@media (max-width: 640px) {
  .location {
    padding: 64px 0;
  }

  .section-intro {
    text-align: left;
  }

  .section-subtitle {
    margin-left: 0;
    margin-right: 0;
  }

  .info-card {
    padding: 18px;
    border-radius: 24px;
  }

  .map-card {
    padding: 10px;
    border-radius: 24px;
  }

  .detail-item {
    padding: 13px;
    gap: 12px;
    border-radius: 14px;
  }

  .detail-icon {
    flex-basis: 40px;
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }

  .info-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }

  .map-frame,
  .map-placeholder {
    min-height: 280px;
  }

  .container {
    padding-inline: 16px;
  }
}
</style>