<template>
  <div class="dash-page">
    <!-- Toolbar -->
    <div class="sp-page-toolbar" style="margin-bottom: 1.75rem">
      <div>
        <h1 class="sp-page-toolbar__title">Panel de Control (SuperAdmin)</h1>
        <p class="sp-page-toolbar__sub">
          Gestión centralizada del sistema Arigumi · {{ today }}
        </p>
      </div>
      <div class="dash-live-dot" title="Sistema en línea">
        <span class="dash-live-pulse" />
        En línea
      </div>
    </div>

    <div class="dash-content admin-fade-in" style="animation-delay: 180ms">
      
      <!-- KPIs -->
      <div class="dash-kpi-grid">
        <div class="kpi-card">
          <div class="kpi-icon users-icon"><Users /></div>
          <div class="kpi-info">
            <span class="kpi-label">Usuarios Totales</span>
            <span class="kpi-value">{{ totalUsers }}</span>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon products-icon"><Package /></div>
          <div class="kpi-info">
            <span class="kpi-label">Productos Listados</span>
            <span class="kpi-value">{{ totalProducts }}</span>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon claims-icon"><AlertTriangle /></div>
          <div class="kpi-info">
            <span class="kpi-label">Reclamos Abiertos</span>
            <span class="kpi-value">{{ pendingComplaints }}</span>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon categories-icon"><List /></div>
          <div class="kpi-info">
            <span class="kpi-label">Categorías</span>
            <span class="kpi-value">{{ totalCategories }}</span>
          </div>
        </div>
      </div>

      <!-- Main Dash Content (Charts & Actions) -->
      <div class="dash-main-grid">
        
        <!-- Gráfico Principal -->
        <div class="dash-card">
          <div class="dash-section-header">
            <h2 class="dash-section-title">Crecimiento (Últimos 7 días)</h2>
          </div>
          <div class="dash-chart-wrapper">
            <ClientOnly>
              <ActivityChart :new-users="usersRaw" :recent-complaints="complaintsRaw" />
              <template #fallback>
                <div class="dash-loading" style="height: 320px">Cargando gráfico...</div>
              </template>
            </ClientOnly>
          </div>
        </div>

        <!-- Quick Actions Side -->
        <div class="dash-card">
          <div class="dash-section-header">
            <h2 class="dash-section-title">Accesos Rápidos</h2>
          </div>
          <div class="qa-grid">
            <NuxtLink to="/admin/configuracion" class="qa-btn">
              <Settings class="qa-icon" />
              <div class="qa-text">
                <strong>Configuración Global</strong>
                <span>Contacto, Logo, Whatsapp</span>
              </div>
            </NuxtLink>

            <NuxtLink to="/admin/categorias" class="qa-btn">
              <Tags class="qa-icon" />
              <div class="qa-text">
                <strong>Categorías</strong>
                <span>Taxonomía del catálogo</span>
              </div>
            </NuxtLink>
          </div>
        </div>

      </div>

      <!-- Reclamaciones Recientes -->
      <div class="dash-card" style="margin-top: 1.5rem">
        <div class="dash-section-header">
          <h2 class="dash-section-title">Últimas Reclamaciones</h2>
          <NuxtLink to="/admin/reclamaciones" class="dash-link">Ver todas</NuxtLink>
        </div>
        <div class="dash-table-wrapper">
          <table class="dash-table" v-if="recentComplaints.length > 0">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Usuario</th>
                <th>Asunto</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in recentComplaints" :key="c.id">
                <td>{{ formatDate(c.createdAt) }}</td>
                <td>{{ c.customerName || 'Anónimo' }}</td>
                <td class="truncate" style="max-width: 300px;">{{ c.tipoReclamo || c.descripcion || '' }}</td>
                <td>
                  <span :class="['status-badge', c.estado?.toLowerCase() || '']">
                    {{ c.estado === 'OPEN' ? 'ABIERTO' : c.estado === 'IN_PROGRESS' ? 'EN PROCESO' : c.estado === 'RESOLVED' ? 'RESUELTO' : (c.estado || 'DESCONOCIDO') }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="empty-state">
            <CheckCircle style="margin-bottom: 8px; color: var(--sp-success); display: block; margin: 0 auto" :size="32" />
            Excelente, no hay reclamaciones pendientes.
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Users, Package, AlertTriangle, List, Settings, Image, Tags, CheckCircle } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import ActivityChart from '~/components/admin/ActivityChart.vue'

definePageMeta({ middleware: "auth", layout: "admin" });
useSeoMeta({ title: "Dashboard — Admin" });

const today = new Intl.DateTimeFormat("es-PE", {
  timeZone: "America/Lima",
  weekday: "long",
  day: "numeric",
  month: "long",
}).format(new Date());

const authStore = useAuthStore()

// Fetching con useFetch asegura que SSR funciona bien y extrae automáticamente "data"
const { data: rawUsers } = await useFetch<any[]>('/api/admin/users')
const { data: rawProducts } = await useFetch<any>('/api/products')
const { data: rawComplaints } = await useFetch<any>('/api/admin/reclamaciones')
const { data: rawCategories } = await useFetch<any>('/api/admin/categories')

// Extracción Segura
const usersRaw = computed(() => rawUsers.value || [])
const productsRaw = computed(() => rawProducts.value?.data || rawProducts.value || [])
const complaintsRaw = computed(() => rawComplaints.value?.data || rawComplaints.value || [])
const categoriesRaw = computed(() => rawCategories.value?.data || rawCategories.value || [])

// KPIs
const totalUsers = computed(() => usersRaw.value.length)
const totalProducts = computed(() => productsRaw.value.length)
const totalCategories = computed(() => categoriesRaw.value.filter((c:any) => c.isActive === 1).length)

const pendingComplaints = computed(() => {
  return complaintsRaw.value.filter((c:any) => c.estado !== 'RESOLVED' && c.estado !== 'CLOSED').length
})

const recentComplaints = computed(() => {
  return [...complaintsRaw.value]
    .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.dash-page {
  padding: 1.5rem;
}

/* ── Live indicator ── */
.dash-live-dot {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: var(--sp-text-xs);
  font-weight: 700;
  color: var(--sp-text-soft);
  background: var(--sp-surface-subtle);
  border: 1px solid var(--sp-border);
  border-radius: var(--sp-radius-pill);
  padding: 0.3rem 0.7rem;
  font-family: var(--sp-font);
}
.dash-live-pulse {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--sp-success);
  position: relative;
  flex-shrink: 0;
}
.dash-live-pulse::after {
  content: "";
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  background: var(--sp-success);
  opacity: 0.3;
  animation: dash-pulse 1.8s ease-in-out infinite;
}
@keyframes dash-pulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.9); opacity: 0; }
}

/* ── Grid KPIs ── */
.dash-kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}
.kpi-card {
  background: var(--sp-surface-solid);
  border: 1px solid var(--sp-border);
  border-radius: var(--sp-radius-xl);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  transition: transform var(--sp-t-fast), box-shadow var(--sp-t-fast);
}
.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
}
.kpi-icon {
  width: 54px;
  height: 54px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.kpi-icon svg { width: 24px; height: 24px; stroke-width: 2.2; }
.users-icon { background: #e0e7ff; color: #4338ca; }
.products-icon { background: #dcfce7; color: #15803d; }
.claims-icon { background: #fee2e2; color: #b91c1c; }
.categories-icon { background: #fef9c3; color: #a16207; }

.kpi-info {
  display: flex;
  flex-direction: column;
}
.kpi-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--sp-text-soft);
  font-weight: 700;
  margin-bottom: 2px;
}
.kpi-value {
  font-family: var(--sp-font-display);
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--sp-text-strong);
  line-height: 1;
}

/* ── Main Dash Grid ── */
.dash-main-grid {
  display: grid;
  grid-template-columns: 2.5fr 1fr;
  gap: 1.5rem;
}
@media (max-width: 1024px) {
  .dash-main-grid { grid-template-columns: 1fr; }
}

/* ── Card (General) ── */
.dash-card {
  background: var(--sp-surface-solid);
  border: 1px solid var(--sp-border);
  border-radius: var(--sp-radius-xl);
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}

.dash-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}
.dash-section-title {
  font-family: var(--sp-font);
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--sp-text-strong);
  letter-spacing: -0.01em;
}
.dash-link {
  font-size: 0.8rem;
  color: var(--sp-primary);
  font-weight: 600;
  text-decoration: none;
}
.dash-link:hover { text-decoration: underline; }

/* ── Table ── */
.dash-table-wrapper {
  overflow-x: auto;
}
.dash-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}
.dash-table th, .dash-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid var(--sp-border);
}
.dash-table th {
  color: var(--sp-text-soft);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 0.05em;
  border-bottom: 2px solid var(--sp-border);
}
.dash-table tbody tr:last-child td { border-bottom: none; }
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.empty-state {
  padding: 3rem 1rem;
  text-align: center;
  color: var(--sp-text-soft);
  font-size: 0.95rem;
  font-weight: 600;
}

.status-badge {
  padding: 4px 10px;
  border-radius: var(--sp-radius-pill);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.05em;
}
.status-badge.open { background: #fee2e2; color: #b91c1c; }
.status-badge.in_progress { background: #fef9c3; color: #a16207; }
.status-badge.resolved { background: #dcfce7; color: #15803d; }

/* ── Quick Actions ── */
.qa-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.qa-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--sp-surface-subtle);
  border: 1px solid var(--sp-border);
  border-radius: var(--sp-radius-lg);
  padding: 1rem;
  text-decoration: none;
  transition: all var(--sp-t-fast);
}
.qa-btn:hover {
  background: var(--sp-surface-solid);
  border-color: var(--sp-border-hover);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}
.qa-icon {
  width: 20px;
  height: 20px;
  color: var(--sp-primary);
  stroke-width: 2.2;
}
.qa-text {
  display: flex;
  flex-direction: column;
}
.qa-text strong {
  font-size: 0.9rem;
  color: var(--sp-text-strong);
  font-weight: 700;
}
.qa-text span {
  font-size: 0.75rem;
  color: var(--sp-text-soft);
}
</style>
