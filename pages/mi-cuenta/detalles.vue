<template>
  <div class="detalles-page section">
    <div class="container detalles-container">
      
      <div class="detalles-card">
        
        <!-- Header -->
        <div class="detalles-header">
          <div class="header-text">
            <span class="badge-credencial">MI CREDENCIAL</span>
            <h1 class="detalles-title">Detalles de mi Cuenta</h1>
            <p class="detalles-subtitle">Revise sus datos personales de Arigumi. Mantener su teléfono y correo vigente ayuda a que le compren rápido.</p>
          </div>
          <button v-if="!isEditing" class="btn btn-edit-data" @click="isEditing = true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="edit-icon"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            Editar<br/>Datos
          </button>
          <div v-else class="edit-actions">
            <button class="btn btn-cancel" @click="cancelEdit">Cancelar</button>
            <button class="btn btn-save" :disabled="saving" @click="saveData">
              {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </div>

        <!-- User Identity Box -->
        <div class="user-identity-box">
          <div class="avatar-lg">
            <img :src="'https://ui-avatars.com/api/?name=' + (user?.name || 'C') + '&background=7d8e74&color=fff&size=128'" alt="Avatar" />
          </div>
          <div class="identity-info">
            <h2>{{ user?.name || 'Abuela/o Clara Gisbert Mendoza' }}</h2>
            <span class="role-badge">{{ user?.role ? user.role.replace('_', ' y ').toUpperCase() : 'VENDEDOR Y COMPRADOR' }}</span>
            <span class="identity-subtext">Socio registrado / @{{ user?.username || (user?.name ? user.name.split(' ')[0].toLowerCase() : 'abuelaclara') }}</span>
          </div>
        </div>

        <!-- Form Fields Grid -->
        <div class="data-grid">
          
          <div class="data-group">
            <label>NOMBRE</label>
            <div v-if="!isEditing" class="data-value">{{ firstName }}</div>
            <input v-else v-model="form.name" class="data-value sp-input" type="text" />
          </div>
          
          <div class="data-group">
            <label>APELLIDOS</label>
            <div v-if="!isEditing" class="data-value">{{ lastName }}</div>
            <input v-else v-model="form.lastName" class="data-value sp-input" type="text" />
          </div>

          <div class="data-group">
            <label>NOMBRE DE USUARIO (@)</label>
            <div v-if="!isEditing" class="data-value monospace-text">@{{ user?.username || '—' }}</div>
            <input v-else v-model="form.username" class="data-value sp-input monospace-text" type="text" />
          </div>

          <div class="data-group">
            <label>GÉNERO</label>
            <div v-if="!isEditing" class="data-value">{{ user?.gender || '—' }}</div>
            <select v-else v-model="form.gender" class="data-value sp-input">
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div class="data-group">
            <label>FECHA DE NACIMIENTO</label>
            <div v-if="!isEditing" class="data-value">{{ user?.birthDate || '—' }}</div>
            <input v-else v-model="form.birthDate" class="data-value sp-input" type="date" />
          </div>

          <div class="data-group">
            <label>DNI (IDENTIFICACIÓN)</label>
            <div v-if="!isEditing" class="data-value">{{ user?.dni || '08342155' }}</div>
            <input v-else v-model="form.dni" class="data-value sp-input" type="text" />
          </div>

          <div class="data-group">
            <label>CELULAR WHATSAPP</label>
            <div v-if="!isEditing" class="data-value whatsapp-value">
              <span class="active-dot"></span>
              {{ user?.phone || '+51940756166' }}
            </div>
            <input v-else v-model="form.phone" class="data-value sp-input" type="text" />
          </div>

          <div class="data-group full-width">
            <label>DIRECCIÓN</label>
            <div v-if="!isEditing" class="data-value">{{ user?.address || 'Av. Larco 452, Miraflores, Lima' }}</div>
            <input v-else v-model="form.address" class="data-value sp-input" type="text" />
          </div>

          <div class="data-group full-width">
            <label>CORREO ELECTRÓNICO DE CONTACTO</label>
            <div class="data-value monospace-text">{{ user?.email || 'clara.tejidos@arigumi.pe' }}</div>
            <small v-if="isEditing" class="helper-text">El correo no se puede cambiar aquí.</small>
          </div>

          <div class="data-group full-width">
            <label>ROL DE SOCIO</label>
            <div class="data-value">{{ formattedRole }}</div>
          </div>

        </div>

        <div class="protection-text">
         <span class="check-circle">✓</span> arigumi prueba ci/cd 1:18 am
        </div>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'landing',
  middleware: ['auth']
})

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const firstName = computed(() => user.value?.name || '—')
const lastName = computed(() => user.value?.lastName || '—')

const formattedRole = computed(() => {
  if (!user.value?.role) return 'Vendedor y Comprador'
  const role = user.value.role.replace('_', ' y ')
  return role.charAt(0).toUpperCase() + role.slice(1)
})

const isEditing = ref(false)
const saving = ref(false)

const form = ref({
  name: user.value?.name || '',
  lastName: user.value?.lastName || '',
  username: user.value?.username || '',
  gender: user.value?.gender || '',
  birthDate: user.value?.birthDate || '',
  dni: user.value?.dni || '',
  phone: user.value?.phone || '',
  address: user.value?.address || ''
})

watch(isEditing, (val) => {
  if (val) {
    form.value = {
      name: user.value?.name || '',
      lastName: user.value?.lastName || '',
      username: user.value?.username || '',
      gender: user.value?.gender || '',
      birthDate: user.value?.birthDate || '',
      dni: user.value?.dni || '',
      phone: user.value?.phone || '',
      address: user.value?.address || ''
    }
  }
})

const cancelEdit = () => {
  isEditing.value = false
}

const saveData = async () => {
  try {
    saving.value = true
    await authStore.updateProfile(form.value)
    isEditing.value = false
    // Opcional: mostrar un toast de éxito
    alert('Perfil actualizado correctamente')
  } catch (error) {
    console.error(error)
    alert('Ocurrió un error al guardar los cambios.')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.detalles-page {
  padding-top: var(--space-8);
  padding-bottom: var(--space-16);
  min-height: 80vh;
}

.detalles-container {
  display: flex;
  justify-content: center;
}

.detalles-card {
  background: #ffffff;
  border: 1px solid var(--cp-border);
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.05);
  width: 100%;
  max-width: 700px;
  padding: 40px;
}

/* Header */
.detalles-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  gap: 20px;
}
.header-text {
  flex: 1;
}

.badge-credencial {
  display: inline-block;
  background: #475a40; /* dark green */
  color: white;
  padding: 4px 12px;
  border-radius: var(--r-pill);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.detalles-title {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--cp-text-dark);
  margin-bottom: 8px;
}

.detalles-subtitle {
  font-size: 0.9rem;
  color: var(--cp-text-muted);
  line-height: 1.5;
}

.btn-edit-data {
  background: #a38d70; /* brown gold */
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  text-align: left;
  line-height: 1.2;
  transition: opacity var(--t-fast);
}
.btn-edit-data:hover {
  opacity: 0.9;
}
.edit-icon {
  opacity: 0.9;
}

/* User Identity Box */
.user-identity-box {
  display: flex;
  align-items: center;
  gap: 20px;
  border: 1.5px dashed var(--cp-border-mid);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 32px;
}
.avatar-lg {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}
.avatar-lg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.identity-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.identity-info h2 {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--cp-text-dark);
  margin-bottom: 4px;
}
.role-badge {
  background: #f4f6f3;
  color: var(--cp-earth-dark);
  padding: 4px 10px;
  border-radius: var(--r-pill);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}
.identity-subtext {
  font-size: 0.8rem;
  color: var(--cp-text-faint);
  font-family: monospace;
}

/* Data Grid */
.data-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 32px;
}
.full-width {
  grid-column: 1 / -1;
}

.data-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.data-group label {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--cp-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.data-value {
  border: 1.5px solid var(--cp-border-light);
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 1rem;
  font-weight: 700;
  color: var(--cp-text-dark);
  background: #ffffff;
}

.whatsapp-value {
  display: flex;
  align-items: center;
  gap: 10px;
}
.active-dot {
  width: 10px;
  height: 10px;
  background: #48bb78; /* green */
  border-radius: 50%;
}

.monospace-text {
  font-family: monospace;
  font-size: 1.05rem;
}

/* Protection Text */
.protection-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.8rem;
  color: var(--cp-text-faint);
  text-align: center;
}
.check-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: #e2e8e0;
  border-radius: 50%;
  font-size: 0.65rem;
  font-weight: bold;
  color: #718096;
}

@media (max-width: 640px) {
  .detalles-header {
    flex-direction: column;
  }
  .data-grid {
    grid-template-columns: 1fr;
  }
}
</style>
