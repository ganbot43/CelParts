<template>
  <div class="summary-card">
    <!-- Header -->
    <div class="summary-header">
      <div class="summary-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.8"
          stroke="currentColor"
          class="w-4 h-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185Z"
          />
        </svg>
      </div>
      <h3 class="summary-title">Resumen del pedido</h3>
    </div>

    <!-- Items -->
    <div class="summary-items">
      <div v-for="item in cartStore.items" :key="item.id" class="summary-item">
        <div class="item-left">
          <!-- Thumbnail -->
          <div class="item-thumb">
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.name"
              class="item-thumb-img"
            />
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1"
              stroke="currentColor"
              class="w-4 h-4 text-gray-300"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </div>
          <div class="item-info">
            <p class="item-name">{{ item.name }}</p>
            <p class="item-qty">× {{ item.qty }}</p>
          </div>
        </div>
        <span class="item-price">{{
          formatPrice.format(item.price * (item.qty ?? 0))
        }}</span>
      </div>
    </div>

    <!-- Divider -->
    <div class="summary-divider" />

    <!-- Subtotal + Total -->
    <div class="summary-totals">
      <div class="total-row">
        <span class="total-row-label">Subtotal</span>
        <span class="total-row-val">{{
          formatPrice.format(cartStore.total)
        }}</span>
      </div>
      <!-- <div class="total-row">
        <span class="total-row-label">Envío</span>
        <span class="shipping-free">Por coordinar</span>
      </div> -->
    </div>

    <!-- Grand total -->
    <div class="grand-total">
      <span class="grand-label">Total</span>
      <span class="grand-val">{{ formatPrice.format(cartStore.total) }}</span>
    </div>

    <!-- Trust badges -->
    <!-- <div class="trust-strip">
      <div class="trust-item">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-3.5 h-3.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
          />
        </svg>
        Pago seguro
      </div>
      <div class="trust-sep" />
      <div class="trust-item">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-3.5 h-3.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
        Datos protegidos
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
const cartStore = useCartStore();
const formatPrice = useFormatPrice();
</script>

<style scoped>
/* ═══════════════════════════════════
   RESUMEN CARRITO — CELPARTS
   100% tokens de main.css
═══════════════════════════════════ */

/* ─── Card ───────────────────────────────────────────────── */
.summary-card {
  background: var(--bg-surface);
  border: 1.5px solid var(--border-light);
  border-radius: var(--r-xl);
  overflow: hidden;
  position: sticky;
  top: 5.5rem;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--card-shadow);
}

/* ─── Header ─────────────────────────────────────────────── */
.summary-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--border-light);
  position: relative;
}

.summary-header::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--line-brand) 30%, var(--line-brand) 70%, transparent);
}

.summary-icon {
  width: 32px;
  height: 32px;
  background: rgba(0, 174, 239, 0.06);
  border: 1px solid rgba(0, 174, 239, 0.15);
  border-radius: var(--r-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--cp-electric);
  flex-shrink: 0;
}

.summary-title {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

/* ─── Items ──────────────────────────────────────────────── */
.summary-items {
  padding: var(--space-4) var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-height: 260px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 174, 239, 0.2) transparent;
}
.summary-items::-webkit-scrollbar {
  width: 3px;
}
.summary-items::-webkit-scrollbar-thumb {
  background: rgba(0, 174, 239, 0.2);
  border-radius: var(--r-pill);
}

.summary-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}
.item-left {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
  flex: 1;
}
.item-thumb {
  width: 36px;
  height: 36px;
  border-radius: var(--r-sm);
  background: var(--bg-alt);
  border: 1px solid var(--border-light);
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.item-info {
  min-width: 0;
}
.item-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-qty {
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-top: 0.1rem;
}
.item-price {
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--cp-navy);
  flex-shrink: 0;
}

/* ─── Divider ────────────────────────────────────────────── */
.summary-divider {
  height: 1px;
  background: var(--border-light);
  margin: 0 var(--space-4);
}

/* ─── Totals ─────────────────────────────────────────────── */
.summary-totals {
  padding: var(--space-3) var(--space-4) 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.82rem;
}
.total-row-label {
  color: var(--text-muted);
  font-weight: 600;
}
.total-row-val {
  font-weight: 700;
  color: var(--text-body);
}

.shipping-free {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
}

/* ─── Grand total ────────────────────────────────────────── */
.grand-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4);
  margin: var(--space-3) var(--space-4) var(--space-4);
  background: var(--bg-alt);
  border: 1.5px solid var(--border-light);
  border-radius: var(--r-md);
}

.grand-label {
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.grand-val {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--cp-navy);
  letter-spacing: -0.03em;
  line-height: 1;
}

/* ─── Trust strip ────────────────────────────────────────── */
.trust-strip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4) var(--space-4);
  border-top: 1px solid var(--border-light);
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.7rem;
  color: var(--text-muted);
  font-weight: 500;
}
.trust-item svg {
  color: var(--cp-electric);
  opacity: 0.65;
}
.trust-sep {
  width: 1px;
  height: 14px;
  background: var(--border-light);
}
</style>


