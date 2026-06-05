<template>
  <div v-if="product" class="product-card" @click="$emit('select', product)">
    <!-- Image Area -->
    <div class="product-card-img">
      <img v-if="primaryImage" :src="primaryImage" :alt="product.name" class="img-content" loading="lazy" />
      <div v-else class="img-placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
      </div>

      <div class="card-overlay"></div>

      <!-- Top Badge: Patrón -->
      <span v-if="product.offersPattern" class="badge-pattern">
        INCLUYE GUÍA/PATRÓN
      </span>

      <!-- Bottom Badge: Dimensiones -->
      <span v-if="product.sizeLength" class="badge-dimension">
        📍 {{ product.sizeLength }} {{ product.sizeWidth ? 'x ' + product.sizeWidth : '' }} {{ product.sizeUnit }}
      </span>
    </div>

    <!-- Info Area -->
    <div class="product-card-body">
      <!-- Material Tag -->
      <div v-if="product.material" class="material-tag">
        <span class="material-dot"></span>
        {{ product.material }}
      </div>

      <!-- Title & Description -->
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-description">{{ product.description }}</p>

      <!-- Footer Info -->
      <div class="product-footer">
        <!-- Author -->
        <div class="author-info">
          <div class="author-avatar">{{ product.sellerName ? product.sellerName.charAt(0).toUpperCase() : 'T' }}</div>
          <div class="author-text">
            <span class="author-role">Tejedor/a</span>
            <span class="author-name">{{ product.sellerName || 'Tejedor' }}</span>
          </div>
        </div>

        <!-- Price -->
        <div class="price-info">
          <span class="price-label">Precio sugerido</span>
          <span class="price-value">{{ formatPrice(product.price) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

defineEmits(['select'])

const primaryImage = computed(() => {
  const primary = props.product?.images?.find((i: any) => i.isPrimary)
  return primary?.url ?? props.product?.images?.[0]?.url ?? null
})

const formatPrice = (price: number | string) => {
  const p = Number(price)
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(p)
}
</script>

<style scoped>
.product-card {
  background: #ffffff;
  border: 1px solid var(--cp-border);
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  transition: transform var(--t-base), box-shadow var(--t-base);
  cursor: pointer;
  height: 100%;
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.08);
}

.product-card-img {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background-color: var(--cp-cream-card);
  margin: 12px 12px 0 12px;
  border-radius: 14px;
}

.img-content {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--t-slow);
}
.product-card:hover .img-content {
  transform: scale(1.05);
}

.img-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--cp-border-mid);
}
.img-placeholder svg {
  width: 48px;
  height: 48px;
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 40%);
  pointer-events: none;
}

.badge-pattern {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #475a40; /* Dark green */
  color: white;
  padding: 4px 10px;
  border-radius: var(--r-pill);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  z-index: 2;
}

.badge-dimension {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(0,0,0,0.6);
  color: white;
  padding: 4px 10px;
  border-radius: var(--r-pill);
  font-size: 0.75rem;
  font-weight: 700;
  backdrop-filter: blur(4px);
  z-index: 2;
}

.product-card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.material-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  font-weight: 800;
  color: var(--cp-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}
.material-dot {
  width: 6px;
  height: 6px;
  background: #3b82f6; /* Blue dot */
  border-radius: 50%;
}

.product-name {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--cp-text-dark);
  line-height: 1.3;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-description {
  font-size: 0.85rem;
  color: var(--cp-text-body);
  line-height: 1.5;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-top: 1px solid var(--cp-border);
  padding-top: 16px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
.author-avatar {
  width: 32px;
  height: 32px;
  background: #b19d85; /* Brown background */
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.9rem;
}
.author-text {
  display: flex;
  flex-direction: column;
}
.author-role {
  font-size: 0.65rem;
  color: var(--cp-text-faint);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
}
.author-name {
  font-size: 0.85rem;
  color: var(--cp-text-dark);
  font-weight: 700;
}

.price-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.price-label {
  font-size: 0.65rem;
  color: var(--cp-text-faint);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.price-value {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--cp-earth-dark);
  line-height: 1.1;
}
</style>