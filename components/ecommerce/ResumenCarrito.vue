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
/* ─── Card ───────────────────────────────────────────────── */
.summary-card {
  background: var(--card-bg);
  border: 1.5px solid var(--card-border);
  border-radius: 20px;
  overflow: hidden;
  position: sticky;
  top: 5.5rem;
  box-shadow: var(--card-shadow);
}

/* ─── Header ─────────────────────────────────────────────── */
.summary-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1.5px solid var(--border-light);
}

.summary-icon {
  width: 32px;
  height: 32px;
  background: rgba(7,30,82,0.06);
  border: 1px solid rgba(7,30,82,0.12);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--cp-navy);
  flex-shrink: 0;
}

.summary-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--text-primary);
}

/* ─── Items ──────────────────────────────────────────────── */
.summary-items {
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 260px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(7,30,82,0.18) transparent;
}
.summary-items::-webkit-scrollbar {
  width: 3px;
}
.summary-items::-webkit-scrollbar-thumb {
  background: rgba(7,30,82,0.18);
  border-radius: 4px;
}

.summary-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}
.item-left {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  min-width: 0;
  flex: 1;
}
.item-thumb {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--bg-muted);
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
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-qty {
  font-size: 0.7rem;
  color: var(--text-faint);
  margin-top: 0.1rem;
}
.item-price {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-primary);
  flex-shrink: 0;
}

/* ─── Divider ────────────────────────────────────────────── */
.summary-divider {
  height: 1px;
  background: var(--border-light);
  margin: 0 1.25rem;
}

/* ─── Totals ─────────────────────────────────────────────── */
.summary-totals {
  padding: 0.875rem 1.25rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
}
.total-row-label {
  color: var(--text-faint);
}
.total-row-val {
  font-weight: 600;
  color: var(--text-body);
}

.shipping-free {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-faint);
}

/* ─── Grand total ────────────────────────────────────────── */
.grand-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  margin: 0.75rem 1.25rem 1.25rem;
  background: var(--card-bg);
  border: 1.5px solid var(--card-border);
  border-radius: 12px;
}

.grand-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-primary);
}

.grand-val {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--cp-navy);
  letter-spacing: -0.03em;
  line-height: 1;
}

/* ─── Trust strip ────────────────────────────────────────── */
.trust-strip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem 1.125rem;
  border-top: 1px solid #e5e5e5;
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.7rem;
  color: #999999;
  font-weight: 500;
}
.trust-sep {
  width: 1px;
  height: 14px;
  background: #d9d9d9;
}
</style>
