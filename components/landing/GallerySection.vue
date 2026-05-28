<script setup lang="ts">
const items = [
  { imageUrl: "/images/gallery/sartenes.png", label: "Sartenes & Woks", alt: "Sartenes y woks Joymar" },
  { imageUrl: "/images/gallery/ollas.png", label: "Ollas y cazuelas", alt: "Ollas Joymar" },
  { imageUrl: "/images/gallery/cuchilleria.png", label: "Cuchillería", alt: "Cuchillos Joymar" },
  { imageUrl: "/images/gallery/reposteria.png", label: "Repostería", alt: "Utensilios de repostería Joymar" },
  { imageUrl: "/images/gallery/almacenaje.png", label: "Almacenaje", alt: "Recipientes y almacenaje Joymar" },
];
</script>

<template>
  <section class="gallery" id="galeria">
    <div class="gallery-container">
      <div class="gallery-header">
        <span class="section-label">Galería</span>
        <h2 class="section-title">
          Productos en acción<span class="accent-dot" />
        </h2>
        <p class="section-subtitle">
          Así lucen nuestros artículos en cocinas reales.
        </p>
      </div>

      <div class="gallery-grid">
        <div
          v-for="(item, i) in items"
          :key="item.label"
          class="gallery-item"
          :class="`gallery-item--${i + 1}`"
        >
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
.gallery {
  --magenta: #b01883;
  --magenta-dark: #7a0f5c;
  --magenta-tint: rgba(176, 24, 131, 0.08);
  --yellow: #f7d21e;

  --bg: #ffffff;
  --bg-alt: #fafafa;
  --bg-section: #f5f5f5;

  --text-title: #2b2b2b;
  --text-muted: #6b6b6b;

  --border: #e8e8e8;

  --radius: 20px;
  --radius-lg: 28px;

  --shadow-sm: 0 10px 25px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 20px 50px rgba(0, 0, 0, 0.08);

  padding: 120px 0;
  background: linear-gradient(180deg, var(--bg-section) 0%, var(--bg-alt) 100%);
}

/* 👇 CLAVE PARA QUE NO SE VEA PEGADO */
.gallery-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(24px, 6vw, 80px);
}

/* HEADER */
.gallery-header {
  text-align: center;
  margin-bottom: 72px;
  padding: 0 10px;
}

.section-label {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--magenta);
  margin-bottom: 16px;
}

.section-label::before,
.section-label::after {
  content: "";
  width: 26px;
  height: 2px;
  background: var(--magenta);
  border-radius: 2px;
}

.section-title {
  font-size: clamp(1.9rem, 4vw, 2.8rem);
  font-weight: 800;
  color: var(--text-title);
}

.accent-dot {
  width: 6px;
  height: 6px;
  background: var(--yellow);
  border-radius: 50%;
  display: inline-block;
  margin-left: 4px;
}

.section-subtitle {
  font-size: 1.05rem;
  color: var(--text-muted);
  margin-top: 14px;
}

/* GRID */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(2, 260px);
  gap: 22px; /* 👈 más aire entre cards */
}

/* ITEM */
.gallery-item {
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--bg);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.gallery-item:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-md);
}

/* IMAGE */
.img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--bg-section), var(--magenta-tint));
  overflow: hidden;
  transition: transform 0.4s ease;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.gallery-item:hover .img-placeholder {
  transform: scale(1.05);
}

/* OVERLAY */
.gallery-item-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(176, 24, 131, 0.65), transparent);
  display: flex;
  align-items: flex-end;
  padding: 22px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-item:hover .gallery-item-overlay {
  opacity: 1;
}

.gallery-item-label {
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
}

/* POSICIONES */
.gallery-item--1 {
  grid-column: 1 / 5;
}
.gallery-item--2 {
  grid-column: 5 / 8;
}
.gallery-item--3 {
  grid-column: 8 / 13;
  grid-row: 1 / 3;
}
.gallery-item--4 {
  grid-column: 1 / 4;
}
.gallery-item--5 {
  grid-column: 4 / 8;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .gallery {
    padding: 90px 0;
  }

  .gallery-grid {
    grid-template-columns: 1fr 1fr;
    gap: 18px;
  }

  .gallery-item {
    grid-column: auto !important;
    grid-row: auto !important;
    aspect-ratio: 4/3;
  }
}

@media (max-width: 540px) {
  .gallery-container {
    padding: 0 18px;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .gallery-header {
    margin-bottom: 48px;
  }
}
</style>
