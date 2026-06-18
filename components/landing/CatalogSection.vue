<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  category?: { name: string } | null;
  images?: Array<{ id: number; url: string; isPrimary: boolean }>;
  isFeatured?: boolean;
}

interface CatalogCategoriesResponse {
  data: Category[];
}

interface CatalogProductsResponse {
  data: Product[];
}

const categories = ref<Category[]>([]);
const activeCategory = ref<string | null>(null);
const products = ref<Product[]>([]);
const loadingCategories = ref(false);
const loadingProducts = ref(false);

onMounted(async () => {
  try {
    loadingCategories.value = true;
    const { data } = await $fetch<CatalogCategoriesResponse>(
      "/api/landing/catalog-categories",
    );
    categories.value = data || [];
  } catch (error) {
    console.error("Error cargando categorías:", error);
  } finally {
    loadingCategories.value = false;
  }
});

const fetchProducts = async (categorySlug: string | null) => {
  try {
    loadingProducts.value = true;
    const params = new URLSearchParams();
    if (categorySlug !== null) {
      params.append("categorySlug", categorySlug);
    }
    const queryString = params.toString();
    const url = queryString
      ? `/api/landing/catalog-products?${queryString}`
      : "/api/landing/catalog-products";

    const { data } = await $fetch<CatalogProductsResponse>(url);
    products.value = data || [];
  } catch (error) {
    console.error("Error cargando productos:", error);
    products.value = [];
  } finally {
    loadingProducts.value = false;
  }
};

const visibleProducts = computed(() => products.value.slice(0, 4));

const productsPageLink = computed(() => {
  const query: Record<string, string> = { source: "landing-catalog" };
  if (activeCategory.value !== null) {
    query.categoria = activeCategory.value;
  }
  return { path: "/productos", query };
});

watch(activeCategory, (newCategoryId) => fetchProducts(newCategoryId), {
  immediate: true,
});
</script>

<template>
  <section class="catalog" id="catalogo">
    <div class="container">
      <!-- Header -->
      <div class="catalog-header">
        <div class="catalog-header-left">
          <span class="section-label">Catálogo</span>
          <h2 class="section-title">
            Nuestros productos<span class="accent-dot" />
          </h2>
          <p class="section-subtitle">
            Utensilios seleccionados para hacer de tu cocina un espacio más
            funcional y agradable.
          </p>
        </div>
        <LandingAppButton variant="primary" href="/productos">
          Ver catálogo completo
        </LandingAppButton>
      </div>

      <!-- Filtros -->
      <div class="catalog-filters">
        <button
          class="filter-btn"
          :class="{ active: activeCategory === null }"
          @click="activeCategory = null"
        >
          Todos
        </button>
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="filter-btn"
          :class="{ active: activeCategory === cat.slug }"
          @click="activeCategory = cat.slug"
        >
          {{ cat.name }}
        </button>
      </div>

      <!-- Grid de productos -->
      <div class="products-grid">
        <template v-if="loadingProducts">
          <EcommerceSkeletonProductCard :count="4" />
        </template>
        <template v-else-if="products.length === 0">
          <div class="empty-state">
            <span>No hay productos en esta categoría</span>
          </div>
        </template>
        <template v-else>
          <EcommerceTarjetaProducto
            v-for="product in visibleProducts"
            :key="product.id"
            :product="product"
          />
        </template>
      </div>

      <!-- Ver todos -->
      <div v-if="products.length > 4" class="catalog-footer">
        <NuxtLink :to="productsPageLink" class="show-all-btn">
          Mostrar todos
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.catalog {

  --text-title: var(--text-primary);
  --text-muted: var(--text-muted);

  --bg: #F8F7F4;
  --bg-alt: #F1EFEA;
  --border: #E2E0D9;

  --shadow-sm: 0 10px 30px rgba(17, 17, 17, 0.05);
  --shadow-md: 0 20px 60px rgba(17, 17, 17, 0.08);

  --radius: 18px;

  padding: 120px 32px;
  background: linear-gradient(180deg, var(--bg) 0%, var(--bg-alt) 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* ── Header ── */
.catalog-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 32px;
  flex-wrap: wrap;
  margin-bottom: 28px;
  padding: 20px 22px;
  border: 1px solid var(--border-light);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.56);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 6px 20px rgba(17, 17, 17, 0.03), inset 0 1px 0 rgba(255,255,255,0.4);
}

.catalog-header-left {
  max-width: 440px;
}

.section-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  color: var(--cp-electric);
  font-weight: 700;
  letter-spacing: 0.1em;
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.section-label::before,
.section-label::after {
  content: "";
  display: inline-block;
  width: 12px;
  height: 1.5px;
  background: var(--cp-electric);
  border-radius: 2px;
}

.section-title {
  font-size: clamp(1.35rem, 2.6vw, 2rem);
  font-weight: 700;
  color: var(--text-title);
  margin: 0.2rem 0 0;
  line-height: 1.15;
}

.accent-dot {
  width: 5px;
  height: 5px;
  background: var(--cp-sky);
  display: inline-block;
  border-radius: 50%;
  margin-left: 4px;
  vertical-align: middle;
}

.section-subtitle {
  color: var(--text-muted);
  margin-top: 8px;
  max-width: 520px;
  line-height: 1.45;
  font-size: 0.94rem;
}

/* ── Filtros ── */
.catalog-filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 28px;
}

.filter-btn {
  padding: 0.4rem 1rem;
  border-radius: 999px;
  border: 1px solid var(--border-light);
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
  color: var(--text-title);
  box-shadow: 0 2px 8px rgba(17, 17, 17, 0.02), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.filter-btn:hover {
  border-color: var(--cp-electric);
  color: var(--cp-electric);
}

.filter-btn.active {
  background: var(--cp-electric);
  color: #fff;
  border-color: var(--cp-electric);
}

/* ── Grid ── */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
  align-items: stretch;
}

/* ── Estados ── */
.loading-state,
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 40px;
  color: var(--text-muted);
  font-size: 1rem;
}

/* ── Footer ── */
.catalog-footer {
  margin-top: 28px;
  display: flex;
  justify-content: center;
}

.show-all-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 22px;
  border-radius: 999px;
  background: var(--cp-electric);
  color: #fff;
  font-size: 0.84rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.show-all-btn:hover {
  background: var(--cp-blue);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(45, 106, 79, 0.28);
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .catalog {
    padding: 90px 24px;
  }

  .catalog-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 22px;
    padding: 18px 18px;
  }
}

@media (max-width: 640px) {
  .catalog {
    padding: 80px 18px;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
}

@media (max-width: 380px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
