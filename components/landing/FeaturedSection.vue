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
      "[Kite] Error cargando productos destacados:",
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

    <!-- glow decor -->
    <div class="featured-glow featured-glow--left" aria-hidden="true" />
    <div class="featured-glow featured-glow--right" aria-hidden="true" />

    <div class="featured-container">

      <!-- ═════════ HEADER ═════════ -->
      <div class="featured-header fade-up">

        <div class="featured-badge">
          Selección Kite
        </div>

        <h2 class="featured-title">
          Productos destacados
          <span class="featured-title-accent">.</span>
        </h2>

        <p class="featured-subtitle">
          Diseño funcional, calidad real y acabados
          pensados para cocinas modernas.
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
                  <span class="currency">
                    S/
                  </span>

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
                  <span class="currency">
                    S/
                  </span>

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
   SECTION
═══════════════════════════════════ */
.featured-section {
  position: relative;
  overflow: hidden;

  padding: 110px 32px;

  background:
    linear-gradient(180deg,
      #F8F7F4 0%,
      #FDFDFC 100%);
}

/* ═══════════════════════════════════
   GLOW
═══════════════════════════════════ */
.featured-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(90px);
  pointer-events: none;
  opacity: 0.35;
}

.featured-glow--left {
  top: -120px;
  left: -120px;

  width: 340px;
  height: 340px;

  background:
    rgba(45, 106, 79, 0.12);
}

.featured-glow--right {
  bottom: -140px;
  right: -120px;

  width: 320px;
  height: 320px;

  background:
    rgba(231, 111, 81, 0.10);
}

/* ═══════════════════════════════════
   CONTAINER
═══════════════════════════════════ */
.featured-container {
  position: relative;
  z-index: 2;

  max-width: 1280px;
  margin: 0 auto;
}

/* ═══════════════════════════════════
   HEADER
═══════════════════════════════════ */
.featured-header {
  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;

  gap: 14px;

  margin-bottom: 42px;
}

.featured-badge {
  display: inline-flex;
  align-items: center;

  padding: 6px 14px;

  border-radius: 999px;

  background:
    rgba(45, 106, 79, 0.08);

  border:
    1px solid rgba(45, 106, 79, 0.14);

  color: #2D6A4F;

  font-size: 0.72rem;
  font-weight: 700;

  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.featured-title {
  font-size:
    clamp(2rem, 4vw, 3.4rem);

  line-height: 1.04;
  letter-spacing: -0.05em;

  color: #111111;
}

.featured-title-accent {
  color: #E76F51;
}

.featured-subtitle {
  max-width: 620px;

  font-size: 1rem;
  line-height: 1.7;

  color: #66625A;
}

/* ═══════════════════════════════════
   TABS
═══════════════════════════════════ */
.featured-tabs {
  width: fit-content;

  margin: 0 auto 54px;

  padding: 5px;

  display: flex;
  align-items: center;
  gap: 4px;

  border-radius: 999px;

  background: rgba(255, 255, 255, 0.85);

  border:
    1px solid rgba(228, 225, 216, 0.9);

  backdrop-filter: blur(10px);

  box-shadow:
    0 8px 30px rgba(17, 17, 17, 0.04);
}

.featured-tab {
  border: none;
  outline: none;

  background: transparent;

  padding: 0.7rem 1.25rem;

  border-radius: 999px;

  font-size: 0.82rem;
  font-weight: 600;

  color: #66625A;

  cursor: pointer;

  transition:
    background 0.18s ease,
    color 0.18s ease,
    transform 0.14s ease;
}

.featured-tab:hover:not(.active) {
  background: #F3F1EC;
  color: #111111;
}

.featured-tab.active {
  background: #111111;
  color: #FFFFFF;

  box-shadow:
    0 8px 24px rgba(17, 17, 17, 0.12);
}

/* ═══════════════════════════════════
   GRID
═══════════════════════════════════ */
.featured-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr;
  gap: 22px;
}

/* ═══════════════════════════════════
   CARD
═══════════════════════════════════ */
.featured-card {
  position: relative;

  display: flex;
  flex-direction: column;

  overflow: hidden;

  background: rgba(255, 255, 255, 0.78);

  border:
    1px solid rgba(228, 225, 216, 0.85);

  border-radius: 24px;

  backdrop-filter: blur(14px);

  box-shadow:
    0 10px 40px rgba(17, 17, 17, 0.05);

  transition:
    transform 0.24s ease,
    border-color 0.24s ease,
    box-shadow 0.24s ease;
}

.featured-card:hover {
  transform: translateY(-6px);

  border-color:
    rgba(45, 106, 79, 0.16);

  box-shadow:
    0 22px 50px rgba(17, 17, 17, 0.10);
}

.featured-card--hero {
  flex-direction: row;
}

/* ═══════════════════════════════════
   IMAGE
═══════════════════════════════════ */
.featured-image-wrap {
  position: relative;

  width: 100%;
  aspect-ratio: 1;

  overflow: hidden;

  background: #F1EFEA;
}

.featured-card--hero .featured-image-wrap {
  width: 48%;
  aspect-ratio: auto;
}

.featured-image {
  width: 100%;
  height: 100%;

  object-fit: cover;
  object-position: center;

  display: block;

  transition:
    transform 0.45s ease;
}

.featured-card:hover .featured-image {
  transform: scale(1.05);
}

.featured-image-overlay {
  position: absolute;
  inset: 0;

  background:
    linear-gradient(180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.05) 100%);

  pointer-events: none;
}

.featured-image-placeholder {
  width: 100%;
  height: 100%;
  min-height: 220px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 2.8rem;

  color: #A5A39C;
}

/* ═══════════════════════════════════
   BODY
═══════════════════════════════════ */
.featured-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  gap: 18px;

  flex: 1;

  padding: 26px;
}

.featured-meta {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.featured-category {
  font-size: 0.68rem;
  font-weight: 700;

  letter-spacing: 0.16em;
  text-transform: uppercase;

  color: #2D6A4F;
}

.featured-name {
  font-size: 1.05rem;
  font-weight: 800;

  line-height: 1.25;
  letter-spacing: -0.02em;

  color: #111111;
}

.featured-name--hero {
  font-size: 1.7rem;
  line-height: 1.08;
}

.featured-description {
  font-size: 0.9rem;
  line-height: 1.7;

  color: #66625A;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;

  overflow: hidden;
}

/* ═══════════════════════════════════
   FOOTER
═══════════════════════════════════ */
.featured-footer {
  display: flex;
  align-items: center;
  gap: 12px;

  padding-top: 18px;

  border-top:
    1px solid rgba(228, 225, 216, 0.9);
}

.featured-price {
  margin-right: auto;

  color: #111111;

  font-size: 1.15rem;
  font-weight: 800;

  letter-spacing: -0.02em;
}

.currency {
  position: relative;
  top: -1px;

  font-size: 0.76rem;
  font-weight: 700;

  color: #66625A;
}

.featured-btn {
  flex-shrink: 0;
}

/* ═══════════════════════════════════
   EMPTY
═══════════════════════════════════ */
.featured-empty {
  grid-column: 1 / -1;

  padding: 70px 24px;

  text-align: center;

  border-radius: 24px;

  background: rgba(255, 255, 255, 0.7);

  border:
    1px dashed rgba(228, 225, 216, 0.9);

  color: #9E9A91;

  font-size: 0.95rem;
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
    aspect-ratio: 16 / 9;
    max-height: 340px;
  }
}

@media (max-width: 720px) {

  .featured-section {
    padding: 80px 18px;
  }

  .featured-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .featured-card--hero {
    grid-column: span 1;
  }

  .featured-card--hero .featured-image-wrap {
    aspect-ratio: 4 / 3;
  }

  .featured-tabs {
    width: 100%;
    justify-content: stretch;
  }

  .featured-tab {
    flex: 1;
    text-align: center;
  }

  .featured-body {
    padding: 22px;
  }

  .featured-name--hero {
    font-size: 1.35rem;
  }

  .featured-footer {
    flex-wrap: wrap;
  }

  .featured-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {

  .featured-title {
    font-size: 2rem;
  }

  .featured-subtitle {
    font-size: 0.92rem;
  }

  .featured-tab {
    font-size: 0.75rem;
    padding: 0.72rem 0.8rem;
  }

  .featured-body {
    padding: 20px;
  }
}
</style>