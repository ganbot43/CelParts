<script setup lang="ts">
const items = [
  {
    imageUrl: "/images/gallery/almacenaje.png",
    label: "Pantallas",
    alt: "Pantallas para celulares"
  },
  {
    imageUrl: "/images/gallery/cuchilleria.png",
    label: "Baterías",
    alt: "Baterías para celulares"
  },
  {
    imageUrl: "/images/gallery/ollas.png",
    label: "Cases y fundas",
    alt: "Cases para celulares"
  },
  {
    imageUrl: "/images/gallery/reposteria.png",
    label: "Cargadores",
    alt: "Cargadores para celulares"
  },
  {
    imageUrl: "/images/gallery/sartenes.png",
    label: "Protectores",
    alt: "Protectores de pantalla"
  },
];
</script>

<template>
  <section class="gallery" id="galeria">
    <div class="gallery-container">
      <div class="gallery-header">
        <span class="section-label">Arigumi</span>

        <h2 class="section-title">
          Nuestros productos
          <span class="accent-dot" />
        </h2>

        <p class="section-subtitle">
          Descubre repuestos y accesorios para las principales marcas de celulares.
        </p>
      </div>

      <div class="gallery-grid">
        <div v-for="(item, i) in items" :key="item.label" class="gallery-item" :class="`gallery-item--${i + 1}`">
          <div class="img-placeholder">
            <img :src="item.imageUrl" :alt="item.alt" class="gallery-image" />
          </div>
          <div class="gallery-item-overlay">
            <span class="gallery-item-label">{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ═══════════════════════════════════
   GALLERY SECTION — ARIGUMI
   100% tokens de main.css — sin hardcode
═══════════════════════════════════ */

.gallery {
  position: relative;
  overflow: hidden;
  padding: clamp(80px, 8vw, 120px) 0;
  background: var(--bg-page);
}

/* Línea técnica superior */
.gallery::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  display: none; /* background: var(--line-brand); */
  z-index: 1;
}

/* Decoración de fondo */
.gallery::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top right, var(--cp-ice) 0%, transparent 40%),
    radial-gradient(circle at bottom left, var(--cp-frost) 0%, transparent 40%);
  opacity: 0.8;
  pointer-events: none;
  z-index: 0;
}

.gallery-container {
  position: relative;
  z-index: 2;
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 var(--space-8);
}

/* ── HEADER ── */
.gallery-header {
  text-align: center;
  margin-bottom: var(--space-12);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.section-label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--cp-electric);
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
  background: var(--cp-electric);
  opacity: 0.5;
}

.section-title {
  margin: var(--space-3) 0 0;
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 4.5vw, 3.6rem);
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -0.045em;
}

.accent-dot {
  width: 8px;
  height: 8px;
  display: inline-block;
  margin-left: var(--space-2);
  border-radius: 50%;
  background: var(--cp-electric);
  position: relative;
  top: -6px;
  box-shadow: var(--glow-soft);
}

.section-subtitle {
  margin: var(--space-3) 0 0;
  max-width: 600px;
  color: var(--text-muted);
  font-size: 1rem;
  line-height: 1.8;
}

/* ── GRID ── */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(2, 280px);
  gap: var(--space-5);
}

/* ── CARD ── */
.gallery-item {
  position: relative;
  overflow: hidden;
  border-radius: var(--r-xl);
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  box-shadow: var(--card-shadow);
  transition:
    transform var(--t-base) var(--ease-snappy),
    border-color var(--t-base) var(--ease-smooth),
    box-shadow var(--t-base) var(--ease-smooth);
}

.gallery-item:hover {
  transform: translateY(-6px);
  border-color: var(--border-mid);
  box-shadow: var(--card-shadow-hover);
  z-index: 2;
}

/* Línea técnica top al hover */
.gallery-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  display: none; /* background: var(--line-brand); */
  opacity: 0;
  transition: opacity var(--t-base) var(--ease-smooth);
  z-index: 2;
}

.gallery-item:hover::before {
  opacity: 1;
}

/* ── IMAGE ── */
.img-placeholder {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--bg-alt);
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition:
    transform var(--t-slow) var(--ease-smooth),
    filter var(--t-base) var(--ease-smooth);
}

.gallery-item:hover .gallery-image {
  transform: scale(1.08);
  filter: saturate(1.05);
}

/* ── OVERLAY ── */
.gallery-item-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  padding: var(--space-5);
  background: linear-gradient(to top, rgba(7, 30, 82, 0.6), transparent);
}

.gallery-item-label {
  color: var(--cp-white);
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 700;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--r-pill);
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* ── POSICIONES ── */
.gallery-item--1 { grid-column: 1 / 5; }
.gallery-item--2 { grid-column: 5 / 8; }
.gallery-item--3 { grid-column: 8 / 13; grid-row: 1 / 3; }
.gallery-item--4 { grid-column: 1 / 4; }
.gallery-item--5 { grid-column: 4 / 8; }

/* ═══════════════════════════════════
   RESPONSIVE
═══════════════════════════════════ */
@media (max-width: 960px) {
  .gallery-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    gap: var(--space-4);
  }

  .gallery-item {
    grid-column: auto !important;
    grid-row: auto !important;
    aspect-ratio: 16/9;
  }
}

@media (max-width: 640px) {
  .gallery {
    padding: var(--space-16) 0;
  }

  .gallery-container {
    padding: 0 var(--space-5);
  }

  .gallery-grid {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .gallery-header {
    margin-bottom: var(--space-8);
  }

  .gallery-item {
    aspect-ratio: 4/3;
  }
}
</style>