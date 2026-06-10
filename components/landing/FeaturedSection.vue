<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";

const { waLink } = useKite();

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  description?: string;
  category?: { name: string };
  images?: Array<{ url: string }>;
  isFeatured?: boolean;
}

interface FeaturedProductsResponse {
  data: Product[];
}

const tabMap = {
  "Más vendidos": "bestsellers",
  Novedades: "newest",
  Ofertas: "offers",
};

const tabs = Object.keys(tabMap) as Array<keyof typeof tabMap>;

const activeTab = ref<keyof typeof tabMap>("Más vendidos");

const products = ref<Product[]>([]);
const loading = ref(true);

const getPrimaryImage = (product: Product) =>
  product.images?.[0]?.url ?? "";

const heroProduct = computed(() => products.value[0] || null);

const sideProducts = computed(() => products.value.slice(1, 3));

const fetchFeaturedProducts = async (
  tabName: keyof typeof tabMap
) => {
  try {
    loading.value = true;

    const type = tabMap[tabName];

    const { data } =
      await $fetch<FeaturedProductsResponse>(
        `/api/landing/featured-products?type=${type}`
      );

    products.value = data || [];
  } catch (error) {
    console.error(
      "[CelParts] Error cargando productos destacados:",
      error
    );

    products.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchFeaturedProducts(activeTab.value);
});

watch(activeTab, (newTab) => {
  fetchFeaturedProducts(newTab);
});
</script>

<template>
  <section class="featured-section" id="destacados">

    <!-- Fondo decorativo -->
    <div class="featured-bg-deco" aria-hidden="true" />

    <div class="featured-container">

      <!-- ═════════ HEADER ═════════ -->
      <div class="featured-header">

        <span class="featured-label">Selección CelParts</span>

        <h2 class="featured-title">
          Productos destacados<span class="featured-title__dot" />
        </h2>

        <p class="featured-subtitle">
          Descubre nuestra selección cuidadosamente elegida por calidad,
          innovación y popularidad entre nuestros clientes.
        </p>

      </div>

      <!-- ═════════ TABS ═════════ -->
      <div class="featured-tabs" role="tablist">

        <button v-for="tab in tabs" :key="tab" class="featured-tab" :class="{ active: activeTab === tab }" role="tab"
          :aria-selected="activeTab === tab" @click="activeTab = tab">
          {{ tab }}
        </button>

      </div>

      <!-- ═════════ LOADING ═════════ -->
      <EcommerceSkeletonFeaturedSection v-if="loading" />

      <!-- ═════════ GRID ═════════ -->
      <div v-else class="featured-grid">

        <template v-if="heroProduct">

          <!-- HERO PRODUCT -->
          <article class="featured-card featured-card--hero">

            <!-- image -->
            <div class="featured-image-wrap">

              <img v-if="getPrimaryImage(heroProduct)" :src="getPrimaryImage(heroProduct)" :alt="heroProduct.name"
                class="featured-image" />

              <div v-else class="featured-image-placeholder">
                📦
              </div>

              <div class="featured-image-overlay" />

            </div>

            <!-- body -->
            <div class="featured-body">

              <div class="featured-meta">

                <span class="featured-category">
                  {{ heroProduct.category?.name }}
                </span>

                <h3 class="featured-name featured-name--hero">
                  {{ heroProduct.name }}
                </h3>

                <p class="featured-description">
                  {{ heroProduct.description }}
                </p>

              </div>

              <div class="featured-footer">

                <div class="featured-price">
                  <span class="currency">S/</span>
                  {{ heroProduct.price.toFixed(2) }}
                </div>

                <LandingAppButton variant="wa" size="sm" class="featured-btn"
                  :href="waLink(`Hola, me interesa el producto: ${heroProduct.name}`)" target="_blank">
                  <LandingWaIcon :size="16" />
                  Consultar
                </LandingAppButton>

              </div>

            </div>

          </article>

          <!-- SIDE PRODUCTS -->
          <article v-for="product in sideProducts" :key="product.id" class="featured-card">

            <!-- image -->
            <div class="featured-image-wrap">

              <img v-if="getPrimaryImage(product)" :src="getPrimaryImage(product)" :alt="product.name"
                class="featured-image" />

              <div v-else class="featured-image-placeholder">
                📦
              </div>

              <div class="featured-image-overlay" />

            </div>

            <!-- body -->
            <div class="featured-body">

              <div class="featured-meta">

                <span class="featured-category">
                  {{ product.category?.name }}
                </span>

                <h3 class="featured-name">
                  {{ product.name }}
                </h3>

                <p class="featured-description">
                  {{ product.description }}
                </p>

              </div>

              <div class="featured-footer">

                <div class="featured-price">
                  <span class="currency">S/</span>
                  {{ product.price.toFixed(2) }}
                </div>

                <LandingAppButton variant="wa" size="sm" class="featured-btn"
                  :href="waLink(`Hola, me interesa el producto: ${product.name}`)" target="_blank">
                  <LandingWaIcon :size="16" />
                  Consultar
                </LandingAppButton>

              </div>

            </div>

          </article>

        </template>

        <!-- EMPTY -->
        <div v-else class="featured-empty">
          No hay productos disponibles
        </div>

      </div>

    </div>

  </section>
</template>

<style scoped>
/* ═══════════════════════════════════
   FEATURED SECTION — CELPARTS
   100% tokens de main.css — sin hardcode
═══════════════════════════════════ */

.featured-section {
  position: relative;
  overflow: hidden;
  background: var(--bg-alt);
  padding: clamp(80px, 8vw, 120px) var(--space-8);
}

/* Línea técnica superior */
.featured-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  display: none; /* background: var(--line-brand); */
  z-index: 1;
}

/* Fondo decorativo radial */
.featured-bg-deco {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 50% at 0% 0%, var(--cp-ice) 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 100% 100%, var(--cp-frost) 0%, transparent 60%);
  pointer-events: none;
  z-index: 0;
}

/* ── Container ── */
.featured-container {
  position: relative;
  z-index: 2;
  max-width: var(--container-width);
  margin: 0 auto;
}

/* ── Header ── */
.featured-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-4);
  margin-bottom: var(--space-10);
}

/* Label — mismo estilo que benefits / catalog */
.featured-label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--cp-electric);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.featured-label::before,
.featured-label::after {
  content: '';
  width: 20px;
  height: 1px;
  background: var(--cp-electric);
  opacity: 0.5;
}

.featured-title {
  margin: 0;
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 4.5vw, 3.6rem);
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -0.045em;
}

.featured-title__dot {
  width: 8px;
  height: 8px;
  margin-left: var(--space-2);
  border-radius: 50%;
  display: inline-block;
  background: var(--cp-electric);
  position: relative;
  top: -6px;
  box-shadow: var(--glow-soft);
}

.featured-subtitle {
  margin: 0;
  max-width: 600px;
  color: var(--text-muted);
  line-height: 1.8;
  font-size: 1rem;
}

/* ── Tabs ── */
.featured-tabs {
  width: fit-content;
  margin: 0 auto var(--space-10);
  padding: var(--space-1);
  display: flex;
  gap: var(--space-1);
  border-radius: var(--r-pill);
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  box-shadow: var(--card-shadow-sm);
}

.featured-tab {
  border: none;
  outline: none;
  cursor: pointer;
  padding: var(--space-2) var(--space-5);
  border-radius: var(--r-pill);
  background: transparent;
  color: var(--text-muted);
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 600;
  transition:
    background var(--t-base) var(--ease-smooth),
    color var(--t-base) var(--ease-smooth),
    box-shadow var(--t-base) var(--ease-smooth);
}

.featured-tab:hover {
  color: var(--text-primary);
  background: var(--bg-alt);
}

.featured-tab.active {
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
  box-shadow: 0 4px 14px rgba(7, 30, 82, 0.18);
}

/* ── Grid ── */
.featured-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr;
  gap: var(--space-6);
}

/* ── Card ── */
.featured-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: var(--r-xl);
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  box-shadow: var(--card-shadow);
  transition:
    transform var(--t-base) var(--ease-snappy),
    border-color var(--t-base) var(--ease-smooth),
    box-shadow var(--t-base) var(--ease-smooth);
  position: relative;
}

/* Línea técnica top en hover */
.featured-card::before {
  content: '';
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

.featured-card:hover {
  transform: translateY(-6px);
  border-color: var(--border-mid);
  box-shadow: var(--card-shadow-hover);
}

.featured-card:hover::before {
  opacity: 1;
}

.featured-card--hero {
  flex-direction: row;
}

/* ── Image ── */
.featured-image-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: var(--bg-alt);
}

.featured-card--hero .featured-image-wrap {
  width: 48%;
  aspect-ratio: unset;
}

.featured-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--t-slow) var(--ease-smooth);
}

.featured-card:hover .featured-image {
  transform: scale(1.05);
}

.featured-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(7, 30, 82, 0.10), transparent);
}

.featured-image-placeholder {
  width: 100%;
  height: 100%;
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: var(--text-faint);
}

/* ── Body ── */
.featured-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--space-5);
  padding: var(--space-6);
}

.featured-meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.featured-category {
  color: var(--cp-electric);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.featured-name {
  margin: 0;
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.featured-name--hero {
  font-size: clamp(1.3rem, 2.5vw, 1.7rem);
}

.featured-description {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.7;
  font-size: 0.9rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── Footer ── */
.featured-footer {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding-top: var(--space-5);
  border-top: 1px solid var(--border-light);
}

.featured-price {
  margin-right: auto;
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.currency {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--cp-electric);
}

/* ── Empty ── */
.featured-empty {
  grid-column: 1 / -1;
  padding: var(--space-20) var(--space-8);
  text-align: center;
  border-radius: var(--r-xl);
  background: var(--bg-surface);
  border: 1px dashed var(--border-light);
  color: var(--text-faint);
}

/* ═══════════════════════════════════
   RESPONSIVE
═══════════════════════════════════ */
@media (max-width: 1100px) {
  .featured-grid {
    grid-template-columns: 1fr 1fr;
  }

  .featured-card--hero {
    grid-column: span 2;
    flex-direction: column;
  }

  .featured-card--hero .featured-image-wrap {
    width: 100%;
    aspect-ratio: 16/9;
  }
}

@media (max-width: 720px) {
  .featured-section {
    padding: clamp(64px, 6vw, 80px) var(--space-5);
  }

  .featured-grid {
    grid-template-columns: 1fr;
  }

  .featured-card--hero {
    grid-column: span 1;
  }

  .featured-tabs {
    width: 100%;
  }

  .featured-tab {
    flex: 1;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .featured-tab {
    font-size: 0.75rem;
    padding: var(--space-2) var(--space-3);
  }

  .featured-body {
    padding: var(--space-5);
  }
}
</style>