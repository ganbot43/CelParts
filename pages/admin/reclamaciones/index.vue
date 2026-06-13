<template>
  <div class="reclamaciones-page">
    <!-- ══ TOOLBAR ══ -->
    <div class="sp-page-toolbar" style="margin-bottom: 1.25rem">
      <div>
        <h1 class="sp-page-toolbar__title">Libro de Reclamaciones</h1>
        <p class="sp-page-toolbar__sub">
          {{ items.length }}
          {{ items.length === 1 ? "reclamo" : "reclamos" }} registrado{{
            items.length !== 1 ? "s" : ""
          }}
        </p>
      </div>
      <button class="sp-page-btn" @click="refresh">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path
            d="M14 2v4h-4M2 14v-4h4"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M13 5c-1.5-2-3.5-3-6-3-4 0-7 3-7 7s3 7 7 7c3 0 5.5-1.5 6.5-3.5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
        Actualizar
      </button>
    </div>

    <!-- ══ TABLE ══ -->
    <div class="sp-table-wrap">
      <div class="sp-table-scroll">
        <table class="sp-table">
          <thead>
            <tr>
              <th class="sp-th">Código</th>
              <th class="sp-th">Cliente</th>
              <th class="sp-th">Tipo</th>
              <th class="sp-th sp-th--center">Estado</th>
              <th class="sp-th">Fecha</th>
              <th class="sp-th" style="width: 80px">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="r in items"
              :key="r.id"
              class="sp-tr sp-tr--clickable"
              @click="openModal(r)"
            >
              <td class="sp-td">
                <span class="sp-table-link">{{ r.codigo }}</span>
              </td>
              <td class="sp-td">
                <p class="sp-table-title">{{ r.customerName }}</p>
              </td>
              <td class="sp-td">
                <span class="sp-badge" :class="getBadgeClass(r.tipoReclamo)">{{
                  r.tipoReclamo
                }}</span>
              </td>
              <td class="sp-td sp-td--center">
                <span class="sp-badge" :class="getStatusBadgeClass(r.estado)">
                  <span class="sp-badge__dot" />
                  {{ formatEstado(r.estado) }}
                </span>
              </td>
              <td class="sp-td sp-td--muted">
                <span class="sp-table-date">{{
                  formatDateTime(r.createdAt)
                }}</span>
              </td>
              <td class="sp-td">
                <div class="sp-table-actions">
                  <button
                    class="sp-table-btn sp-table-btn--edit"
                    title="Ver detalle"
                    @click.stop="openModal(r)"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 3C4.5 3 1.5 8 1.5 8S4.5 13 8 13s6.5-5 6.5-5S11.5 3 8 3Z"
                        stroke="currentColor"
                        stroke-width="1.4"
                        stroke-linejoin="round"
                      />
                      <circle
                        cx="8"
                        cy="8"
                        r="2"
                        stroke="currentColor"
                        stroke-width="1.4"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty state -->
            <tr v-if="!items.length">
              <td colspan="6" class="sp-table-empty">
                <div class="sp-table-empty__inner">
                  <div class="sp-table-empty__icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                      <path
                        d="M12 11v4M10 13h4"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                    </svg>
                  </div>
                  <p class="sp-table-empty__msg">No hay reclamaciones aún</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ══ MODAL ══ -->
    <Teleport to="body">
      <Transition name="sp-modal">
        <div
          v-if="modalOpen"
          class="sp-modal-backdrop"
          @click.self="closeModal"
        >
          <div class="sp-modal-box">
            <ReclamacionesModal
              :reclamacion="selectedItem"
              @close="closeModal"
              @updated="onUpdated"
            />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import ReclamacionesModal from './reclamacionesModal.vue';

definePageMeta({ middleware: "auth", layout: "admin" });
useSeoMeta({ title: "Libro de Reclamaciones — Admin" });

const { data, refresh } = await useFetch('/api/admin/reclamaciones', {
  method: 'GET'
});
const items = computed(() => data.value?.data ?? []);
const { formatDateTime } = useFormatDateTime();

const modalOpen = ref(false);
const selectedItem = ref(null);

function openModal(item) {
  selectedItem.value = item;
  modalOpen.value = true;
}

function closeModal() {
  modalOpen.value = false;
  selectedItem.value = null;
}

async function onUpdated() {
  await refresh();
}

// Cerrar con Escape
onMounted(() => {
  window.addEventListener("keydown", onKeydown);
});
onUnmounted(() => {
  window.removeEventListener("keydown", onKeydown);
});
function onKeydown(e) {
  if (e.key === "Escape" && modalOpen.value) closeModal();
}

function formatEstado(estado) {
  const map = {
    pendiente: "Pendiente",
    en_proceso: "En proceso",
    respondido: "Respondido",
    cerrado: "Cerrado",
  };
  return map[estado] || estado;
}

function getBadgeClass(tipo) {
  return tipo === "Queja" ? "sp-badge--warning" : "sp-badge--info";
}

function getStatusBadgeClass(estado) {
  switch (estado) {
    case "pendiente":
      return "sp-badge--warning";
    case "en_proceso":
      return "sp-badge--info";
    case "respondido":
      return "sp-badge--success";
    case "cerrado":
      return "sp-badge--neutral";
    default:
      return "sp-badge--neutral";
  }
}
</script>

<style scoped>
.reclamaciones-page {
  animation: sp-fade-in 220ms var(--sp-ease) both;
}

/* Fila clickeable */
.sp-tr--clickable {
  cursor: pointer;
}

.sp-table-link {
  color: var(--sp-primary);
  font-weight: 700;
  font-size: var(--sp-text-sm);
}

/* Badges */
.sp-badge--info {
  background: rgba(53, 109, 255, 0.1);
  color: #1a44d4;
  border: 1px solid rgba(53, 109, 255, 0.18);
}
</style>
