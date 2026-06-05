<template>
  <section
    v-if="shouldRender"
    :id="`seccion-${sectionId}`"
    class="cat-grid-section"
    :style="`--cat-count: ${categories.length}`"
  >
    <!-- Encabezado opcional -->
    <div v-if="title || subtitle" class="cat-grid-header">
      <p v-if="subtitle" class="cat-grid-subtitle">{{ subtitle }}</p>
      <h2 v-if="title" class="cat-grid-title">{{ title }}</h2>
      <div class="cat-grid-rule" aria-hidden="true" />
    </div>

    <!-- Skeleton -->
    <div v-if="loading" class="cat-grid cat-grid--4col">
      <div
        v-for="n in skeletonCount"
        :key="`sk-${n}`"
        class="cat-card cat-card--skeleton"
        :style="`--i: ${n - 1}`"
      >
        <div class="cat-card__img-wrap skel-img" />
        <div class="cat-card__label">
          <span class="skel-line skel-line--name" />
          <span class="skel-circle" />
        </div>
      </div>
    </div>

    <!-- Grid real -->
    <div
      v-else
      class="cat-grid"
      :class="[`cat-grid--${Math.min(categories.length, 4)}col`]"
    >
      <a
        v-for="(cat, i) in categories"
        :key="cat.id ?? i"
        :href="cat.href ?? `/productos?categoria=${cat.slug}&page=1&limit=24`"
        class="cat-card"
        :style="`--i: ${i}`"
        :aria-label="`Ver ${cat.name}`"
      >
        <div class="cat-card__img-wrap">
          <img
            :src="cat.image"
            :alt="cat.name"
            class="cat-card__img"
            loading="lazy"
          />
          <div class="cat-card__overlay" aria-hidden="true" />
        </div>
        <div class="cat-card__label">
          <span class="cat-card__name">{{ cat.name }}</span>
          <span class="cat-card__arrow" aria-hidden="true">
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 10L10 2M10 2H5M10 2V7"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </div>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
export interface CategoryItem {
  id?: number | string;
  name: string;
  slug: string;
  image: string;
  href?: string;
}
interface Props {
  sectionId: number | string;
  title?: string;
  subtitle?: string;
  skeletonCount?: number;
}
const props = withDefaults(defineProps<Props>(), {
  skeletonCount: 4,
});

const categories = ref<CategoryItem[]>([]);
const loading = ref(true);
const hasHeader = computed(() => Boolean(props.title || props.subtitle));
const shouldRender = computed(
  () => loading.value || categories.value.length > 0 || hasHeader.value,
);

async function loadCategories() {
  loading.value = true;
  categories.value = [];
  try {
    const response = await $fetch<{ data: CategoryItem[] }>(
      `/api/landing/category-grid?sectionId=${props.sectionId}`,
    );
    categories.value = response?.data ?? [];
  } catch (error) {
    console.error("Error cargando categorías del grid:", error);
    categories.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(() => void loadCategories());
watch(
  () => props.sectionId,
  () => void loadCategories(),
);

const route = useRoute();
watch(
  () => route.path,
  (p) => {
    if (p === "/") void loadCategories();
  },
);
onActivated(() => void loadCategories());
</script>

<style scoped>
/* ═══════════════════════════════════
   CATEGORY GRID — ARIGUMI
   100% tokens de main.css — sin hardcode
═══════════════════════════════════ */
.cat-grid-section {
  --gap: var(--space-5);
  --radius: var(--r-lg);
  --img-aspect: 4 / 3;

  width: 100%;
  padding: clamp(72px, 7vw, 100px) var(--space-8);
  background: var(--bg-page);
  position: relative;
  overflow: hidden;
}

/* Línea técnica superior */
.cat-grid-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  display: none; /* background: var(--line-brand); */
  z-index: 1;
}

/* Fondo decorativo sutil */
.cat-grid-section::after {
  content: "";
  position: absolute;
  top: -100px;
  right: -100px;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--cp-ice) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

/* ═══════════════════════════════════
   HEADER
═══════════════════════════════════ */
.cat-grid-header {
  max-width: var(--container-width);
  margin: 0 auto var(--space-12);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  position: relative;
  z-index: 2;
}

.cat-grid-subtitle {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--cp-electric);
  margin: 0;
}

.cat-grid-subtitle::before,
.cat-grid-subtitle::after {
  content: "";
  width: 20px;
  height: 1px;
  background: var(--cp-electric);
  opacity: 0.5;
}

.cat-grid-title {
  font-size: clamp(2.2rem, 4.5vw, 3.4rem);
  line-height: 1.02;
  font-weight: 800;
  letter-spacing: -0.045em;
  color: var(--text-primary);
  font-family: var(--font-display);
  margin: 0;
  max-width: 700px;
}

.cat-grid-rule {
  width: 48px;
  height: 3px;
  border-radius: var(--r-pill);
  background: var(--grad-sky);
}

/* ═══════════════════════════════════
   GRID
═══════════════════════════════════ */
.cat-grid {
  max-width: var(--container-width);
  margin: 0 auto;
  display: grid;
  gap: var(--gap);
  position: relative;
  z-index: 2;
}

.cat-grid--1col {
  grid-template-columns: 1fr;
}
.cat-grid--2col {
  grid-template-columns: repeat(2, 1fr);
}
.cat-grid--3col {
  grid-template-columns: repeat(3, 1fr);
}
.cat-grid--4col {
  grid-template-columns: repeat(4, 1fr);
}

/* ═══════════════════════════════════
   CARD
═══════════════════════════════════ */
.cat-card {
  position: relative;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  overflow: hidden;
  border-radius: var(--radius);
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  box-shadow: var(--card-shadow);
  opacity: 0;
  transform: translateY(20px);
  animation: cardIn 0.5s var(--ease-snappy) forwards;
  animation-delay: calc(var(--i) * 85ms);
  transition:
    transform var(--t-base) var(--ease-snappy),
    box-shadow var(--t-base) var(--ease-smooth),
    border-color var(--t-base) var(--ease-smooth);
}

/* Línea técnica top al hover */
.cat-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  display: none; /* background: var(--line-brand); */
  opacity: 0;
  transition: opacity var(--t-base) var(--ease-smooth);
  z-index: 1;
}

.cat-card:hover {
  transform: translateY(-6px);
  border-color: var(--border-mid);
  box-shadow: var(--card-shadow-hover);
}

.cat-card:hover::before {
  opacity: 1;
}

/* ═══════════════════════════════════
   IMAGE
═══════════════════════════════════ */
.cat-card__img-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: var(--img-aspect);
  overflow: hidden;
  background: var(--bg-alt);
}

.cat-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition:
    transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1),
    filter 0.35s var(--ease-smooth);
}

.cat-card:hover .cat-card__img {
  transform: scale(1.07);
  filter: saturate(1.05);
}

.cat-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(7, 30, 82, 0.22) 0%,
    rgba(7, 30, 82, 0.04) 50%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity var(--t-base) var(--ease-smooth);
}

.cat-card:hover .cat-card__overlay {
  opacity: 1;
}

/* ═══════════════════════════════════
   LABEL
═══════════════════════════════════ */
.cat-card__label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  background: var(--bg-surface);
  border-top: 1px solid var(--border-light);
  transition: background var(--t-base) var(--ease-smooth);
}

.cat-card:hover .cat-card__label {
  background: var(--bg-alt);
}

.cat-card__name {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-muted);
  transition: color var(--t-base) var(--ease-smooth);
}

.cat-card:hover .cat-card__name {
  color: var(--text-primary);
}

/* Arrow */
.cat-card__arrow {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-light);
  color: var(--text-faint);
  background: var(--bg-surface);
  flex-shrink: 0;
  transition:
    background var(--t-base) var(--ease-smooth),
    border-color var(--t-base) var(--ease-smooth),
    color var(--t-base) var(--ease-smooth),
    transform var(--t-base) var(--ease-snappy);
}

.cat-card:hover .cat-card__arrow {
  background: var(--cp-navy);
  border-color: var(--cp-navy);
  color: var(--cp-white);
  transform: rotate(45deg) scale(1.05);
}

/* ═══════════════════════════════════
   SKELETON
═══════════════════════════════════ */
.cat-card--skeleton {
  pointer-events: none;
}

@keyframes shimmer {
  0% {
    background-position: -500px 0;
  }
  100% {
    background-position: 500px 0;
  }
}

.skel-img,
.skel-line,
.skel-circle {
  background: linear-gradient(
    90deg,
    var(--cp-ice) 25%,
    var(--cp-frost) 50%,
    var(--cp-ice) 75%
  );
  background-size: 900px 100%;
  animation: shimmer 1.5s linear infinite;
}

.skel-img {
  width: 100%;
  aspect-ratio: var(--img-aspect);
}

.skel-line {
  height: 10px;
  width: 60%;
  border-radius: var(--r-pill);
}

.skel-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
}

/* ═══════════════════════════════════
   ANIMATIONS
═══════════════════════════════════ */
@keyframes cardIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ═══════════════════════════════════
   RESPONSIVE
═══════════════════════════════════ */
@media (max-width: 1280px) {
  .cat-grid-section {
    padding: clamp(64px, 6vw, 80px) var(--space-10);
  }
}

@media (max-width: 1024px) {
  .cat-grid--4col,
  .cat-grid--3col {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .cat-grid-section {
    padding: var(--space-16) var(--space-5);
    --gap: var(--space-3);
    --radius: var(--r-md);
    --img-aspect: 3 / 2;
  }

  .cat-grid-header {
    margin-bottom: var(--space-8);
  }

  .cat-grid-title {
    font-size: clamp(1.8rem, 8vw, 2.4rem);
  }

  .cat-grid--2col,
  .cat-grid--3col,
  .cat-grid--4col {
    grid-template-columns: repeat(2, 1fr);
  }

  .cat-card__label {
    padding: var(--space-3) var(--space-4);
  }

  .cat-card__name {
    font-size: 0.62rem;
    letter-spacing: 0.12em;
  }

  .cat-card__arrow,
  .skel-circle {
    width: 24px;
    height: 24px;
  }
}

@media (max-width: 380px) {
  .cat-grid--2col {
    grid-template-columns: 1fr;
  }
}

.cat-grid-section {
  --gap: 18px;
  --radius: 18px;
  --img-aspect: 4 / 3;

  width: 100%;
  padding: 96px 40px;
  background: linear-gradient(to bottom, var(--brand-bg) 0%, #ffffff 100%);
  position: relative;
  overflow: hidden;
}

/* Glow decorativo */
.cat-grid-section::before {
  content: "";
  position: absolute;
  top: -180px;
  right: -180px;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(45, 106, 79, 0.07) 0%,
    transparent 72%
  );
  pointer-events: none;
}

/* ═══════════════════════════════════
   HEADER
═══════════════════════════════════ */
.cat-grid-header {
  max-width: 1200px;
  margin: 0 auto 54px;
  text-align: center;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;

  position: relative;
  z-index: 2;
}

.cat-grid-subtitle {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;

  color: var(--brand-primary);

  margin: 0;
}

.cat-grid-subtitle::before,
.cat-grid-subtitle::after {
  content: "";
  width: 20px;
  height: 1.5px;
  border-radius: 999px;
  background: var(--brand-primary);
}

.cat-grid-title {
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.045em;

  color: var(--brand-black);

  margin: 0;
  max-width: 700px;
}

.cat-grid-rule {
  width: 48px;
  height: 3px;
  border-radius: 999px;

  background: linear-gradient(90deg, var(--brand-primary), var(--brand-accent));
}

/* ═══════════════════════════════════
   GRID
═══════════════════════════════════ */
.cat-grid {
  max-width: 1200px;
  margin: 0 auto;

  display: grid;
  gap: var(--gap);

  position: relative;
  z-index: 2;
}

.cat-grid--1col {
  grid-template-columns: 1fr;
}

.cat-grid--2col {
  grid-template-columns: repeat(2, 1fr);
}

.cat-grid--3col {
  grid-template-columns: repeat(3, 1fr);
}

.cat-grid--4col {
  grid-template-columns: repeat(4, 1fr);
}

/* ═══════════════════════════════════
   CARD
═══════════════════════════════════ */
.cat-card {
  position: relative;

  display: flex;
  flex-direction: column;

  text-decoration: none;
  overflow: hidden;

  border-radius: var(--radius);

  background: rgba(255, 255, 255, 0.86);

  border: 1px solid rgba(255, 255, 255, 0.6);

  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  box-shadow:
    0 4px 18px rgba(17, 17, 17, 0.05),
    0 1px 2px rgba(17, 17, 17, 0.04);

  opacity: 0;
  transform: translateY(20px);

  animation: cardIn 0.5s ease forwards;
  animation-delay: calc(var(--i) * 85ms);

  transition:
    transform 0.26s ease,
    box-shadow 0.26s ease,
    border-color 0.26s ease;
}

.cat-card:hover {
  transform: translateY(-6px);

  border-color: rgba(45, 106, 79, 0.14);

  box-shadow:
    0 18px 40px rgba(17, 17, 17, 0.1),
    0 4px 12px rgba(17, 17, 17, 0.04);
}

/* ═══════════════════════════════════
   IMAGE
═══════════════════════════════════ */
.cat-card__img-wrap {
  position: relative;

  width: 100%;
  aspect-ratio: var(--img-aspect);

  overflow: hidden;

  background: var(--brand-bg-alt);
}

.cat-card__img {
  width: 100%;
  height: 100%;

  object-fit: cover;
  display: block;

  transition:
    transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1),
    filter 0.35s ease;
}

.cat-card:hover .cat-card__img {
  transform: scale(1.07);
  filter: saturate(1.03);
}

.cat-card__overlay {
  position: absolute;
  inset: 0;

  background: linear-gradient(
    to top,
    rgba(17, 17, 17, 0.28) 0%,
    rgba(17, 17, 17, 0.05) 50%,
    transparent 100%
  );

  opacity: 0;
  transition: opacity 0.3s ease;
}

.cat-card:hover .cat-card__overlay {
  opacity: 1;
}

/* ═══════════════════════════════════
   LABEL
═══════════════════════════════════ */
.cat-card__label {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 12px;

  padding: 16px 18px;

  background: rgba(255, 255, 255, 0.92);

  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.cat-card__name {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;

  color: var(--brand-text-muted);

  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

.cat-card:hover .cat-card__name {
  color: var(--brand-primary);
  transform: translateX(2px);
}

/* Arrow */
.cat-card__arrow {
  width: 30px;
  height: 30px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid var(--brand-border);

  color: var(--brand-text-faint);

  background: rgba(255, 255, 255, 0.9);

  flex-shrink: 0;

  transition:
    background 0.22s ease,
    border-color 0.22s ease,
    color 0.22s ease,
    transform 0.22s ease;
}

.cat-card:hover .cat-card__arrow {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  color: white;

  transform: rotate(45deg) scale(1.05);
}

/* ═══════════════════════════════════
   SKELETON
═══════════════════════════════════ */
.cat-card--skeleton {
  pointer-events: none;
}

@keyframes shimmer {
  0% {
    background-position: -500px 0;
  }

  100% {
    background-position: 500px 0;
  }
}

.skel-img,
.skel-line,
.skel-circle {
  background: linear-gradient(90deg, #eceae5 25%, #f7f5f2 50%, #eceae5 75%);

  background-size: 900px 100%;
  animation: shimmer 1.5s linear infinite;
}

.skel-img {
  width: 100%;
  aspect-ratio: var(--img-aspect);
}

.skel-line {
  height: 10px;
  width: 60%;
  border-radius: 999px;
}

.skel-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
}

/* ═══════════════════════════════════
   ANIMATIONS
═══════════════════════════════════ */
@keyframes cardIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ═══════════════════════════════════
   RESPONSIVE
═══════════════════════════════════ */
@media (max-width: 1024px) {
  .cat-grid-section {
    padding: 72px 24px;
  }

  .cat-grid--4col,
  .cat-grid--3col {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .cat-grid-section {
    padding: 64px 18px;

    --gap: 12px;
    --radius: 14px;
    --img-aspect: 3 / 2;
  }

  .cat-grid-header {
    margin-bottom: 36px;
    gap: 12px;
  }

  .cat-grid-title {
    font-size: clamp(1.7rem, 8vw, 2.3rem);
  }

  .cat-grid--2col,
  .cat-grid--3col,
  .cat-grid--4col {
    grid-template-columns: repeat(2, 1fr);
  }

  .cat-card__label {
    padding: 13px 14px;
  }

  .cat-card__name {
    font-size: 9.5px;
    letter-spacing: 0.14em;
  }

  .cat-card__arrow,
  .skel-circle {
    width: 24px;
    height: 24px;
  }
}

@media (max-width: 380px) {
  .cat-grid--2col {
    grid-template-columns: 1fr;
  }
}
</style>
