<template>
  <div class="orders-page">
    <div class="sp-page-toolbar">
      <div>
        <h1 class="sp-page-toolbar__title">Pedidos</h1>
        <p class="sp-page-toolbar__sub">
          {{ filteredOrders.length }} pedidos
          {{ statusFilter ? "filtrados" : "en total" }}
        </p>
      </div>
    </div>

    <!-- Filtros -->
    <div class="orders-filters">
      <button
        v-for="s in statusOptions"
        :key="s.value"
        class="orders-filter-btn"
        :class="{ 'orders-filter-btn--active': statusFilter === s.value }"
        @click="statusFilter = s.value"
      >
        {{ s.label }}
      </button>
    </div>

    <!-- Tabla -->
    <div class="sp-table-wrap">
      <div class="sp-table-scroll">
        <table class="sp-table">
          <thead>
            <tr>
              <th class="sp-th">Código</th>
              <th class="sp-th">Cliente</th>
              <th class="sp-th">Total</th>
              <th class="sp-th">Estado</th>
              <th class="sp-th">Fecha</th>
              <th class="sp-th" style="width: 60px" />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in filteredOrders"
              :key="order.id"
              class="sp-tr sp-tr--clickable"
              @click="openOrder(order.id)"
            >
              <td class="sp-td">
                <span class="orders-code">{{ order.orderCode }}</span>
              </td>
              <td class="sp-td">
                <p class="sp-table-title">{{ order.customerName }}</p>
              </td>
              <td class="sp-td">
                <span class="sp-table-amount">{{
                  formatPrice.format(order.total)
                }}</span>
              </td>
              <td class="sp-td">
                <AdminEtiquetaEstadoPedido :status="order.status" />
              </td>
              <td class="sp-td sp-td--muted">
                <span class="orders-date">
                  {{ formatDateTime(order.createdAt) }}
                </span>
              </td>
              <td class="sp-td" @click.stop>
                <button
                  class="sp-table-btn sp-table-btn--view"
                  title="Ver pedido"
                  @click="openOrder(order.id)"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <ellipse
                      cx="8"
                      cy="8"
                      rx="6"
                      ry="4"
                      stroke="currentColor"
                      stroke-width="1.4"
                    />
                    <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                  </svg>
                </button>
              </td>
            </tr>

            <tr v-if="!filteredOrders.length">
              <td colspan="6" class="sp-table-empty">
                <div class="sp-table-empty__inner">
                  <div class="sp-table-empty__icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <rect
                        x="2"
                        y="7"
                        width="20"
                        height="14"
                        rx="2"
                        stroke="currentColor"
                        stroke-width="1.5"
                      />
                      <path
                        d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"
                        stroke="currentColor"
                        stroke-width="1.5"
                      />
                    </svg>
                  </div>
                  <p class="sp-table-empty__msg">
                    No hay pedidos{{ statusFilter ? " con este estado" : "" }}
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="modalOpen"
          class="modal-backdrop"
          @click.self="modalOpen = false"
        >
          <div class="modal-box">
            <PedidoModal
              v-if="selectedOrderId"
              :order-id="selectedOrderId"
              @close="modalOpen = false"
              @updated="onOrderUpdated"
            />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import PedidoModal from "./pedidoModal.vue";

definePageMeta({ middleware: "auth", layout: "admin" });
useSeoMeta({ title: "Pedidos — Admin" });

const { data: ordersData, refresh } = await useFetch("/api/admin/orders");
const formatPrice = useFormatPrice();
const { formatDateTime } = useFormatDateTime();
const statusFilter = ref("");
const modalOpen = ref(false);
const selectedOrderId = ref<number | null>(null);

const statusOptions = [
  { value: "", label: "Todos" },
  { value: "pending", label: "Pendientes" },
  { value: "voucher_sent", label: "Comprobante enviado" },
  { value: "payment_validated", label: "Pago validado" },
  { value: "in_preparation", label: "En preparación" },
  { value: "delivered", label: "Entregados" },
  { value: "cancelled", label: "Cancelados" },
];

const filteredOrders = computed(() => {
  const orders = ordersData.value?.data ?? [];
  if (!statusFilter.value) return orders;
  return orders.filter((o: any) => o.status === statusFilter.value);
});

function openOrder(id: number) {
  selectedOrderId.value = id;
  modalOpen.value = true;
}

async function onOrderUpdated() {
  await refresh();
}

// Cerrar con Escape
onMounted(() => {
  window.addEventListener("keydown", onKeydown);
});
onUnmounted(() => {
  window.removeEventListener("keydown", onKeydown);
});
function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") modalOpen.value = false;
}
</script>

<style scoped>
.orders-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* ── Filtros ── */
.orders-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.orders-filter-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.85rem;
  border-radius: var(--sp-radius-pill);
  border: 1px solid var(--sp-border);
  background: var(--sp-surface-subtle);
  color: var(--sp-text-muted);
  font-size: var(--sp-text-xs);
  font-weight: 600;
  font-family: var(--sp-font);
  cursor: pointer;
  transition:
    background var(--sp-t-fast) var(--sp-ease),
    color var(--sp-t-fast) var(--sp-ease),
    border-color var(--sp-t-fast) var(--sp-ease);
  white-space: nowrap;
}
.orders-filter-btn:hover {
  background: var(--sp-surface-solid);
  color: var(--sp-text);
}
.orders-filter-btn--active {
  background: var(--sp-primary-soft);
  color: var(--sp-primary-ink);
  border-color: rgba(53, 109, 255, 0.22);
  box-shadow: 0 2px 8px rgba(53, 109, 255, 0.1);
}

/* ── Row clickable ── */
.sp-tr--clickable {
  cursor: pointer;
}
.sp-tr--clickable:hover td {
  background: var(--sp-surface-subtle, #f9f9f9);
}

/* ── Código ── */
.orders-code {
  font-family: "Courier New", Courier, monospace;
  font-size: var(--sp-text-sm);
  font-weight: 700;
  color: var(--sp-primary);
  letter-spacing: 0.02em;
}

/* ── Fecha ── */
.orders-date {
  font-size: var(--sp-text-xs);
  font-variant-numeric: tabular-nums;
}
</style>
