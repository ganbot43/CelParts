<template>
  <div v-if="pending" class="cp-loading">
    Cargando detalles del pedido...
  </div>
  <div v-else-if="!order" class="cp-empty">
    <p>No se encontró el pedido o no tienes permiso para verlo.</p>
    <NuxtLink to="/mi-cuenta/pedidos" class="cp-btn">Volver a mis pedidos</NuxtLink>
  </div>
  <div v-else>
    <div class="cp-detail-header">
      <div>
        <NuxtLink to="/mi-cuenta/pedidos" class="cp-back-link">← Volver a Mis Pedidos</NuxtLink>
        <h1 class="cp-portal-title">Pedido {{ order.orderCode }}</h1>
        <p class="cp-portal-desc">
          Realizado el {{ new Date(order.createdAt).toLocaleDateString() }}
        </p>
      </div>
      <div>
        <span class="cp-badge" :class="`badge-${order.status}`">
          {{ traducirEstado(order.status) }}
        </span>
      </div>
    </div>

    <div class="cp-detail-grid">
      <!-- Columna Principal -->
      <div class="cp-detail-main">
        <h2 class="cp-section-title">Artículos del Pedido</h2>
        <div class="cp-table-wrap">
          <table class="cp-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cant.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in order.items" :key="item.id">
                <td class="cp-product-cell">{{ item.productName }}</td>
                <td>{{ formatPrice.format(item.unitPrice) }}</td>
                <td>{{ item.quantity }}</td>
                <td class="cp-price-cell">{{ formatPrice.format(item.subtotal) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="cp-tfoot-label">Total</td>
                <td class="cp-tfoot-value">{{ formatPrice.format(order.total) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Columna Lateral -->
      <div class="cp-detail-side">
        <h2 class="cp-section-title">Detalles de Entrega</h2>
        <div class="cp-info-card">
          <p><strong>Destinatario:</strong><br>{{ order.customerName }}</p>
          <p><strong>Teléfono:</strong><br>{{ order.customerPhone || 'N/A' }}</p>
          <p><strong>Dirección:</strong><br>{{ order.customerAddress || 'N/A' }}</p>
          <p><strong>Referencia:</strong><br>{{ order.customerReference || 'N/A' }}</p>
        </div>

        <h2 class="cp-section-title mt-4">Historial de Estados</h2>
        <div class="cp-timeline">
          <div v-for="log in order.statusLogs" :key="log.id" class="cp-timeline-item">
            <div class="cp-timeline-dot"></div>
            <div class="cp-timeline-content">
              <p class="cp-timeline-status">{{ traducirEstado(log.status) }}</p>
              <p class="cp-timeline-date">{{ new Date(log.createdAt).toLocaleString() }}</p>
              <p v-if="log.note" class="cp-timeline-note">{{ log.note }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const formatPrice = useFormatPrice();

const { data: order, pending } = await useFetch<any>(`/api/my-orders/${route.params.code}`);

useSeoMeta({ title: `Pedido ${route.params.code} — CelParts` });

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
.cp-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--border-light);
}

.cp-back-link {
  font-size: 0.85rem;
  color: var(--text-muted);
  text-decoration: none;
  margin-bottom: var(--space-2);
  display: inline-block;
  transition: color var(--t-fast);
}

.cp-back-link:hover {
  color: var(--cp-electric);
}

.cp-portal-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 4px;
  letter-spacing: -0.02em;
}

.cp-portal-desc {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0;
}

.cp-detail-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: var(--space-6);
}

@media (max-width: 900px) {
  .cp-detail-grid {
    grid-template-columns: 1fr;
  }
}

.cp-section-title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--space-3);
}

.mt-4 {
  margin-top: var(--space-6);
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
  color: var(--text-body);
}

.cp-product-cell {
  font-weight: 500;
  color: var(--text-primary) !important;
}

.cp-price-cell {
  font-weight: 600;
  color: var(--text-primary) !important;
}

.cp-tfoot-label {
  text-align: right;
  font-weight: 700;
  padding: 16px;
  background: rgba(0, 0, 0, 0.01);
}

.cp-tfoot-value {
  font-weight: 800;
  font-size: 1.1rem;
  color: var(--cp-electric) !important;
  padding: 16px;
  background: rgba(0, 0, 0, 0.01);
}

.cp-info-card {
  background: rgba(0, 0, 0, 0.02);
  padding: var(--space-4);
  border-radius: var(--r-md);
  border: 1px solid var(--border-light);
}

.cp-info-card p {
  margin: 0 0 12px;
  font-size: 0.9rem;
  color: var(--text-body);
  line-height: 1.4;
}

.cp-info-card p:last-child {
  margin-bottom: 0;
}

.cp-info-card strong {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  display: block;
  margin-bottom: 2px;
}

/* Timeline */
.cp-timeline {
  position: relative;
  padding-left: 12px;
}

.cp-timeline::before {
  content: '';
  position: absolute;
  left: 3px;
  top: 8px;
  bottom: 0;
  width: 2px;
  background: var(--border-light);
}

.cp-timeline-item {
  position: relative;
  margin-bottom: var(--space-4);
}

.cp-timeline-item:last-child {
  margin-bottom: 0;
}

.cp-timeline-dot {
  position: absolute;
  left: -12px;
  top: 5px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border-mid);
  border: 2px solid var(--bg-surface);
}

.cp-timeline-item:first-child .cp-timeline-dot {
  background: var(--cp-electric);
  box-shadow: 0 0 0 2px rgba(0, 174, 239, 0.2);
}

.cp-timeline-content {
  padding-left: var(--space-3);
}

.cp-timeline-status {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-primary);
  margin: 0;
}

.cp-timeline-date {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 2px 0 4px;
}

.cp-timeline-note {
  font-size: 0.85rem;
  color: var(--text-body);
  margin: 0;
  background: rgba(0, 0, 0, 0.02);
  padding: 6px 10px;
  border-radius: var(--r-sm);
  border: 1px solid var(--border-light);
}

.cp-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-pending { background: rgba(245, 158, 11, 0.1); color: #d97706; }
.badge-voucher_sent { background: rgba(59, 130, 246, 0.1); color: #2563eb; }
.badge-payment_validated { background: rgba(99, 102, 241, 0.1); color: #4f46e5; }
.badge-in_preparation { background: rgba(139, 92, 246, 0.1); color: #7c3aed; }
.badge-delivered { background: rgba(16, 185, 129, 0.1); color: #059669; }
.badge-cancelled { background: rgba(239, 68, 68, 0.1); color: #dc2626; }

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
</style>
