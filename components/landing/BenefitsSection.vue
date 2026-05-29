<script setup lang="ts">
import { ref } from "vue";

const { waLink } = useKite();

const benefits = [
  {
    icon: "check",
    title: "Selección profesional",
    description:
      "Elegimos productos pensados para restaurantes premium y cocinas de alto rendimiento.",
  },
  {
    icon: "shield",
    title: "Calidad de nivel gastronómico",
    description:
      "Trabajamos con materiales resistentes, elegantes y preparados para uso profesional.",
  },
  {
    icon: "chat",
    title: "Asesoría especializada",
    description:
      "Te ayudamos a encontrar el equipamiento ideal según el estilo y necesidad de tu restaurante.",
  },
  {
    icon: "store",
    title: "Showroom en Lima",
    description:
      "Conoce nuestros productos de cerca y evalúa cada detalle antes de equipar tu cocina.",
  },
  {
    icon: "truck",
    title: "Entregas seguras",
    description:
      "Coordinamos envíos rápidos y confiables para restaurantes y negocios gastronómicos.",
  },
  {
    icon: "peru",
    title: "Marca peruana",
    description:
      "Kite impulsa la gastronomía peruana con equipamiento moderno y funcional.",
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
        <span class="section-label">Kite Professional Supply</span>

        <h2 class="section-title">
          Equipamiento para restaurantes de lujo
          <span class="accent-dot" />
        </h2>

        <p class="section-subtitle">
          Productos premium para chefs, restaurantes y cocinas
          que buscan calidad, diseño y rendimiento profesional.
        </p>
      </div>

      <!-- Slider -->
      <div class="benefits-slider-area">

        <button
          class="slider-btn slider-btn-left"
          type="button"
          aria-label="Ver beneficios anteriores"
          @click="scroll('left')"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M10 12L6 8l4-4"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <div class="benefits-slider" ref="slider">
          <div
            v-for="benefit in benefits"
            :key="benefit.title"
            class="benefit-slide"
          >
            <article class="benefit-card">

              <!-- Ícono SVG -->
              <div class="benefit-icon">

                <!-- check -->
                <svg
                  v-if="benefit.icon === 'check'"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 12l2 2 4-4"/>
                  <circle cx="12" cy="12" r="9"/>
                </svg>

                <!-- shield -->
                <svg
                  v-else-if="benefit.icon === 'shield'"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>

                <!-- chat -->
                <svg
                  v-else-if="benefit.icon === 'chat'"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>

                <!-- store -->
                <svg
                  v-else-if="benefit.icon === 'store'"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>

                <!-- truck -->
                <svg
                  v-else-if="benefit.icon === 'truck'"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <rect x="1" y="3" width="15" height="13" rx="1"/>
                  <path d="M16 8h4l3 5v4h-7V8z"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>

                <!-- peru -->
                <svg
                  v-else-if="benefit.icon === 'peru'"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 014-10z"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                </svg>

              </div>

              <div class="benefit-body">
                <h3>{{ benefit.title }}</h3>
                <p>{{ benefit.description }}</p>
              </div>

            </article>
          </div>
        </div>

        <button
          class="slider-btn slider-btn-right"
          type="button"
          aria-label="Ver más beneficios"
          @click="scroll('right')"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M6 4l4 4-4 4"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

      </div>

      <!-- CTA -->
      <div class="benefits-cta">

        <div class="benefits-cta-text">
          <span class="cta-eyebrow">
            Equipamiento gastronómico premium
          </span>

          <h3>
            Lleva tu restaurante al siguiente nivel.
          </h3>

          <p>
            Cotiza con nosotros y recibe asesoría personalizada.
          </p>
        </div>

        <LandingAppButton
          variant="accent"
          size="lg"
          :href="waLink('Hola Kite, quiero cotizar equipamiento para mi restaurante')"
          target="_blank"
        >
          <LandingWaIcon />
          Cotizar por WhatsApp
        </LandingAppButton>

      </div>

    </div>
  </section>
</template>

<style scoped>
/* ═══════════════════════════════════
   TOKENS
═══════════════════════════════════ */
.benefits {
  --b-green:        #2D6A4F;
  --b-green-dark:   #1E4D38;
  --b-green-soft:   rgba(45, 106, 79, 0.08);
  --b-green-line:   rgba(45, 106, 79, 0.2);
  --b-terracotta:   #E76F51;
  --b-terracotta-dark: #C85A3D;
  --b-yellow:       #E9C46A;
  --b-black:        #111111;
  --b-text:         #111111;
  --b-text-muted:   #6B6860;
  --b-text-faint:   #A5A39C;
  --b-bg:           #F8F7F4;
  --b-bg-alt:       #F0EFEB;
  --b-surface:      #FFFFFF;
  --b-border:       #E2E0D9;
  --b-shadow-sm:    0 2px 10px rgba(17, 17, 17, 0.05);
  --b-shadow-md:    0 10px 36px rgba(17, 17, 17, 0.09);
  --b-radius:       14px;
  --b-radius-lg:    20px;

  width: 100%;
  overflow: hidden;
  background: var(--b-bg);
  padding: clamp(80px, 8vw, 112px) clamp(18px, 4vw, 52px);
  border-top: 1px solid var(--b-border);
}

.benefits-container {
  width: min(100%, 1400px);
  margin: 0 auto;
}

/* ═══════════════════════════════════
   HEADER
═══════════════════════════════════ */
.benefits-header {
  text-align: center;
  margin-bottom: clamp(40px, 5vw, 64px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.section-label {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--b-green);
}

.section-label::before,
.section-label::after {
  content: "";
  display: inline-block;
  width: 18px;
  height: 1.5px;
  background: var(--b-green);
  border-radius: 2px;
}

.section-title {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  line-height: 1.08;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--b-text);
  margin: 0;
}

.accent-dot {
  width: 7px;
  height: 7px;
  background: var(--b-terracotta);
  display: inline-block;
  border-radius: 50%;
  margin-left: 5px;
  vertical-align: middle;
  position: relative;
  top: -4px;
}

.section-subtitle {
  color: var(--b-text-muted);
  max-width: 560px;
  margin: 0;
  line-height: 1.7;
  font-size: clamp(0.9rem, 1.4vw, 1rem);
}

/* ═══════════════════════════════════
   SLIDER
═══════════════════════════════════ */
.benefits-slider-area {
  position: relative;
  padding: 0 68px;
  overflow: hidden;
}

.benefits-slider {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  overflow-y: visible;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  padding: 12px 2px 28px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.benefits-slider::-webkit-scrollbar {
  display: none;
}

.benefit-slide {
  flex: 0 0 calc((100% - 40px) / 3);
  scroll-snap-align: start;
  display: flex;
}

/* ═══════════════════════════════════
   CARD
═══════════════════════════════════ */
.benefit-card {
  width: 100%;
  background: rgba(255, 255, 255, 0.72);
  border: 1.5px solid rgba(226, 224, 217, 0.5);
  border-radius: var(--b-radius);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: clamp(24px, 2.5vw, 32px);
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-shadow: 0 4px 16px rgba(17, 17, 17, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.4);
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    border-color 0.22s ease;
}

.benefit-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--b-shadow-md);
  border-color: var(--b-green-line);
}

/* Ícono */
.benefit-icon {
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  border-radius: 12px;
  background: var(--b-green-soft);
  border: 1px solid var(--b-green-line);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--b-green);
  transition:
    background 0.2s,
    border-color 0.2s,
    color 0.2s;
}

.benefit-card:hover .benefit-icon {
  background: var(--b-green);
  border-color: var(--b-green);
  color: #fff;
}

.benefit-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.benefit-card h3 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--b-text);
  margin: 0;
  letter-spacing: -0.01em;
  line-height: 1.3;
}

.benefit-card p {
  font-size: 0.875rem;
  color: var(--b-text-muted);
  line-height: 1.7;
  margin: 0;
}

/* ═══════════════════════════════════
   FLECHAS
═══════════════════════════════════ */
.slider-btn {
  position: absolute;
  top: 50%;
  transform: translateY(calc(-50% - 8px));
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1.5px solid var(--b-border);
  background: var(--b-surface);
  color: var(--b-text-muted);
  box-shadow: 0 4px 16px rgba(17, 17, 17, 0.08);
  cursor: pointer;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.2s,
    border-color 0.2s,
    color 0.2s,
    transform 0.2s,
    box-shadow 0.2s;
}

.slider-btn:hover {
  background: var(--b-black);
  border-color: var(--b-black);
  color: #fff;
  transform: translateY(calc(-50% - 8px)) scale(1.05);
  box-shadow: 0 6px 20px rgba(17, 17, 17, 0.14);
}

.slider-btn-left {
  left: 0;
}

.slider-btn-right {
  right: 0;
}

/* ═══════════════════════════════════
   CTA BANNER
═══════════════════════════════════ */
.benefits-cta {
  margin-top: clamp(52px, 6vw, 80px);
  background:
    radial-gradient(circle at top right, rgba(233, 196, 106, 0.08), transparent 32%),
    radial-gradient(circle at left bottom, rgba(45, 106, 79, 0.08), transparent 28%),
    linear-gradient(135deg, #101010 0%, #141414 55%, #111111 100%);
  border-radius: var(--b-radius-lg);
  padding: clamp(32px, 4vw, 52px) clamp(28px, 4vw, 52px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 18px 50px rgba(17, 17, 17, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.benefits-cta::before {
  content: "";
  position: absolute;
  top: -40px;
  right: -40px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: rgba(233, 196, 106, 0.06);
  pointer-events: none;
}

.benefits-cta::after {
  content: "";
  position: absolute;
  bottom: -60px;
  left: 30%;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: rgba(45, 106, 79, 0.05);
  pointer-events: none;
}

.benefits-cta-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
  z-index: 1;
}

.cta-eyebrow {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--b-yellow);
  display: flex;
  align-items: center;
  gap: 7px;
}

.cta-eyebrow::before {
  content: "";
  display: inline-block;
  width: 16px;
  height: 1.5px;
  background: var(--b-yellow);
  border-radius: 2px;
}

.benefits-cta-text h3 {
  color: #fff;
  margin: 0;
  font-size: clamp(1.3rem, 2.5vw, 1.9rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.025em;
}

.benefits-cta-text p {
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.925rem;
  line-height: 1.6;
  margin: 0;
}

/* ═══════════════════════════════════
   RESPONSIVE
═══════════════════════════════════ */
@media (max-width: 1024px) {
  .benefits-slider-area {
    padding: 0 56px;
  }

  .benefit-slide {
    flex-basis: clamp(280px, 44vw, 340px);
  }

  .slider-btn {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 720px) {
  .benefits {
    padding-inline: 18px;
  }

  .benefits-slider-area {
    padding: 0;
  }

  .benefits-slider {
    gap: 14px;
    padding: 6px 0 20px;
  }

  .benefit-slide {
    flex: 0 0 84%;
  }

  .slider-btn {
    display: none;
  }

  .benefits-cta {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 420px) {
  .benefit-slide {
    flex-basis: 90%;
  }

  .benefit-card {
    padding: 22px 18px;
  }
}
</style>
