<template>
  <div class="confirm-page">
    <div class="container">
      <div v-if="order" class="confirm-layout">
        <!-- ── Success hero ── -->
        <div class="success-hero">
          <div class="success-icon-ring">
            <div class="success-icon-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2.5"
                stroke="currentColor"
                class="w-8 h-8"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            </div>
          </div>
          <h1 class="success-title">¡Pedido confirmado!</h1>
          <p class="success-sub">
            Tu pedido
            <span class="order-code">{{ order.orderCode }}</span>
            fue registrado exitosamente.
          </p>
          <div class="success-badge">
            <span class="badge-dot" />
            Procesando pedido
          </div>
        </div>

        <!-- ── Cards grid ── -->
        <div class="cards-stack">
          <!-- Productos -->
          <div class="confirm-card">
            <div class="card-header">
              <div class="card-header-icon">
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
                    d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                  />
                </svg>
              </div>
              <h2 class="card-title">Productos del pedido</h2>
            </div>

            <div class="items-list">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="order-item"
              >
                <div class="order-item-left">
                  <div class="order-item-qty">{{ item.quantity }}</div>
                  <span class="order-item-name">{{ item.productName }}</span>
                </div>
                <span class="order-item-price">{{
                  formatPrice.format(item.subtotal)
                }}</span>
              </div>
            </div>

            <div class="card-total">
              <span class="card-total-label">Total del pedido</span>
              <span class="card-total-val">{{
                formatPrice.format(order.total)
              }}</span>
            </div>
          </div>

          <!-- Instrucciones de pago -->
          <div v-if="order.paymentMethodLabel" class="confirm-card">
            <div class="card-header">
              <div class="card-header-icon">
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
                    d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                  />
                </svg>
              </div>
              <h2 class="card-title">Instrucciones de pago</h2>
            </div>

            <div class="payment-body">
              <div class="payment-method-tag">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-4 h-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                Pago via {{ order.paymentMethodLabel }}
              </div>

              <div
                v-if="order.paymentMethodAccountNumber"
                class="payment-account"
              >
                <div class="account-row">
                  <span class="account-key">Número de cuenta</span>
                  <span class="account-val">{{
                    order.paymentMethodAccountNumber
                  }}</span>
                </div>
                <div v-if="order.paymentMethodAccountName" class="account-row">
                  <span class="account-key">Titular</span>
                  <span class="account-val">{{
                    order.paymentMethodAccountName
                  }}</span>
                </div>
              </div>

              <div v-if="order.paymentMethodQrUrl" class="qr-wrap">
                <p class="qr-label">Escanea para pagar</p>
                <div class="qr-frame">
                  <img
                    :src="order.paymentMethodQrUrl"
                    alt="QR de pago"
                    class="qr-img"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- WhatsApp CTA -->
          <div class="whatsapp-card">
            <div class="wa-icon-wrap">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-7 h-7"
              >
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"
                />
              </svg>
            </div>
            <div class="wa-text">
              <p class="wa-title">Envía tu comprobante de pago</p>
              <p class="wa-sub">Te confirmaremos tu pedido a la brevedad</p>
            </div>

            <a :href="waUrl" target="_blank" class="wa-btn">
              Enviar por WhatsApp
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </a>
          </div>

          <!-- Back link -->
          <div class="back-wrap">
            <NuxtLink to="/productos" class="back-link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
              Seguir comprando
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from "~/types";

definePageMeta({ layout: "landing" });

const route = useRoute();
const config = useRuntimeConfig();
const formatPrice = useFormatPrice();

const { data: order } = await useFetch<Order>(
  `/api/orders/${route.params.code}`,
);
if (!order.value)
  throw createError({ statusCode: 404, message: "Pedido no encontrado" });

useSeoMeta({ title: `Pedido ${order.value?.orderCode} — Celparts SAC` });

const waMessage = computed(() =>
  encodeURIComponent(
    `Hola! Realicé el pedido *${order.value?.orderCode}* por S/ ${order.value?.total.toFixed(2)}. Adjunto comprobante de pago.`,
  ),
);
const waUrl = computed(
  () => `https://wa.me/${config.public.whatsapp}?text=${waMessage.value}`,
);
</script>

<style scoped>
/* ═══════════════════════════════════
   PEDIDO CONFIRMADO — CELPARTS
   100% tokens de main.css
═══════════════════════════════════ */

/* ─── Page ───────────────────────────────────────────────── */
.confirm-page {
  min-height: 100vh;
  background: var(--bg-base);
  padding: 3rem 0 5rem;
}

.container {
  max-width: 42rem;
  margin: 0 auto;
  padding: 0 1rem;
}
@media (min-width: 640px) {
  .container {
    padding: 0 1.5rem;
  }
}

.confirm-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* ─── Success hero ───────────────────────────────────────── */
.success-hero {
  text-align: center;
  padding: 1rem 0 0.5rem;
}

.success-icon-ring {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: rgba(0, 174, 239, 0.08);
  border: 2px solid rgba(0, 174, 239, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
}

.success-icon-inner {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--btn-primary-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--cp-white);
  box-shadow: 0 6px 20px rgba(7, 30, 82, 0.25);
}

.success-title {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.03em;
  margin-bottom: 0.5rem;
}

.success-sub {
  font-size: 0.95rem;
  color: var(--text-body);
  margin-bottom: 1rem;
}

.order-code {
  font-weight: 800;
  color: var(--cp-electric);
  font-family: monospace;
  font-size: 1rem;
  background: rgba(0, 174, 239, 0.08);
  padding: 0.1rem 0.5rem;
  border-radius: var(--r-sm);
  border: 1px solid rgba(0, 174, 239, 0.2);
}

.success-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.875rem;
  background: rgba(0, 174, 239, 0.08);
  border: 1px solid rgba(0, 174, 239, 0.2);
  border-radius: var(--r-pill);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--cp-electric);
}

.badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--cp-electric);
  animation: pulse-dot 1.5s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.75);
  }
}

/* ─── Cards ──────────────────────────────────────────────── */
.cards-stack {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.confirm-card {
  background: var(--bg-surface);
  border: 1.5px solid var(--border-light);
  border-radius: var(--r-xl);
  overflow: hidden;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--card-shadow-sm);
}

/* ─── Card header ────────────────────────────────────────── */
.card-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 1rem 1.25rem;
  border-bottom: 1.5px solid var(--border-light);
  position: relative;
}
.card-header::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--line-brand) 30%, var(--line-brand) 70%, transparent);
}

.card-header-icon {
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

.card-title {
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

/* ─── Items list ─────────────────────────────────────────── */
.items-list {
  padding: var(--space-3) 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.order-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--border-light);
}
.order-item:last-child {
  border-bottom: none;
}

.order-item-left {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
}

.order-item-qty {
  width: 24px;
  height: 24px;
  background: rgba(0, 174, 239, 0.08);
  border: 1px solid rgba(0, 174, 239, 0.18);
  border-radius: var(--r-sm);
  font-size: 0.7rem;
  font-weight: 800;
  color: var(--cp-navy);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.order-item-name {
  font-size: 0.875rem;
  color: var(--text-body);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.order-item-price {
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-primary);
  flex-shrink: 0;
}

/* ─── Card total ─────────────────────────────────────────── */
.card-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: rgba(7, 30, 82, 0.03);
  border-top: 1.5px solid var(--border-light);
}

.card-total-label {
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 800;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.card-total-val {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--cp-navy);
  letter-spacing: -0.04em;
}

/* ─── Payment ────────────────────────────────────────────── */
.payment-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.payment-method-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.875rem;
  background: var(--bg-alt);
  border: 1px solid var(--border-light);
  border-radius: var(--r-pill);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-body);
  width: fit-content;
}

.payment-account {
  background: var(--bg-alt);
  border: 1.5px solid var(--border-light);
  border-radius: var(--r-md);
  overflow: hidden;
}

.account-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.7rem 1rem;
  font-size: 0.875rem;
  border-bottom: 1px solid var(--border-light);
}
.account-row:last-child {
  border-bottom: none;
}

.account-key {
  color: var(--text-muted);
}

.account-val {
  font-weight: 700;
  color: var(--text-primary);
}

.qr-wrap {
  text-align: center;
}

.qr-label {
  font-size: 0.72rem;
  color: var(--text-muted);
  font-weight: 600;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.qr-frame {
  display: inline-block;
  padding: 0.75rem;
  background: var(--bg-surface);
  border: 1.5px solid var(--border-light);
  border-radius: var(--r-lg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: var(--card-shadow-sm);
}

.qr-img {
  width: 148px;
  height: 148px;
  border-radius: var(--r-sm);
  display: block;
}

/* ─── WhatsApp card ──────────────────────────────────────── */
.whatsapp-card {
  background: var(--bg-surface);
  border: 1.5px solid var(--border-light);
  border-radius: var(--r-xl);
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--card-shadow-sm);
}

.wa-icon-wrap {
  width: 48px;
  height: 48px;
  background: #f0fdf4;
  border: 1.5px solid #bbf7d0;
  border-radius: var(--r-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #16a34a;
  flex-shrink: 0;
}

.wa-text {
  flex: 1;
  min-width: 0;
}

.wa-title {
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.2rem;
}

.wa-sub {
  font-size: 0.775rem;
  color: var(--text-muted);
}

.wa-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.65rem 1.25rem;
  background: #22c55e;
  color: #ffffff;
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 700;
  border-radius: var(--r-md);
  text-decoration: none;
  transition: all var(--t-fast) var(--ease-snappy);
  white-space: nowrap;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(34, 197, 94, 0.3);
}
.wa-btn:hover {
  background: #16a34a;
  transform: translateY(-1px);
  box-shadow: 0 5px 16px rgba(34, 197, 94, 0.4);
}

/* ─── Back link ──────────────────────────────────────────── */
.back-wrap {
  text-align: center;
  padding: 0.5rem 0;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted);
  text-decoration: none;
  transition: color var(--t-fast) var(--ease-smooth);
}
.back-link:hover {
  color: var(--cp-electric);
}
</style>
