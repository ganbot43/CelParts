<script setup lang="ts">
import { ref } from "vue";

const { waLink } = useJoymar();

const benefits = [
  {
    icon: "🧪",
    title: "Productos probados",
    description:
      "Verificamos cada artículo antes de ponerlo a la venta. Si no nos convence, no lo vendemos.",
  },
  {
    icon: "🛡️",
    title: "Calidad garantizada",
    description:
      "Solo trabajamos con materiales resistentes y funcionales. Tu inversión debe durar.",
  },
  {
    icon: "💬",
    title: "Atención vía WhatsApp",
    description:
      "Respondemos rápido. Te asesoramos para que encuentres exactamente lo que necesitas.",
  },
  {
    icon: "🏪",
    title: "Tienda física en Lima",
    description:
      "Puedes venir a vernos en Villa El Salvador. Toca los productos antes de decidir.",
  },
  {
    icon: "🚚",
    title: "Envíos a todo Lima",
    description:
      "Coordinamos la entrega de tu pedido de forma rápida y segura donde estés.",
  },
  {
    icon: "🇵🇪",
    title: "Marca peruana",
    description:
      "Somos una empresa local comprometida con el hogar peruano. Tu confianza nos impulsa.",
  },
];

const slider = ref<HTMLElement | null>(null);

const scroll = (dir: "left" | "right") => {
  if (!slider.value) return;

  const card = slider.value.querySelector(".benefit-slide") as HTMLElement;
  if (!card) return;
  
  // Scroll de 1 en 1 (ancho de una tarjeta + gap)
  const scrollAmount = card.offsetWidth + 28;

  slider.value.scrollBy({
    left: dir === "left" ? -scrollAmount : scrollAmount,
    behavior: "smooth",
  });
};
</script>

<template>
  <section class="benefits" id="beneficios">
    <div class="benefits-container">
      <div class="benefits-header">
        <span class="section-label">¿Por qué elegirnos?</span>

        <h2 class="section-title">
          La diferencia Joymar<span class="accent-dot" />
        </h2>

        <p class="section-subtitle">
          Cada decisión que tomamos está pensada en darte la mejor experiencia
          de compra.
        </p>
      </div>

      <div class="benefits-slider-area">
        <button
          class="slider-btn slider-btn-left"
          type="button"
          aria-label="Ver beneficios anteriores"
          @click="scroll('left')"
        >
          ‹
        </button>

        <div class="benefits-slider" ref="slider">
          <div
            v-for="benefit in benefits"
            :key="benefit.title"
            class="benefit-slide"
          >
            <article class="benefit-card">
              <div class="benefit-icon">
                {{ benefit.icon }}
              </div>

              <h3>{{ benefit.title }}</h3>

              <p>{{ benefit.description }}</p>
            </article>
          </div>
        </div>

        <button
          class="slider-btn slider-btn-right"
          type="button"
          aria-label="Ver más beneficios"
          @click="scroll('right')"
        >
          ›
        </button>
      </div>

      <div class="benefits-cta">
        <div class="benefits-cta-text">
          <h3>¿Listo para equipar tu cocina?</h3>
          <p>
            Escríbenos y te ayudamos a encontrar el utensilio perfecto para tu
            hogar.
          </p>
        </div>

        <LandingAppButton
          variant="accent"
          size="lg"
          :href="waLink('Hola Joymar, quiero consultar sobre sus productos')"
          target="_blank"
        >
          <LandingWaIcon />
          Escribirnos ahora
        </LandingAppButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.benefits {
  --magenta: #b01883;
  --magenta-dark: #7a0f5c;
  --magenta-soft: rgba(176, 24, 131, 0.08);
  --yellow: #f7d21e;

  --text-title: #232323;
  --text-muted: #6f6f6f;
  --bg: #ffffff;
  --border: rgba(0, 0, 0, 0.08);

  --radius: 22px;
  --radius-lg: 30px;

  --shadow-sm: 0 12px 35px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 22px 70px rgba(0, 0, 0, 0.1);

  width: 100%;
  overflow: hidden;
  background: var(--bg);
  padding: clamp(80px, 8vw, 120px) clamp(18px, 4vw, 56px);
}

.benefits-container {
  width: min(100%, 1500px);
  margin: 0 auto;
}

/* HEADER */
.benefits-header {
  text-align: center;
  margin-bottom: clamp(42px, 5vw, 70px);
}

.section-label {
  display: inline-block;
  margin-bottom: 12px;
  font-size: 0.76rem;
  text-transform: uppercase;
  color: var(--magenta);
  font-weight: 800;
  letter-spacing: 0.14em;
}

.section-title {
  font-size: clamp(2rem, 4.5vw, 3rem);
  line-height: 1.08;
  font-weight: 900;
  color: var(--text-title);
  margin: 0 0 16px;
}

.accent-dot {
  width: 8px;
  height: 8px;
  background: var(--yellow);
  display: inline-block;
  border-radius: 50%;
  margin-left: 6px;
}

.section-subtitle {
  color: var(--text-muted);
  max-width: 620px;
  margin: 0 auto;
  line-height: 1.7;
  font-size: clamp(0.95rem, 1.5vw, 1.05rem);
}

/* SLIDER */
.benefits-slider-area {
  position: relative;
  padding: 0 72px;
  max-width: 100%;
  overflow: hidden;
}

.benefits-slider {
  display: flex;
  gap: 28px;
  overflow-x: auto;
  overflow-y: visible;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  padding: 14px 4px 28px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  width: 100%;
}

.benefits-slider::-webkit-scrollbar {
  display: none;
}

.benefit-slide {
  flex: 0 0 calc((100% - 56px) / 3);
  scroll-snap-align: start;
  display: flex;
}

.benefit-card {
  width: 100%;
  min-height: 250px;
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: clamp(28px, 3vw, 36px);
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: var(--shadow-sm);
  transition: transform 0.25s ease, box-shadow 0.25s ease,
    border-color 0.25s ease;
}

.benefit-card:hover {
  transform: translateY(-7px);
  box-shadow: var(--shadow-md);
  border-color: rgba(176, 24, 131, 0.18);
}

.benefit-icon {
  width: 62px;
  height: 62px;
  flex: 0 0 62px;
  border-radius: 18px;
  background: var(--magenta-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.65rem;
}

.benefit-card h3 {
  font-size: 1.15rem;
  line-height: 1.25;
  font-weight: 800;
  color: var(--text-title);
  margin: 0;
}

.benefit-card p {
  font-size: 0.96rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin: 0;
}

/* FLECHAS */
.slider-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 54px;
  height: 54px;
  border-radius: 999px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: #ffffff;
  color: var(--magenta);
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  z-index: 5;
  font-size: 2.2rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
}

.slider-btn:hover {
  background: var(--magenta);
  color: #ffffff;
  transform: translateY(-50%) scale(1.06);
}

.slider-btn-left {
  left: 0;
}

.slider-btn-right {
  right: 0;
}

/* CTA */
.benefits-cta {
  margin-top: clamp(56px, 6vw, 82px);
  background: linear-gradient(135deg, var(--magenta), var(--magenta-dark));
  border-radius: var(--radius-lg);
  padding: clamp(32px, 4vw, 52px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 26px;
  box-shadow: 0 25px 70px rgba(176, 24, 131, 0.18);
}

.benefits-cta-text h3 {
  color: #ffffff;
  margin: 0 0 10px;
  font-size: clamp(1.45rem, 3vw, 2rem);
  line-height: 1.15;
}

.benefits-cta-text p {
  color: rgba(255, 255, 255, 0.78);
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
  max-width: 560px;
}

/* TABLET */
@media (max-width: 1024px) {
  .benefits-slider-area {
    padding: 0 58px;
  }

  .benefit-slide {
    flex-basis: clamp(300px, 42vw, 360px);
  }

  .slider-btn {
    width: 50px;
    height: 50px;
    font-size: 2rem;
  }
}

/* MOBILE */
@media (max-width: 720px) {
  .benefits {
    padding-inline: 18px;
  }

  .benefits-slider-area {
    padding: 0;
  }

  .benefits-slider {
    gap: 18px;
    padding: 8px 0 22px;
  }

  .benefit-slide {
    flex: 0 0 86%;
  }

  .benefit-card {
    min-height: 240px;
  }

  .slider-btn {
    display: none;
  }

  .benefits-cta {
    flex-direction: column;
    align-items: flex-start;
  }
}

/* MOBILE PEQUEÑO */
@media (max-width: 420px) {
  .benefit-slide {
    flex-basis: 92%;
  }

  .benefit-card {
    padding: 26px 22px;
  }

  .benefit-card h3 {
    font-size: 1.05rem;
  }

  .benefit-card p {
    font-size: 0.9rem;
  }
}
</style>