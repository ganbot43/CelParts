<template>
  <div>
    <h1 class="cp-portal-title">Resumen de mi cuenta</h1>
    <p class="cp-portal-desc">
      Hola, <strong>{{ user?.name }}</strong>. Desde el panel de control de tu cuenta puedes visualizar tu actividad reciente y gestionar tu información.
    </p>

    <div class="cp-portal-dashboard-grid">
      <div class="cp-portal-stat">
        <div class="cp-stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
        </div>
        <div>
          <p class="cp-stat-label">Pedidos Totales</p>
          <p class="cp-stat-value" v-if="pending">{{ pending ? '-' : orders?.length || 0 }}</p>
          <p class="cp-stat-value" v-else>{{ orders?.length || 0 }}</p>
        </div>
      </div>
      
      <div class="cp-portal-stat">
        <div class="cp-stat-icon cp-stat-electric">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
          </svg>
        </div>
        <div>
          <p class="cp-stat-label">Beneficios</p>
          <p class="cp-stat-value">Activo</p>
        </div>
      </div>
    </div>

    <div class="cp-portal-recent">
      <div class="cp-recent-header">
        <h2 class="cp-portal-subtitle">Pedidos Recientes</h2>
        <NuxtLink to="/mi-cuenta/pedidos" class="cp-recent-link">Ver todos</NuxtLink>
      </div>

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
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders.slice(0, 3)" :key="order.id">
              <td>
                <NuxtLink :to="`/mi-cuenta/pedidos/${order.orderCode}`" class="cp-order-link">
                  {{ order.orderCode }}
                </NuxtLink>
              </td>
              <td>{{ new Date(order.createdAt).toLocaleDateString() }}</td>
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
  </div>
</template>

<script setup lang="ts">
const { user } = useUserSession();
const { data: orders, pending } = await useFetch<any[]>('/api/my-orders');
const formatPrice = useFormatPrice();

useSeoMeta({ title: "Mi Cuenta — CelParts" });

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

.cp-portal-subtitle {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.cp-portal-dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

.cp-portal-stat {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: var(--r-md);
}

.cp-stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--r-sm);
  background: rgba(0, 0, 0, 0.04);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cp-stat-icon svg {
  width: 24px;
  height: 24px;
}

.cp-stat-electric {
  background: rgba(0, 174, 239, 0.08);
  color: var(--cp-electric);
}

.cp-stat-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
  margin: 0 0 2px;
}

.cp-stat-value {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
  line-height: 1;
}

.cp-recent-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.cp-recent-link {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--cp-electric);
  text-decoration: none;
}

.cp-recent-link:hover {
  text-decoration: underline;
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
