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
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
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
  /** Cuántas tarjetas mostrar en el skeleton (default 4) */
  skeletonCount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  skeletonCount: 4,
});

const categories = ref<CategoryItem[]>([]);
const loading = ref(true);

const hasHeader = computed(() => Boolean(props.title || props.subtitle));
const shouldRender = computed(() => loading.value || categories.value.length > 0 || hasHeader.value);

async function loadCategories() {
  loading.value = true; // sin el "if (loading.value) return"
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
   TOKENS
═══════════════════════════════════ */
.cat-grid-section {
  --jm-magenta: #d4229f;
  --jm-magenta-dark: #9c1275;
  --jm-magenta-glow: rgba(212, 34, 159, 0.18);
  --jm-magenta-line: rgba(212, 34, 159, 0.25);
  --jm-magenta-soft: rgba(212, 34, 159, 0.07);
  --jm-yellow: #f7d21e;
  --jm-bg: #ffffff;
  --jm-surface: #ffffff;
  --jm-surface-hover: #fdf0f9;
  --jm-text: #0f0f0f;
  --jm-text-dim: #6b6b6b;
  --jm-border: rgba(0, 0, 0, 0.08);
  --jm-border-hover: rgba(212, 34, 159, 0.3);
  --jm-shadow: rgba(0, 0, 0, 0.08);
  --jm-shadow-hover: rgba(212, 34, 159, 0.15);

  /* skeleton */
  --sk-base: #e8e8ea;
  --sk-shine: #f2f2f4;

  --gap: 14px;
  --radius: 14px;
  --img-aspect: 4 / 3;

  width: 100%;
  background: #ffffff;
  padding: 56px 32px 64px;
  box-sizing: border-box;
}

/* ═══════════════════════════════════
   ENCABEZADO
═══════════════════════════════════ */
.cat-grid-header {
  max-width: 1200px;
  margin: 0 auto 36px;
  text-align: center;
}
.cat-grid-subtitle {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: var(--jm-magenta);
  margin: 0 0 10px;
}
.cat-grid-title {
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--jm-text);
  margin: 0 0 18px;
}
.cat-grid-rule {
  width: 40px;
  height: 2px;
  margin: 0 auto;
  background: linear-gradient(90deg, var(--jm-magenta), var(--jm-yellow));
  border-radius: 2px;
}

/* ═══════════════════════════════════
   GRID
═══════════════════════════════════ */
.cat-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: var(--gap);
  grid-template-columns: repeat(auto-fit, minmax(min(200px, 100%), 1fr));
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
.cat-grid:not(.cat-grid--1col):not(.cat-grid--2col):not(.cat-grid--3col):not(
    .cat-grid--4col
  ) {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

/* ═══════════════════════════════════
   TARJETA BASE
═══════════════════════════════════ */
.cat-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--jm-surface);
  border: 1px solid var(--jm-border);
  position: relative;
  cursor: pointer;
  box-shadow: 0 2px 8px var(--jm-shadow);

  opacity: 0;
  transform: translateY(16px);
  animation: cardIn 0.5s ease forwards;
  animation-delay: calc(var(--i) * 80ms);

  transition:
    border-color 0.22s ease,
    box-shadow 0.22s ease,
    transform 0.22s ease;
}
.cat-card:not(.cat-card--skeleton):hover {
  border-color: var(--jm-border-hover);
  box-shadow:
    0 12px 36px var(--jm-shadow-hover),
    0 0 0 1px var(--jm-magenta-line);
  transform: translateY(-3px);
}

/* ═══════════════════════════════════
   SKELETON
═══════════════════════════════════ */
.cat-card--skeleton {
  cursor: default;
  pointer-events: none;
  animation: cardIn 0.4s ease forwards;
}

@keyframes shimmer {
  0% {
    background-position: -400px 0;
  }
  100% {
    background-position: 400px 0;
  }
}

.skel-img {
  width: 100%;
  aspect-ratio: var(--img-aspect);
  background: linear-gradient(
    90deg,
    var(--sk-base) 25%,
    var(--sk-shine) 50%,
    var(--sk-base) 75%
  );
  background-size: 800px 100%;
  animation: shimmer 1.4s linear infinite;
}

.skel-line {
  display: block;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    var(--sk-base) 25%,
    var(--sk-shine) 50%,
    var(--sk-base) 75%
  );
  background-size: 800px 100%;
  animation: shimmer 1.4s linear infinite;
}
.skel-line--name {
  height: 10px;
  width: 65%;
}

.skel-circle {
  display: block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
  background: linear-gradient(
    90deg,
    var(--sk-base) 25%,
    var(--sk-shine) 50%,
    var(--sk-base) 75%
  );
  background-size: 800px 100%;
  animation: shimmer 1.4s linear infinite;
}

/* ── Imagen real ── */
.cat-card__img-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: var(--img-aspect);
  overflow: hidden;
  background: #ede8ec;
}
.cat-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.42s ease;
}
.cat-card:hover .cat-card__img {
  transform: scale(1.06);
}
.cat-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 50%,
    rgba(0, 0, 0, 0.22) 100%
  );
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.22s;
}
.cat-card:hover .cat-card__overlay {
  opacity: 1;
}

/* ── Etiqueta ── */
.cat-card__label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 13px 16px 14px;
  border-top: 1px solid var(--jm-border);
  background: var(--jm-surface);
  transition:
    background 0.18s,
    border-color 0.18s;
}
.cat-card:not(.cat-card--skeleton):hover .cat-card__label {
  background: var(--jm-surface-hover);
  border-color: var(--jm-magenta-line);
}
.cat-card__name {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--jm-text-dim);
  transition: color 0.18s;
  line-height: 1;
}
.cat-card:hover .cat-card__name {
  color: var(--jm-magenta-dark);
}
.cat-card__arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid var(--jm-border);
  color: var(--jm-text-dim);
  flex-shrink: 0;
  transition:
    background 0.18s,
    border-color 0.18s,
    color 0.18s,
    transform 0.18s;
}
.cat-card:hover .cat-card__arrow {
  background: var(--jm-magenta);
  border-color: var(--jm-magenta);
  color: #fff;
  transform: rotate(45deg);
}

/* ═══════════════════════════════════
   ANIMACIÓN
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
@media (max-width: 1023px) {
  .cat-grid-section {
    padding: 40px 20px 48px;
  }
  .cat-grid--4col {
    grid-template-columns: repeat(2, 1fr);
  }
  .cat-grid--3col {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .cat-grid-section {
    padding: 32px 14px 40px;
    --gap: 10px;
    --radius: 10px;
    --img-aspect: 3 / 2;
  }
  .cat-grid--1col {
    grid-template-columns: 1fr;
  }
  .cat-grid--2col,
  .cat-grid--3col,
  .cat-grid--4col {
    grid-template-columns: repeat(2, 1fr);
  }
  .cat-card__name {
    font-size: 9.5px;
    letter-spacing: 0.14em;
  }
  .cat-card__label {
    padding: 10px 12px 11px;
  }
  .cat-card__arrow {
    width: 20px;
    height: 20px;
  }
  .skel-circle {
    width: 20px;
    height: 20px;
  }
}

@media (max-width: 380px) {
  .cat-grid--2col {
    grid-template-columns: 1fr;
  }
}
</style>
