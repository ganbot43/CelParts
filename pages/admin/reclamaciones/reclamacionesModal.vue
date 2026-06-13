<template>
  <!-- Contenido -->
  <template v-if="item">

    <!-- Header -->
    <div class="sp-modal-header">
      <div class="sp-modal-header__content">
        <h2 class="sp-modal-header__title">{{ item.codigo }}</h2>
        <div class="sp-modal-header__sub">
          <span class="sp-modal-header__meta">{{ formatDateTime(item.createdAt) }}</span>
          <span class="sp-badge" :class="getStatusBadgeClass(item.estado)">
            <span class="sp-badge__dot"/>
            {{ formatEstado(item.estado) }}
          </span>
          <span class="sp-badge" :class="item.tipoReclamo === 'Queja' ? 'sp-badge--warning' : 'sp-badge--info'">
            {{ item.tipoReclamo }}
          </span>
        </div>
      </div>
      <button class="sp-modal-close" @click="$emit('close')">✕</button>
    </div>

    <!-- Body -->
    <div class="sp-modal-body">
      <div class="rd-grid">

        <!-- Datos del consumidor -->
        <section class="rd-card">
          <p class="rd-card__label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.4"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
            </svg>
            Consumidor
          </p>
          <div class="rd-fields">
            <div class="rd-field rd-field--full">
              <span class="rd-field__key">Nombre</span>
              <span class="rd-field__val">{{ item.customerName }}</span>
            </div>
            <div class="rd-field">
              <span class="rd-field__key">Documento</span>
              <span class="rd-field__val">{{ item.tipoDocumento }} · {{ item.numeroDocumento }}</span>
            </div>
            <div class="rd-field">
              <span class="rd-field__key">Teléfono</span>
              <a :href="`tel:${item.telefono}`" class="rd-field__val rd-link">{{ item.telefono || '—' }}</a>
            </div>
            <div class="rd-field rd-field--full">
              <span class="rd-field__key">Email</span>
              <a :href="`mailto:${item.email}`" class="rd-field__val rd-link">{{ item.email }}</a>
            </div>
            <div v-if="item.direccion" class="rd-field rd-field--full">
              <span class="rd-field__key">Dirección</span>
              <span class="rd-field__val">{{ item.direccion }}</span>
            </div>
          </div>
        </section>

        <!-- Bien + Reclamo -->
        <div class="rd-col">

          <!-- Bien contratado -->
          <section class="rd-card">
            <p class="rd-card__label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.4"/>
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="currentColor" stroke-width="1.4"/>
              </svg>
              Bien contratado
            </p>
            <div class="rd-fields">
              <div class="rd-field">
                <span class="rd-field__key">Tipo</span>
                <span class="rd-field__val">{{ item.tipoBien }}</span>
              </div>
              <div class="rd-field">
                <span class="rd-field__key">Monto</span>
                <span class="rd-field__val rd-field__val--amount">
                  {{ item.monto ? `S/ ${Number(item.monto).toFixed(2)}` : '—' }}
                </span>
              </div>
              <div class="rd-field rd-field--full">
                <span class="rd-field__key">Descripción</span>
                <span class="rd-field__val rd-field__val--long">{{ item.descripcionBien }}</span>
              </div>
            </div>
          </section>

          <!-- Detalle del reclamo -->
          <section class="rd-card">
            <p class="rd-card__label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.4"/>
                <path d="M12 8v4m0 4h.01" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
              </svg>
              Detalle del reclamo
            </p>
            <div class="rd-fields">
              <div class="rd-field rd-field--full">
                <span class="rd-field__key">Descripción</span>
                <span class="rd-field__val rd-field__val--long">{{ item.descripcion }}</span>
              </div>
              <div class="rd-field rd-field--full">
                <span class="rd-field__key">¿Qué solicita?</span>
                <span class="rd-field__val">{{ item.pedido }}</span>
              </div>
              <div v-if="item.adjunto" class="rd-field rd-field--full">
                <span class="rd-field__key">Adjunto</span>
                <button type="button" @click="openAttachment(item.adjunto)" class="rd-file-link" :disabled="openingAttachment">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.41 17.41a2 2 0 0 1-2.83-2.83l8.49-8.48" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  {{ openingAttachment ? 'Generando link...' : 'Ver archivo adjunto' }}
                </button>
              </div>
            </div>
          </section>
        </div>

      </div>

      <!-- Gestión y respuesta -->
      <section class="rd-card rd-card--action">
        <p class="rd-card__label">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Gestión y respuesta
        </p>

        <form @submit.prevent="save" class="rd-form">
          <div class="rd-form__row">
            <div class="rd-form__field">
              <label class="rd-form__label">Estado del reclamo</label>
              <select v-model="local.estado" class="sp-drawer-input sp-drawer-select">
                <option value="pendiente">Pendiente</option>
                <option value="en_proceso">En proceso</option>
                <option value="respondido">Respondido</option>
                <option value="cerrado">Cerrado</option>
              </select>
            </div>
          </div>

          <div class="rd-form__field rd-form__field--full">
            <label class="rd-form__label">
              Respuesta del negocio
              <span v-if="item.fechaRespuesta" class="rd-form__hint">
                · Última: {{ formatDateTime(item.fechaRespuesta) }}
              </span>
            </label>
            <textarea
              v-model="local.respuesta"
              class="sp-drawer-input sp-drawer-textarea"
              rows="4"
              placeholder="Escribe la respuesta al cliente..."
            />
            <div class="rd-form__info">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
                <path d="M12 8v4m0 4h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <span>Esta respuesta será registrada en el sistema. <strong>No se enviará por correo electrónico</strong> al cliente.</span>
            </div>
          </div>

          <div class="rd-form__actions">
            <button type="submit" class="sp-drawer-btn sp-drawer-btn--primary" :disabled="saving">
              <svg v-if="saving" class="rd-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
                <path d="M7 2A5 5 0 0 1 12 7" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <svg v-else width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M13 3L6 10l-3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ saving ? 'Guardando...' : 'Guardar cambios' }}
            </button>
            <button type="button" class="sp-drawer-btn sp-drawer-btn--ghost" @click="$emit('close')">
              Cancelar
            </button>
          </div>
        </form>
      </section>
    </div>

  </template>
</template>

<script setup>
const props = defineProps({
  reclamacion: { type: Object, required: true },
})

const emit = defineEmits(['close', 'updated'])

const { formatDateTime } = useFormatDateTime()
const authStore = useAuthStore()

// Sin fetch — usamos los datos que ya tiene la lista (igual que categorías/subcategorías)
const item = computed(() => props.reclamacion)
const local = reactive({ estado: '', respuesta: '' })
const saving = ref(false)

watch(item, (v) => {
  if (v) {
    local.estado    = v.estado ?? 'pendiente'
    local.respuesta = v.respuesta ?? ''
  }
}, { immediate: true })

function formatEstado(estado) {
  const map = {
    pendiente:  'Pendiente',
    en_proceso: 'En proceso',
    respondido: 'Respondido',
    cerrado:    'Cerrado',
  }
  return map[estado] || estado
}

function getStatusBadgeClass(estado) {
  switch (estado) {
    case 'pendiente':  return 'sp-badge--warning'
    case 'en_proceso': return 'sp-badge--info'
    case 'respondido': return 'sp-badge--success'
    case 'cerrado':    return 'sp-badge--neutral'
    default:           return 'sp-badge--neutral'
  }
}

async function save() {
  if (!local.respuesta.trim()) {
    useAppToast().add({ title: 'Escribe una respuesta antes de guardar', color: 'error' })
    return
  }
  saving.value = true
  try {
    const token = authStore.token
    await $fetch(`/api/admin/reclamaciones/${props.reclamacion.id}`, {
      method: 'PUT',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: { estado: local.estado, respuesta: local.respuesta },
    })
    emit('updated')
    useAppToast().add({ title: 'Reclamo actualizado', color: 'success' })
  } catch (err) {
    const { parseError } = useApiError();
    useAppToast().add({ title: 'Error', description: parseError(err), color: 'error' });
  } finally {
    saving.value = false
  }
}

const openingAttachment = ref(false)

async function openAttachment(url) {
  if (openingAttachment.value) return;
  openingAttachment.value = true;
  try {
    const res = await $fetch(`/api/upload/presigned?url=${encodeURIComponent(url)}`);
    if (res && res.presignedUrl) {
      window.open(res.presignedUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  } catch (err) {
    console.error(err);
    window.open(url, '_blank', 'noopener,noreferrer');
  } finally {
    openingAttachment.value = false;
  }
}
</script>

<style scoped>
/* Grid 2 columnas */
.rd-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

@media (max-width: 640px) {
  .rd-grid { grid-template-columns: 1fr; }
}

.rd-col { display: flex; flex-direction: column; gap: 1rem; }

/* Cards */
.rd-card {
  background: var(--sp-surface-solid);
  border: 1px solid var(--sp-border);
  border-radius: var(--sp-radius-lg);
  padding: 1rem 1.15rem;
  box-shadow: var(--sp-shadow-xs);
}

.rd-card--action {
  border-color: rgba(53, 109, 255, 0.14);
  background: linear-gradient(135deg,
    rgba(53, 109, 255, 0.02) 0%,
    var(--sp-surface-solid) 100%);
  margin-bottom: 0;
}

.rd-card__label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: var(--sp-text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--sp-text-soft);
  margin: 0 0 0.85rem;
}

/* Fields */
.rd-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.rd-field {
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: var(--sp-surface-muted);
  border-radius: var(--sp-radius-sm);
  padding: 7px 10px;
}

.rd-field--full { grid-column: 1 / -1; }

.rd-field__key {
  font-size: 10px;
  color: var(--sp-text-soft);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.rd-field__val {
  font-size: var(--sp-text-sm);
  color: var(--sp-text-strong);
  font-weight: 500;
  line-height: 1.4;
}

.rd-field__val--long {
  white-space: pre-wrap;
  word-break: break-word;
  font-weight: 400;
  color: var(--sp-text);
}

.rd-field__val--amount {
  color: var(--sp-primary);
  font-variant-numeric: tabular-nums;
  font-weight: 700;
}

.rd-link {
  color: var(--sp-primary);
  text-decoration: none;
}
.rd-link:hover { text-decoration: underline; }

/* Adjunto */
.rd-file-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: var(--sp-primary-soft);
  color: var(--sp-primary);
  border: 1px solid rgba(53, 109, 255, 0.15);
  border-radius: var(--sp-radius-pill);
  font-size: var(--sp-text-xs);
  font-weight: 600;
  text-decoration: none;
  transition: background var(--sp-t-fast) var(--sp-ease);
  width: fit-content;
  cursor: pointer;
}
.rd-file-link:hover:not(:disabled) {
  background: var(--sp-primary);
  color: #fff;
}
.rd-file-link:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Formulario */
.rd-form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.rd-form__row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.75rem;
}

.rd-form__field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rd-form__field--full { grid-column: 1 / -1; }

.rd-form__label {
  font-size: var(--sp-text-xs);
  font-weight: 700;
  color: var(--sp-text);
}

.rd-form__hint {
  font-weight: 400;
  color: var(--sp-text-soft);
}

.rd-form__info {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(53, 109, 255, 0.05);
  border: 1px solid rgba(53, 109, 255, 0.15);
  border-radius: var(--sp-radius-sm);
  font-size: var(--sp-text-xs);
  color: var(--sp-text-soft);
  margin-top: 4px;
}

.rd-form__info svg {
  flex-shrink: 0;
  color: var(--sp-primary);
  margin-top: 1px;
}

.rd-form__actions {
  display: flex;
  gap: 0.65rem;
  padding-top: 0.65rem;
  border-top: 1px solid var(--sp-border);
}

/* Badges */
.sp-badge--info {
  background: rgba(53, 109, 255, 0.1);
  color: #1a44d4;
  border: 1px solid rgba(53, 109, 255, 0.18);
}

/* Spinner */
@keyframes rd-spin { to { transform: rotate(360deg); } }
.rd-spin { animation: rd-spin 0.75s linear infinite; flex-shrink: 0; }
</style>