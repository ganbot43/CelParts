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

    <!-- glow decor -->
    <div class="featured-glow featured-glow--left" aria-hidden="true" />
    <div class="featured-glow featured-glow--right" aria-hidden="true" />

    <div class="featured-container">

      <!-- ═════════ HEADER ═════════ -->
      <div class="featured-header fade-up">

        <div class="featured-badge">
          Selección CelParts
        </div>

        <h2 class="featured-title">
          Productos destacados
          <span class="featured-title-accent">.</span>
        </h2>

        <p class="featured-subtitle">
          Descubre nuestra selección de productos destacados, cuidadosamente elegidos por su calidad, innovación y popularidad entre nuestros clientes.
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
.featured-section {
  --cp-bg: #0A0A0A;
  --cp-cyan: #00AEEF;
  --cp-cyan-dark: #0077C8;
  --cp-cyan-light: #50D0FF;
  --cp-ice: #A8EDFF;
  --cp-white: #FFFFFF;
  --cp-text: rgba(168,237,255,.82);
  --cp-border: rgba(0,174,239,.18);

  position: relative;
  overflow: hidden;

  padding: 110px 32px;

  background:
    radial-gradient(circle at top left,
      rgba(0,174,239,.10),
      transparent 35%),
    radial-gradient(circle at bottom right,
      rgba(0,63,138,.18),
      transparent 40%),
    var(--cp-bg);
}

/* GLOW */

.featured-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(100px);
  pointer-events: none;
}

.featured-glow--left {
  top: -120px;
  left: -120px;

  width: 340px;
  height: 340px;

  background:
    rgba(0,174,239,.15);
}

.featured-glow--right {
  bottom: -140px;
  right: -120px;

  width: 320px;
  height: 320px;

  background:
    rgba(0,119,200,.18);
}

/* CONTAINER */

.featured-container {
  position: relative;
  z-index: 2;

  max-width: 1280px;
  margin: 0 auto;
}

/* HEADER */

.featured-header {
  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;

  gap: 14px;

  margin-bottom: 42px;
}

.featured-badge {
  padding: 8px 16px;

  border-radius: 999px;

  background:
    rgba(0,174,239,.08);

  border: 1px solid var(--cp-border);

  color: var(--cp-cyan-light);

  font-size: .72rem;
  font-weight: 700;

  letter-spacing: .14em;
  text-transform: uppercase;
}

.featured-title {
  margin: 0;

  color: white;

  font-size:
    clamp(2rem,4vw,3.4rem);

  line-height: 1.04;
  letter-spacing: -.05em;
}

.featured-title-accent {
  color: var(--cp-cyan);
}

.featured-subtitle {
  max-width: 650px;

  color: var(--cp-text);

  line-height: 1.8;
}

/* TABS */

.featured-tabs {
  width: fit-content;

  margin: 0 auto 54px;

  padding: 6px;

  display: flex;
  gap: 6px;

  border-radius: 999px;

  background:
    rgba(0,174,239,.05);

  border: 1px solid var(--cp-border);

  backdrop-filter: blur(14px);
}

.featured-tab {
  border: none;
  outline: none;

  cursor: pointer;

  padding: .75rem 1.3rem;

  border-radius: 999px;

  background: transparent;

  color: var(--cp-text);

  font-size: .82rem;
  font-weight: 600;

  transition: .2s ease;
}

.featured-tab:hover {
  color: white;
}

.featured-tab.active {
  background:
    linear-gradient(
      135deg,
      var(--cp-cyan),
      var(--cp-cyan-dark)
    );

  color: white;

  box-shadow:
    0 10px 24px rgba(0,174,239,.25);
}

/* GRID */

.featured-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr;
  gap: 22px;
}

/* CARD */

.featured-card {
  display: flex;
  flex-direction: column;

  overflow: hidden;

  border-radius: 24px;

  background:
    rgba(0,174,239,.05);

  border: 1px solid var(--cp-border);

  backdrop-filter: blur(16px);

  transition:
    transform .25s ease,
    border-color .25s ease,
    box-shadow .25s ease;
}

.featured-card:hover {
  transform: translateY(-6px);

  border-color:
    rgba(0,174,239,.45);

  box-shadow:
    0 18px 50px rgba(0,174,239,.12);
}

.featured-card--hero {
  flex-direction: row;
}

/* IMAGE */

.featured-image-wrap {
  position: relative;

  width: 100%;
  aspect-ratio: 1;

  overflow: hidden;

  background:
    rgba(0,174,239,.05);
}

.featured-card--hero .featured-image-wrap {
  width: 48%;
}

.featured-image {
  width: 100%;
  height: 100%;

  object-fit: cover;

  transition: .4s ease;
}

.featured-card:hover .featured-image {
  transform: scale(1.05);
}

.featured-image-overlay {
  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      to top,
      rgba(0,0,0,.15),
      transparent
    );
}

.featured-image-placeholder {
  width: 100%;
  height: 100%;
  min-height: 220px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 3rem;

  color: var(--cp-cyan);
}

/* BODY */

.featured-body {
  flex: 1;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  gap: 18px;

  padding: 26px;
}

.featured-meta {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.featured-category {
  color: var(--cp-cyan-light);

  font-size: .68rem;
  font-weight: 700;

  letter-spacing: .16em;
  text-transform: uppercase;
}

.featured-name {
  color: white;

  font-size: 1.05rem;
  font-weight: 800;
}

.featured-name--hero {
  font-size: 1.7rem;
}

.featured-description {
  color: var(--cp-text);

  line-height: 1.7;

  font-size: .9rem;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;

  overflow: hidden;
}

/* FOOTER */

.featured-footer {
  display: flex;
  align-items: center;
  gap: 12px;

  padding-top: 18px;

  border-top:
    1px solid rgba(0,174,239,.12);
}

.featured-price {
  margin-right: auto;

  color: white;

  font-size: 1.2rem;
  font-weight: 800;
}

.currency {
  font-size: .75rem;
  color: var(--cp-cyan-light);
}

/* EMPTY */

.featured-empty {
  grid-column: 1/-1;

  padding: 70px 24px;

  text-align: center;

  border-radius: 24px;

  background:
    rgba(0,174,239,.04);

  border: 1px dashed var(--cp-border);

  color: var(--cp-text);
}

/* RESPONSIVE */

@media (max-width:1100px){

  .featured-grid{
    grid-template-columns:1fr 1fr;
  }

  .featured-card--hero{
    grid-column:span 2;
    flex-direction:column;
  }

  .featured-card--hero .featured-image-wrap{
    width:100%;
    aspect-ratio:16/9;
  }
}

@media (max-width:720px){

  .featured-section{
    padding:80px 18px;
  }

  .featured-grid{
    grid-template-columns:1fr;
  }

  .featured-card--hero{
    grid-column:span 1;
  }

  .featured-tabs{
    width:100%;
  }

  .featured-tab{
    flex:1;
  }

  .featured-btn{
    width:100%;
  }
}

@media (max-width:480px){

  .featured-title{
    font-size:2rem;
  }

  .featured-tab{
    font-size:.75rem;
    padding:.72rem .8rem;
  }

  .featured-body{
    padding:20px;
  }
}
</style>