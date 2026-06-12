<template>
  <div class="mi-cuenta-page section">
    <div class="container">
      
      <!-- Top Card -->
      <div class="panel-header-card">
        <div class="panel-header-top">
          <div class="panel-title-area">
            <h1 class="panel-title"><span class="title-icon">📋</span> Mi Panel de Tejedor</h1>
            <p class="panel-subtitle">Aquí puedes ver, editar o eliminar de forma fácil todos los tapetes que has subido.</p>
          </div>
          <div class="panel-actions">
            <NuxtLink to="/mi-cuenta/productos/nuevo" class="btn btn-primary btn-sm btn-pill">
              <span class="btn-icon">⊕</span> Subir Otro Tapete
            </NuxtLink>
          </div>
        </div>
        
        <div class="panel-stats-grid">
          <!-- Stat Box 1 -->
          <div class="stat-box">
            <span class="stat-label">TAPETES PUBLICADOS</span>
            <span class="stat-value">{{ products.length }}</span>
            <span class="stat-caption">Exhibiéndose en línea 🧶</span>
          </div>
          <!-- Stat Box 2 -->
          <div class="stat-box">
            <span class="stat-label">VALOR ESTIMADO TOTAL</span>
            <span class="stat-value">S/.{{ totalValue.toFixed(2) }}</span>
            <span class="stat-caption">100% de venta para ti 🧶</span>
          </div>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="catalog-section">
        <h2 class="catalog-title">📚 Catálogo de {{ user?.name?.split(' ')[0] || 'Clara' }} ({{ products.length }})</h2>
        
        <div class="product-list">
          <div v-for="product in products" :key="product.id" class="product-list-card">
            <!-- Image -->
            <div class="product-list-img">
              <img v-if="getPrimaryImage(product)" :src="getPrimaryImage(product)" :alt="product.name" />
              <div v-else class="img-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>
              <span v-if="product.offersPattern" class="badge-pattern">PATRÓN</span>
            </div>

            <!-- Content -->
            <div class="product-list-content">
              <div class="product-list-main">
                <span class="product-material">{{ product.material || 'LANA DE ALPACA BEBÉ' }}</span>
                <h3 class="product-name">{{ product.name }}</h3>
                <span class="product-price">S/.{{ Number(product.price).toFixed(2) }}</span>
              </div>
              
              <!-- Actions -->
              <div class="product-list-actions">
                <div class="action-buttons">
                  <button class="action-btn btn-view" title="Ver" @click="openModal(product)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </button>
                  <NuxtLink :to="`/mi-cuenta/productos/${product.id}`" class="action-btn btn-edit" title="Editar">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </NuxtLink>
                  <button class="action-btn btn-delete" title="Eliminar" @click="deleteProduct(product.id)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                </div>
                <div class="product-views">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  {{ Math.floor(Math.random() * 100) + 10 }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EcommerceModalDetalleTejido 
        :is-open="isModalOpen" 
        @update:is-open="isModalOpen = $event"
        @product-deleted="onProductDeleted"
        :product="selectedProduct || {}" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'landing',
  middleware: ['auth']
})

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const products = ref<any[]>([])
const loading = ref(true)

const isModalOpen = ref(false)
const selectedProduct = ref<any>(null)

const openModal = (product: any) => {
  selectedProduct.value = product
  isModalOpen.value = true
}

const fetchProducts = async () => {
  try {
    loading.value = true
    const { data } = await $fetch<{ data: any[] }>("/api/products")
    
    // Filter by the logged-in user
    const userProducts = data.filter(p => p.sellerId === user.value?.id)
    
    products.value = userProducts.map(p => ({
      ...p,
      material: p.material || 'ALGODÓN 100% ORGÁNICO',
      offersPattern: p.offersPattern !== undefined ? p.offersPattern : Math.random() > 0.5,
    }))
  } catch (error) {
    console.error("Error loading products:", error)
  } finally {
    loading.value = false
  }
}

const deleteProduct = async (id: number) => {
  if (!confirm("¿Estás seguro de que deseas eliminar esta publicación?")) return;
  try {
    await $fetch(`/api/seller/products/${id}`, { method: 'DELETE' });
    products.value = products.value.filter(p => p.id !== id);
  } catch (e) {
    console.error("Error deleting product", e);
    alert("No se pudo eliminar el producto");
  }
}

const onProductDeleted = (id: number) => {
  products.value = products.value.filter(p => p.id !== id);
}

const totalValue = computed(() => {
  return products.value.reduce((acc, curr) => acc + Number(curr.price || 0), 0)
})

const getPrimaryImage = (product: any) => {
  const primary = product.images?.find((i: any) => i.isPrimary)
  return primary?.url ?? product.images?.[0]?.url ?? null
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.mi-cuenta-page {
  padding-top: var(--space-8);
  padding-bottom: var(--space-16);
  min-height: 80vh;
}

/* ── TOP PANEL CARD ── */
.panel-header-card {
  background: #fdfcf9; /* slight cream tint matching wireframe */
  border: 1px solid var(--cp-border);
  border-radius: 24px;
  padding: 32px;
  margin-bottom: var(--space-10);
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
}

.panel-header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.panel-title-area {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.panel-title {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--cp-text-dark);
  display: flex;
  align-items: center;
  gap: 12px;
}
.title-icon {
  font-size: 1.5rem;
}

.panel-subtitle {
  font-size: 0.95rem;
  color: var(--cp-text-muted);
}

.btn-pill {
  border-radius: var(--r-pill);
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: var(--cp-sage);
  border-color: var(--cp-sage);
  font-weight: 700;
  color: white;
  text-decoration: none;
}
.btn-pill:hover {
  background: var(--cp-sage-dark);
  border-color: var(--cp-sage-dark);
}

/* ── STATS GRID ── */
.panel-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.stat-box {
  background: #ffffff;
  border: 1.5px dashed var(--cp-border-mid);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--cp-text-faint);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.stat-value {
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--cp-earth-dark);
  line-height: 1;
  margin-bottom: 8px;
}

.stat-caption {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--cp-sage-dark);
}

/* ── BOTTOM SECTION (CATALOG) ── */
.catalog-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.catalog-title {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--cp-text-dark);
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── PRODUCT CARD (HORIZONTAL) ── */
.product-list-card {
  background: #ffffff;
  border: 1px solid var(--cp-border);
  border-radius: 16px;
  padding: 12px;
  display: flex;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  transition: transform var(--t-fast), box-shadow var(--t-fast);
}
.product-list-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.product-list-img {
  position: relative;
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  background: var(--cp-cream-card);
}
.product-list-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--cp-border-mid);
}
.img-placeholder svg {
  width: 32px;
  height: 32px;
}
.badge-pattern {
  position: absolute;
  top: 4px;
  left: 4px;
  background: #475a40;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.55rem;
  font-weight: 800;
  letter-spacing: 0.05em;
}

.product-list-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-list-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}

.product-material {
  font-size: 0.65rem;
  font-weight: 800;
  color: var(--cp-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.product-name {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--cp-text-dark);
}

.product-price {
  font-size: 1rem;
  font-weight: 700;
  color: var(--cp-text-dark);
  margin-top: 2px;
}

.product-list-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  height: 100%;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--t-fast);
  text-decoration: none;
}

.btn-view, .btn-edit {
  background: #f5f3f0;
  color: var(--cp-text-muted);
}
.btn-view:hover, .btn-edit:hover {
  background: #e8e4e0;
  color: var(--cp-text-dark);
}

.btn-delete {
  background: #fff0f0;
  color: #e53e3e;
}
.btn-delete:hover {
  background: #fee2e2;
  color: #c53030;
}

.product-views {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--cp-text-faint);
  margin-top: auto;
}
.product-views svg {
  opacity: 0.6;
}

@media (max-width: 768px) {
  .panel-header-top {
    flex-direction: column;
    gap: 16px;
  }
  .panel-stats-grid {
    grid-template-columns: 1fr;
  }
  .product-list-card {
    flex-direction: column;
    align-items: flex-start;
  }
  .product-list-content {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    gap: 16px;
  }
  .product-list-actions {
    flex-direction: row;
    width: 100%;
    align-items: flex-end;
  }
}
</style>
