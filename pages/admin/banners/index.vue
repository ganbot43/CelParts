<template>
  <div class="banners-page">
    <div class="sp-page-toolbar">
      <div>
        <h1 class="sp-page-toolbar__title">Banners</h1>
        <p class="sp-page-toolbar__sub">
          {{ banners.length }} banners registrados
        </p>
      </div>
      <button class="sp-page-btn" @click="openDrawer()">
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 3v10M3 8h10"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        Nuevo banner
      </button>
    </div>

    <div class="sp-table-wrap">
      <div class="sp-table-scroll">
        <table class="sp-table">
          <thead>
            <tr>
              <th class="sp-th" style="width: 140px">Preview</th>
              <th class="sp-th">URL imagen</th>
              <th class="sp-th">Enlace</th>
              <th class="sp-th sp-th--center" style="width: 80px">Orden</th>
              <th class="sp-th" style="width: 100px">Estado</th>
              <th class="sp-th">Fecha</th>
              <th class="sp-th" style="width: 100px">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="banner in banners" :key="banner.id" class="sp-tr">
              <td class="sp-td">
                <div class="banner-thumb">
                  <img
                    v-if="banner.imageUrl"
                    :src="banner.imageUrl"
                    :alt="`Banner ${banner.sortOrder}`"
                  />
                  <div v-else class="banner-thumb__empty">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="3"
                        stroke="currentColor"
                        stroke-width="1.5"
                      />
                      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                      <path
                        d="M3 15l5-5 4 4 3-3 6 6"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </td>

              <td class="sp-td">
                <p class="banner-url" :title="banner.imageUrl">
                  {{ banner.imageUrl }}
                </p>
              </td>

              <td class="sp-td">
                <p
                  v-if="banner.linkUrl"
                  class="banner-url banner-url--link"
                  :title="banner.linkUrl"
                >
                  {{ banner.linkUrl }}
                </p>
                <span v-else class="sp-table-num">—</span>
              </td>

              <td class="sp-td sp-td--center">
                <span class="banner-order">{{ banner.sortOrder }}</span>
              </td>

              <td class="sp-td">
                <span
                  class="sp-badge"
                  :class="
                    banner.isActive ? 'sp-badge--success' : 'sp-badge--danger'
                  "
                >
                  <span class="sp-badge__dot"></span>
                  {{ banner.isActive ? "Activo" : "Inactivo" }}
                </span>
              </td>
              <td class="sp-td sp-td--muted">
                <span class="sp-table-date">{{ formatDateTime(banner.createdAt) }}</span>
              </td>
              <td class="sp-td">
                <div class="sp-table-actions">
                  <button
                    class="sp-table-btn sp-table-btn--edit"
                    @click="openDrawer(banner)"
                    title="Editar"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M11.5 2.5a1.414 1.414 0 0 1 2 2L5 13H3v-2L11.5 2.5Z"
                        stroke="currentColor"
                        stroke-width="1.4"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    class="sp-table-btn sp-table-btn--del"
                    @click="deleteBanner(banner.id)"
                    title="Eliminar"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 5h10M6 5V3h4v2M6 8v4M10 8v4M4 5l1 8h6l1-8"
                        stroke="currentColor"
                        stroke-width="1.4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="!banners.length">
              <td colspan="6" class="sp-table-empty">
                <div class="sp-table-empty__inner">
                  <div class="sp-table-empty__icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="3"
                        stroke="currentColor"
                        stroke-width="1.5"
                      />
                      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                      <path
                        d="M3 15l5-5 4 4 3-3 6 6"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <p class="sp-table-empty__msg">No hay banners aún</p>
                  <button class="sp-table-empty__cta" @click="openDrawer()">
                    Crear el primero
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="sp-drawer-overlay">
        <div
          v-if="drawerOpen"
          class="sp-drawer-overlay"
          @click.self="closeDrawer"
        />
      </Transition>
      <Transition name="sp-drawer-panel">
        <aside
          v-if="drawerOpen"
          class="sp-drawer-panel"
          role="dialog"
          aria-modal="true"
        >
          <div class="sp-drawer-header">
            <div>
              <p class="sp-drawer-header__eyebrow">
                {{ isEditing ? "Editar" : "Nuevo" }}
              </p>
              <h2 class="sp-drawer-header__title">
                {{ isEditing ? "Editar banner" : "Crear banner" }}
              </h2>
            </div>
            <button
              class="sp-drawer-close"
              @click="closeDrawer"
              aria-label="Cerrar"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 3l10 10M13 3L3 13"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </div>

          <div class="sp-drawer-body">
            <!-- Preview -->
            <div class="banner-preview" v-if="form.imageUrl">
              <img :src="form.imageUrl" alt="Preview" />
            </div>
            <div class="banner-preview-empty" v-else>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="3"
                  stroke="currentColor"
                  stroke-width="1.2"
                />
                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                <path
                  d="M3 15l5-5 4 4 3-3 6 6"
                  stroke="currentColor"
                  stroke-width="1.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span>Vista previa del banner</span>
            </div>

            <div class="sp-drawer-field">
              <label class="sp-drawer-label">Imagen Banner <span class="sp-drawer-req">*</span></label>
              
              <!-- Si ya hay imagen, mostramos el preview integrado o la zona para cambiarla -->
              <label
                class="banner-upload-zone"
                :class="{ 'banner-upload-zone--uploading': uploadingBanner }"
              >
                <input
                  ref="bannerFileInputRef"
                  type="file"
                  accept="image/*"
                  class="banner-upload-input"
                  @change="onBannerFileSelected"
                />
                <svg v-if="!uploadingBanner" width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 5v14M5 12h14"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                  />
                </svg>
                <span v-if="!uploadingBanner">Subir o cambiar imagen</span>
                <span v-else class="banner-uploading-text">Subiendo a S3...</span>
              </label>
              <span class="sp-drawer-hint">Sube una imagen desde tu computadora (máx. 4 MB). Se recomienda proporción 3:1</span>
              <p v-if="bannerUploadError" class="sp-drawer-error">{{ bannerUploadError }}</p>
            </div>

            <div class="sp-drawer-field">
              <label class="sp-drawer-label"
                >URL de enlace
                <span class="banner-optional">opcional</span></label
              >
              <input
                v-model="form.linkUrl"
                class="sp-drawer-input"
                placeholder="https://..."
              />
              <span class="sp-drawer-hint"
                >Página a la que redirige al hacer clic en el banner</span
              >
            </div>

            <div class="sp-drawer-field">
              <label class="sp-drawer-label">Orden</label>
              <input
                v-model.number="form.sortOrder"
                type="number"
                min="0"
                class="sp-drawer-input banner-input-order"
                placeholder="0"
              />
              <span class="sp-drawer-hint">Menor número = aparece primero</span>
            </div>

            <div class="sp-drawer-switches">
              <label class="sp-drawer-switch">
                <input
                  type="checkbox"
                  v-model="form.isActive"
                  class="sp-drawer-switch__input"
                />
                <span class="sp-drawer-switch__track"
                  ><span class="sp-drawer-switch__thumb"></span
                ></span>
                <span class="sp-drawer-switch__label">Banner activo</span>
              </label>
            </div>

            <p v-if="formError" class="sp-drawer-error">{{ formError }}</p>
          </div>

          <div class="sp-drawer-footer">
            <button
              class="sp-drawer-btn sp-drawer-btn--ghost"
              @click="closeDrawer"
            >
              Cancelar
            </button>
            <button
              class="sp-drawer-btn sp-drawer-btn--primary"
              :disabled="saving"
              @click="save"
            >
              <svg
                v-if="saving"
                class="sp-drawer-spin"
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="6"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-dasharray="25 13"
                  stroke-linecap="round"
                />
              </svg>
              <svg
                v-else
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M3 8l4 4 6-6"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              {{ isEditing ? "Guardar cambios" : "Crear banner" }}
            </button>
          </div>
        </aside>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth", layout: "admin" });
useSeoMeta({ title: "Banners — Admin" });

const authStore = useAuthStore();
const { data, refresh } = await useFetch<{ data: any[] }>("/api/admin/banners", { 
  server: false,
  headers: (authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {}) as Record<string, string>
});
const banners = computed(() => data.value?.data ?? []);
const { formatDateTime } = useFormatDateTime();

const drawerOpen = ref(false);
const editingId = ref<number | null>(null);
const isEditing = computed(() => !!editingId.value);
const saving = ref(false);
const formError = ref("");
const uploadingBanner = ref(false);
const bannerUploadError = ref("");
const bannerFileInputRef = ref<HTMLInputElement>();

const emptyForm = () => ({
  imageUrl: "",
  linkUrl: "",
  sortOrder: 0,
  isActive: true,
});
const form = reactive(emptyForm());

function openDrawer(banner?: any) {
  formError.value = "";
  if (banner) {
    editingId.value = banner.id;
    Object.assign(form, {
      imageUrl: banner.imageUrl ?? "",
      linkUrl: banner.linkUrl ?? "",
      sortOrder: banner.sortOrder ?? 0,
      isActive: banner.isActive ?? true,
    });
  } else {
    editingId.value = null;
    Object.assign(form, emptyForm());
  }
  drawerOpen.value = true;
}

function closeDrawer() {
  drawerOpen.value = false;
}

async function save() {
  if (!form.imageUrl) {
    formError.value = "La imagen es requerida";
    return;
  }
  saving.value = true;
  formError.value = "";
  try {
    const payload = { ...form, isActive: form.isActive ? 1 : 0 };
    if (isEditing.value) {
      await $fetch(`/api/admin/banners/${editingId.value}`, { method: 'PUT', body: payload });
    } else {
      await $fetch('/api/admin/banners', { method: 'POST', body: payload });
    }
    useAppToast().add({
      title: isEditing.value ? "Banner actualizado" : "Banner creado",
      color: "success",
    });
    closeDrawer();
    await refresh();
  } catch (e: any) {
    const { parseError } = useApiError();
    formError.value = parseError(e) ?? "Error al guardar";
  } finally {
    saving.value = false;
  }
}

async function onBannerFileSelected(e: Event) {
  const input = e.target as HTMLInputElement;
  if (!input.files?.length) return;
  
  const file = input.files[0];
  bannerUploadError.value = "";
  
  const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const MAX_SIZE = 4 * 1024 * 1024; // 4 MB
  
  if (!ALLOWED.includes(file.type)) {
    bannerUploadError.value = "Tipo no permitido: solo jpg, png, webp o gif";
    input.value = "";
    return;
  }
  
  if (file.size > MAX_SIZE) {
    bannerUploadError.value = "La imagen debe ser menor a 4 MB";
    input.value = "";
    return;
  }
  
  uploadingBanner.value = true;
  try {
    const fd = new FormData();
    fd.append("file", file);
    const res: any = await $fetch("/api/upload?folder=banners", {
      method: "POST",
      body: fd,
    });
    form.imageUrl = res.url;
    if (bannerFileInputRef.value) {
      bannerFileInputRef.value.value = "";
    }
  } catch (e: any) {
    bannerUploadError.value = e?.data?.message ?? "Error al subir la imagen";
  } finally {
    uploadingBanner.value = false;
  }
}

async function deleteBanner(id: number) {
  if (!confirm("¿Eliminar este banner?")) return;
  await $fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
  await refresh();
  useAppToast().add({ title: "Banner eliminado", color: "success" });
}
</script>

<style scoped>
.banners-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* ── Thumbnail en tabla ── */
.banner-thumb {
  width: 7rem;
  height: 2.5rem;
  border-radius: var(--sp-radius-xs);
  overflow: hidden;
  border: 1px solid var(--sp-border);
  background: var(--sp-surface-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
}
.banner-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.banner-thumb__empty {
  color: var(--sp-text-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

/* ── URL truncada ── */
.banner-url {
  font-size: var(--sp-text-xs);
  color: var(--sp-text-muted);
  max-width: 18rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
}
.banner-url--link {
  color: var(--sp-primary);
}

/* ── Orden ── */
.banner-order {
  font-size: var(--sp-text-sm);
  font-weight: 700;
  color: var(--sp-text-muted);
  font-variant-numeric: tabular-nums;
}

/* ── Preview en drawer ── */
.banner-preview {
  width: 100%;
  aspect-ratio: 3 / 1;
  border-radius: var(--sp-radius-lg);
  overflow: hidden;
  border: 1px solid var(--sp-border);
  background: var(--sp-surface-subtle);
}
.banner-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.banner-preview-empty {
  width: 100%;
  aspect-ratio: 3 / 1;
  border-radius: var(--sp-radius-lg);
  border: 1.5px dashed var(--sp-border);
  background: var(--sp-surface-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--sp-text-soft);
  font-size: var(--sp-text-xs);
  font-weight: 600;
}

/* ── Input orden (ancho reducido) ── */
.banner-input-order {
  max-width: 8rem;
}

/* ── Label opcional ── */
.banner-optional {
  font-size: var(--sp-text-xs);
  font-weight: 500;
  color: var(--sp-text-soft);
  margin-left: 0.3rem;
  text-transform: none;
  letter-spacing: 0;
}

/* ── Upload Zone ── */
.banner-upload-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
  border: 2px dashed var(--sp-border);
  border-radius: var(--sp-radius-md);
  background: var(--sp-surface-subtle);
  cursor: pointer;
  transition: all 0.2s;
  color: var(--sp-text-soft);
  font-size: 0.85rem;
  font-weight: 500;
  margin-top: 0.5rem;
}

.banner-upload-zone:hover {
  border-color: var(--sp-text-muted);
  background: var(--sp-surface-solid);
}

.banner-upload-zone--uploading {
  opacity: 0.6;
  cursor: not-allowed;
}

.banner-upload-input {
  display: none;
}

.banner-uploading-text {
  display: inline-block;
  animation: sp-pulse 1.5s ease-in-out infinite;
}

@keyframes sp-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
</style>
