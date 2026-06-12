<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

// Define simplified product interface
interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  category?: { name: string } | null;
  images?: Array<{ id: number; url: string; isPrimary: boolean }>;
  material?: string;
  sizeLength?: number;
  sizeWidth?: number;
  sizeUnit?: string;
  offersPattern?: number;
  sellerId?: number;
  sellerName?: string;
  sellerPhone?: string;
  description?: string;
  stock?: number;
  createdAt?: string;
}


const searchQuery = ref("");
const debouncedSearchQuery = ref("");
const filterMaterial = ref("");
const filterSize = ref("");
const filterPattern = ref("");
const sortBy = ref("");

// Debounce para la búsqueda de texto
let searchTimeout: ReturnType<typeof setTimeout>;
watch(searchQuery, (newVal) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    debouncedSearchQuery.value = newVal;
  }, 500);
});

// Modal state
const isModalOpen = ref(false);
const selectedProduct = ref<Product | null>(null);

const openModal = (product: Product) => {
  selectedProduct.value = product;
  isModalOpen.value = true;
};

// Mock fetch or actual API using useAsyncData for SSR and Reactivity
const { data: rawProducts, pending: loading } = await useAsyncData(
  'catalog-products',
  () => {
    const query: Record<string, string> = {};
    if (debouncedSearchQuery.value) query.q = debouncedSearchQuery.value;
    if (filterMaterial.value) query.material = filterMaterial.value;
    if (filterSize.value) query.size = filterSize.value;
    if (filterPattern.value) query.pattern = filterPattern.value;
    if (sortBy.value) query.sort = sortBy.value;

    return $fetch<{ data: Product[] }>("/api/products", { query });
  },
  {
    watch: [debouncedSearchQuery, filterMaterial, filterSize, filterPattern, sortBy],
    server: false, // Habilitar SSR (SEO-friendly) - Desactivado temporalmente para evitar problemas con el proxy en el servidor
  }
);

const { data: materialsData } = await useFetch<Array<{ name: string; slug: string }>>("/api/materials");
const materials = computed(() => materialsData.value || []);

// Fallbacks computed
const products = computed(() => {
  return (rawProducts.value?.data || []).map(p => ({
    ...p,
    material: p.material || 'Lana Alpaca',
    sizeLength: p.sizeLength || 30,
    sizeWidth: p.sizeWidth || 30,
    sizeUnit: p.sizeUnit || 'cm',
    offersPattern: p.offersPattern !== undefined ? p.offersPattern : 1,
    sellerName: p.sellerName || 'Clara Gisbert',
    sellerPhone: p.sellerPhone || '+51999999999',
    description: p.description || 'Hermoso tejido a mano con dedicación.',
    stock: p.stock || 1
  }));
});
</script>

<template>
  <section class="catalog-section section">
    <div class="container">
      
      <!-- SEARCH & FILTERS BAR -->
      <div class="catalog-toolbar">
        <div class="search-box-container">
          <span class="search-icon">🔍 🧶</span>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="¿Qué tapete de lana o tejido estás buscando hoy? (Ej: Girasoles, Clara...)" 
            class="search-input"
          />
        </div>
        
        <div class="toolbar-divider"></div>
        
        <div class="filters-grid">
          <!-- Filter 1 -->
          <div class="filter-col">
            <label>🧵 HILO / MATERIAL</label>
            <div class="select-wrapper">
              <span class="select-icon">🧶</span>
              <select v-model="filterMaterial" class="custom-select">
                <option value="">Todos los materiales</option>
                <option v-for="mat in materials" :key="mat.slug" :value="mat.slug">{{ mat.name }}</option>
              </select>
            </div>
          </div>
          
          <!-- Filter 2 -->
          <div class="filter-col">
            <label>📐 RANGO DE TAMAÑO</label>
            <div class="select-wrapper">
              <span class="select-icon">📏</span>
              <select v-model="filterSize" class="custom-select">
                <option value="">Cualquier tamaño</option>
                <option value="pequeno">Pequeño</option>
                <option value="mediano">Mediano</option>
                <option value="grande">Grande</option>
              </select>
            </div>
          </div>

          <!-- Filter 3 -->
          <div class="filter-col">
            <label>📄 ¿OFRECE PATRÓN?</label>
            <div class="select-wrapper">
              <span class="select-icon">📦</span>
              <select v-model="filterPattern" class="custom-select">
                <option value="">Ambos (Con o sin patrón)</option>
                <option value="si">Solo con Patrón</option>
              </select>
            </div>
          </div>

          <!-- Filter 4 -->
          <div class="filter-col">
            <label>⇅ ORDENAR POR</label>
            <div class="select-wrapper">
              <span class="select-icon">⏰</span>
              <select v-model="sortBy" class="custom-select">
                <option value="">Más Recientes Primero</option>
                <option value="precio_menor">Menor Precio</option>
                <option value="precio_mayor">Mayor Precio</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- RESULTS HEADER -->
      <div class="results-header">
        <div class="results-title-group">
          <h2>✨ Tapetes en exhibición</h2>
          <span class="results-badge">{{ products.length }} disponibles</span>
        </div>
        <span class="results-hint">Haz clic en cualquier tarjeta para ver más detalles</span>
      </div>

      <!-- GRID -->
      <div class="products-grid">
        <template v-if="loading">
          <div class="loading-state">Cargando tejidos hermosos...</div>
        </template>
        <template v-else-if="products.length === 0">
          <div class="empty-state">No se encontraron tejidos con esos filtros.</div>
        </template>
        <template v-else>
          <EcommerceTarjetaProducto
            v-for="product in products"
            :key="product.id"
            :product="product"
            @select="openModal"
          />
        </template>
      </div>

      <EcommerceModalDetalleTejido 
        :is-open="isModalOpen" 
        @update:is-open="isModalOpen = $event"
        :product="selectedProduct || {}" 
      />
    </div>
  </section>
</template>

<style scoped>
.catalog-section {
  padding-top: var(--space-8);
  padding-bottom: var(--space-16);
}

/* ── TOOLBAR ── */
.catalog-toolbar {
  background: #ffffff;
  padding: 24px;
  border-radius: 24px;
  border: 1px solid var(--cp-border);
  display: flex;
  flex-direction: column;
  margin-bottom: var(--space-8);
  box-shadow: 0 8px 30px rgba(0,0,0,0.03);
}

.search-box-container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border: 1.5px solid var(--cp-border-mid);
  border-radius: var(--r-pill);
  transition: border-color var(--t-fast);
}
.search-box-container:focus-within {
  border-color: var(--cp-sage);
}
.search-icon {
  font-size: 1.2rem;
  opacity: 0.7;
}
.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1.1rem;
  color: var(--cp-text-dark);
  outline: none;
}
.search-input::placeholder {
  color: var(--cp-text-muted);
}

.toolbar-divider {
  height: 1px;
  background: var(--cp-border);
  margin: 24px 0;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}

.filter-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.filter-col label {
  font-size: 0.7rem;
  font-weight: 800;
  color: var(--cp-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 4px;
}

.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  border: 1.5px solid var(--cp-border-mid);
  border-radius: var(--r-lg);
  padding: 0 12px;
  background: #fff;
  transition: border-color var(--t-fast);
}
.select-wrapper:hover {
  border-color: var(--cp-sage);
}
.select-icon {
  font-size: 1rem;
  margin-right: 8px;
}
.custom-select {
  flex: 1;
  border: none;
  background: transparent;
  padding: 12px 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--cp-text-dark);
  outline: none;
  cursor: pointer;
  appearance: none;
}
.select-wrapper::after {
  content: '⌄';
  font-size: 1.5rem;
  line-height: 0;
  color: var(--cp-text-muted);
  pointer-events: none;
}

/* ── HEADER ── */
.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-6);
  border-bottom: 1px dotted var(--cp-border-mid);
  padding-bottom: var(--space-4);
}

.results-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.results-header h2 {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--cp-text-dark);
  font-family: var(--font-display);
}

.results-badge {
  background: #f4f6f3;
  color: var(--cp-text-muted);
  padding: 4px 12px;
  border-radius: var(--r-pill);
  font-size: 0.85rem;
  font-weight: 700;
  border: 1px solid var(--cp-border);
}

.results-hint {
  font-size: 0.85rem;
  color: var(--cp-text-faint);
  font-style: italic;
}

/* ── GRID ── */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-6);
}

.loading-state,
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: var(--space-10);
  font-size: 1.2rem;
  color: var(--cp-text-muted);
}
</style>
