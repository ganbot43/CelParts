<template>
  <div class="subcat-page">
    <div class="sp-page-toolbar">
      <div>
        <h1 class="sp-page-toolbar__title">Materiales</h1>
        <p class="sp-page-toolbar__sub">
          {{ items.length }} materiales registrados
        </p>
      </div>
      <button class="sp-page-btn" @click="openDrawer()">
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        Nuevo material
      </button>
    </div>

    <div class="sp-table-wrap">
      <div class="sp-table-scroll">
        <table class="sp-table">
          <thead>
            <tr>
              <th class="sp-th">Nombre</th>
              <th class="sp-th">Slug</th>
              <th class="sp-th">Estado</th>
              <th class="sp-th">Fecha</th>
              <th class="sp-th" style="width: 100px">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in items" :key="s.id" class="sp-tr">
              <td class="sp-td">
                <p class="sp-table-title">{{ s.name }}</p>
              </td>
              <td class="sp-td">{{ s.slug }}</td>
              <td class="sp-td">
                <span class="sp-badge" :class="s.isActive ? 'sp-badge--success' : 'sp-badge--danger'">
                  <span class="sp-badge__dot"></span>
                  {{ s.isActive ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="sp-td sp-td--muted">
                <span class="sp-table-date">{{ formatDateTime(s.createdAt) }}</span>
              </td>
              <td class="sp-td">
                <div class="sp-table-actions">
                  <button class="sp-table-btn sp-table-btn--edit" @click="openDrawer(s)" title="Editar">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M11.5 2.5a1.414 1.414 0 0 1 2 2L5 13H3v-2L11.5 2.5Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="!items.length">
              <td colspan="5" class="sp-table-empty">
                <div class="sp-table-empty__inner">
                  <div class="sp-table-empty__icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
                      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                  </div>
                  <p class="sp-table-empty__msg">No hay materiales aún</p>
                  <button class="sp-table-empty__cta" @click="openDrawer()">Crear el primero</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="sp-drawer-overlay">
        <div v-if="drawerOpen" class="sp-drawer-overlay" @click.self="closeDrawer" />
      </Transition>
      <Transition name="sp-drawer-panel">
        <aside v-if="drawerOpen" class="sp-drawer-panel" role="dialog" aria-modal="true">
          <div class="sp-drawer-header">
            <div>
              <p class="sp-drawer-header__eyebrow">{{ isEditing ? 'Editar' : 'Nuevo' }}</p>
              <h2 class="sp-drawer-header__title">{{ isEditing ? form.name || 'Material' : 'Crear material' }}</h2>
            </div>
            <button class="sp-drawer-close" @click="closeDrawer" aria-label="Cerrar">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <div class="sp-drawer-body">
            <div class="sp-drawer-field">
              <label class="sp-drawer-label">Nombre <span class="sp-drawer-req">*</span></label>
              <input v-model="form.name" class="sp-drawer-input" placeholder="Ej. Algodón" />
            </div>

            <div class="sp-drawer-switches">
              <label class="sp-drawer-switch">
                <input type="checkbox" v-model="form.isActive" class="sp-drawer-switch__input" />
                <span class="sp-drawer-switch__track"><span class="sp-drawer-switch__thumb"></span></span>
                <span class="sp-drawer-switch__label">Activo</span>
              </label>
            </div>

            <p v-if="formError" class="sp-drawer-error">{{ formError }}</p>
          </div>

          <div class="sp-drawer-footer">
            <button class="sp-drawer-btn sp-drawer-btn--ghost" @click="closeDrawer">Cancelar</button>
            <button class="sp-drawer-btn sp-drawer-btn--primary" :disabled="saving" @click="save">
              <svg v-if="saving" class="sp-drawer-spin" width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" stroke-dasharray="25 13" stroke-linecap="round" />
              </svg>
              <svg v-else width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8l4 4 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              {{ isEditing ? 'Guardar cambios' : 'Crear material' }}
            </button>
          </div>
        </aside>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth", layout: "admin" });
useSeoMeta({ title: "Materiales — Admin" });

const { data, refresh } = await useFetch<{ data: any[] }>("/api/admin/materials?all=true");
const items = computed(() => data.value?.data ?? []);
const { formatDateTime } = useFormatDateTime();

const drawerOpen = ref(false);
const editingId = ref<number | null>(null);
const isEditing = computed(() => !!editingId.value);
const saving = ref(false);
const formError = ref("");

const emptyForm = () => ({ name: "", isActive: true });
const form = reactive(emptyForm());

function openDrawer(s?: any) {
  formError.value = "";
  if (s) {
    editingId.value = s.id;
    form.name = s.name;
    form.isActive = !!s.isActive;
  } else {
    editingId.value = null;
    Object.assign(form, emptyForm());
  }
  drawerOpen.value = true;
}

function closeDrawer() { drawerOpen.value = false; }

async function save() {
  if (!form.name) {
    formError.value = "El nombre es requerido";
    return;
  }
  saving.value = true;
  formError.value = "";
  try {
    if (isEditing.value) {
      await $fetch(`/api/admin/materials/${editingId.value}`, { method: 'PUT', body: form });
    } else {
      await $fetch('/api/admin/materials', { method: 'POST', body: form });
    }
    useAppToast().add({ title: isEditing.value ? 'Material actualizado' : 'Material creado', color: 'success' });
    closeDrawer();
    await refresh();
  } catch (e: any) {
    formError.value = e?.data?.message ?? 'Error al guardar';
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.subcat-page { display: flex; flex-direction: column; gap: 1.25rem; }
</style>
