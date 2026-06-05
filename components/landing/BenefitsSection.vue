<script setup lang="ts">
import { ref } from "vue";

const { waLink } = useArigumi();

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
  const scrollAmount = card.offsetWidth + 22;
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
        <span class="benefits-label">ARIGUMI PERÚ</span>

        <h2 class="benefits-title">
          Todo lo que necesitas para tu celular
          <span class="benefits-title__dot" />
        </h2>

        <p class="benefits-subtitle">
          Plataforma full-stack con ecommerce, catálogo de repuestos y accesorios,
          gestión de pedidos y panel administrativo para la operación completa del negocio.
        </p>
      </div>

      <!-- Slider -->
      <div class="benefits-slider-area">

        <button class="benefits-arrow benefits-arrow--left" type="button" aria-label="Ver beneficios anteriores"
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

                <svg v-if="benefit.icon === 'check'" width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
                  aria-hidden="true">
                  <path d="M9 12l2 2 4-4" />
                  <circle cx="12" cy="12" r="9" />
                </svg>

                <svg v-else-if="benefit.icon === 'shield'" width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
                  aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>

                <svg v-else-if="benefit.icon === 'chat'" width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
                  aria-hidden="true">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>

                <svg v-else-if="benefit.icon === 'store'" width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
                  aria-hidden="true">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>

                <svg v-else-if="benefit.icon === 'truck'" width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
                  aria-hidden="true">
                  <rect x="1" y="3" width="15" height="13" rx="1" />
                  <path d="M16 8h4l3 5v4h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>

                <!-- peru — reemplazado <line> por <path> para evitar error de Vue -->
                <svg v-else-if="benefit.icon === 'peru'" width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
                  aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 014-10z" />
                  <path d="M2 12h20" />
                </svg>

              </div>

              <div class="benefit-body">
                <h3 class="benefit-title">{{ benefit.title }}</h3>
                <p class="benefit-text">{{ benefit.description }}</p>
              </div>

            </article>
          </div>
        </div>

        <button class="benefits-arrow benefits-arrow--right" type="button" aria-label="Ver más beneficios"
          @click="scroll('right')">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>

      </div>

      <!-- CTA -->
      <div class="benefits-cta">
        <div class="benefits-cta__text">
          <span class="benefits-cta__eyebrow">
            Ecommerce + Gestión administrativa
          </span>
          <h3 class="benefits-cta__title">
            Compra o cotiza tu pedido de repuestos y accesorios para celulares
          </h3>
          <p class="benefits-cta__desc">
            Arigumi es la solución integral para técnicos, tiendas y clientes finales
            que buscan una experiencia de compra completa, segura y personalizada.
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
   BENEFITS — ARIGUMI
   100% tokens de main.css
═══════════════════════════════════ */

.benefits {
  position: relative;
  overflow: hidden;
  background: var(--bg-page);
  padding: clamp(80px, 8vw, 120px) 0;
}

/* Línea técnica superior */
.benefits::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  display: none; /* background: var(--line-brand); */
}

/* ── Container ── */
.benefits-container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 var(--space-8);
}

/* ── Header ── */
.benefits-header {
  text-align: center;
  margin-bottom: var(--space-16);
}

.benefits-label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--cp-electric);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.benefits-label::before,
.benefits-label::after {
  content: "";
  width: 20px;
  height: 1px;
  background: var(--cp-electric);
  opacity: 0.5;
}

.benefits-title {
  margin: var(--space-5) 0 var(--space-4);
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 5vw, 3.8rem);
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -0.045em;
}

.benefits-title__dot {
  width: 8px;
  height: 8px;
  display: inline-block;
  border-radius: 50%;
  background: var(--cp-electric);
  margin-left: var(--space-2);
  box-shadow: var(--glow-soft);
}

.benefits-subtitle {
  max-width: 680px;
  margin: 0 auto;
  color: var(--text-muted);
  font-size: 1rem;
  line-height: 1.8;
}

/* ── Slider area ── */
.benefits-slider-area {
  position: relative;
  padding: 0 var(--space-16);
}

.benefits-slider {
  display: flex;
  gap: var(--space-6);
  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  padding: var(--space-3) 0 var(--space-8);
}

.benefits-slider::-webkit-scrollbar {
  display: none;
}

.benefit-slide {
  flex: 0 0 calc((100% - 44px) / 3);
  scroll-snap-align: start;
}

/* ── Benefit card ── */
.benefit-card {
  height: 100%;
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: var(--r-lg);
  box-shadow: var(--card-shadow);
  padding: var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  transition:
    transform var(--t-base) var(--ease-snappy),
    border-color var(--t-base) var(--ease-smooth),
    box-shadow var(--t-base) var(--ease-smooth);
  position: relative;
  overflow: hidden;
}

/* Línea técnica top en hover */
.benefit-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  display: none; /* background: var(--line-brand); */
  opacity: 0;
  transition: opacity var(--t-base) var(--ease-smooth);
}

.benefit-card:hover {
  transform: translateY(-6px);
  border-color: var(--border-mid);
  box-shadow: var(--card-shadow-hover);
}

.benefit-card:hover::before {
  opacity: 1;
}

/* ── Benefit icon ── */
.benefit-icon {
  width: 52px;
  height: 52px;
  border-radius: var(--r-md);
  background: var(--cp-frost);
  border: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--cp-electric);
  flex-shrink: 0;
  transition:
    background var(--t-base) var(--ease-smooth),
    border-color var(--t-base) var(--ease-smooth),
    color var(--t-base) var(--ease-smooth),
    box-shadow var(--t-base) var(--ease-smooth);
}

.benefit-card:hover .benefit-icon {
  background: var(--cp-electric);
  border-color: var(--cp-electric);
  color: var(--cp-white);
  box-shadow: var(--glow-soft);
}

/* ── Benefit body ── */
.benefit-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.benefit-title {
  margin: 0;
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.benefit-text {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.8;
  font-size: 0.9rem;
}

/* ── Flechas ── */
.benefits-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: var(--r-pill);
  border: 1px solid var(--border-light);
  background: var(--bg-surface);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--card-shadow-sm);
  transition:
    background var(--t-base) var(--ease-smooth),
    border-color var(--t-base) var(--ease-smooth),
    color var(--t-base) var(--ease-smooth),
    box-shadow var(--t-base) var(--ease-smooth),
    transform var(--t-fast) var(--ease-snappy);
  z-index: 10;
}

.benefits-arrow:hover {
  background: var(--cp-navy);
  border-color: var(--cp-navy);
  color: var(--cp-white);
  box-shadow: var(--card-shadow);
  transform: translateY(-50%) scale(1.06);
}

.benefits-arrow--left {
  left: 0;
}

.benefits-arrow--right {
  right: 0;
}

/* ── CTA ── */
.benefits-cta {
  margin-top: var(--space-16);
  background: var(--grad-cta);
  border-radius: var(--r-xl);
  padding: var(--space-12) var(--space-12);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-8);
  overflow: hidden;
  position: relative;
}

/* Línea técnica inferior del CTA */
.benefits-cta::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  display: none; /* background: var(--line-brand); */
}

.benefits-cta__eyebrow {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--cp-sky);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.benefits-cta__eyebrow::before {
  content: "";
  width: 18px;
  height: 1px;
  background: var(--cp-electric);
}

.benefits-cta__title {
  margin: var(--space-3) 0 var(--space-2);
  color: var(--cp-white);
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.1;
}

.benefits-cta__desc {
  margin: 0;
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.9rem;
  line-height: 1.75;
}

/* ═══════════════════════════════════
   RESPONSIVE
═══════════════════════════════════ */
@media (max-width: 1024px) {
  .benefit-slide {
    flex: 0 0 320px;
  }
}

@media (max-width: 768px) {
  .benefits-slider-area {
    padding: 0;
  }

  .benefits-arrow {
    display: none;
  }

  .benefit-slide {
    flex: 0 0 85%;
  }

  .benefits-cta {
    flex-direction: column;
    align-items: flex-start;
    padding: var(--space-8);
  }
}

@media (max-width: 520px) {
  .benefits-container {
    padding: 0 var(--space-5);
  }

  .benefit-slide {
    flex: 0 0 92%;
  }

  .benefit-card {
    padding: var(--space-6);
  }
}
</style>