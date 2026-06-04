<script setup lang="ts">
const items = [
  {
    imageUrl: "/images/gallery/pantallas.jpg",
    label: "Pantallas",
    alt: "Pantallas para celulares"
  },
  {
    imageUrl: "/images/gallery/baterias.jpg",
    label: "Baterías",
    alt: "Baterías para celulares"
  },
  {
    imageUrl: "/images/gallery/cases.jpg",
    label: "Cases y fundas",
    alt: "Cases para celulares"
  },
  {
    imageUrl: "/images/gallery/cargadores.jpg",
    label: "Cargadores",
    alt: "Cargadores para celulares"
  },
  {
    imageUrl: "/images/gallery/protectores.jpg",
    label: "Protectores",
    alt: "Protectores de pantalla"
  },
];
</script>

<template>
  <section class="gallery" id="galeria">
    <div class="gallery-container">
      <div class="gallery-header">
        <span class="section-label">CelParts</span>

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
.gallery {
  --cp-bg: #0A0A0A;
  --cp-cyan: #00AEEF;
  --cp-cyan-dark: #0077C8;
  --cp-cyan-light: #50D0FF;
  --cp-ice: #A8EDFF;
  --cp-white: #FFFFFF;
  --cp-text: rgba(168,237,255,.82);
  --cp-border: rgba(0,174,239,.18);

  padding: 120px 0;

  background:
    radial-gradient(circle at top right,
      rgba(0,174,239,.10),
      transparent 35%),
    radial-gradient(circle at bottom left,
      rgba(0,63,138,.15),
      transparent 40%),
    var(--cp-bg);
}

.gallery-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(24px, 6vw, 80px);
}

/* HEADER */

.gallery-header {
  text-align: center;
  margin-bottom: 72px;
}

.section-label {
  display: inline-flex;
  align-items: center;
  gap: 10px;

  color: var(--cp-cyan-light);

  font-size: .72rem;
  font-weight: 700;

  letter-spacing: .14em;
  text-transform: uppercase;
}

.section-label::before,
.section-label::after {
  content: "";

  width: 26px;
  height: 2px;

  border-radius: 999px;

  background: var(--cp-cyan);
}

.section-title {
  color: white;

  font-size:
    clamp(2rem,4vw,3rem);

  font-weight: 800;

  margin-top: 14px;
}

.accent-dot {
  width: 7px;
  height: 7px;

  display: inline-block;

  margin-left: 5px;

  border-radius: 50%;

  background: var(--cp-cyan);

  box-shadow:
    0 0 15px rgba(0,174,239,.8);
}

.section-subtitle {
  margin-top: 14px;

  color: var(--cp-text);

  font-size: 1rem;
}

/* GRID */

.gallery-grid {
  display: grid;

  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(2, 260px);

  gap: 22px;
}

/* CARD */

.gallery-item {
  position: relative;

  overflow: hidden;

  border-radius: 28px;

  background:
    rgba(0,174,239,.04);

  border: 1px solid var(--cp-border);

  backdrop-filter: blur(16px);

  transition:
    transform .25s ease,
    border-color .25s ease,
    box-shadow .25s ease;
}

.gallery-item:hover {
  transform: translateY(-6px);

  border-color:
    rgba(0,174,239,.45);

  box-shadow:
    0 20px 50px rgba(0,174,239,.12);
}

/* IMAGE */

.img-placeholder {
  width: 100%;
  height: 100%;

  overflow: hidden;

  background:
    rgba(0,174,239,.04);
}

.gallery-image {
  width: 100%;
  height: 100%;

  object-fit: cover;

  transition: .4s ease;
}

.gallery-item:hover .gallery-image {
  transform: scale(1.08);
}

/* OVERLAY */

.gallery-item-overlay {
  position: absolute;
  inset: 0;

  display: flex;
  align-items: flex-end;

  padding: 24px;

  background:
    linear-gradient(
      to top,
      rgba(0,0,0,.75),
      transparent
    );
}

.gallery-item-label {
  color: white;

  font-size: .88rem;
  font-weight: 700;

  padding: 10px 16px;

  border-radius: 999px;

  background:
    rgba(0,174,239,.12);

  border:
    1px solid rgba(0,174,239,.25);

  backdrop-filter: blur(14px);
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

@media (max-width:900px) {

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

@media (max-width:540px) {

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

  .section-title {
    font-size: 2rem;
  }

  .section-subtitle {
    font-size: .92rem;
  }
}
</style>