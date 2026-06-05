<template>
  <div class="publish-page section">
    <div class="container publish-container">
      
      <div class="publish-card">
        <!-- Close Button -->
        <NuxtLink to="/mi-cuenta" class="btn-close" aria-label="Cancelar y regresar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </NuxtLink>

        <!-- Header -->
        <div class="publish-header">
          <span class="badge-creation">COMPARTIR CREACIÓN 🧶</span>
          <h1 class="publish-title">{{ isEditing ? 'Editar tejido publicado' : 'Publicar un nuevo tapete o tejido' }}</h1>
          <p class="publish-subtitle">Cuéntenos sobre su obra de arte. Los compradores se contactarán mediante su celular registrado.</p>
        </div>

        <form @submit.prevent="saveProduct" class="publish-form">
          <!-- Name -->
          <div class="form-group">
            <label>NOMBRE DE SU CREACIÓN / TAPETE *</label>
            <input type="text" v-model="form.name" class="form-input" placeholder="Ej: Tapete de Rosas Rojas a Crochet" required />
            <span class="help-text">Por ejemplo: "Camino de Mesa Primavera" o "Alfombra de Lana Gruesa Estrellada".</span>
          </div>

          <!-- Price & Dimensions -->
          <div class="form-row">
            <div class="form-group flex-1">
              <div class="label-with-badge">
                <label>PRECIO SABOR LOCAL *</label>
                <span class="badge-small">SIN COMISIONES</span>
              </div>
              <div class="input-with-prefix">
                <span class="prefix">S/.</span>
                <input type="number" v-model="form.price" class="form-input input-price" placeholder="0.00" step="0.01" required />
              </div>
            </div>

            <div class="form-group flex-1">
              <label>DIMENSIONES DEL TEJIDO *</label>
              <div class="dimensions-inputs">
                <div class="dim-wrapper">
                  <span class="dim-label">LARGO</span>
                  <input type="number" v-model="form.sizeLength" class="dim-input" placeholder="80" required />
                </div>
                <span class="dim-x">✕</span>
                <div class="dim-wrapper">
                  <span class="dim-label">ANCHO</span>
                  <input type="number" v-model="form.sizeWidth" class="dim-input" placeholder="80" required />
                </div>
                <select v-model="form.sizeUnit" class="form-select dim-unit">
                  <option value="cm">cm</option>
                  <option value="m">m</option>
                </select>
              </div>
              <span class="help-text">Por ejemplo: 80 × 80 cm, o 1.5 × 2 metros. Simplificado sin escribir "x" manualmente.</span>
            </div>
          </div>

          <!-- Material & Pattern -->
          <div class="form-row">
            <div class="form-group flex-1">
              <label>MATERIAL DEL TEJIDO *</label>
              <div class="select-wrapper">
                <span class="select-icon">🧶</span>
                <select v-model="form.material" class="form-select with-icon" required>
                  <option value="" disabled>Seleccione material</option>
                  <option value="Lana de Alpaca">Lana de Alpaca</option>
                  <option value="Algodón 100% Orgánico">Algodón 100% Orgánico</option>
                  <option value="Lana Gruesa y Yute">Lana Gruesa y Yute</option>
                  <option value="Hilo Acrílico">Hilo Acrílico</option>
                </select>
              </div>
            </div>

            <div class="form-group flex-1">
              <label>¿OFRECE EL PATRÓN PARA TEJERLO? *</label>
              <div class="pattern-toggles">
                <button type="button" class="toggle-btn" :class="{ active: form.offersPattern === true }" @click="form.offersPattern = true">
                  <span class="toggle-icon">✅</span> Sí, enseño cómo tejerlo
                </button>
                <button type="button" class="toggle-btn" :class="{ active: form.offersPattern === false }" @click="form.offersPattern = false">
                  <span class="toggle-icon">❌</span> No, solo vendo el producto
                </button>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="form-group">
            <label>CUÉNTENOS SOBRE SU TEJIDO (DESCRIPCIÓN) *</label>
            <textarea v-model="form.description" class="form-input textarea" rows="4" placeholder="Ej: He tejido este tapete con muchísimo cariño durante tres semanas de tardes lluviosas usando punto piña tradicional. Las lanas provienen de ovejas andinas..." required></textarea>
            <span class="help-text">Mencione detalles entrañables: el tiempo que le tomó tejerlo, la técnica o cómo cuidarlo.</span>
          </div>

          <!-- Photo Upload -->
          <div class="form-group">
            <label>FOTOS DEL PRODUCTO *</label>
            <div class="upload-area" @click="triggerFileInput" :style="form.image ? `background-image: url(${form.image}); background-size: cover; background-position: center; border: none;` : ''">
              <input type="file" ref="fileInput" accept="image/jpeg, image/png, image/webp" class="hidden-input" @change="handleFileUpload" />
              <div v-if="!form.image" class="upload-placeholder">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="upload-icon"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                <p class="upload-text"><strong>Haga clic aquí</strong> para seleccionar su fotografía</p>
                <p class="upload-subtext">Soporta imágenes JPG, PNG tomadas con celular.</p>
              </div>
              <div v-else class="upload-overlay">
                <span class="upload-change-text">Haga clic para cambiar imagen</span>
              </div>
            </div>
            <p v-if="uploadingImg" class="uploading-status">Subiendo imagen, espere por favor...</p>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary btn-submit" :disabled="isSaving">
              {{ isSaving ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Publicar Tejido') }}
            </button>
          </div>
        </form>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  layout: 'landing',
  middleware: ['auth']
})

const route = useRoute()
const router = useRouter()
const { user } = useUserSession()

const isEditing = computed(() => route.params.id !== 'nuevo')
const isSaving = ref(false)

const form = ref({
  name: '',
  price: '',
  sizeLength: '',
  sizeWidth: '',
  sizeUnit: 'cm',
  material: '',
  offersPattern: null as boolean | null,
  description: '',
  image: ''
})

const fileInput = ref<HTMLInputElement | null>(null)
const uploadingImg = ref(false)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement
  if (!target.files?.length) return
  const file = target.files[0]
  
  const formData = new FormData()
  formData.append('file', file)
  
  uploadingImg.value = true
  try {
    const res = await $fetch('/api/upload/image', {
      method: 'POST',
      body: formData
    })
    form.value.image = (res as any).url
  } catch (err: any) {
    alert(err.data?.message || 'Error al subir la imagen')
  } finally {
    uploadingImg.value = false
    target.value = '' 
  }
}

onMounted(async () => {
  if (isEditing.value) {
    try {
      const data = await $fetch(`/api/seller/products/${route.params.id}`) as any
      form.value = {
        name: data.name || '',
        price: data.price?.toString() || '',
        sizeLength: data.sizeLength?.toString() || '',
        sizeWidth: data.sizeWidth?.toString() || '',
        sizeUnit: data.sizeUnit || 'cm',
        material: data.material || '',
        offersPattern: data.offersPattern === 1,
        description: data.description || '',
        image: data.images?.find((img: any) => img.isPrimary)?.url || data.images?.[0]?.url || ''
      }
    } catch (err: any) {
      alert('Error cargando el producto')
      router.push('/mi-cuenta')
    }
  }
})

const saveProduct = async () => {
  if (!form.value.image) {
    alert('Por favor, suba una fotografía de su obra.')
    return
  }
  
  isSaving.value = true
  try {
    const payload = {
      name: form.value.name,
      price: parseFloat(form.value.price),
      sizeLength: form.value.sizeLength ? parseInt(form.value.sizeLength) : null,
      sizeWidth: form.value.sizeWidth ? parseInt(form.value.sizeWidth) : null,
      sizeUnit: form.value.sizeUnit,
      material: form.value.material,
      offersPattern: form.value.offersPattern,
      description: form.value.description,
      images: [{ url: form.value.image, isPrimary: true }]
    }

    if (isEditing.value) {
      await $fetch(`/api/seller/products/${route.params.id}`, { method: 'PUT', body: payload })
    } else {
      await $fetch('/api/seller/products', { method: 'POST', body: payload })
    }
    
    router.push('/mi-cuenta')
  } catch (err: any) {
    alert(err.data?.message || 'Error al guardar')
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.publish-page {
  padding-top: var(--space-8);
  padding-bottom: var(--space-16);
  min-height: 80vh;
  background-color: transparent; /* Assuming landing layout has dotted bg */
}

.publish-container {
  display: flex;
  justify-content: center;
}

.publish-card {
  background: #ffffff;
  border: 1px solid var(--cp-border);
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.05);
  width: 100%;
  max-width: 800px;
  padding: 40px;
  position: relative;
}

.btn-close {
  position: absolute;
  top: 24px;
  right: 24px;
  color: var(--cp-border-mid);
  transition: color var(--t-fast);
}
.btn-close:hover {
  color: var(--cp-text-dark);
}

.publish-header {
  margin-bottom: 32px;
}

.badge-creation {
  display: inline-block;
  background: #a38d70; /* brown gold */
  color: white;
  padding: 4px 12px;
  border-radius: var(--r-pill);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.publish-title {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--cp-text-dark);
  margin-bottom: 8px;
}

.publish-subtitle {
  font-size: 0.95rem;
  color: var(--cp-text-muted);
}

.publish-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.form-group label {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--cp-text-dark);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-row {
  display: flex;
  gap: 24px;
}
.flex-1 {
  flex: 1;
}

.form-input, .form-select {
  border: 1.5px solid var(--cp-border-light);
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--cp-text-dark);
  background: #ffffff;
  outline: none;
  transition: border-color var(--t-fast);
  width: 100%;
}
.form-input:focus, .form-select:focus {
  border-color: var(--cp-sage);
}
.form-input::placeholder {
  color: var(--cp-text-faint);
  font-weight: 500;
}
.textarea {
  resize: vertical;
  line-height: 1.5;
}

.help-text {
  font-size: 0.75rem;
  color: var(--cp-text-faint);
}

/* Price Input */
.label-with-badge {
  display: flex;
  align-items: center;
  gap: 8px;
}
.badge-small {
  background: transparent;
  border: 1px solid var(--cp-border-mid);
  color: var(--cp-text-muted);
  font-size: 0.6rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: var(--r-pill);
}

.input-with-prefix {
  position: relative;
  display: flex;
  align-items: center;
}
.prefix {
  position: absolute;
  left: 16px;
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--cp-text-dark);
  pointer-events: none;
}
.input-price {
  padding-left: 44px;
  font-family: var(--font-display);
  font-size: 1.1rem;
}

/* Dimensions Inputs */
.dimensions-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}
.dim-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  border: 1.5px solid var(--cp-border-light);
  border-radius: 12px;
  background: #ffffff;
  transition: border-color var(--t-fast);
}
.dim-wrapper:focus-within {
  border-color: var(--cp-sage);
}
.dim-label {
  position: absolute;
  left: 12px;
  font-size: 0.65rem;
  font-weight: 800;
  color: var(--cp-text-muted);
  pointer-events: none;
}
.dim-input {
  width: 100%;
  border: none;
  background: transparent;
  padding: 14px 12px 14px 50px;
  font-size: 1rem;
  font-weight: 700;
  color: var(--cp-text-dark);
  outline: none;
  text-align: center;
}
.dim-x {
  color: var(--cp-text-muted);
  font-weight: 500;
}
.dim-unit {
  width: 80px;
  flex-shrink: 0;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 14px;
}

/* Select Material */
.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.select-icon {
  position: absolute;
  left: 16px;
  font-size: 1.1rem;
  pointer-events: none;
}
.with-icon {
  padding-left: 44px;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 16px;
}

/* Pattern Toggles */
.pattern-toggles {
  display: flex;
  gap: 12px;
}
.toggle-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1.5px solid var(--cp-border-light);
  background: #ffffff;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--cp-text-dark);
  cursor: pointer;
  transition: all var(--t-fast);
}
.toggle-btn:hover {
  border-color: var(--cp-border-mid);
}
.toggle-btn.active {
  border-color: var(--cp-sage);
  background: #f4f6f3;
}

/* Upload Area */
.upload-area {
  border: 2px dashed var(--cp-border-mid);
  border-radius: 16px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 12px;
  background-color: #fdfcfb;
  cursor: pointer;
  transition: all var(--t-fast);
  position: relative;
  overflow: hidden;
}
.upload-area:hover {
  border-color: var(--cp-sage);
}
.hidden-input {
  display: none;
}
.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px 20px;
}
.upload-icon {
  color: var(--cp-sage);
}
.upload-text {
  font-size: 0.95rem;
  color: var(--cp-text-dark);
}
.upload-subtext {
  font-size: 0.8rem;
  color: var(--cp-text-muted);
}
.upload-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--t-fast);
}
.upload-area:hover .upload-overlay {
  opacity: 1;
}
.upload-change-text {
  color: white;
  font-weight: 800;
  font-size: 0.9rem;
  padding: 8px 16px;
  border: 2px solid white;
  border-radius: var(--r-pill);
}
.uploading-status {
  font-size: 0.8rem;
  color: var(--cp-sage-dark);
  font-weight: 700;
  margin-top: 4px;
}

/* Submit */
.form-actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}
.btn-submit {
  padding: 16px 32px;
  font-size: 1.1rem;
  font-weight: 800;
  border-radius: var(--r-pill);
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 24px;
  }
  .publish-card {
    padding: 24px;
  }
  .pattern-toggles {
    flex-direction: column;
  }
}
</style>
