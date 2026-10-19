<template>
  <div class="paypal-wrapper">
    <div v-if="loadingSdk" class="paypal-loading">
      <span class="paypal-spinner" />
      <span>Cargando pasarela de PayPal...</span>
    </div>

    <!-- Error al cargar SDK o procesar -->
    <div v-if="sdkError" class="paypal-alert paypal-alert--error" role="alert">
      <span>{{ sdkError }}</span>
      <button type="button" class="paypal-retry-btn" @click="initPayPal">
        Reintentar
      </button>
    </div>

    <!-- Mensaje si faltan completar datos del cliente -->
    <div v-if="!canSubmit" class="paypal-hint">
      Completa tus datos de entrega arriba para habilitar el pago con PayPal.
    </div>

    <!-- Contenedor oficial donde PayPal inyecta el botón -->
    <div
      ref="paypalContainerRef"
      class="paypal-container"
      :class="{ 'is-disabled': !canSubmit || processing }"
    />

    <!-- Estado procesando pago -->
    <div v-if="processing" class="paypal-processing-overlay">
      <div class="paypal-spinner" />
      <p class="paypal-processing-text">Confirmando pago con PayPal, por favor espera...</p>
    </div>

    <!-- Conversión estimada transparente para el cliente -->
    <div v-if="usdEstimate" class="paypal-conversion-notice">
      <span>Monto a pagar en PayPal: <strong>${{ usdEstimate }} USD</strong></span>
      <span class="paypal-conversion-rate">(Tipo de cambio ref.: 1 USD ≈ S/. {{ exchangeRate }})</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { loadScript } from '@paypal/paypal-js'

const props = defineProps<{
  amountPen: number
  canSubmit: boolean
  customerData: {
    customerName: string
    customerPhone?: string
    customerAddress?: string
    customerReference?: string
    customerNotes?: string
    paymentMethodId: number | null
  }
  items: Array<{ productId: number; quantity: number }>
}>()

const emit = defineEmits<{
  (e: 'success', payload: { orderCode: string; captureId?: string }): void
  (e: 'error', message: string): void
}>()

const config = useRuntimeConfig()
const clientId = (config.public?.paypalClientId as string) || 'sb'
const currency = (config.public?.paypalCurrency as string) || 'USD'
const exchangeRate = Number(config.public?.paypalExchangeRate) || 3.75

const paypalContainerRef = ref<HTMLElement | null>(null)
const loadingSdk = ref(true)
const sdkError = ref('')
const processing = ref(false)
const currentOrderCode = ref('')

const usdEstimate = computed(() => {
  if (!props.amountPen) return '0.00'
  return (props.amountPen / exchangeRate).toFixed(2)
})

let paypalButtonsInstance: any = null

async function initPayPal() {
  sdkError.value = ''
  loadingSdk.value = true

  try {
    const paypal = await loadScript({
      clientId: clientId || 'test',
      currency: currency,
      intent: 'capture',
      components: 'buttons',
      disableFunding: ['card', 'credit'],
    })

    if (!paypal || !paypal.Buttons) {
      throw new Error('No se pudo inicializar la librería de PayPal.')
    }

    if (!paypalContainerRef.value) return

    // Limpiar contenedor previo
    paypalContainerRef.value.innerHTML = ''

    paypalButtonsInstance = paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal',
        height: 48,
      },
      onClick: (_data: any, actions: any) => {
        if (!props.canSubmit) {
          emit('error', 'Por favor completa todos tus datos de entrega obligatorios.')
          return actions.reject()
        }
        return actions.resolve()
      },
      createOrder: async (_data: any, actions: any) => {
        try {
          sdkError.value = ''
          // La orden se persiste antes de abrir el popup de PayPal.
          const res = await $fetch<{
            paypalOrderId: string
            orderCode: string
            amountPayPal?: number
            isMock?: boolean
          }>('/api/payments/paypal/create-order', {
            method: 'POST',
            body: {
              ...props.customerData,
              items: props.items,
            },
          })

          currentOrderCode.value = res.orderCode

          // Si el backend se comunicó con PayPal API real y tiene token válido
          if (res.paypalOrderId && !res.isMock && !res.paypalOrderId.startsWith('PAYPAL-TEST-')) {
            return res.paypalOrderId
          }

          // Si estamos en modo Sandbox con client-id=sb, dejamos que el SDK de PayPal
          // cree la orden directamente en el Sandbox de PayPal:
          const usdVal = (res.amountPayPal || Number((props.amountPen / exchangeRate).toFixed(2))).toFixed(2)
          return actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [
              {
                reference_id: res.orderCode,
                description: `Pedido ${res.orderCode} - CelParts`,
                amount: {
                  currency_code: currency,
                  value: usdVal,
                },
              },
            ],
          })
        } catch (err: any) {
          const msg = err?.data?.message || err?.message || 'Error al iniciar la orden de PayPal.'
          sdkError.value = msg
          emit('error', msg)
          throw err
        }
      },
      onApprove: async (data: any, actions: any) => {
        processing.value = true
        try {
          let captureId = data.orderID
          // Si el SDK puede capturar en el cliente (sandbox directo)
          if (actions?.order?.capture) {
            try {
              const details = await actions.order.capture()
              captureId = details.id || details.purchase_units?.[0]?.payments?.captures?.[0]?.id || data.orderID
            } catch (captureErr) {
              console.warn('Captura cliente fallback a backend:', captureErr)
            }
          }

          // Notificar a CelParts para validar el pedido en la BD
          const captureRes = await $fetch<{
            success: boolean
            orderCode: string
            captureId?: string
          }>('/api/payments/paypal/capture-order', {
            method: 'POST',
            body: {
              paypalOrderId: data.orderID,
              orderCode: currentOrderCode.value || data.referenceID || '',
              captureId,
            },
          })

          emit('success', {
            orderCode: captureRes.orderCode,
            captureId: captureRes.captureId || captureId,
          })
        } catch (err: any) {
          const msg = err?.data?.message || err?.message || 'No se pudo confirmar la transacción en PayPal.'
          sdkError.value = msg
          emit('error', msg)
        } finally {
          processing.value = false
        }
      },
      onError: (err: any) => {
        console.error('PayPal Buttons error:', err)
        // No bloquear la experiencia, permitir reintentar o usar la simulación demo
        sdkError.value = 'El sandbox de PayPal respondió con un aviso. Puedes usar la demostración rápida abajo.'
      },
      onCancel: () => {
        emit('error', 'Transacción de PayPal cancelada por el usuario.')
      },
    })

    if (paypalButtonsInstance.isEligible()) {
      await paypalButtonsInstance.render(paypalContainerRef.value)
    } else {
      throw new Error('Los botones de PayPal no son elegibles en este navegador.')
    }
  } catch (err: any) {
    console.error('Error cargando SDK de PayPal:', err)
    sdkError.value = err?.message || 'No se pudo cargar la pasarela de PayPal.'
  } finally {
    loadingSdk.value = false
  }
}

onMounted(() => {
  initPayPal()
})

onBeforeUnmount(() => {
  if (paypalButtonsInstance && typeof paypalButtonsInstance.close === 'function') {
    try {
      paypalButtonsInstance.close()
    } catch {
      // Ignorar error al desmontar
    }
  }
})
</script>

<style scoped>
.paypal-wrapper {
  margin-top: 1rem;
  padding: 1.25rem;
  background: var(--surface-2, #f9fafb);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: var(--radius-lg, 0.75rem);
  position: relative;
  overflow: hidden;
  isolation: isolate;
  z-index: 1;
}

.paypal-container {
  min-height: 48px;
  position: relative;
  z-index: 1;
  max-width: 100%;
}

.paypal-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  color: var(--text-muted, #64748b);
  font-size: 0.9rem;
}

.paypal-spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--border-color, #e2e8f0);
  border-top-color: #0079C1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.paypal-alert {
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md, 0.5rem);
  font-size: 0.875rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.paypal-alert--error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.paypal-retry-btn {
  font-weight: 600;
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
}

.paypal-hint {
  font-size: 0.825rem;
  color: #b45309;
  background: #fef3c7;
  border: 1px solid #fde68a;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm, 0.375rem);
  margin-bottom: 0.75rem;
  text-align: center;
}

.paypal-container {
  min-height: 48px;
  transition: opacity 0.2s ease;
}

.paypal-container.is-disabled {
  opacity: 0.5;
  pointer-events: none;
}

.paypal-processing-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.92);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  z-index: 10;
}

.paypal-processing-text {
  font-size: 0.9rem;
  font-weight: 500;
  color: #1e293b;
}

.paypal-conversion-notice {
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 0.8rem;
  color: var(--text-muted, #64748b);
  text-align: center;
}

.paypal-conversion-rate {
  font-size: 0.75rem;
  opacity: 0.85;
}
</style>
