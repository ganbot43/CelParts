<template>
  <div class="admin-profile-page">
    <div class="sp-page-toolbar" style="margin-bottom: 1.25rem">
      <div>
        <h1 class="sp-page-toolbar__title">Mi Perfil</h1>
        <p class="sp-page-toolbar__sub">Gestiona tu información y foto de perfil</p>
      </div>
    </div>

    <div class="admin-surface profile-card admin-fade-in">
      <div class="profile-header">
        <div class="profile-avatar-section">
          <div class="avatar-preview">
            <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" />
            <div v-else class="avatar-placeholder">
              {{ initials }}
            </div>
            
            <label class="avatar-upload-btn" :class="{ 'is-uploading': uploading }">
              <input type="file" accept="image/*" @change="onFileSelected" style="display:none" />
              <svg v-if="!uploading" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <svg v-else class="cfg-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" stroke-dasharray="28" stroke-dashoffset="10" stroke-linecap="round" />
              </svg>
            </label>
          </div>
          <div class="avatar-info">
            <h3>{{ session?.name || 'Administrador' }} {{ session?.lastName || '' }}</h3>
            <p>{{ session?.role === 'superadmin' ? 'Administrador Global' : 'Administrador' }}</p>
          </div>
        </div>
      </div>

      <div class="profile-body">
        <div class="admin-fields-grid">
          <div class="admin-field">
            <label class="admin-field__label">Nombre</label>
            <input v-model="form.name" type="text" placeholder="Ej. Juan" />
          </div>
          <div class="admin-field">
            <label class="admin-field__label">Apellidos</label>
            <input v-model="form.lastName" type="text" placeholder="Ej. Pérez" />
          </div>
          <div class="admin-field">
            <label class="admin-field__label">Username</label>
            <input v-model="form.username" type="text" placeholder="Ej. juanperez" />
          </div>
          <div class="admin-field">
            <label class="admin-field__label">DNI</label>
            <input v-model="form.dni" type="text" placeholder="Ej. 12345678" />
          </div>
          <div class="admin-field">
            <label class="admin-field__label">Teléfono</label>
            <input v-model="form.phone" type="text" placeholder="Ej. 999 888 777" />
          </div>
          <div class="admin-field">
            <label class="admin-field__label">Género</label>
            <select v-model="form.gender">
              <option value="">No especificar</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>
          <div class="admin-field">
            <label class="admin-field__label">Fecha de Nacimiento</label>
            <input v-model="form.birthDate" type="date" />
          </div>
          <div class="admin-field" style="grid-column: 1 / -1">
            <label class="admin-field__label">Dirección</label>
            <input v-model="form.address" type="text" placeholder="Ej. Av. Principal 123" />
          </div>
        </div>
      </div>

      <div class="profile-footer">
        <button class="admin-button admin-button--primary" :disabled="saving" @click="saveProfile">
          <span v-if="saving">Guardando...</span>
          <span v-else>Guardar Cambios</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'superadmin']
})
useSeoMeta({ title: "Mi Perfil — Admin" })

import { useAuthStore } from '~/stores/auth'
const authStore = useAuthStore()
const { user: session } = storeToRefs(authStore)

const initials = computed(() => {
  const n = session.value?.name?.charAt(0) || ''
  const l = session.value?.lastName?.charAt(0) || ''
  return (n + l).toUpperCase() || 'AD'
})

const form = ref({
  name: session.value?.name || '',
  lastName: session.value?.lastName || '',
  username: session.value?.username || '',
  dni: session.value?.dni || '',
  phone: session.value?.phone || '',
  gender: session.value?.gender || '',
  birthDate: session.value?.birthDate || '',
  address: session.value?.address || '',
  profileImageUrl: session.value?.profileImageUrl || ''
})

const avatarUrl = ref('')
watch(
  () => form.value.profileImageUrl,
  async (newUrl) => {
    if (!newUrl) {
      avatarUrl.value = ''
      return
    }
    if (newUrl.includes('.amazonaws.com/')) {
      try {
        const res: any = await $fetch(`/api/upload/presigned?url=${encodeURIComponent(newUrl)}`)
        avatarUrl.value = res.presignedUrl || newUrl
      } catch (e) {
        avatarUrl.value = newUrl
      }
    } else {
      avatarUrl.value = newUrl
    }
  },
  { immediate: true }
)

const uploading = ref(false)
const saving = ref(false)

async function onFileSelected(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  const file = input.files[0]
  
  if (file.size > 2 * 1024 * 1024) {
    alert("La imagen debe pesar menos de 2MB")
    return
  }

  uploading.value = true
  try {
    const fd = new FormData()
    fd.append('file', file)
    const res: any = await $fetch('/api/upload?folder=perfil', {
      method: 'POST',
      body: fd
    })
    form.value.profileImageUrl = res.url
    useAppToast().add({ title: 'Foto subida correctamente', color: 'success' })
  } catch(e:any) {
    alert("Error al subir la imagen a S3")
  } finally {
    uploading.value = false
  }
}

async function saveProfile() {
  if (!form.value.name) return
  saving.value = true
  try {
    await authStore.updateProfile(form.value)
    useAppToast().add({ title: 'Perfil guardado', color: 'success' })
  } catch(e:any) {
    alert("Error al guardar el perfil")
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.admin-profile-page {
  padding: 1.5rem;
  max-width: 800px;
}

.profile-card {
  display: flex;
  flex-direction: column;
}

.profile-header {
  padding: 2rem;
  border-bottom: 1px solid var(--sp-border);
  background: linear-gradient(180deg, var(--sp-slate-50) 0%, var(--sp-surface-solid) 100%);
  border-radius: var(--sp-radius-xl) var(--sp-radius-xl) 0 0;
}

.profile-avatar-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.avatar-preview {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid var(--sp-border-strong);
  background: var(--sp-surface-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-placeholder {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--sp-text-soft);
}

.avatar-upload-btn {
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--sp-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--sp-shadow-sm);
  border: 2px solid #fff;
  transition: transform 0.2s;
}

.avatar-upload-btn:hover {
  transform: scale(1.1);
}

.is-uploading {
  pointer-events: none;
  opacity: 0.8;
}

.avatar-info h3 {
  margin: 0;
  font-size: var(--sp-text-lg);
  color: var(--sp-text-strong);
}

.avatar-info p {
  margin: 0;
  font-size: var(--sp-text-sm);
  color: var(--sp-text-soft);
}

.profile-body {
  padding: 2rem;
}

.admin-fields-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.profile-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--sp-border);
  display: flex;
  justify-content: flex-end;
  background: var(--sp-slate-50);
  border-radius: 0 0 var(--sp-radius-xl) var(--sp-radius-xl);
}

.cfg-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
