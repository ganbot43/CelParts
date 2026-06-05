<template>
  <div class="cart-item">
    <!-- Imagen / placeholder -->
    <div class="item-img">
      <img v-if="item.image && !imgError" :src="item.image" :alt="item.name" loading="lazy" @error="imgError = true" />
      <span v-else class="img-placeholder">{{ item.emoji ?? "📦" }}</span>
    </div>

    <!-- Info -->
    <div class="item-info">
      <div class="item-name" :title="item.name">{{ item.name }}</div>
      <div v-if="item.variant" class="item-variant">{{ item.variant }}</div>

      <!-- Price row -->
      <div class="price-row">
        <span class="item-price">{{ fmt(item.price) }}</span>
        <span v-if="safeOriginal > safePrice" class="item-original">
          {{ fmt(item.originalPrice) }}
        </span>
        <span v-if="discountPct > 0" class="item-discount">-{{ discountPct }}%</span>
      </div>

      <!-- Controls -->
      <div class="item-bottom">
        <div class="qty-ctrl" role="group" aria-label="Cantidad">
          <button class="qty-btn" aria-label="Reducir cantidad" @click="$emit('decrement')">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
              stroke="currentColor" width="14" height="14">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
            </svg>
          </button>
          <span class="qty-num" aria-live="polite">{{ safeQty }}</span>
          <button class="qty-btn" aria-label="Aumentar cantidad" @click="$emit('increment')">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
              stroke="currentColor" width="14" height="14">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>

        <div class="item-subtotal">{{ fmt(safePrice * safeQty) }}</div>

        <button class="del-btn" aria-label="Eliminar producto" @click="$emit('remove')">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
            width="15" height="15">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface CartItemType {
  id: number | string;
  name: string;
  image?: string;
  emoji?: string;
  variant?: string;
  price: number | string;
  originalPrice?: number | string;
  qty: number | string;
  stock?: number | string;
}

const props = defineProps<{ item: CartItemType }>();

defineEmits<{
  increment: [];
  decrement: [];
  remove: [];
}>();

const imgError = ref(false);

// Helpers para nunca tener NaN en el template
const safePrice = computed(() => {
  const n = Number(props.item.price);
  return Number.isFinite(n) ? n : 0;
});
const safeOriginal = computed(() => {
  const n = Number(props.item.originalPrice);
  return Number.isFinite(n) ? n : 0;
});
const safeQty = computed(() => {
  const n = Number(props.item.qty);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
});

const discountPct = computed(() => {
  if (!safeOriginal.value || safeOriginal.value <= safePrice.value) return 0;
  return Math.round((1 - safePrice.value / safeOriginal.value) * 100);
});

function fmt(amount: unknown): string {
  const num = parseFloat(String(amount));
  if (!Number.isFinite(num)) return "S/ 0.00";
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(num);
}
</script>

<style scoped>
/* ═══════════════════════════════════
   ELEMENTO CARRITO — CELPARTS
   100% tokens de main.css
═══════════════════════════════════ */
.cart-item {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-3);
  border-radius: var(--r-md);
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition:
    border-color var(--t-fast) var(--ease-smooth),
    background var(--t-fast) var(--ease-smooth),
    box-shadow var(--t-fast) var(--ease-smooth);
  box-shadow: var(--card-shadow-sm);
}

.cart-item:hover {
  border-color: rgba(0, 174, 239, 0.2);
  background: var(--bg-alt);
  box-shadow: 0 10px 30px rgba(7, 30, 82, 0.08);
}

/* ── Image ───────────────────────────────── */
.item-img {
  width: 72px;
  height: 72px;
  border-radius: var(--r-sm);
  border: 1px solid var(--border-light);
  background: var(--bg-alt);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.img-placeholder {
  font-size: 28px;
  line-height: 1;
}

/* ── Info ────────────────────────────────── */
.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-variant {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 2px;
}

/* ── Price ───────────────────────────────── */
.price-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
}

.item-price {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 800;
  color: var(--cp-navy);
}

.item-original {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-decoration: line-through;
}

.item-discount {
  font-size: 0.7rem;
  font-weight: 800;
  color: var(--cp-navy);
  background: rgba(0, 174, 239, 0.12);
  border: 1px solid rgba(0, 174, 239, 0.22);
  padding: 1px 6px;
  border-radius: var(--r-sm);
}

/* ── Bottom row ──────────────────────────── */
.item-bottom {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

/* ── Qty control ─────────────────────────── */
.qty-ctrl {
  display: flex;
  align-items: center;
  gap: 2px;
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: var(--r-sm);
  padding: 2px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.qty-btn {
  width: 26px;
  height: 26px;
  border: none;
  border-radius: var(--r-sm);
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  transition: all var(--t-fast) var(--ease-smooth);
}

.qty-btn:hover {
  background: var(--bg-alt);
  color: var(--cp-electric);
  box-shadow: 0 1px 4px rgba(0, 174, 239, 0.15);
}

.qty-num {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary);
  min-width: 22px;
  text-align: center;
}

/* ── Subtotal ────────────────────────────── */
.item-subtotal {
  flex: 1;
  text-align: right;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--text-primary);
}

/* ── Delete ──────────────────────────────── */
.del-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: var(--r-sm);
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  transition: all var(--t-fast) var(--ease-smooth);
  flex-shrink: 0;
}

.del-btn:hover {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
  /* Color de alerta rojo */
}
</style>
