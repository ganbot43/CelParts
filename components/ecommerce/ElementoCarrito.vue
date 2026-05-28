<template>
  <div class="cart-item">
    <!-- Imagen / placeholder -->
    <div class="item-img">
      <img
        v-if="item.image && !imgError"
        :src="item.image"
        :alt="item.name"
        loading="lazy"
        @error="imgError = true"
      />
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
        <span v-if="discountPct > 0" class="item-discount"
          >-{{ discountPct }}%</span
        >
      </div>

      <!-- Controls -->
      <div class="item-bottom">
        <div class="qty-ctrl" role="group" aria-label="Cantidad">
          <button
            class="qty-btn"
            aria-label="Reducir cantidad"
            @click="$emit('decrement')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.5"
              stroke="currentColor"
              width="14"
              height="14"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5 12h14"
              />
            </svg>
          </button>
          <span class="qty-num" aria-live="polite">{{ safeQty }}</span>
          <button
            class="qty-btn"
            aria-label="Aumentar cantidad"
            @click="$emit('increment')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.5"
              stroke="currentColor"
              width="14"
              height="14"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        </div>

        <div class="item-subtotal">{{ fmt(safePrice * safeQty) }}</div>

        <button
          class="del-btn"
          aria-label="Eliminar producto"
          @click="$emit('remove')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            width="15"
            height="15"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
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
.cart-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  transition:
    border-color 0.2s ease,
    background 0.2s ease;
}
.cart-item:hover {
  border-color: rgba(176, 24, 131, 0.3);
  background: #fdf5fb;
}

/* ── Image ───────────────────────────────── */
.item-img {
  width: 72px;
  height: 72px;
  border-radius: 10px;
  border: 1px solid #e5e5e5;
  background: #f5f5f5;
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
  font-size: 14px;
  font-weight: 600;
  color: #2b2b2b;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-variant {
  font-size: 11.5px;
  color: #999999;
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
  font-size: 15px;
  font-weight: 800;
  color: #b01883;
}

.item-original {
  font-size: 12px;
  color: #999999;
  text-decoration: line-through;
}

.item-discount {
  font-size: 11px;
  font-weight: 700;
  color: #121212;
  background: #ffd735;
  border: 1px solid #f7d21e;
  padding: 1px 6px;
  border-radius: 6px;
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
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 2px;
}

.qty-btn {
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777777;
  transition: all 0.15s ease;
}
.qty-btn:hover {
  background: #ffffff;
  color: #b01883;
  box-shadow: 0 1px 4px rgba(176, 24, 131, 0.12);
}

.qty-num {
  font-size: 13px;
  font-weight: 700;
  color: #2b2b2b;
  min-width: 22px;
  text-align: center;
}

/* ── Subtotal ────────────────────────────── */
.item-subtotal {
  flex: 1;
  text-align: right;
  font-size: 13px;
  font-weight: 700;
  color: #2b2b2b;
}

/* ── Delete ──────────────────────────────── */
.del-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 7px;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999999;
  transition: all 0.15s ease;
  flex-shrink: 0;
}
.del-btn:hover {
  background: rgba(176, 24, 131, 0.08);
  color: #b01883;
}
</style>
