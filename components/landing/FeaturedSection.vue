<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";

const { waLink } = useJoymar();

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
const loading = ref(true); // ← true desde el inicio

const getPrimaryImage = (product: Product) => product.images?.[0]?.url ?? "";

const heroProduct = computed(() => products.value[0] || null);
const sideProducts = computed(() => products.value.slice(1, 3));

const fetchFeaturedProducts = async (tabName: keyof typeof tabMap) => {
  try {
    loading.value = true;
    const type = tabMap[tabName];
    const url = `/api/landing/featured-products?type=${type}`;
    const { data } = await $fetch<FeaturedProductsResponse>(url);
    products.value = data || [];
  } catch (error) {
    console.error("Error cargando productos destacados:", error);
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
  <section class="featured" id="destacados">
    <div class="container">
      <div class="featured-header">
        <span class="section-label">Lo más popular</span>
        <h2 class="section-title">
          Productos destacados<span class="accent-dot" />
        </h2>
        <p class="section-subtitle">
          Los favoritos de nuestros clientes, seleccionados por calidad y
          funcionalidad.
        </p>
      </div>

      <!-- Tabs -->
      <div class="featured-tabs" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab"
          class="featured-tab"
          :class="{ active: activeTab === tab }"
          role="tab"
          :aria-selected="activeTab === tab"
          @click="activeTab = tab"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Cards -->
      <EcommerceSkeletonFeaturedSection v-if="loading" />
      <div v-else class="featured-grid">
        <template v-if="heroProduct">
          <!-- Hero -->
          <div class="featured-card featured-card--hero">
            <div class="featured-card-image">
              <img
                v-if="getPrimaryImage(heroProduct)"
                :src="getPrimaryImage(heroProduct)"
                :alt="heroProduct.name"
                class="product-img"
              />
              <div v-else class="img-placeholder">📦</div>
            </div>
            <div class="featured-card-body">
              <div>
                <span class="product-category">{{
                  heroProduct.category?.name
                }}</span>
                <h3 class="product-name">{{ heroProduct.name }}</h3>
                <p class="card-desc">{{ heroProduct.description }}</p>
              </div>
              <div class="card-footer-row">
                <div class="product-price">
                  <span class="currency">S/ </span
                  >{{ heroProduct.price.toFixed(2) }}
                </div>
                <LandingAppButton
                  variant="wa"
                  size="sm"
                  :href="
                    waLink(`Hola, me interesa el producto: ${heroProduct.name}`)
                  "
                  target="_blank"
                >
                  <LandingWaIcon :size="16" /> Consultar
                </LandingAppButton>
              </div>
            </div>
          </div>

          <!-- Side Cards -->
          <template v-for="product in sideProducts" :key="product.id">
            <div class="featured-card">
              <div class="featured-card-image">
                <img
                  v-if="getPrimaryImage(product)"
                  :src="getPrimaryImage(product)"
                  :alt="product.name"
                  class="product-img"
                />
                <div v-else class="img-placeholder">📦</div>
              </div>
              <div class="featured-card-body">
                <div>
                  <span class="product-category">{{
                    product.category?.name
                  }}</span>
                  <h3 class="product-name">{{ product.name }}</h3>
                  <p class="card-desc">{{ product.description }}</p>
                </div>
                <div class="card-footer-row">
                  <div class="product-price">
                    <span class="currency">S/ </span
                    >{{ product.price.toFixed(2) }}
                  </div>
                  <LandingAppButton
                    variant="wa"
                    size="sm"
                    :href="
                      waLink(`Hola, me interesa el producto: ${product.name}`)
                    "
                    target="_blank"
                  >
                    <LandingWaIcon :size="16" /> Consultar
                  </LandingAppButton>
                </div>
              </div>
            </div>
          </template>
        </template>
        <div v-else class="empty-state">No hay productos disponibles</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.featured {
  --magenta: #b01883;
  --magenta-dark: #7a0f5c;
  --magenta-soft: rgba(176, 24, 131, 0.08);

  --yellow: #f7d21e;

  --text-title: #2b2b2b;
  --text-muted: #777;

  --bg: #ffffff;
  --bg-alt: #fafafa;
  --border: #eeeeee;

  --radius: 18px;
  --radius-lg: 26px;

  --shadow-sm: 0 10px 30px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 20px 60px rgba(0, 0, 0, 0.08);

  padding: 120px 40px;
  background: var(--bg-alt);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.featured-header {
  text-align: center;
  margin-bottom: 48px;
}

.featured-tabs {
  display: flex;
  justify-content: center;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 4px;
  width: fit-content;
  margin: 0 auto 48px;
}

.featured-tab {
  padding: 0.5rem 1.2rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  color: var(--text-muted);
  border: none;
  background: none;
  transition: 0.2s;
}

.featured-tab.active {
  background: var(--magenta);
  color: #fff;
}

.featured-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 28px;
}

.featured-card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-sm);
  transition: 0.25s;
}

.featured-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-md);
}

.featured-card--hero {
  flex-direction: row;
}

.featured-card-image {
  width: 100%;
  aspect-ratio: 1;
  background: var(--magenta-soft);
}

.featured-card--hero .featured-card-image {
  width: 50%;
  aspect-ratio: auto;
}

.img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
}

.featured-card:hover .product-img {
  transform: scale(1.05);
}

.featured-card-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  flex: 1;
}

.product-category {
  font-size: 0.7rem;
  text-transform: uppercase;
  color: var(--magenta);
  font-weight: 700;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-title);
}

.featured-card--hero .product-name {
  font-size: 1.4rem;
}

.card-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.card-footer-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.product-price {
  font-weight: 700;
  color: var(--magenta);
  margin-right: auto;
}

.currency {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.section-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--magenta);
  font-weight: 700;
}

.section-title {
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 800;
  color: var(--text-title);
}

.accent-dot {
  width: 6px;
  height: 6px;
  background: var(--yellow);
  display: inline-block;
  border-radius: 50%;
  margin-left: 4px;
}

.section-subtitle {
  color: var(--text-muted);
  max-width: 520px;
  margin: 0 auto;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: var(--text-muted);
  font-size: 1rem;
}

@media (max-width: 900px) {
  .featured-grid {
    grid-template-columns: 1fr 1fr;
  }

  .featured-card--hero {
    grid-column: span 2;
    flex-direction: column;
  }

  .featured-card--hero .featured-card-image {
    width: 100%;
    aspect-ratio: 16 / 9;
  }
}

@media (max-width: 600px) {
  .featured {
    padding: 90px 18px;
  }

  .featured-grid {
    grid-template-columns: 1fr;
  }

  .featured-card--hero {
    grid-column: span 1;
  }
}
</style>
