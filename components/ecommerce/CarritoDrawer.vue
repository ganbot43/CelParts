<template>
  <Teleport to="body">
    <!-- Overlay -->
    <Transition name="overlay">
      <div
        v-if="cartStore.isOpen"
        class="cart-overlay"
        @click="cartStore.isOpen = false"
      />
    </Transition>

    <!-- Drawer -->
    <Transition name="drawer">
      <div
        v-if="cartStore.isOpen"
        class="cart-drawer"
        role="dialog"
        aria-label="Carrito de compras"
        aria-modal="true"
      >
        <!-- ── Header ──────────────────────────────── -->
        <div class="ch">
          <div class="ch-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.8"
              stroke="currentColor"
              width="20"
              height="20"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
          </div>
          <div class="ch-info">
            <h2 class="ch-title">Mi carrito</h2>
            <p class="ch-sub">
              {{
                cartStore.isEmpty
                  ? "Vacío"
                  : `${cartStore.itemCount} producto${cartStore.itemCount !== 1 ? "s" : ""}`
              }}
            </p>
          </div>
          <span v-if="!cartStore.isEmpty" class="ch-badge">{{
            cartStore.itemCount
          }}</span>
          <button
            class="close-btn"
            aria-label="Cerrar carrito"
            @click="cartStore.isOpen = false"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              width="18"
              height="18"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- ── Body ───────────────────────────────── -->
        <div class="cart-body">
          <Transition name="fade" mode="out-in">
            <!-- Empty state -->
            <div v-if="cartStore.isEmpty" key="empty" class="empty-state">
              <div class="empty-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1"
                  stroke="currentColor"
                  width="36"
                  height="36"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
              </div>
              <h3 class="empty-title">Tu carrito está vacío</h3>
              <p class="empty-sub">
                Explora nuestro catálogo y encuentra los mejores productos
              </p>
              <NuxtLink
                to="/productos"
                class="empty-cta"
                @click="cartStore.isOpen = false"
              >
                Ver catálogo
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  width="14"
                  height="14"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </NuxtLink>
            </div>

            <!-- Items list -->
            <div v-else key="items" class="items-wrapper">
              <!-- TEMPORAL: Promo strip comentada (lógica de envío desactivada) -->
              <!-- <div
                class="promo-strip"
                :class="{ 'promo-achieved': cartStore.freeShipping }"
              >
                <svg
                  v-if="!cartStore.freeShipping"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.8"
                  stroke="currentColor"
                  width="14"
                  height="14"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3ZM6 6h.008v.008H6V6Z"
                  />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  width="14"
                  height="14"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
                <span v-if="!cartStore.freeShipping">
                  ¡Envío gratis en pedidos mayores a
                  {{ fmt(FREE_SHIPPING_THRESHOLD) }}!
                </span>
                <span v-else>¡Tienes envío gratis!</span>
              </div> -->

              <TransitionGroup name="item" tag="div" class="items-list">
                <EcommerceElementoCarrito
                  v-for="item in cartStore.items"
                  :key="item.id"
                  :item="item"
                  @increment="cartStore.increment(item.id)"
                  @decrement="cartStore.decrement(item.id)"
                  @remove="cartStore.remove(item.id)"
                />
              </TransitionGroup>
            </div>
          </Transition>
        </div>

        <!-- ── Footer ─────────────────────────────── -->
        <Transition name="footer">
          <div v-if="!cartStore.isEmpty" class="cart-footer">
            <div class="summary">
              <div class="s-row">
                <span class="s-label">Subtotal</span>
                <span class="s-val">{{ fmt(cartStore.subtotal) }}</span>
              </div>
              <!-- TEMPORAL: Fila de envío comentada (lógica desactivada) -->
              <!-- <div class="s-row">
                <span class="s-label">Envío</span>
                <span :class="['s-ship', { free: cartStore.freeShipping }]">
                  {{
                    cartStore.freeShipping
                      ? "Gratis"
                      : fmt(cartStore.shippingCost)
                  }}
                </span>
              </div> -->
              <div v-if="cartStore.discount > 0" class="s-row">
                <span class="s-label">Descuento</span>
                <span class="s-discount">− {{ fmt(cartStore.discount) }}</span>
              </div>
              <div class="s-total">
                <span class="s-total-label">Total</span>
                <span class="s-total-val">{{ fmt(cartStore.total) }}</span>
              </div>
            </div>

            <div class="actions">
              <NuxtLink
                to="/checkout"
                class="checkout-btn"
                @click="cartStore.isOpen = false"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  width="18"
                  height="18"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                  />
                </svg>
                Proceder al checkout
              </NuxtLink>
              <!-- <NuxtLink
                to="/carrito"
                class="view-cart-btn"
                @click="cartStore.isOpen = false"
              >
                Ver carrito completo
              </NuxtLink> -->
              <button class="clear-btn" @click="confirmClear">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  width="14"
                  height="14"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
                Vaciar carrito
              </button>
            </div>

            <!-- <div class="trust-row">
              <span class="trust-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  width="13"
                  height="13"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                  />
                </svg>
                Pago seguro
              </span>
              <span class="trust-divider" />
              <span class="trust-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  width="13"
                  height="13"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                Devoluciones
              </span>
              <span class="trust-divider" />
              <span class="trust-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  width="13"
                  height="13"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
                Datos cifrados
              </span>
            </div> -->
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from "vue";

const cartStore = useCartStore();

const FREE_SHIPPING_THRESHOLD = 150;

/**
 * Formatea un número como moneda PEN.
 * Recibe parseFloat para asegurar que nunca se pase NaN a Intl.
 */
function fmt(amount: unknown): string {
  const num = parseFloat(String(amount));
  if (!Number.isFinite(num)) return "S/ 0.00";
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(num);
}

function confirmClear() {
  if (confirm("¿Vaciar el carrito? Esta acción no se puede deshacer.")) {
    cartStore.clear();
  }
}

// Bloquea el scroll del body cuando el drawer está abierto
watch(
  () => cartStore.isOpen,
  (open) => {
    document.body.style.overflow = open ? "hidden" : "";
  },
);

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && cartStore.isOpen) cartStore.isOpen = false;
}

onMounted(() => {
  cartStore.isOpen = false;
  window.addEventListener("keydown", onKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", onKeydown);
  document.body.style.overflow = "";
});
</script>

<style scoped>
/* ═══════════════════════════════════
   TOKENS KITE — LIQUID GLASS
═══════════════════════════════════ */
.cart-overlay,
.cart-drawer {
  --kite-green: #2D6A4F;
  --kite-green-dark: #1E4D38;
  --kite-green-light: #4F9D75;
  --kite-green-glow: rgba(45, 106, 79, 0.18);
  --kite-green-soft: rgba(45, 106, 79, 0.08);
  --kite-green-line: rgba(45, 106, 79, 0.2);

  --kite-yellow: #E9C46A;
  --kite-yellow-intense: #E9C46A;

  --jm-surface: rgba(255, 255, 255, 0.72);
  --jm-surface2: rgba(255, 255, 255, 0.72);
  --jm-surface3: rgba(248, 247, 244, 0.88);

  --jm-border: rgba(226, 224, 217, 0.5);
  --jm-border-strong: rgba(226, 224, 217, 0.7);

  --jm-text: #111111;
  --jm-text-dim: #66625A;
  --jm-text-muted: #9E9A91;
}

/* ─── Overlay ──────────────────────────────────────────── */
.cart-overlay {
  position: fixed;
  inset: 0;
  background: rgba(43, 43, 43, 0.45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 9998;
}

/* ─── Drawer ───────────────────────────────────────────── */
.cart-drawer {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  height: 100dvh;
  width: 420px;
  max-width: 100vw;
  background: var(--jm-surface);
  border-left: 1px solid var(--jm-border);
  box-shadow:
    -8px 0 40px rgba(45, 106, 79, 0.06),
    -1px 0 0 var(--jm-border);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  isolation: isolate;
}

@media (max-width: 480px) {
  .cart-drawer {
    width: 100%;
  }
}

/* ─── Transitions ──────────────────────────────────────── */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.drawer-enter-active {
  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
}
.drawer-leave-active {
  transition: transform 0.28s cubic-bezier(0.4, 0, 1, 1);
}
.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.footer-enter-active {
  transition: all 0.25s ease;
}
.footer-leave-active {
  transition: all 0.2s ease;
}
.footer-enter-from,
.footer-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

.item-enter-active {
  transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.item-leave-active {
  transition: all 0.22s ease;
  position: absolute;
  width: 100%;
}
.item-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.item-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
.item-move {
  transition: transform 0.28s ease;
}

/* ─── Header ───────────────────────────────────────────── */
.ch {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 20px;
  border-bottom: 1px solid var(--jm-border);
  flex-shrink: 0;
  background: var(--jm-surface);
  position: relative;
}
.ch::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--kite-green-line) 30%,
    var(--kite-green-line) 70%,
    transparent
  );
}

.ch-icon {
  width: 42px;
  height: 42px;
  border-radius: 11px;
  background: var(--kite-green-soft);
  border: 1px solid var(--kite-green-line);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--kite-green);
  flex-shrink: 0;
  box-shadow: 0 0 16px var(--kite-green-glow);
}

.ch-info {
  flex: 1;
  min-width: 0;
}

.ch-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--jm-text);
  line-height: 1.2;
  letter-spacing: 0.02em;
}

.ch-sub {
  font-size: 12px;
  color: var(--jm-text-muted);
  margin-top: 2px;
  letter-spacing: 0.04em;
}

.ch-badge {
  background: var(--kite-green);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 20px;
  line-height: 1;
  flex-shrink: 0;
  box-shadow: 0 2px 10px var(--kite-green-glow);
}

.close-btn {
  width: 34px;
  height: 34px;
  border: 1px solid var(--jm-border-strong);
  border-radius: 8px;
  background: var(--jm-surface2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--jm-text-muted);
  transition: all 0.18s ease;
  flex-shrink: 0;
}
.close-btn:hover {
  background: var(--kite-green-soft);
  border-color: var(--kite-green-line);
  color: var(--kite-green);
  box-shadow: 0 0 12px var(--kite-green-glow);
}

/* ─── Body ─────────────────────────────────────────────── */
.cart-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  position: relative;
  background: var(--jm-surface2);
}
.cart-body::-webkit-scrollbar {
  width: 3px;
}
.cart-body::-webkit-scrollbar-track {
  background: transparent;
}
.cart-body::-webkit-scrollbar-thumb {
  background: var(--kite-green-line);
  border-radius: 4px;
}

/* ─── Empty state ──────────────────────────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 64px 32px;
  min-height: 320px;
  background: var(--jm-surface);
}

.empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: var(--kite-green-soft);
  border: 1px solid var(--kite-green-line);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--kite-green);
  margin-bottom: 20px;
  box-shadow: 0 4px 20px var(--kite-green-glow);
}

.empty-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--jm-text);
  margin-bottom: 6px;
  letter-spacing: 0.02em;
}

.empty-sub {
  font-size: 13px;
  color: var(--jm-text-dim);
  line-height: 1.6;
  margin-bottom: 24px;
  max-width: 210px;
}

.empty-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 11px 26px;
  background: var(--kite-green);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 4px 20px var(--kite-green-glow);
}
.empty-cta:hover {
  background: var(--kite-green-dark);
  transform: translateY(-2px);
  box-shadow: 0 8px 28px var(--kite-green-glow);
}

/* ─── Items wrapper ────────────────────────────────────── */
.items-wrapper {
  padding: 12px;
}

/* ─── Promo strip ──────────────────────────────────────── */
.promo-strip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(247, 210, 30, 0.1);
  border: 1px solid rgba(247, 210, 30, 0.35);
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  color: #7a5f00;
  margin-bottom: 10px;
}
.promo-strip.promo-achieved {
  background: var(--kite-green-soft);
  border-color: var(--kite-green-line);
  color: var(--kite-green);
}

/* ─── Items list ───────────────────────────────────────── */
.items-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}

/* ─── Footer ───────────────────────────────────────────── */
.cart-footer {
  border-top: 1px solid var(--jm-border);
  padding: 20px;
  flex-shrink: 0;
  background: var(--jm-surface);
  position: relative;
}
.cart-footer::before {
  content: "";
  position: absolute;
  top: -1px;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--kite-green-line) 30%,
    var(--kite-green-line) 70%,
    transparent
  );
}

/* ─── Summary ──────────────────────────────────────────── */
.summary {
  margin-bottom: 16px;
  background: var(--jm-surface2);
  border: 1px solid var(--jm-border);
  border-radius: 12px;
  padding: 14px 16px;
}

.s-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  font-size: 13px;
}
.s-label {
  color: var(--jm-text-muted);
  font-weight: 500;
}
.s-val {
  font-weight: 600;
  color: var(--jm-text);
}
.s-ship {
  font-weight: 700;
  color: var(--jm-text);
}
.s-ship.free {
  color: #2a7a3b;
}
.s-discount {
  font-weight: 700;
  color: #2a7a3b;
}

.s-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px dashed var(--kite-green-line);
  margin-top: 10px;
  padding-top: 12px;
}

.s-total-label {
  font-size: 14px;
  font-weight: 700;
  color: var(--jm-text);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.s-total-val {
  font-size: 26px;
  font-weight: 900;
  color: var(--kite-green);
  letter-spacing: -0.03em;
  text-shadow: 0 0 20px var(--kite-green-glow);
}

/* ─── Actions ──────────────────────────────────────────── */
.actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.checkout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  background: var(--kite-green);
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: none;
  border-radius: 12px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow:
    0 4px 20px var(--kite-green-glow),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}
.checkout-btn:hover {
  background: var(--kite-green-dark);
  transform: translateY(-2px);
  box-shadow:
    0 8px 30px rgba(45, 106, 79, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}
.checkout-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px var(--kite-green-glow);
}

.view-cart-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 11px;
  background: transparent;
  border: 1px solid var(--jm-border-strong);
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--jm-text-dim);
  text-decoration: none;
  transition: all 0.2s ease;
}
.view-cart-btn:hover {
  border-color: var(--kite-green-line);
  color: var(--kite-green);
  background: var(--kite-green-soft);
}

.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 10px;
  background: transparent;
  border: 1px solid var(--jm-border);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: var(--jm-text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}
.clear-btn:hover {
  border-color: rgba(45, 106, 79, 0.25);
  color: var(--kite-green);
  background: var(--kite-green-soft);
}

/* ─── Trust row ─────────────────────────────────────────── */
.trust-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding-top: 2px;
}
.trust-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--jm-text-muted);
  font-weight: 500;
  letter-spacing: 0.04em;
}
.trust-item svg {
  color: var(--kite-green);
  opacity: 0.65;
}
.trust-divider {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--jm-border-strong);
}
</style>
