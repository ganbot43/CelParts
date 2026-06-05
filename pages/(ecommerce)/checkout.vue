<template>
  <div class="checkout-pagina">
    <div class="checkout-encabezado">
      <h1 class="checkout-titulo">Finalizar pedido</h1>
      <p class="checkout-subtitulo">
        Completa tus datos para confirmar tu compra
      </p>
    </div>

    <div class="checkout-grid">
      <!-- ── Columna izquierda ─────────────────────────────── -->
      <div class="checkout-formulario">
        <!-- Datos personales -->
        <div class="checkout-card">
          <div class="checkout-card-header">
            <div class="checkout-card-icono-wrap">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </div>
            <div>
              <h2 class="checkout-card-titulo">Tus datos</h2>
              <p class="checkout-card-sub">Información de contacto y entrega</p>
            </div>
          </div>

          <div class="checkout-campos">
            <div class="checkout-fila-2">
              <div class="checkout-campo">
                <label class="checkout-label" for="customerName"
                  >Nombre completo
                  <span class="checkout-requerido">*</span></label
                >
                <input
                  id="customerName"
                  name="customerName"
                  v-model="form.customerName"
                  type="text"
                  placeholder="Juan García"
                  autocomplete="name"
                  class="checkout-input"
                  :class="{
                    'checkout-input-error':
                      intentoEnviar && !form.customerName.trim(),
                  }"
                />
                <span
                  v-if="intentoEnviar && !form.customerName.trim()"
                  class="checkout-error-msg"
                  >Este campo es requerido</span
                >
              </div>
              <div class="checkout-campo">
                <label class="checkout-label" for="customerPhone"
                  >Teléfono</label
                >
                <input
                  id="customerPhone"
                  name="customerPhone"
                  v-model="form.customerPhone"
                  type="tel"
                  inputmode="tel"
                  placeholder="+51 996 111 303"
                  autocomplete="tel"
                  class="checkout-input"
                />
              </div>
            </div>

            <div class="checkout-campo">
              <label class="checkout-label" for="customerAddress"
                >Dirección de entrega</label
              >
              <input
                id="customerAddress"
                name="customerAddress"
                v-model="form.customerAddress"
                type="text"
                placeholder="Av. Principal 123, Lima"
                autocomplete="address-line1"
                class="checkout-input"
              />
            </div>

            <div class="checkout-campo">
              <label class="checkout-label" for="customerReference"
                >Referencia</label
              >
              <input
                id="customerReference"
                name="customerReference"
                v-model="form.customerReference"
                type="text"
                placeholder="Cerca al parque, edificio azul..."
                autocomplete="address-line2"
                class="checkout-input"
              />
            </div>

            <div class="checkout-campo">
              <label class="checkout-label" for="customerNotes"
                >Notas adicionales</label
              >
              <textarea
                id="customerNotes"
                name="customerNotes"
                v-model="form.customerNotes"
                placeholder="Hora de entrega preferida, instrucciones especiales..."
                autocomplete="off"
                class="checkout-input checkout-textarea"
                rows="3"
              />
            </div>
          </div>
        </div>

        <!-- Métodos de pago -->
        <div class="checkout-card">
          <div class="checkout-card-header">
            <div class="checkout-card-icono-wrap">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                />
              </svg>
            </div>
            <div>
              <h2 class="checkout-card-titulo">Método de pago</h2>
              <p class="checkout-card-sub">Selecciona cómo quieres pagar</p>
            </div>
          </div>

          <div class="checkout-metodos">
            <button
              v-for="pm in paymentMethods?.data"
              :key="pm.id"
              @click="form.paymentMethodId = pm.id"
              class="checkout-metodo-boton"
              :class="{ activo: form.paymentMethodId === pm.id }"
            >
              <div class="checkout-metodo-radio">
                <div class="checkout-metodo-radio-inner" />
              </div>
              <div class="checkout-metodo-info">
                <p class="checkout-metodo-label">{{ pm.label }}</p>
                <p v-if="pm.accountNumber" class="checkout-metodo-cuenta">
                  {{ pm.accountNumber }}
                </p>
              </div>
              <svg
                v-if="form.paymentMethodId === pm.id"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="checkout-metodo-check"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <p
              v-if="intentoEnviar && !form.paymentMethodId"
              class="checkout-error-msg"
              style="margin-top: 4px"
            >
              Selecciona un método de pago
            </p>
          </div>
        </div>

        <!-- Error global -->
        <div v-if="error" class="checkout-error-global">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="checkout-error-icono"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
          {{ error }}
        </div>

        <!-- Botón confirmar -->
        <button
          class="checkout-boton-confirmar"
          @click="submitOrder"
          :disabled="submitting"
        >
          <svg
            v-if="!submitting"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="checkout-boton-icono"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <svg
            v-else
            class="checkout-spinner"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span>
            {{ submitting ? "Procesando pedido..." : "Confirmar pedido" }}
            <ClientOnly v-if="!submitting">
              &nbsp;— {{ formatPrice.format(cartStore.total) }}
            </ClientOnly>
          </span>
        </button>

        <!-- Insignias de seguridad -->
        <!-- <div class="checkout-seguridad">
          <div class="checkout-seguridad-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="checkout-seguridad-icono"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
            Pago seguro
          </div>
          <div class="checkout-seguridad-punto" />
          <div class="checkout-seguridad-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="checkout-seguridad-icono"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
              />
            </svg>
            Datos protegidos
          </div>
          <div class="checkout-seguridad-punto" />
          <div class="checkout-seguridad-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="checkout-seguridad-icono"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
              />
            </svg>
            Envío confirmado
          </div>
        </div> -->
      </div>

      <!-- ── Resumen ─────────────────────────────────────────── -->
      <div class="checkout-resumen-wrap">
        <ClientOnly>
          <EcommerceResumenCarrito />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "landing", middleware: "auth-customer" });
useSeoMeta({ title: "Checkout — CelParts" });

const cartStore = useCartStore();
const formatPrice = useFormatPrice();
const router = useRouter();

onMounted(() => {
  if (cartStore.isEmpty) router.replace("/carrito");
});

const { data: paymentMethods } = await useFetch("/api/payment-methods", {
  query: { active: true },
});

const { user } = useUserSession();

const form = reactive({
  customerName: user.value?.name || "",
  customerPhone: user.value?.phone || "",
  customerAddress: "",
  customerReference: "",
  customerNotes: "",
  paymentMethodId: null as number | null,
});

const submitting = ref(false);
const error = ref("");
const intentoEnviar = ref(false);

const canSubmit = computed(
  () => form.customerName.trim().length >= 2 && form.paymentMethodId !== null,
);

async function submitOrder() {
  intentoEnviar.value = true;
  if (!canSubmit.value) return;
  submitting.value = true;
  error.value = "";
  try {
    const order = await $fetch<any>("/api/orders", {
      method: "POST",
      body: {
        ...form,
        items: cartStore.items.map((i) => ({
          productId: Number(i.id),
          quantity: Number((i as any).qty ?? (i as any).quantity ?? 0),
        })),
      },
    });
    cartStore.clear();
    await navigateTo(`/pedido/${order.orderCode}`);
  } catch (e: any) {
    error.value =
      e?.data?.message ?? "Error al procesar el pedido. Intenta nuevamente.";
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
/* ═══════════════════════════════════
   CHECKOUT — CELPARTS
   100% tokens de main.css
═══════════════════════════════════ */

/* ─── Página ────────────────────────────────────────────────── */
.checkout-pagina {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px 60px;
}

/* ─── Encabezado ───────────────────────────────────────────── */
.checkout-encabezado {
  margin-bottom: 32px;
}

.checkout-titulo {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 4vw, 1.75rem);
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 6px;
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.checkout-subtitulo {
  font-size: 0.9rem;
  color: var(--text-body);
  margin: 0;
}

/* ─── Grid ──────────────────────────────────────────────────── */
.checkout-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;
  align-items: start;
}

@media (max-width: 900px) {
  .checkout-grid {
    grid-template-columns: 1fr;
  }
  .checkout-resumen-wrap {
    order: -1;
  }
}

/* ─── Columna formulario ───────────────────────────────────── */
.checkout-formulario {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ─── Card base ─────────────────────────────────────────────── */
.checkout-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: var(--r-lg);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--card-shadow-sm);
}

.checkout-card-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.checkout-card-icono-wrap {
  width: 38px;
  height: 38px;
  border-radius: var(--r-sm);
  background: rgba(0, 174, 239, 0.06);
  border: 1px solid rgba(0, 174, 239, 0.14);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--cp-electric);
}

.checkout-card-icono-wrap svg {
  width: 18px;
  height: 18px;
}

.checkout-card-titulo {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 2px;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.checkout-card-sub {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin: 0;
}

/* ─── Campos ────────────────────────────────────────────────── */
.checkout-campos {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.checkout-fila-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

@media (max-width: 520px) {
  .checkout-fila-2 {
    grid-template-columns: 1fr;
  }
}

.checkout-campo {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.checkout-label {
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.checkout-requerido {
  color: var(--cp-electric);
  margin-left: 2px;
}

.checkout-input {
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border: 1px solid var(--border-light);
  border-radius: var(--r-sm);
  background: var(--bg-surface);
  color: var(--text-primary);
  font-size: 0.9rem;
  outline: none;
  transition:
    border-color var(--t-fast) var(--ease-smooth),
    box-shadow var(--t-fast) var(--ease-smooth);
  box-sizing: border-box;
  font-family: inherit;
}

.checkout-input::placeholder {
  color: var(--text-muted);
}

.checkout-input:focus {
  border-color: rgba(0, 174, 239, 0.5);
  box-shadow: 0 0 0 3px rgba(0, 174, 239, 0.10);
}

.checkout-input-error {
  border-color: rgba(220, 38, 38, 0.5) !important;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.08) !important;
}

.checkout-textarea {
  height: auto;
  padding: 10px 12px;
  resize: vertical;
  min-height: 80px;
}

.checkout-error-msg {
  font-size: 0.72rem;
  color: #dc2626;
  font-weight: 600;
}

/* ─── Métodos de pago ───────────────────────────────────────── */
.checkout-metodos {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checkout-metodo-boton {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 14px 16px;
  border: 1.5px solid var(--border-light);
  border-radius: var(--r-sm);
  background: var(--bg-surface);
  cursor: pointer;
  text-align: left;
  transition:
    border-color var(--t-fast) var(--ease-smooth),
    background var(--t-fast) var(--ease-smooth);
  position: relative;
}

.checkout-metodo-boton:hover {
  border-color: rgba(0, 174, 239, 0.3);
  background: rgba(0, 174, 239, 0.04);
}

.checkout-metodo-boton.activo {
  border-color: var(--cp-electric);
  background: rgba(0, 174, 239, 0.06);
}

.checkout-metodo-radio {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.5px solid var(--border-mid);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color var(--t-fast) var(--ease-smooth);
}

.checkout-metodo-boton.activo .checkout-metodo-radio {
  border-color: var(--cp-electric);
}

.checkout-metodo-radio-inner {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: transparent;
  transition: background var(--t-fast) var(--ease-smooth);
}

.checkout-metodo-boton.activo .checkout-metodo-radio-inner {
  background: var(--cp-electric);
}

.checkout-metodo-info {
  flex: 1;
}

.checkout-metodo-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.3;
}

.checkout-metodo-cuenta {
  font-size: 0.72rem;
  color: var(--text-muted);
  margin: 3px 0 0;
  font-family: monospace;
  letter-spacing: 0.04em;
}

.checkout-metodo-check {
  width: 18px;
  height: 18px;
  color: var(--cp-electric);
  flex-shrink: 0;
}

/* ─── Error global ──────────────────────────────────────────── */
.checkout-error-global {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: rgba(220, 38, 38, 0.05);
  border: 1px solid rgba(220, 38, 38, 0.2);
  border-radius: var(--r-sm);
  font-size: 0.875rem;
  font-weight: 500;
  color: #dc2626;
}

.checkout-error-icono {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* ─── Botón confirmar ───────────────────────────────────────── */
.checkout-boton-confirmar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 14px 20px;
  border: none;
  border-radius: var(--r-sm);
  cursor: pointer;
  transition:
    background var(--t-fast) var(--ease-smooth),
    transform var(--t-fast) var(--ease-snappy),
    box-shadow var(--t-fast) var(--ease-smooth);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(7, 30, 82, 0.15);
}

.checkout-boton-confirmar::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.12);
  opacity: 0;
  transition: opacity var(--t-fast) var(--ease-smooth);
}
.checkout-boton-confirmar:hover:not(:disabled)::before {
  opacity: 1;
}

.checkout-boton-confirmar:hover:not(:disabled) {
  background: var(--btn-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(7, 30, 82, 0.22);
  color: var(--btn-primary-text);
}

.checkout-boton-confirmar:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: none;
}

.checkout-boton-confirmar:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.checkout-boton-icono {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.checkout-spinner {
  width: 17px;
  height: 17px;
  animation: spin 0.75s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ─── Seguridad ─────────────────────────────────────────────── */
.checkout-seguridad {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.checkout-seguridad-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 500;
  color: var(--text2);
}

.checkout-seguridad-icono {
  width: 13px;
  height: 13px;
  color: var(--green);
  flex-shrink: 0;
}

.checkout-seguridad-punto {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(226, 224, 217, 0.9);
  flex-shrink: 0;
}

/* ─── Resumen sticky ────────────────────────────────────────── */
.checkout-resumen-wrap {
  position: sticky;
  top: 24px;
}

@media (max-width: 900px) {
  .checkout-resumen-wrap {
    position: static;
  }
  .checkout-pagina {
    padding: 24px 16px 48px;
  }
}
</style>
