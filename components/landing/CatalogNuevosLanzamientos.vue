<script setup lang="ts">
import { ref, onMounted } from "vue";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  category?: { name: string } | null;
  images?: Array<{ id: number; url: string; isPrimary: boolean }>;
  isFeatured?: boolean;
}

interface CatalogProductsResponse {
  data: Product[];
  total: number;
}
const products = ref<Product[]>([]);
const totalProducts = ref(0);
const loadingProducts = ref(false);
const fetchNuevoLanzamientos = async () => {
  try {
    loadingProducts.value = true;
    const response = await $fetch<CatalogProductsResponse>(
      "/api/landing/nuevos-lanzamientos?limit=4",
    );
    products.value = response.data || [];
    totalProducts.value = response.total ?? response.data?.length ?? 0;
  } catch (error) {
    console.error("Error cargando nuevos lanzamientos:", error);
    products.value = [];
    totalProducts.value = 0;
  } finally {
    loadingProducts.value = false;
  }
};

onMounted(async () => {
  await fetchNuevoLanzamientos();
});

const productsPageLink = {
  path: "/productos",
  query: {
    nuevoLanzamiento: "1",
    page: "1",
    limit: "24",
  },
};
</script>

<template>
  <section class="catalog" id="nuevos-lanzamientos">
    <div class="container">
      <!-- Header -->
      <div class="catalog-header">
        <div class="catalog-header-left">
          <!-- <span class="section-label">Nuevos</span> -->
          <h2 class="section-title">
            Nuevos lanzamientos<span class="accent-dot" />
          </h2>
          <p class="section-subtitle">
            Descubre las últimas incorporaciones a nuestro catálogo.
          </p>
        </div>
      </div>

      <!-- filtros y tabs removidos (mostrar solo nuevos lanzamientos) -->

      <!-- Grid de productos -->
      <div class="products-grid">
        <template v-if="loadingProducts">
          <EcommerceSkeletonProductCard :count="4" />
        </template>
        <template v-else-if="products.length === 0">
          <LandingNuevosLanzamientosEmptyState />
        </template>
        <template v-else>
          <EcommerceTarjetaProducto
            v-for="product in products"
            :key="product.id"
            :product="product"
          />
        </template>
      </div>

      <!-- Ver todos -->
      <div v-if="totalProducts > 0" class="catalog-footer">
        <NuxtLink :to="productsPageLink" class="show-all-btn">
          Ver todos
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.catalog {
  --magenta: #b01883;
  --magenta-dark: #7a0f5c;

  --yellow: #f7d21e;

  --text-title: #2b2b2b;
  --text-muted: #777;

  --bg: #ffffff;
  --bg-alt: #ffffff;
  --border: #eeeeee;

  --shadow-sm: 0 10px 30px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 20px 60px rgba(0, 0, 0, 0.08);

  --radius: 18px;

  padding: 60px 40px;
  background: #ffffff;
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
  margin-bottom: 56px;
}

.catalog-header-left {
  max-width: 520px;
}

.section-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--magenta);
  font-weight: 700;
  letter-spacing: 0.08em;
}

.section-title {
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 800;
  color: var(--text-title);
  margin: 0.25rem 0 0;
}

.accent-dot {
  width: 6px;
  height: 6px;
  background: var(--yellow);
  display: inline-block;
  border-radius: 50%;
  margin-left: 4px;
  vertical-align: middle;
}

.section-subtitle {
  color: var(--text-muted);
  margin-top: 10px;
  max-width: 520px;
  line-height: 1.6;
}

/* ── Filtros ── */
.catalog-filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 44px;
}

.filter-btn {
  padding: 0.5rem 1.2rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    color 0.2s ease;
  color: var(--text-title);
}

.filter-btn:hover {
  border-color: var(--magenta);
  color: var(--magenta);
}

.filter-btn.active {
  background: var(--magenta);
  color: #fff;
  border-color: var(--magenta);
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
  margin-top: 48px;
  display: flex;
  justify-content: center;
}

.show-all-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 28px;
  border-radius: 999px;
  background: var(--magenta);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.show-all-btn:hover {
  background: var(--magenta-dark);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(176, 24, 131, 0.28);
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
    margin-bottom: 36px;
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
