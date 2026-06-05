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
    <div class="catalog-container">

      <!-- Header -->
      <div class="catalog-header">
        <div class="catalog-header__left">
          <span class="catalog-label">Nuevos</span>
          <h2 class="catalog-title">
            Nuevos lanzamientos<span class="catalog-title__dot" />
          </h2>
          <p class="catalog-subtitle">
            Descubre las últimas incorporaciones a nuestro catálogo.
          </p>
        </div>

        <!-- Ver todos — desktop -->
        <NuxtLink v-if="totalProducts > 0" :to="productsPageLink" class="catalog-btn catalog-btn--ghost">
          Ver todos
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </NuxtLink>
      </div>

      <!-- Grid -->
      <div class="catalog-grid">
        <template v-if="loadingProducts">
          <EcommerceSkeletonProductCard :count="4" />
        </template>
        <template v-else-if="products.length === 0">
          <LandingNuevosLanzamientosEmptyState />
        </template>
        <template v-else>
          <EcommerceTarjetaProducto v-for="product in products" :key="product.id" :product="product" />
        </template>
      </div>

      <!-- Ver todos — mobile -->
      <div v-if="totalProducts > 0" class="catalog-footer">
        <NuxtLink :to="productsPageLink" class="catalog-btn catalog-btn--primary">
          Ver todos los lanzamientos
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </NuxtLink>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* ═══════════════════════════════════
   NUEVOS LANZAMIENTOS — CELPARTS
   Design system: hero + benefits pattern
   100% tokens de main.css — sin hardcode
═══════════════════════════════════ */

/* ── Sección ── */
.catalog {
  position: relative;
  overflow: hidden;
  background: var(--bg-page);
  padding: clamp(80px, 8vw, 120px) 0;
}

/* Fondo degradado sutil igual que benefits */
.catalog::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 80% 60% at 50% 0%,
    var(--cp-frost) 0%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 0;
}

/* Línea técnica de marca superior */
.catalog::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--line-brand);
  z-index: 1;
}

/* ── Container ── */
.catalog-container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 var(--space-8);
  position: relative;
  z-index: 2;
}

/* ── Header ── */
.catalog-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: var(--space-8);
  flex-wrap: wrap;
  margin-bottom: var(--space-12);
}

.catalog-header__left {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-width: 650px;
}

/* Label — mismo estilo que benefits */
.catalog-label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  width: fit-content;
  color: var(--cp-electric);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.catalog-label::before,
.catalog-label::after {
  content: "";
  width: 20px;
  height: 1px;
  background: var(--cp-electric);
  opacity: 0.5;
}

/* Título */
.catalog-title {
  margin: 0;
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 4.5vw, 3.6rem);
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -0.045em;
}

.catalog-title__dot {
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

/* Subtítulo */
.catalog-subtitle {
  margin: 0;
  max-width: 560px;
  color: var(--text-muted);
  font-size: 1rem;
  line-height: 1.8;
}

/* ── Botón "Ver todos" — desktop (ghost) ── */
.catalog-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  height: 44px;
  padding: 0 var(--space-6);
  border-radius: var(--r-pill);
  text-decoration: none;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 700;
  transition:
    transform var(--t-fast) var(--ease-snappy),
    box-shadow var(--t-base) var(--ease-smooth),
    background var(--t-base) var(--ease-smooth),
    border-color var(--t-base) var(--ease-smooth),
    color var(--t-base) var(--ease-smooth);
}

.catalog-btn svg {
  transition: transform var(--t-base) var(--ease-snappy);
}

.catalog-btn:hover svg {
  transform: translateX(4px);
}

.catalog-btn:hover {
  transform: translateY(-2px);
}

.catalog-btn--primary {
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
  border: none;
  box-shadow: 0 2px 10px rgba(7, 30, 82, 0.18);
}

.catalog-btn--primary:hover {
  background: var(--btn-primary-hover);
  box-shadow: 0 6px 22px rgba(7, 30, 82, 0.26);
  color: var(--btn-primary-text);
}

.catalog-btn--ghost {
  background: var(--bg-surface);
  color: var(--text-body);
  border: 1px solid var(--border-light);
  box-shadow: var(--card-shadow-sm);
}

.catalog-btn--ghost:hover {
  background: var(--bg-alt);
  border-color: var(--border-mid);
  color: var(--text-primary);
}

/* ── Grid de productos ── */
.catalog-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-6);
  align-items: stretch;
}

/* ── Footer — botón centrado en mobile ── */
.catalog-footer {
  display: flex;
  justify-content: center;
  margin-top: var(--space-12);
}

@media (min-width: 641px) {
  .catalog-footer {
    display: none;
  }
}

/* ═══════════════════════════════════
   RESPONSIVE
═══════════════════════════════════ */
@media (max-width: 1280px) {
  .catalog-container {
    padding: 0 var(--space-10);
  }
}

@media (max-width: 1100px) {
  .catalog-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 860px) {
  .catalog-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-5);
  }

  .catalog-btn--ghost {
    display: none;
  }

  .catalog-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-5);
  }
}

@media (max-width: 640px) {
  .catalog-header {
    margin-bottom: var(--space-8);
  }

  .catalog-title {
    font-size: clamp(2rem, 9vw, 2.6rem);
  }

  .catalog-subtitle {
    font-size: 0.93rem;
  }

  .catalog-grid {
    gap: var(--space-4);
  }

  .catalog-footer {
    display: flex;
  }

  .catalog-btn {
    width: 100%;
  }
}

@media (max-width: 420px) {
  .catalog-grid {
    grid-template-columns: 1fr;
  }

  .catalog-container {
    padding: 0 var(--space-5);
  }
}
</style>