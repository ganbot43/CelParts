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
      "/api/landing/nuevos-lanzamientos?limit=4"
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
  query: { nuevoLanzamiento: "1", page: "1", limit: "24" },
};
</script>

<template>
  <section class="catalog" id="nuevos-lanzamientos">
    <div class="container">

      <!-- Header -->
      <div class="catalog-header">
        <div class="catalog-header-left">
          <span class="section-label">Nuevos</span>
          <h2 class="section-title">
            Nuevos lanzamientos<span class="accent-dot" />
          </h2>
          <p class="section-subtitle">
            Descubre las últimas incorporaciones a nuestro catálogo.
          </p>
        </div>

        <!-- Enlace Ver todos — desktop -->
        <NuxtLink
          v-if="totalProducts > 0"
          :to="productsPageLink"
          class="show-all-btn show-all-btn--header"
        >
          Ver todos
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </NuxtLink>
      </div>

      <!-- Grid -->
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

      <!-- Ver todos — mobile / centrado -->
      <div v-if="totalProducts > 0" class="catalog-footer">
        <NuxtLink :to="productsPageLink" class="show-all-btn">
          Ver todos los lanzamientos
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </NuxtLink>
      </div>

    </div>
  </section>
</template>

<style scoped>
.catalog {
  --cp-bg: #0A0A0A;
  --cp-cyan: #00AEEF;
  --cp-cyan-dark: #0077C8;
  --cp-cyan-light: #50D0FF;
  --cp-ice: #A8EDFF;
  --cp-white: #FFFFFF;
  --cp-text: rgba(168, 237, 255, 0.82);
  --cp-border: rgba(0, 174, 239, 0.2);

  position: relative;
  overflow: hidden;

  padding: 110px 40px;

  background:
    radial-gradient(circle at top right,
      rgba(0, 174, 239, 0.12),
      transparent 35%),
    radial-gradient(circle at bottom left,
      rgba(0, 63, 138, 0.18),
      transparent 40%),
    var(--cp-bg);
}

.catalog::before {
  content: "";
  position: absolute;
  inset: 0;

  background-image:
    linear-gradient(rgba(0,174,239,.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,174,239,.03) 1px, transparent 1px);

  background-size: 64px 64px;
  pointer-events: none;
}

.container {
  max-width: 1240px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

/* HEADER */

.catalog-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 28px;
  flex-wrap: wrap;

  margin-bottom: 54px;
}

.catalog-header-left {
  display: flex;
  flex-direction: column;
  gap: 12px;

  max-width: 650px;
}

.section-label {
  display: inline-flex;
  align-items: center;
  gap: 10px;

  width: fit-content;

  color: var(--cp-cyan-light);

  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.section-label::before {
  content: "";
  width: 26px;
  height: 1.5px;
  border-radius: 999px;
  background: var(--cp-cyan);
}

.section-title {
  margin: 0;

  color: var(--cp-white);

  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.05em;
}

.accent-dot {
  width: 8px;
  height: 8px;

  margin-left: 6px;

  border-radius: 50%;
  display: inline-block;

  background: var(--cp-cyan);

  position: relative;
  top: -4px;

  box-shadow:
    0 0 16px rgba(0,174,239,.8);
}

.section-subtitle {
  margin: 0;

  max-width: 560px;

  color: var(--cp-text);

  font-size: 1rem;
  line-height: 1.8;
}

/* BOTONES */

.show-all-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  padding: .95rem 1.6rem;

  border-radius: 999px;

  text-decoration: none;

  font-size: .9rem;
  font-weight: 700;

  transition:
    transform .2s ease,
    box-shadow .2s ease,
    background .2s ease;

  background:
    linear-gradient(
      135deg,
      var(--cp-cyan),
      var(--cp-cyan-dark)
    );

  color: white;

  border: 1px solid rgba(80,208,255,.25);

  box-shadow:
    0 10px 30px rgba(0,174,239,.25);
}

.show-all-btn:hover {
  transform: translateY(-2px);

  box-shadow:
    0 16px 42px rgba(0,174,239,.45);
}

.show-all-btn svg {
  transition: transform .2s ease;
}

.show-all-btn:hover svg {
  transform: translateX(3px);
}

.show-all-btn--header {
  background: rgba(0,174,239,.08);

  color: var(--cp-ice);

  border: 1px solid rgba(0,174,239,.2);

  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  box-shadow: none;
}

.show-all-btn--header:hover {
  background: var(--cp-cyan);
  color: white;
}

/* GRID */

.products-grid {
  display: grid;

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  gap: 22px;

  align-items: stretch;
}

/* FOOTER */

.catalog-footer {
  display: flex;
  justify-content: center;

  margin-top: 56px;
}

@media (min-width: 641px) {
  .catalog-footer {
    display: none;
  }
}

/* TABLET */

@media (max-width: 1100px) {
  .catalog {
    padding: 90px 30px;
  }

  .products-grid {
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
  }
}

/* MOBILE */

@media (max-width: 860px) {
  .catalog-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .show-all-btn--header {
    display: none;
  }

  .products-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .catalog {
    padding: 75px 18px;
  }

  .catalog-header {
    gap: 18px;
    margin-bottom: 38px;
  }

  .section-title {
    font-size:
      clamp(2rem, 9vw, 2.6rem);
  }

  .section-subtitle {
    font-size: .93rem;
  }

  .products-grid {
    gap: 14px;
  }

  .catalog-footer {
    display: flex;
  }

  .show-all-btn {
    width: 100%;
  }
}

@media (max-width: 420px) {
  .products-grid {
    grid-template-columns: 1fr;
  }

  .catalog {
    padding-inline: 16px;
  }
}
</style>