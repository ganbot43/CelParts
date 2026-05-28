<template>
  <div class="prod-page">
    <div class="sp-page-toolbar">
      <div>
        <h1 class="sp-page-toolbar__title">Productos</h1>
        <p class="sp-page-toolbar__sub">
          {{ products.length }} productos en catálogo
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
        Nuevo producto
      </button>
    </div>

    <div class="sp-table-wrap">
      <div class="sp-table-scroll">
        <table class="sp-table">
          <thead>
            <tr>
              <th class="sp-th" style="width: 72px">Imagen</th>
              <th class="sp-th">Producto</th>
              <th class="sp-th">Precio</th>
              <th class="sp-th">Stock</th>
              <th class="sp-th">Nuevo</th>
              <th class="sp-th">Estado</th>
              <th class="sp-th">Fecha</th>
              <th class="sp-th" style="width: 100px">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id" class="sp-tr">
              <td class="sp-td">
                <div class="sp-table-img">
                  <img
                    v-if="product.images?.[0]?.url"
                    :src="product.images[0].url"
                    :alt="product.name"
                  />
                  <svg
                    v-else
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
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
              </td>
              <td class="sp-td">
                <p class="sp-table-title">{{ product.name }}</p>
                <p class="sp-table-sub" v-if="product.category?.name">
                  {{ product.category.name }}
                </p>
              </td>
              <td class="sp-td">
                <span class="sp-table-amount">{{
                  formatPrice.format(product.price)
                }}</span>
              </td>
              <td class="sp-td">
                <span
                  class="sp-table-num"
                  :class="{ 'sp-table-num--low': product.stock < 5 }"
                  >{{ product.stock }}</span
                >
              </td>
              <td class="sp-td">
                <span
                  class="sp-badge"
                  :class="
                    product.nuevoLanzamiento
                      ? 'sp-badge--warning'
                      : 'sp-badge--neutral'
                  "
                >
                  <span class="sp-badge__dot"></span>
                  {{ product.nuevoLanzamiento ? 'Sí' : 'No' }}
                </span>
              </td>
              <td class="sp-td">
                <span
                  class="sp-badge"
                  :class="
                    product.isActive ? 'sp-badge--success' : 'sp-badge--danger'
                  "
                >
                  <span class="sp-badge__dot"></span>
                  {{ product.isActive ? "Activo" : "Inactivo" }}
                </span>
              </td>
              <td class="sp-td sp-td--muted">
                <span class="sp-table-date">{{ formatDateTime(product.createdAt) }}</span>
              </td>
              <td class="sp-td">
                <div class="sp-table-actions">
                  <button
                    class="sp-table-btn sp-table-btn--edit"
                    @click="openDrawer(product)"
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
                    @click="deleteProduct(product.id)"
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
            <tr v-if="!products.length">
              <td colspan="7" class="sp-table-empty">
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
                      <path
                        d="M12 12v4M10 14h4"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                    </svg>
                  </div>
                  <p class="sp-table-empty__msg">No hay productos aún</p>
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

    <!-- ══ DRAWER ══ -->
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
                {{ isEditing ? form.name || "Producto" : "Crear producto" }}
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
            <!-- ── Zona de imágenes ── -->
            <div class="prod-img-section">
              <div class="prod-img-section__header">
                <span class="sp-drawer-label">Imágenes</span>
                <span class="prod-img-counter"
                  >{{ allSlots.length }} / {{ MAX_IMAGES }}</span
                >
              </div>

              <!-- Grid de miniaturas + slot para agregar -->
              <div class="prod-img-grid">
                <!-- Imágenes existentes (URLs) -->
                <div
                  v-for="(url, i) in images"
                  :key="`url-${i}`"
                  class="prod-img-thumb"
                  :class="{ 'prod-img-thumb--primary': i === 0 }"
                  draggable="true"
                  @dragstart="onDragStart('url', i)"
                  @dragover.prevent
                  @drop="onDrop('url', i)"
                >
                  <img :src="url" :alt="`Imagen ${i + 1}`" />
                  <div class="prod-img-thumb__overlay">
                    <button
                      class="prod-img-thumb__remove"
                      @click="removeImageByUrl(i)"
                      title="Eliminar"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M2 2l8 8M10 2L2 10"
                          stroke="currentColor"
                          stroke-width="1.6"
                          stroke-linecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <span v-if="i === 0" class="prod-img-thumb__badge"
                    >Principal</span
                  >
                </div>

                <!-- Previews de archivos locales -->
                <div
                  v-for="(p, i) in previews"
                  :key="`file-${i}`"
                  class="prod-img-thumb prod-img-thumb--new"
                  :class="{
                    'prod-img-thumb--primary': images.length === 0 && i === 0,
                  }"
                  draggable="true"
                  @dragstart="onDragStart('file', i)"
                  @dragover.prevent
                  @drop="onDrop('file', i)"
                >
                  <img :src="p" :alt="`Preview ${i + 1}`" />
                  <div class="prod-img-thumb__overlay">
                    <button
                      class="prod-img-thumb__remove"
                      @click="removePreview(i)"
                      title="Eliminar"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M2 2l8 8M10 2L2 10"
                          stroke="currentColor"
                          stroke-width="1.6"
                          stroke-linecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <span
                    v-if="images.length === 0 && i === 0"
                    class="prod-img-thumb__badge"
                    >Principal</span
                  >
                  <span class="prod-img-thumb__new-badge">Nueva</span>
                </div>

                <!-- Slot para agregar más -->
                <label
                  v-if="allSlots.length < MAX_IMAGES"
                  class="prod-img-add"
                  :class="{ 'prod-img-add--drag': isDraggingOver }"
                  @dragover.prevent="isDraggingOver = true"
                  @dragleave="isDraggingOver = false"
                  @drop.prevent="onDropFile($event)"
                >
                  <input
                    ref="fileInputRef"
                    type="file"
                    accept="image/*"
                    multiple
                    class="prod-img-add__input"
                    @change="onFilesSelected"
                  />
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 5v14M5 12h14"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                    />
                  </svg>
                  <span>Agregar</span>
                </label>
              </div>

              <!-- Zona drop grande si no hay imágenes -->
              <label
                v-if="allSlots.length === 0"
                class="prod-img-dropzone"
                :class="{ 'prod-img-dropzone--active': isDraggingOver }"
                @dragover.prevent="isDraggingOver = true"
                @dragleave="isDraggingOver = false"
                @drop.prevent="onDropFile($event)"
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  class="prod-img-add__input"
                  @change="onFilesSelected"
                />
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
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
                <span class="prod-img-dropzone__title"
                  >Arrastra imágenes aquí</span
                >
                <span class="prod-img-dropzone__sub"
                  >o haz clic para seleccionar · jpg, png, webp · máx 2 MB</span
                >
              </label>

              <p v-if="imgError" class="prod-img-error">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle
                    cx="6"
                    cy="6"
                    r="5"
                    stroke="currentColor"
                    stroke-width="1.2"
                  />
                  <path
                    d="M6 4v2.5M6 8h.01"
                    stroke="currentColor"
                    stroke-width="1.2"
                    stroke-linecap="round"
                  />
                </svg>
                {{ imgError }}
              </p>

              <p v-if="allSlots.length > 0" class="prod-img-hint">
                La primera imagen es la principal · arrastra para reordenar
              </p>
            </div>

            <!-- ── Campos del formulario ── -->
            <div class="sp-drawer-field">
              <label class="sp-drawer-label"
                >Nombre <span class="sp-drawer-req">*</span></label
              >
              <input
                v-model="form.name"
                class="sp-drawer-input"
                placeholder="Ej. Crema hidratante"
              />
            </div>

            <div class="sp-drawer-row">
              <div class="sp-drawer-field">
                <label class="sp-drawer-label"
                  >Precio (S/) <span class="sp-drawer-req">*</span></label
                >
                <input
                  v-model.number="form.price"
                  type="number"
                  step="0.01"
                  min="0"
                  class="sp-drawer-input"
                  placeholder="0.00"
                />
              </div>
              <div class="sp-drawer-field">
                <label class="sp-drawer-label">Stock</label>
                <input
                  v-model.number="form.stock"
                  type="number"
                  min="0"
                  class="sp-drawer-input"
                  placeholder="0"
                />
              </div>
            </div>

            <div class="sp-drawer-row">
              <div class="sp-drawer-field">
                <label class="sp-drawer-label">Categoría</label>
                <select
                  v-model="form.categoryId"
                  class="sp-drawer-input sp-drawer-select"
                >
                  <option :value="null">Sin categoría</option>
                  <option
                    v-for="c in categoryOptions"
                    :key="c.value"
                    :value="c.value"
                  >
                    {{ c.label }}
                  </option>
                </select>
              </div>
              <div class="sp-drawer-field">
                <label class="sp-drawer-label">Subcategoría</label>
                <select
                  v-model="form.subcategoryId"
                  class="sp-drawer-input sp-drawer-select"
                >
                  <option :value="null">Sin subcategoría</option>
                  <option
                    v-for="s in subcategoryOptions"
                    :key="s.value"
                    :value="s.value"
                  >
                    {{ s.label }}
                  </option>
                </select>
              </div>
            </div>

            <div class="sp-drawer-field">
              <div class="sp-drawer-field-header">
                <label class="sp-drawer-label">Descripción</label>
                <span class="sp-drawer-field-counter">{{ (form.description || '').length }} / 1000</span>
              </div>
              <textarea
                v-model="form.description"
                class="sp-drawer-input sp-drawer-textarea"
                rows="3"
                maxlength="1000"
                placeholder="Descripción del producto..."
              />
            </div>

            <div class="sp-drawer-switches">
              <label class="sp-drawer-switch">
                <input
                  type="checkbox"
                  v-model="form.isFeatured"
                  class="sp-drawer-switch__input"
                />
                <span class="sp-drawer-switch__track"
                  ><span class="sp-drawer-switch__thumb"></span
                ></span>
                <span class="sp-drawer-switch__label">Producto destacado</span>
              </label>
              <label class="sp-drawer-switch">
                <input
                  type="checkbox"
                  v-model="form.nuevoLanzamiento"
                  class="sp-drawer-switch__input"
                />
                <span class="sp-drawer-switch__track"
                  ><span class="sp-drawer-switch__thumb"></span
                ></span>
                <span class="sp-drawer-switch__label">Nuevo lanzamiento</span>
              </label>
              <label class="sp-drawer-switch">
                <input
                  type="checkbox"
                  v-model="form.isActive"
                  class="sp-drawer-switch__input"
                />
                <span class="sp-drawer-switch__track"
                  ><span class="sp-drawer-switch__thumb"></span
                ></span>
                <span class="sp-drawer-switch__label">Activo</span>
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
              {{ isEditing ? "Guardar cambios" : "Crear producto" }}
            </button>
          </div>
        </aside>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "~/types";

definePageMeta({ middleware: "auth", layout: "admin" });
useSeoMeta({ title: "Productos — Admin" });

const { data, refresh } = await useFetch<{ data: Product[] }>(
  "/api/admin/products",
);
const { data: categoriesData } = await useFetch("/api/admin/categories");
const { data: subsData } = await useFetch("/api/admin/subcategories");

const products = computed(() => data.value?.data ?? []);
const formatPrice = useFormatPrice();
const { formatDateTime } = useFormatDateTime();

// ── Drawer state ──
const drawerOpen = ref(false);
const editingId = ref<number | null>(null);
const isEditing = computed(() => !!editingId.value);
const saving = ref(false);
const formError = ref("");

// ── Image state ──
const images = ref<string[]>([]); // URLs existentes
const selectedFiles = ref<File[]>([]);
const previews = ref<string[]>([]);
const imgError = ref("");
const isDraggingOver = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

const MAX_IMAGES = 5;
const MAX_SIZE = 2 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// Total de slots ocupados (para calcular cuántos quedan)
const allSlots = computed(() => [...images.value, ...previews.value]);

// ── Drag-to-reorder entre thumbnails ──
let dragSrc: { type: "url" | "file"; index: number } | null = null;

function onDragStart(type: "url" | "file", index: number) {
  dragSrc = { type, index };
}

function onDrop(type: "url" | "file", dropIndex: number) {
  if (!dragSrc) return;
  // Reordenar dentro del mismo array
  if (dragSrc.type === type) {
    if (type === "url") {
      const [item] = images.value.splice(dragSrc.index, 1);
      images.value.splice(dropIndex, 0, item);
    } else {
      const [file] = selectedFiles.value.splice(dragSrc.index, 1);
      const [preview] = previews.value.splice(dragSrc.index, 1);
      selectedFiles.value.splice(dropIndex, 0, file);
      previews.value.splice(dropIndex, 0, preview);
    }
  }
  dragSrc = null;
}

// ── Drop de archivos desde el sistema operativo ──
function onDropFile(e: DragEvent) {
  isDraggingOver.value = false;
  const files = Array.from(e.dataTransfer?.files ?? []);
  addFiles(files);
}

function onFilesSelected(e: Event) {
  const input = e.target as HTMLInputElement;
  const files = Array.from(input.files ?? []);
  addFiles(files);
  input.value = "";
}

function addFiles(files: File[]) {
  imgError.value = "";
  const remaining = MAX_IMAGES - allSlots.value.length;
  if (remaining <= 0) {
    imgError.value = `Ya tienes el máximo de ${MAX_IMAGES} imágenes`;
    return;
  }
  const toAdd = files.slice(0, remaining);

  for (const f of toAdd) {
    if (!ALLOWED.includes(f.type)) {
      imgError.value = "Tipo no permitido: solo jpg, png, webp o gif";
      return;
    }
    if (f.size > MAX_SIZE) {
      imgError.value = "Cada imagen debe ser menor a 2 MB";
      return;
    }
    selectedFiles.value.push(f);
    previews.value.push(URL.createObjectURL(f));
  }

  if (files.length > remaining) {
    imgError.value = `Solo se agregaron ${remaining} de ${files.length} (límite alcanzado)`;
  }
}

function removePreview(index: number) {
  URL.revokeObjectURL(previews.value[index]);
  previews.value.splice(index, 1);
  selectedFiles.value.splice(index, 1);
}

function removeImageByUrl(index: number) {
  images.value.splice(index, 1);
}

// ── Form ──
const emptyForm = () => ({
  name: "",
  price: 0,
  stock: 0,
  description: "",
  categoryId: null as number | null,
  subcategoryId: null as number | null,
  isFeatured: false,
  nuevoLanzamiento: false,
  isActive: true,
});
const form = reactive(emptyForm());

function openDrawer(product?: any) {
  formError.value = "";
  imgError.value = "";
  if (product) {
    editingId.value = product.id;
    Object.assign(form, {
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description ?? "",
      categoryId: product.categoryId ?? null,
      subcategoryId: product.subcategoryId ?? null,
      isFeatured: product.isFeatured ?? false,
      nuevoLanzamiento: product.nuevoLanzamiento ?? false,
      isActive: product.isActive ?? true,
    });
    images.value = product.images?.map((i: any) => i.url) ?? [];
  } else {
    editingId.value = null;
    Object.assign(form, emptyForm());
    images.value = [];
  }
  selectedFiles.value = [];
  previews.value.forEach(URL.revokeObjectURL);
  previews.value = [];
  drawerOpen.value = true;
}

function closeDrawer() {
  drawerOpen.value = false;
}

const categoryOptions = computed(() =>
  (categoriesData.value?.data ?? []).map((c: any) => ({
    label: c.name,
    value: c.id,
  })),
);
const subcategoryOptions = computed(() =>
  (subsData.value?.data ?? [])
    .filter((s: any) => !form.categoryId || s.categoryId === form.categoryId)
    .map((s: any) => ({ label: s.name, value: s.id })),
);

async function save() {
  if (!form.name || !form.price) {
    formError.value = "Nombre y precio son requeridos";
    return;
  }
  saving.value = true;
  formError.value = "";
  try {
    let uploadedUrls: string[] = [];
    if (selectedFiles.value.length) {
      uploadedUrls = await uploadFiles(selectedFiles.value);
    }
    const finalUrls = [...images.value, ...uploadedUrls].slice(0, MAX_IMAGES);
    const body: any = {
      ...form,
      images: finalUrls.map((u: string, i: number) => ({
        url: u,
        isPrimary: i === 0,
      })),
    };
    if (isEditing.value) {
      await $fetch(`/api/admin/products/${editingId.value}`, {
        method: "PUT",
        body,
      });
    } else {
      await $fetch("/api/admin/products", { method: "POST", body });
    }
    useAppToast().add({
      title: isEditing.value ? "Producto actualizado" : "Producto creado",
      color: "success",
    });
    closeDrawer();
    await refresh();
  } catch (e: any) {
    formError.value = e?.data?.message ?? "Error al guardar";
  } finally {
    saving.value = false;
  }
}

async function uploadFiles(files: File[]) {
  return Promise.all(
    files.map(async (file) => {
      const fd = new FormData();
      fd.append("file", file);
      const res: any = await $fetch("/api/upload/image", {
        method: "POST",
        body: fd,
      });
      return res.url;
    }),
  );
}

async function deleteProduct(id: number) {
  if (!confirm("¿Eliminar este producto?")) return;
  await $fetch(`/api/admin/products/${id}`, { method: "DELETE" });
  await refresh();
  useAppToast().add({ title: "Producto eliminado", color: "success" });
}
</script>

<style scoped>
.prod-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* ── Sección de imágenes ── */
.prod-img-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.prod-img-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.prod-img-counter {
  font-size: var(--sp-text-xs);
  font-weight: 600;
  color: var(--sp-text-soft);
  background: var(--sp-surface-subtle);
  border: 1px solid var(--sp-border);
  border-radius: var(--sp-radius-pill);
  padding: 0.1rem 0.55rem;
}

/* Grid de thumbnails */
.prod-img-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
}

/* Thumbnail */
.prod-img-thumb {
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--sp-radius-md);
  overflow: hidden;
  border: 1.5px solid var(--sp-border);
  background: var(--sp-surface-subtle);
  cursor: grab;
  transition:
    border-color 0.15s,
    transform 0.15s;
}

.prod-img-thumb:active {
  cursor: grabbing;
  transform: scale(0.97);
}

.prod-img-thumb--primary {
  border-color: var(--sp-primary);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--sp-primary) 15%, transparent);
}

.prod-img-thumb--new {
  border-style: dashed;
}

.prod-img-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  pointer-events: none;
}

/* Overlay con botón eliminar */
.prod-img-thumb__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 4px;
  transition: background 0.15s;
}

.prod-img-thumb:hover .prod-img-thumb__overlay {
  background: rgba(0, 0, 0, 0.35);
}

.prod-img-thumb__remove {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition:
    opacity 0.15s,
    background 0.15s;
  flex-shrink: 0;
}

.prod-img-thumb:hover .prod-img-thumb__remove {
  opacity: 1;
}

.prod-img-thumb__remove:hover {
  background: #dc2626;
}

/* Badge "Principal" */
.prod-img-thumb__badge {
  position: absolute;
  bottom: 4px;
  left: 4px;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: var(--sp-primary);
  color: #fff;
  border-radius: var(--sp-radius-pill);
  padding: 1px 6px;
  pointer-events: none;
}

/* Badge "Nueva" */
.prod-img-thumb__new-badge {
  position: absolute;
  bottom: 4px;
  right: 4px;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border-radius: var(--sp-radius-pill);
  padding: 1px 5px;
  pointer-events: none;
}

/* Slot para agregar (+) */
.prod-img-add {
  aspect-ratio: 1;
  border-radius: var(--sp-radius-md);
  border: 1.5px dashed var(--sp-border);
  background: var(--sp-surface-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  cursor: pointer;
  color: var(--sp-text-soft);
  font-size: 10px;
  font-weight: 600;
  transition:
    border-color 0.15s,
    background 0.15s,
    color 0.15s;
}

.prod-img-add:hover,
.prod-img-add--drag {
  border-color: var(--sp-primary);
  background: var(
    --sp-primary-soft,
    color-mix(in srgb, var(--sp-primary) 8%, transparent)
  );
  color: var(--sp-primary);
}

.prod-img-add__input {
  display: none;
}

/* Dropzone grande (cuando no hay imágenes) */
.prod-img-dropzone {
  width: 100%;
  padding: 1.5rem 1rem;
  border-radius: var(--sp-radius-lg);
  border: 1.5px dashed var(--sp-border);
  background: var(--sp-surface-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  cursor: pointer;
  color: var(--sp-text-soft);
  text-align: center;
  transition:
    border-color 0.15s,
    background 0.15s;
}

.prod-img-dropzone:hover,
.prod-img-dropzone--active {
  border-color: var(--sp-primary);
  background: var(
    --sp-primary-soft,
    color-mix(in srgb, var(--sp-primary) 8%, transparent)
  );
  color: var(--sp-primary);
}

.prod-img-dropzone__title {
  font-size: var(--sp-text-sm);
  font-weight: 600;
}

.prod-img-dropzone__sub {
  font-size: var(--sp-text-xs);
  opacity: 0.7;
}

/* Mensajes de error y ayuda */
.prod-img-error {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: var(--sp-text-xs);
  color: var(--sp-danger);
  font-weight: 500;
}

.prod-img-hint {
  font-size: 0.68rem;
  color: var(--sp-text-muted);
  font-weight: 500;
}

/* Counter para descripción */
.sp-drawer-field-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.sp-drawer-field-counter {
  font-size: var(--sp-text-xs);
  font-weight: 500;
  color: var(--sp-text-soft);
}
</style>
