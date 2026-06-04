<script setup lang="ts">
import { ref } from "vue";

const { waLink } = useKite();

const benefits = [
  {
    icon: "check",
    title: "Catálogo especializado",
    description:
      "Encuentra pantallas, baterías, cámaras, flex, conectores y accesorios para las principales marcas de celulares.",
  },
  {
    icon: "shield",
    title: "Compras seguras",
    description:
      "Productos seleccionados con garantía y procesos de compra confiables para técnicos, tiendas y clientes finales.",
  },
  {
    icon: "chat",
    title: "Soporte personalizado",
    description:
      "Brindamos asesoría para ayudarte a encontrar el repuesto o accesorio compatible con tu dispositivo.",
  },
  {
    icon: "store",
    title: "Ecommerce completo",
    description:
      "Explora categorías, filtra por marca, agrega productos al carrito y realiza pedidos desde una sola plataforma.",
  },
  {
    icon: "truck",
    title: "Seguimiento de pedidos",
    description:
      "Consulta el estado de tus compras y mantente informado durante todo el proceso de entrega.",
  },
  {
    icon: "peru",
    title: "Panel administrativo",
    description:
      "Gestiona productos, categorías, pedidos y usuarios mediante roles diferenciados entre SuperAdmin y Admin.",
  },
];

const slider = ref<HTMLElement | null>(null);

const scroll = (dir: "left" | "right") => {
  if (!slider.value) return;
  const card = slider.value.querySelector(".benefit-slide") as HTMLElement;
  if (!card) return;

  const scrollAmount = card.offsetWidth + 20;

  slider.value.scrollBy({
    left: dir === "left" ? -scrollAmount : scrollAmount,
    behavior: "smooth",
  });
};
</script>

<template>
  <section class="benefits" id="beneficios">
    <div class="benefits-container">

      <!-- Header -->
      <div class="benefits-header">
        <span class="section-label">CELPARTS PERÚ</span>

        <h2 class="section-title">
          Todo lo que necesitas para tu celular
          <span class="accent-dot" />
        </h2>

        <p class="section-subtitle">
          Plataforma full-stack con ecommerce, catálogo de repuestos y accesorios,
          gestión de pedidos y panel administrativo para la operación completa del negocio.
        </p>
      </div>

      <!-- Slider -->
      <div class="benefits-slider-area">

        <button class="slider-btn slider-btn-left" type="button" aria-label="Ver beneficios anteriores"
          @click="scroll('left')">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>

        <div class="benefits-slider" ref="slider">
          <div v-for="benefit in benefits" :key="benefit.title" class="benefit-slide">
            <article class="benefit-card">

              <!-- Ícono SVG -->
              <div class="benefit-icon">

                <!-- check -->
                <svg v-if="benefit.icon === 'check'" width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
                  aria-hidden="true">
                  <path d="M9 12l2 2 4-4" />
                  <circle cx="12" cy="12" r="9" />
                </svg>

                <!-- shield -->
                <svg v-else-if="benefit.icon === 'shield'" width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
                  aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>

                <!-- chat -->
                <svg v-else-if="benefit.icon === 'chat'" width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
                  aria-hidden="true">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>

                <!-- store -->
                <svg v-else-if="benefit.icon === 'store'" width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
                  aria-hidden="true">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>

                <!-- truck -->
                <svg v-else-if="benefit.icon === 'truck'" width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
                  aria-hidden="true">
                  <rect x="1" y="3" width="15" height="13" rx="1" />
                  <path d="M16 8h4l3 5v4h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>

                <!-- peru -->
                <svg v-else-if="benefit.icon === 'peru'" width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
                  aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 014-10z" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                </svg>

              </div>

              <div class="benefit-body">
                <h3>{{ benefit.title }}</h3>
                <p>{{ benefit.description }}</p>
              </div>

            </article>
          </div>
        </div>

        <button class="slider-btn slider-btn-right" type="button" aria-label="Ver más beneficios"
          @click="scroll('right')">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>

      </div>

      <!-- CTA -->
      <div class="benefits-cta">

        <div class="benefits-cta-text">
          <span class="cta-eyebrow">
            Ecommerce + Gestión administrativa
          </span>

          <h3>
            Compra o cotiza tu pedido de repuestos y accesorios para celulares
          </h3>

          <p>
            CelParts es la solución integral para técnicos, tiendas y clientes finales que buscan una experiencia de compra completa, segura y personalizada.
          </p>
        </div>

        <LandingAppButton variant="accent" size="lg"
          :href="waLink('Hola Gino, quiero cotizar repuestos y accesorios para celulares')" target="_blank">
          <LandingWaIcon />
          Cotizar por WhatsApp
        </LandingAppButton>

      </div>

    </div>
  </section>
</template>

<style scoped>
/* ═══════════════════════════════════
   BENEFITS - CELPARTS TECH
═══════════════════════════════════ */

.benefits {
  --cp-bg: #0A0A0A;
  --cp-cyan: #00AEEF;
  --cp-cyan-dark: #0077C8;
  --cp-cyan-light: #50D0FF;
  --cp-ice: #A8EDFF;
  --cp-white: #FFFFFF;
  --cp-text: rgba(168, 237, 255, 0.82);
  --cp-border: rgba(0, 174, 239, 0.2);

  position: relative;
  overflow: hidden;

  background:
    radial-gradient(circle at top right,
      rgba(0, 174, 239, 0.15),
      transparent 35%),
    radial-gradient(circle at bottom left,
      rgba(0, 63, 138, 0.2),
      transparent 40%),
    #0A0A0A;

  padding: clamp(90px, 8vw, 120px) clamp(20px, 4vw, 50px);
}

.benefits-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* HEADER */

.benefits-header {
  text-align: center;
  margin-bottom: 70px;
}

.section-label {
  display: inline-flex;
  align-items: center;
  gap: 10px;

  color: var(--cp-cyan-light);

  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.section-label::before,
.section-label::after {
  content: "";
  width: 20px;
  height: 1px;
  background: var(--cp-cyan);
}

.section-title {
  margin: 18px 0 14px;

  color: var(--cp-white);

  font-size: clamp(2.4rem, 5vw, 4.2rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.05em;
}

.accent-dot {
  width: 8px;
  height: 8px;
  display: inline-block;

  border-radius: 50%;
  background: var(--cp-cyan);

  margin-left: 6px;

  box-shadow: 0 0 14px rgba(0, 174, 239, .8);
}

.section-subtitle {
  max-width: 700px;
  margin: 0 auto;

  color: var(--cp-text);

  font-size: 1rem;
  line-height: 1.8;
}

/* SLIDER */

.benefits-slider-area {
  position: relative;
  padding: 0 70px;
}

.benefits-slider {
  display: flex;
  gap: 22px;

  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;

  scrollbar-width: none;

  padding: 12px 0 28px;
}

.benefits-slider::-webkit-scrollbar {
  display: none;
}

.benefit-slide {
  flex: 0 0 calc((100% - 44px) / 3);
  scroll-snap-align: start;
}

/* CARD */

.benefit-card {
  height: 100%;

  background: rgba(0, 174, 239, 0.05);

  border: 1px solid var(--cp-border);

  border-radius: 22px;

  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);

  padding: 32px;

  display: flex;
  flex-direction: column;
  gap: 20px;

  transition:
    transform .25s ease,
    border-color .25s ease,
    box-shadow .25s ease;
}

.benefit-card:hover {
  transform: translateY(-8px);

  border-color: rgba(0, 174, 239, .45);

  box-shadow:
    0 0 30px rgba(0, 174, 239, .15),
    0 18px 50px rgba(0, 174, 239, .12);
}

/* ICON */

.benefit-icon {
  width: 58px;
  height: 58px;

  border-radius: 16px;

  background: rgba(0, 174, 239, .08);
  border: 1px solid var(--cp-border);

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--cp-cyan);

  transition: all .25s ease;
}

.benefit-card:hover .benefit-icon {
  background: var(--cp-cyan);
  color: white;

  box-shadow:
    0 0 24px rgba(0, 174, 239, .6);
}

.benefit-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.benefit-card h3 {
  margin: 0;

  color: var(--cp-white);

  font-size: 1.1rem;
  font-weight: 700;
}

.benefit-card p {
  margin: 0;

  color: var(--cp-text);

  line-height: 1.8;
  font-size: .92rem;
}

/* FLECHAS */

.slider-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);

  width: 48px;
  height: 48px;

  border-radius: 50%;

  border: 1px solid var(--cp-border);

  background: rgba(0, 174, 239, .08);

  color: var(--cp-cyan-light);

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  backdrop-filter: blur(12px);

  transition: all .25s ease;

  z-index: 10;
}

.slider-btn:hover {
  background: var(--cp-cyan);
  border-color: var(--cp-cyan);

  color: white;

  box-shadow:
    0 0 24px rgba(0, 174, 239, .6);
}

.slider-btn-left {
  left: 0;
}

.slider-btn-right {
  right: 0;
}

/* CTA */

.benefits-cta {
  margin-top: 80px;

  background:
    linear-gradient(135deg,
      rgba(0, 174, 239, .10),
      rgba(0, 63, 138, .15));

  border: 1px solid var(--cp-border);

  border-radius: 28px;

  backdrop-filter: blur(18px);

  padding: 48px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;

  overflow: hidden;
}

.cta-eyebrow {
  color: var(--cp-cyan-light);

  text-transform: uppercase;
  letter-spacing: .18em;

  font-size: .72rem;
  font-weight: 700;

  display: flex;
  align-items: center;
  gap: 8px;
}

.cta-eyebrow::before {
  content: "";
  width: 18px;
  height: 1px;
  background: var(--cp-cyan);
}

.benefits-cta-text h3 {
  margin: 12px 0;

  color: var(--cp-white);

  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 800;
}

.benefits-cta-text p {
  margin: 0;
  color: var(--cp-text);
}

/* RESPONSIVE */

@media (max-width: 1024px) {
  .benefit-slide {
    flex: 0 0 340px;
  }
}

@media (max-width: 768px) {

  .benefits-slider-area {
    padding: 0;
  }

  .slider-btn {
    display: none;
  }

  .benefit-slide {
    flex: 0 0 85%;
  }

  .benefits-cta {
    flex-direction: column;
    align-items: flex-start;
    padding: 32px;
  }
}

@media (max-width: 520px) {

  .benefits {
    padding-inline: 18px;
  }

  .benefit-slide {
    flex: 0 0 92%;
  }

  .benefit-card {
    padding: 24px;
  }

  .section-title {
    font-size: 2.4rem;
  }
}
</style>