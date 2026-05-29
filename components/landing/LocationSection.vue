<script setup lang="ts">
const { waLink } = useKite();

const details = [
  {
    icon: "📍",
    title: "Dirección",
    content:
      "Villa El Salvador, Lima, Perú\nAv. [Nombre de la avenida], [número], VES",
  },
  {
    icon: "🕐",
    title: "Horario de atención",
    content: "Lunes a Sábado: 9:00 am – 7:00 pm\nDomingos: 10:00 am – 3:00 pm",
  },
  {
    icon: "📱",
    title: "WhatsApp / Llamadas",
    content: "+51 XXX XXX XXX\nTambién atendemos pedidos por WhatsApp",
  },
  {
    icon: "📦",
    title: "Envíos",
    content: "Delivery a todo Lima.\nCoordina tu pedido por WhatsApp.",
  },
];
</script>

<template>
  <section class="location" id="tienda">
    <div class="container">
      <div class="section-intro">
        <span class="section-label">Encuéntranos</span>

        <h2 class="section-title">
          Visita nuestra tienda<span class="accent-dot" />
        </h2>

        <p class="section-subtitle">
          Ven a conocer nuestros productos de cocina y hogar. Te esperamos con
          una atención cercana, práctica y personalizada.
        </p>
      </div>

      <div class="location-grid">
        <div class="location-info-card">
          <div class="location-info-header">
            <span class="info-badge">Atención en tienda</span>
            <h3>Estamos cerca de ti</h3>
            <p>
              Coordina tu visita, consulta disponibilidad o realiza tu pedido
              directamente por WhatsApp.
            </p>
          </div>

          <div class="location-info">
            <div
              v-for="detail in details"
              :key="detail.title"
              class="location-detail"
            >
              <div class="location-detail-icon">
                {{ detail.icon }}
              </div>

              <div class="location-detail-text">
                <strong>{{ detail.title }}</strong>
                <!-- eslint-disable-next-line vue/no-v-html -->
                <span v-html="detail.content.replace(/\n/g, '<br>')" />
              </div>
            </div>
          </div>

          <div class="location-actions">
            <LandingAppButton
              variant="wa"
              :href="
                waLink('Hola Kite, quisiera coordinar una visita a la tienda')
              "
              target="_blank"
              class="action-btn action-btn-primary"
            >
              <LandingWaIcon /> Escribirnos
            </LandingAppButton>

            <LandingAppButton
              variant="outline"
              href="https://maps.google.com/?q=Villa+El+Salvador+Lima"
              target="_blank"
              class="action-btn action-btn-secondary"
            >
              📍 Ver en Google Maps
            </LandingAppButton>
          </div>
        </div>

        <div class="location-map-card">
          <div class="map-topbar">
            <span class="map-status" />
            <span>Ubicación Kite</span>
          </div>

          <div class="location-map">
            <!--
              Reemplazar por iframe real:
              <iframe
                src="https://www.google.com/maps/embed?pb=..."
                allowfullscreen
                loading="lazy"
              />
            -->

            <div class="map-placeholder">
              <div class="map-icon">🗺️</div>
              <h4>Mapa de Google Maps</h4>
              <p>Inserta aquí el iframe real de la ubicación.</p>

              <a
                class="map-link"
                href="https://maps.app.goo.gl/AJnmGdDDr7a4dvPT7"
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir ubicación
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.location {
  position: relative;
  overflow: hidden;
  padding: clamp(72px, 9vw, 120px) 0;
  background:
    radial-gradient(
      circle at top left,
      rgba(45, 106, 79, 0.08),
      transparent 34%
    ),
    radial-gradient(
      circle at bottom right,
      rgba(233, 196, 106, 0.16),
      transparent 32%
    ),
    #F8F7F4;
}

.container {
  position: relative;
  z-index: 2;
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
}

.section-intro {
  max-width: 720px;
  margin: 0 auto clamp(36px, 5vw, 60px);
  text-align: center;
}

.section-label {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 9px 16px;
  margin-bottom: 18px;
  border: 1px solid rgba(45, 106, 79, 0.16);
  border-radius: 999px;
  background: #FFFFFF;
  color: #2D6A4F;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  box-shadow: 0 10px 24px rgba(45, 106, 79, 0.08);
}

.section-label::before {
  content: "";
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: linear-gradient(135deg, #2D6A4F, #E9C46A);
  box-shadow: 0 0 14px rgba(45, 106, 79, 0.22);
}

.section-title {
  margin: 0;
  color: #111111;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 850;
  line-height: 1.08;
  letter-spacing: -0.04em;
}

.accent-dot {
  display: inline-block;
  width: 9px;
  height: 9px;
  margin-left: 5px;
  border-radius: 999px;
  background: #E9C46A;
  vertical-align: middle;
  box-shadow: 0 0 18px rgba(233, 196, 106, 0.55);
}

.section-subtitle {
  max-width: 620px;
  margin: 16px auto 0;
  color: #66625A;
  font-size: clamp(0.98rem, 2vw, 1.08rem);
  line-height: 1.75;
}

.location-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: clamp(24px, 4vw, 48px);
  align-items: stretch;
}

.location-info-card,
.location-map-card {
  min-width: 0;
  border: 1px solid #E2E0D9;
  border-radius: 28px;
  background: #FFFFFF;
  box-shadow: 0 18px 45px rgba(17, 17, 17, 0.06);
}

.location-info-card {
  padding: clamp(22px, 3vw, 34px);
}

.location-info-header {
  margin-bottom: 22px;
  padding-bottom: 22px;
  border-bottom: 1px solid #E2E0D9;
}

.info-badge {
  display: inline-flex;
  width: fit-content;
  margin-bottom: 14px;
  padding: 7px 12px;
  border-radius: 999px;
  background: #E9C46A;
  color: #111111;
  font-size: 0.76rem;
  font-weight: 800;
}

.location-info-header h3 {
  margin: 0;
  color: #111111;
  font-size: clamp(1.35rem, 2.5vw, 1.8rem);
  font-weight: 850;
  letter-spacing: -0.03em;
}

.location-info-header p {
  margin: 10px 0 0;
  color: #66625A;
  font-size: 0.96rem;
  line-height: 1.65;
}

.location-info {
  display: grid;
  gap: 14px;
}

.location-detail {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 18px;
  border: 1px solid rgba(226, 224, 217, 0.5);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 4px 16px rgba(17, 17, 17, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.4);
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease;
}

.location-detail:hover {
  transform: translateY(-3px);
  border-color: #2D6A4F;
  box-shadow: 0 10px 30px rgba(45, 106, 79, 0.12);
}

.location-detail-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 48px;
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: rgba(45, 106, 79, 0.09);
  color: #2D6A4F;
  font-size: 1.25rem;
  box-shadow: inset 0 0 0 1px rgba(45, 106, 79, 0.08);
}

.location-detail-text {
  min-width: 0;
}

.location-detail-text strong {
  display: block;
  margin-bottom: 5px;
  color: #111111;
  font-size: 0.95rem;
  font-weight: 850;
}

.location-detail-text span {
  display: block;
  color: #66625A;
  font-size: 0.9rem;
  line-height: 1.6;
}

.location-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.action-btn {
  min-height: 48px;
  border-radius: 999px !important;
}

.location-map-card {
  overflow: hidden;
  padding: 14px;
}

.map-topbar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px 14px;
  color: #66625A;
  font-size: 0.86rem;
  font-weight: 800;
}

.map-status {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #2D6A4F;
  box-shadow: 0 0 0 6px rgba(45, 106, 79, 0.11);
}

.location-map {
  position: relative;
  overflow: hidden;
  min-height: 440px;
  height: 100%;
  border: 1px solid #E2E0D9;
  border-radius: 22px;
  background: #F8F7F4;
}

.location-map iframe {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 440px;
  border: 0;
}

.map-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 440px;
  height: 100%;
  padding: 32px;
  text-align: center;
  background:
    linear-gradient(135deg, rgba(45, 106, 79, 0.12), rgba(233, 196, 106, 0.2)),
    #FFFFFF;
}

.map-icon {
  display: grid;
  place-items: center;
  width: 86px;
  height: 86px;
  margin-bottom: 18px;
  border-radius: 26px;
  background: #FFFFFF;
  font-size: 2.6rem;
  box-shadow: 0 18px 38px rgba(45, 106, 79, 0.14);
}

.map-placeholder h4 {
  margin: 0;
  color: #111111;
  font-size: 1.25rem;
  font-weight: 850;
}

.map-placeholder p {
  max-width: 320px;
  margin: 10px 0 0;
  color: #66625A;
  font-size: 0.94rem;
  line-height: 1.6;
}

.map-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 22px;
  padding: 13px 20px;
  border-radius: 999px;
  background: #2D6A4F;
  color: #FFFFFF;
  font-size: 0.9rem;
  font-weight: 800;
  text-decoration: none;
  box-shadow: 0 10px 24px rgba(45, 106, 79, 0.25);
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.map-link:hover {
  transform: translateY(-2px);
  background: #1E4D38;
  box-shadow: 0 14px 30px rgba(45, 106, 79, 0.3);
}

@media (max-width: 960px) {
  .location-grid {
    grid-template-columns: 1fr;
  }

  .location-map {
    min-height: 360px;
  }

  .location-map iframe,
  .map-placeholder {
    min-height: 360px;
  }
}

@media (max-width: 640px) {
  .location {
    padding: 64px 0;
  }

  .container {
    width: min(100% - 24px, 1180px);
  }

  .section-intro {
    text-align: left;
  }

  .section-subtitle {
    margin-left: 0;
    margin-right: 0;
  }

  .location-info-card {
    padding: 18px;
    border-radius: 22px;
  }

  .location-map-card {
    padding: 10px;
    border-radius: 22px;
  }

  .location-detail {
    padding: 15px;
    gap: 12px;
    border-radius: 18px;
  }

  .location-detail-icon {
    flex-basis: 42px;
    width: 42px;
    height: 42px;
    border-radius: 14px;
    font-size: 1.1rem;
  }

  .location-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }

  .location-map {
    min-height: 300px;
  }

  .location-map iframe,
  .map-placeholder {
    min-height: 300px;
  }

  .map-placeholder {
    padding: 24px 18px;
  }

  .map-icon {
    width: 72px;
    height: 72px;
    border-radius: 22px;
    font-size: 2.2rem;
  }
}
</style>
