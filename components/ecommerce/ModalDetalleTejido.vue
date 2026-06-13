<template>
  <Teleport to="body">
    <Transition name="fade-slide">
      <div v-if="isOpen" class="modal-overlay" @click.self="close">
        <div class="modal-content">
          
          <div class="modal-grid">
            <!-- Left: Image Area -->
            <div class="modal-image-col">
              <!-- Top floating actions -->
              <div class="image-actions-top">
                <button class="btn-heart" aria-label="Favorito">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" class="heart-icon"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </button>
                <span v-if="product.offersPattern" class="badge-pattern">
                  🧶 INCLUYE PATRÓN
                </span>
              </div>

              <!-- Main Image -->
              <div class="image-wrapper">
                <img v-if="primaryImage" :src="primaryImage" :alt="product.name" class="main-image" />
                <div v-else class="img-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </div>
              </div>

              <!-- Bottom Meta -->
              <div class="image-meta-bottom mt-3">
                <span class="meta-date">⏰ Publicado: {{ formattedDate }}</span>
                <span class="meta-location">📍 Lima, Perú</span>
              </div>
            </div>

            <!-- Right: Details Area -->
            <div class="modal-info-col">
              <!-- Close button -->
              <button class="modal-close" @click="close" aria-label="Cerrar modal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>

              <!-- Header Info -->
              <div class="modal-header">
                <div class="material-tag" v-if="product.material">
                  <span class="material-dot"></span> {{ product.material }}
                </div>
                <h2 class="product-title">{{ product.name }}</h2>
              </div>

              <!-- Price & Size Box -->
              <div class="price-size-box">
                <div class="box-col border-right">
                  <span class="box-label">PRECIO DE VENTA</span>
                  <span class="box-price">{{ formatPrice(product.price) }}</span>
                  <span class="box-subtext">¡Sin comisiones intermedias!</span>
                </div>
                <div class="box-col">
                  <span class="box-label">MEDIDAS / TAMAÑO</span>
                  <span class="box-value">
                    📏 {{ product.sizeLength }}
                    <template v-if="product.sizeWidth">x {{ product.sizeWidth }}</template>
                    {{ product.sizeUnit }}
                    <template v-if="!product.sizeWidth">de alto</template>
                  </span>
                </div>
              </div>

              <!-- Seller Box -->
              <div class="seller-box">
                <div class="seller-avatar">{{ product.sellerName ? product.sellerName.charAt(0).toUpperCase() : 'C' }}</div>
                <div class="seller-details">
                  <span class="seller-label">Tejido con amor por</span>
                  <span class="seller-name">{{ product.sellerName || 'Clara Gisbert Mendoza' }}</span>
                  <span class="seller-phone">📱 Celular: {{ product.sellerPhone || businessConfig?.whatsapp || '+51940756166' }}</span>
                </div>
                <div class="seller-badge" v-if="isOwner">Es tuyo ✨</div>
              </div>

              <!-- Description -->
              <div class="product-description">
                <h4>HISTORIA Y DESCRIPCIÓN DE LA OBRA:</h4>
                <p>"{{ product.description || 'Muñeco de crochet inspirado en nuestro logotipo. Tejido con la lana más suave de alpaca bebé, hipoalergénico y relleno de napa siliconada para mantener su forma tierna. Lleva una chalina tejida a dos agujas que se puede retirar.' }}"</p>
              </div>

              <!-- Actions -->
              <div class="modal-actions">
                <template v-if="isOwner">
                  <div class="action-row">
                    <NuxtLink :to="`/mi-cuenta/productos/${product.id}`" class="btn btn-edit-full">
                      <span class="icon">📝</span> Editar Tejido
                    </NuxtLink>
                    <button class="btn btn-delete-full" @click="deleteProduct">
                      <span class="icon">🗑️</span> Eliminar Publicación
                    </button>
                  </div>
                </template>
                <template v-else>
                  <button @click="isChatOpen = true" class="btn btn-chat-full">
                    <span class="icon">💬</span> Chatear con el Vendedor
                  </button>
                </template>
                <button class="btn btn-cancel-full" @click="close">Regresar al Catálogo</button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Transition>
    
    <!-- Floating Chat Window -->
    <EcommerceChatVendedor 
      v-model:isOpen="isChatOpen"
      :sellerName="product.sellerName"
      :productName="product.name"
    />
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref } from 'vue'

const businessConfig = useBusinessConfig()

const props = defineProps({
  isOpen: Boolean,
  product: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

const emit = defineEmits(['update:isOpen', 'product-deleted'])

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const isChatOpen = ref(false);

const isOwner = computed(() => {
  return user.value && props.product.sellerId === user.value.id
})

const close = () => {
  emit('update:isOpen', false)
}

const deleteProduct = async () => {
  if (!confirm("¿Estás seguro de que deseas eliminar esta publicación?")) return;
  try {
    await $fetch(`/api/seller/products/${props.product.id}`, { method: 'DELETE' });
    close();
    emit('product-deleted', props.product.id);
  } catch (e) {
    const { parseError } = useApiError();
    alert('Ocurrió un error al eliminar el producto: ' + parseError(e));
  }
}

const primaryImage = computed(() => {
  const primary = props.product?.images?.find((i: any) => i.isPrimary)
  return primary?.url ?? props.product?.images?.[0]?.url ?? null
})

const formatPrice = (price: number | string) => {
  const p = Number(price)
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(p)
}

const formattedDate = computed(() => {
  if (!props.product.createdAt) return 'Hoy'
  const date = new Date(props.product.createdAt)
  return new Intl.DateTimeFormat('es-PE', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  }).format(date)
})

const whatsappLink = computed(() => {
  const phone = props.product.sellerPhone?.replace(/\D/g, '') || ''
  const message = `Hola ${props.product.sellerName}, estoy interesado en tu hermoso tejido: *${props.product.name}* que vi en Arigumi. ¿Aún está disponible?`
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal-content {
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  max-width: 1000px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  position: relative;
}

.modal-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 500px;
  height: 100%;
}

/* ── LEFT: IMAGE ── */
.modal-image-col {
  padding: 24px;
  display: flex;
  flex-direction: column;
  position: relative;
  background: #fdfcfb;
}

.image-actions-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.btn-heart {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #ffffff;
  border: 1px solid var(--cp-border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  color: var(--cp-border-mid);
  transition: color var(--t-fast), border-color var(--t-fast);
}
.btn-heart:hover {
  color: #e53e3e;
  border-color: #fc8181;
}

.badge-pattern {
  background: #475a40;
  color: white;
  padding: 6px 14px;
  border-radius: var(--r-pill);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.image-wrapper {
  flex: 1;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 20px;
}
.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.img-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--cp-border-mid);
  background-color: var(--cp-cream-card);
}
.img-placeholder svg {
  width: 64px;
  height: 64px;
}

.image-meta-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.meta-date, .meta-location {
  font-size: 0.8rem;
  color: var(--cp-text-faint);
  font-weight: 600;
  letter-spacing: 0.05em;
}

/* ── RIGHT: INFO ── */
.modal-info-col {
  padding: 32px;
  display: flex;
  flex-direction: column;
  position: relative;
  border-left: 1px solid var(--cp-border-light);
  overflow-y: auto;
}

.modal-close {
  position: absolute;
  top: 24px;
  right: 24px;
  background: transparent;
  border: none;
  color: var(--cp-text-muted);
  cursor: pointer;
  transition: color var(--t-fast);
}
.modal-close:hover {
  color: var(--cp-text-dark);
}

.modal-header {
  margin-bottom: 24px;
  padding-right: 40px; /* space for close button */
}

.material-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--cp-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 12px;
}
.material-dot {
  width: 6px;
  height: 6px;
  background: #9f7aea; /* light purple dot */
  border-radius: 50%;
}

.product-title {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--cp-text-dark);
  line-height: 1.2;
}

.price-size-box {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1.5px dashed var(--cp-border-mid);
  border-radius: 16px;
  margin-bottom: 24px;
}

.box-col {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.border-right {
  border-right: 1.5px dashed var(--cp-border-mid);
}

.box-label {
  font-size: 0.65rem;
  font-weight: 800;
  color: var(--cp-text-faint);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}
.box-price {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 800;
  color: var(--cp-sage-dark);
  line-height: 1;
  margin-bottom: 4px;
}
.box-subtext {
  font-size: 0.7rem;
  color: var(--cp-text-muted);
  font-style: italic;
  font-weight: 600;
}
.box-value {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--cp-text-dark);
}

.seller-box {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--cp-border-light);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 32px;
}
.seller-avatar {
  width: 40px;
  height: 40px;
  background: #a38d70;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.1rem;
}
.seller-details {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.seller-label {
  font-size: 0.65rem;
  color: var(--cp-text-faint);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
}
.seller-name {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--cp-text-dark);
}
.seller-phone {
  font-size: 0.8rem;
  color: var(--cp-text-muted);
  font-weight: 600;
}
.seller-badge {
  background: #f4f6f3;
  color: var(--cp-earth-dark);
  padding: 4px 10px;
  border-radius: var(--r-pill);
  font-size: 0.75rem;
  font-weight: 800;
}

.product-description {
  margin-bottom: 32px;
  flex: 1;
}
.product-description h4 {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--cp-text-faint);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.product-description p {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--cp-text-muted);
  font-style: italic;
  font-family: 'Georgia', serif;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: auto;
}

.action-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.btn-edit-full {
  background: #a38d70; /* brown gold */
  color: white;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  text-decoration: none;
  transition: opacity var(--t-fast);
}
.btn-edit-full:hover {
  opacity: 0.9;
}

.btn-delete-full {
  background: #e53e3e; /* red */
  color: white;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: opacity var(--t-fast);
}
.btn-delete-full:hover {
  opacity: 0.9;
}

.btn-chat-full {
  background: var(--cp-sage);
  color: white;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  text-decoration: none;
  transition: background var(--t-fast);
}
.btn-chat-full:hover {
  background: var(--cp-sage-dark);
}

.btn-cancel-full {
  background: #f4f6f3;
  color: var(--cp-text-dark);
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background var(--t-fast);
}
.btn-cancel-full:hover {
  background: #e2e8e0;
}

@media (max-width: 768px) {
  .modal-grid {
    grid-template-columns: 1fr;
  }
  .modal-image-col {
    height: 400px;
  }
  .modal-info-col {
    padding: 24px;
  }
  .price-size-box {
    grid-template-columns: 1fr;
  }
  .border-right {
    border-right: none;
    border-bottom: 1.5px dashed var(--cp-border-mid);
  }
  .action-row {
    grid-template-columns: 1fr;
  }
}

/* Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease;
}
.fade-slide-enter-active .modal-content,
.fade-slide-leave-active .modal-content {
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.fade-slide-enter-from {
  opacity: 0;
}
.fade-slide-enter-from .modal-content {
  transform: translateY(20px) scale(0.95);
}
.fade-slide-leave-to {
  opacity: 0;
}
.fade-slide-leave-to .modal-content {
  transform: translateY(20px) scale(0.95);
}
</style>
