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

        <!-- Enlace Ver todos — desktop -->
        <NuxtLink
          v-if="totalProducts > 0"
          :to="productsPageLink"
          class="catalog-btn catalog-btn--ghost"
        >
          Ver todos
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.6"
              stroke-linecap="round" stroke-linejoin="round" />
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
          <EcommerceTarjetaProducto
            v-for="product in products"
            :key="product.id"
            :product="product"
          />
        </template>
      </div>

      <!-- Ver todos — mobile -->
      <div v-if="totalProducts > 0" class="catalog-footer">
        <NuxtLink :to="productsPageLink" class="catalog-btn catalog-btn--primary">
          Ver todos los lanzamientos
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.6"
              stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </NuxtLink>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* ═══════════════════════════════════
   NUEVOS LANZAMIENTOS — CELPARTS TECH DARK
═══════════════════════════════════ */
.catalog {
  --cp-cyan:         #00AEEF;
  --cp-cyan-dark:    #0077C8;
  --cp-cyan-light:   #50D0FF;
  --cp-ice:          #A8EDFF;
  --cp-white:        #FFFFFF;
  --cp-text:         rgba(168, 237, 255, 0.82);
  --cp-border:       rgba(0, 174, 239, 0.18);
  --cp-border-hover: rgba(0, 174, 239, 0.45);

  position: relative;
  overflow: hidden;
  background: transparent;
  padding: 110px 40px;
}

/* ═══════════════════════════════════
   CONTAINER
═══════════════════════════════════ */
.catalog-container {
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

.catalog-header__left {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 650px;
}

.catalog-label {
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

.catalog-label::before {
  content: "";
  width: 26px;
  height: 1.5px;
  border-radius: 999px;
  background: var(--cp-cyan);
}

.catalog-title {
  margin: 0;
  color: var(--cp-white);
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.05em;
}

.catalog-title__dot {
  width: 8px;
  height: 8px;
  margin-left: 6px;
  border-radius: 50%;
  display: inline-block;
  background: var(--cp-cyan);
  position: relative;
  top: -4px;
  box-shadow: 0 0 16px rgba(0, 174, 239, 0.80);
}

.catalog-subtitle {
  margin: 0;
  max-width: 560px;
  color: var(--cp-text);
  font-size: 1rem;
  line-height: 1.8;
}

/* ═══════════════════════════════════
   BOTONES
═══════════════════════════════════ */
.catalog-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0.95rem 1.6rem;
  border-radius: 999px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 700;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.catalog-btn svg {
  transition: transform 0.2s ease;
}

.catalog-btn:hover svg {
  transform: translateX(3px);
}

.catalog-btn:hover {
  transform: translateY(-2px);
}

/* Primario — gradiente cyan */
.catalog-btn--primary {
  background: linear-gradient(135deg, var(--cp-cyan), var(--cp-cyan-dark));
  color: var(--cp-white);
  border: 1px solid rgba(80, 208, 255, 0.25);
  box-shadow:
    0 10px 30px rgba(0, 174, 239, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.catalog-btn--primary:hover {
  box-shadow:
    0 16px 42px rgba(0, 174, 239, 0.45),
    0 0 0 1px rgba(0, 174, 239, 0.50);
}

/* Ghost — glass transparente */
.catalog-btn--ghost {
  background: rgba(0, 174, 239, 0.07);
  color: var(--cp-ice);
  border: 1px solid var(--cp-border);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.catalog-btn--ghost:hover {
  background: var(--cp-cyan);
  border-color: var(--cp-cyan);
  color: var(--cp-white);
  box-shadow: 0 0 22px rgba(0, 174, 239, 0.45);
}

/* ═══════════════════════════════════
   GRID
═══════════════════════════════════ */
.catalog-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 22px;
  align-items: stretch;
}

/* ═══════════════════════════════════
   FOOTER
═══════════════════════════════════ */
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

/* ═══════════════════════════════════
   RESPONSIVE
═══════════════════════════════════ */
@media (max-width: 1100px) {
  .catalog {
    padding: 90px 30px;
  }

  .catalog-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 860px) {
  .catalog-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .catalog-btn--ghost {
    display: none;
  }

  .catalog-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
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

  .catalog-title {
    font-size: clamp(2rem, 9vw, 2.6rem);
  }

  .catalog-subtitle {
    font-size: 0.93rem;
  }

  .catalog-grid {
    gap: 14px;
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

  .catalog {
    padding-inline: 16px;
  }
}
</style>