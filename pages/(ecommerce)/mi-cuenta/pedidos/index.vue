<template>
  <div>
    <h1 class="cp-portal-title">Historial de Pedidos</h1>
    <p class="cp-portal-desc">
      Aquí puedes ver todos los pedidos que has realizado. Haz clic en el código de pedido para ver más detalles y el estado de entrega.
    </p>

    <div v-if="pending" class="cp-loading">
      Cargando pedidos...
    </div>
    <div v-else-if="!orders?.length" class="cp-empty">
      <p>Aún no has realizado ningún pedido.</p>
      <NuxtLink to="/productos" class="cp-btn">Empezar a comprar</NuxtLink>
    </div>
    <div v-else class="cp-table-wrap">
      <table class="cp-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Fecha</th>
            <th>Artículos</th>
            <th>Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>
              <NuxtLink :to="`/mi-cuenta/pedidos/${order.orderCode}`" class="cp-order-link">
                {{ order.orderCode }}
              </NuxtLink>
            </td>
            <td>{{ new Date(order.createdAt).toLocaleDateString() }}</td>
            <td>{{ calcularArticulos(order.items) }}</td>
            <td>{{ formatPrice.format(order.total) }}</td>
            <td>
              <span class="cp-badge" :class="`badge-${order.status}`">
                {{ traducirEstado(order.status) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: orders, pending } = await useFetch<any[]>('/api/my-orders');
const formatPrice = useFormatPrice();

useSeoMeta({ title: "Mis Pedidos — CelParts" });

function calcularArticulos(items: any[]) {
  if (!items || !items.length) return 0;
  return items.reduce((acc, curr) => acc + curr.quantity, 0);
}

function traducirEstado(status: string) {
  const map: Record<string, string> = {
    pending: 'Pendiente',
    voucher_sent: 'Comprobante Enviado',
    payment_validated: 'Pago Validado',
    in_preparation: 'En Preparación',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  };
  return map[status] || status;
}
</script>

<style scoped>
.cp-portal-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 8px;
  letter-spacing: -0.02em;
}

.cp-portal-desc {
  font-size: 0.95rem;
  color: var(--text-body);
  margin: 0 0 32px;
  max-width: 600px;
}

.cp-empty {
  padding: var(--space-8);
  text-align: center;
  background: rgba(0, 0, 0, 0.02);
  border-radius: var(--r-md);
  border: 1px dashed var(--border-light);
}

.cp-empty p {
  color: var(--text-muted);
  margin-bottom: var(--space-4);
}

.cp-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--cp-electric);
  color: white;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: var(--r-sm);
  text-decoration: none;
  transition: all var(--t-fast);
}

.cp-btn:hover {
  background: var(--cp-dark);
}

.cp-table-wrap {
  overflow-x: auto;
  border: 1px solid var(--border-light);
  border-radius: var(--r-md);
}

.cp-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
}

.cp-table th {
  background: rgba(0, 0, 0, 0.02);
  padding: 12px 16px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--border-light);
}

.cp-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-light);
  color: var(--text-primary);
}

.cp-table tr:last-child td {
  border-bottom: none;
}

.cp-order-link {
  font-weight: 700;
  color: var(--cp-electric);
  text-decoration: none;
}

.cp-order-link:hover {
  text-decoration: underline;
}

.cp-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-pending { background: rgba(245, 158, 11, 0.1); color: #d97706; }
.badge-voucher_sent { background: rgba(59, 130, 246, 0.1); color: #2563eb; }
.badge-payment_validated { background: rgba(99, 102, 241, 0.1); color: #4f46e5; }
.badge-in_preparation { background: rgba(139, 92, 246, 0.1); color: #7c3aed; }
.badge-delivered { background: rgba(16, 185, 129, 0.1); color: #059669; }
.badge-cancelled { background: rgba(239, 68, 68, 0.1); color: #dc2626; }
</style>
