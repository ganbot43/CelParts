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
/* ═══════════════════════════════════
   KITE — NUEVOS LANZAMIENTOS
═══════════════════════════════════ */
.catalog {
  padding: 110px 40px;
  background:
    linear-gradient(
      to bottom,
      var(--brand-bg) 0%,
      #ffffff 100%
    );
  position: relative;
  overflow: hidden;
}

.catalog::before {
  content: "";
  position: absolute;
  top: -180px;
  right: -120px;
  width: 420px;
  height: 420px;
  background:
    radial-gradient(
      circle,
      rgba(45, 106, 79, 0.08) 0%,
      transparent 70%
    );
  pointer-events: none;
}

.container {
  max-width: 1240px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* ═══════════════════════════════════
   HEADER
═══════════════════════════════════ */
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
  max-width: 620px;
}

/* Label */
.section-label {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  width: fit-content;

  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;

  color: var(--brand-primary);
}

.section-label::before {
  content: "";
  width: 26px;
  height: 1.5px;
  border-radius: 999px;
  background: var(--brand-primary);
}

/* Title */
.section-title {
  margin: 0;

  font-size: clamp(2rem, 4vw, 3.1rem);
  line-height: 1.05;
  letter-spacing: -0.045em;
  font-weight: 800;

  color: var(--brand-black);
}

.section-title span {
  color: var(--brand-primary);
}

.accent-dot {
  width: 8px;
  height: 8px;
  margin-left: 6px;
  border-radius: 999px;
  display: inline-block;
  background: var(--brand-accent);
  vertical-align: middle;
  position: relative;
  top: -4px;

  box-shadow: 0 0 18px rgba(231, 111, 81, 0.45);
}

/* Subtitle */
.section-subtitle {
  margin: 0;

  font-size: 0.98rem;
  line-height: 1.75;
  color: var(--brand-text-muted);

  max-width: 520px;
}

/* ═══════════════════════════════════
   BUTTONS
═══════════════════════════════════ */
.show-all-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  padding: 0.9rem 1.55rem;

  border-radius: 999px;
  border: 1px solid transparent;

  background: var(--brand-black);
  color: white;

  text-decoration: none;

  font-size: 0.88rem;
  font-weight: 600;
  letter-spacing: -0.01em;

  transition:
    transform 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.show-all-btn svg {
  transition: transform 0.18s ease;
}

.show-all-btn:hover {
  background: var(--brand-primary);
  box-shadow: 0 10px 30px rgba(45, 106, 79, 0.18);
  transform: translateY(-2px);
}

.show-all-btn:hover svg {
  transform: translateX(2px);
}

/* Header version */
.show-all-btn--header {
  background: rgba(255,255,255,0.78);
  color: var(--brand-text);

  border: 1px solid rgba(17,17,17,0.08);

  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  box-shadow:
    0 2px 10px rgba(17,17,17,0.04);
}

.show-all-btn--header:hover {
  color: white;
  border-color: transparent;
}

/* ═══════════════════════════════════
   GRID
═══════════════════════════════════ */
.products-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 22px;
  align-items: stretch;
}

/* ═══════════════════════════════════
   FOOTER
═══════════════════════════════════ */
.catalog-footer {
  margin-top: 54px;
  display: flex;
  justify-content: center;
}

/* Desktop */
@media (min-width: 641px) {
  .catalog-footer {
    display: none;
  }
}

/* ═══════════════════════════════════
   RESPONSIVE
═══════════════════════════════════ */
@media (max-width: 1100px) {
  .catalog {
    padding: 92px 32px;
  }

  .products-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 860px) {
  .catalog-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .show-all-btn--header {
    display: none;
  }

  .products-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .catalog {
    padding: 74px 18px;
  }

  .catalog-header {
    margin-bottom: 36px;
    gap: 18px;
  }

  .catalog-header-left {
    gap: 10px;
  }

  .section-title {
    font-size: clamp(1.9rem, 9vw, 2.4rem);
  }

  .section-subtitle {
    font-size: 0.92rem;
    line-height: 1.65;
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