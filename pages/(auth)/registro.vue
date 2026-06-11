<template>
  <div class="register-root">
    <div class="register-container">
      <!-- Left Branding Section (same as login) -->
      <div class="branding-section">
        <div class="brand-header">
          <img src="/images/logo.png" alt="Arigumi logo" class="brand-logo" />
          <div class="brand-title">
            <h1>Arigumi</h1>
            <span>Hilando sonrisas</span>
          </div>
          <span class="badge-c2c">MERCADO C2C</span>
        </div>

        <div class="brand-icon">
          <span>🧶</span>
        </div>

        <h1 class="hero-title">
          Uniendo generaciones paso <br />a paso,<br />
          <em>hecho a mano y con el corazón.</em>
        </h1>

        <p class="hero-description">
          Arigumi es un espacio cálido y sin comisiones diseñado especialmente para que adultos mayores compren y vendan sus tapetes, mantas y bordados directamente a través de WhatsApp.
        </p>

        <div class="info-box-stacked">
          <h4 class="info-title">💚 ¿Cómo funciona?</h4>
          <ol class="info-list">
            <li>Registra tus hermosas creaciones.</li>
            <li>Los compradores interesados verán tus publicaciones.</li>
            <li>Harán un clic y chatearán directamente a tu celular por WhatsApp.</li>
          </ol>
        </div>

        <div class="brand-footer">
          <span class="dot">🧶</span>
          <span>Hilando historias desde el hogar peruano. Sin comisiones intermedias.</span>
        </div>
      </div>

      <!-- Right Form Section -->
      <div class="form-section">
        <div class="form-header">
          <NuxtLink to="/login" class="back-link">← Regresar al login</NuxtLink>
          <h2 class="form-title-main">Unirme como Tejedor</h2>
          <p class="form-description">Llena esta linda cartilla para crear tu cuenta gratis en un minuto.</p>
        </div>

        <form class="register-form" @submit.prevent="register">
          <div class="form-grid">
            <!-- Row 1 -->
            <div class="field-group">
              <label for="username">Usuario</label>
              <input id="username" v-model="form.username" type="text" placeholder="Ej. clara123" required />
            </div>
            <div class="field-group">
              <label for="email">Correo Electrónico</label>
              <input id="email" v-model="form.email" type="email" placeholder="usuario@correo.com" required />
            </div>

            <!-- Row 2 -->
            <div class="field-group">
              <label for="name">Nombre</label>
              <input id="name" v-model="form.name" type="text" placeholder="Tu nombre" required />
            </div>
            <div class="field-group">
              <label for="lastName">Apellidos</label>
              <input id="lastName" v-model="form.lastName" type="text" placeholder="Tus apellidos" />
            </div>

            <!-- Row 3 -->
            <div class="field-group">
              <label for="gender">Género</label>
              <select id="gender" v-model="form.gender">
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
                <option value="Prefiero no decirlo">Prefiero no decirlo</option>
              </select>
            </div>
            <div class="field-group">
              <label for="birthDate">Fecha de Nacimiento</label>
              <input id="birthDate" v-model="form.birthDate" type="date" />
            </div>

            <!-- Row 4 -->
            <div class="field-group">
              <label for="dni">Documento DNI / ID</label>
              <input id="dni" v-model="form.dni" type="text" placeholder="Ocho números" />
            </div>
            <div class="field-group">
              <label for="phone">Celular (Para WhatsApp)</label>
              <input id="phone" v-model="form.phone" type="text" placeholder="Ej. +51 940 756 166" required />
            </div>
          </div>

          <!-- Row 5 Full Width -->
          <div class="field-group mt-3">
            <label for="address">Dirección u hogar de despacho</label>
            <input id="address" v-model="form.address" type="text" placeholder="Calle, Distrito, Ciudad" />
          </div>

          <!-- Row 6 Full Width (Roles) -->
          <div class="field-group mt-3">
            <label>Mi rol en la página</label>
            <div class="role-selector">
              <div 
                class="form-selector-card" 
                :class="{ active: form.role === 'vendedor_comprador' }"
                @click="form.role = 'vendedor_comprador'"
              >
                Vendedor y<br/>Comprador
              </div>
              <div 
                class="form-selector-card" 
                :class="{ active: form.role === 'vendedor' }"
                @click="form.role = 'vendedor'"
              >
                Vendedor
              </div>
              <div 
                class="form-selector-card" 
                :class="{ active: form.role === 'comprador' }"
                @click="form.role = 'comprador'"
              >
                Comprador
              </div>
            </div>
          </div>

          <!-- Row 7 Full Width -->
          <div class="field-group mt-3">
            <label for="password">Establecer Contraseña</label>
            <input id="password" v-model="form.password" type="password" placeholder="Elige una contraseña amigable" required />
          </div>

          <!-- Error -->
          <Transition name="fade-slide">
            <div v-if="error" class="alert alert-error mt-4">
              {{ error }}
            </div>
          </Transition>

          <button type="submit" class="btn btn-primary btn-lg w-full mt-4" :disabled="loading">
            <span v-if="!loading">Crear mi cuenta gratis</span>
            <span v-else>Cargando...</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "auth", middleware: 'guest' })
useSeoMeta({ title: "Arigumi — Registro" })

const form = reactive({
  username: "",
  email: "",
  name: "",
  lastName: "",
  gender: "Femenino",
  birthDate: "",
  dni: "",
  phone: "",
  address: "",
  role: "vendedor_comprador",
  password: ""
})
const loading = ref(false)
const error = ref("")

const authStore = useAuthStore();
const route = useRoute()

async function register() {
  if (!form.email || !form.password || !form.name) {
    error.value = "Por favor completa los campos obligatorios."
    return
  }

  loading.value = true
  error.value = ""

  try {
    // In a real implementation this endpoint would exist and create the user
    // We simulate creating user and navigating for now
    await $fetch("/api/auth/register", {
      method: "POST",
      body: form,
    })

    // Log the user in automatically after successful registration
    await authStore.login(form.email, form.password);

    const redirect = route.query.redirect as string
    if (redirect) {
      await navigateTo(redirect, { external: true })
    } else {
      await navigateTo("/", { external: true })
    }
  } catch (e: any) {
    // Si no existe el endpoint temporalmente, mostramos error
    error.value = e?.data?.message || e?.message || "Servicio temporalmente no disponible. Inténtalo más tarde."
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-root {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--cp-cream-bg);
  background-image: radial-gradient(var(--cp-border-mid) 0.75px, transparent 0.75px);
  background-size: 24px 24px;
  padding: var(--space-4);
}

.register-container {
  display: grid;
  grid-template-columns: 350px 1fr;
  max-width: 1100px;
  width: 100%;
  background: var(--cp-cream-surface);
  border-radius: var(--r-xl);
  box-shadow: var(--card-shadow-hover);
  overflow: hidden;
  border: 1px solid var(--cp-border);
}

/* ── LEFT: Branding ── */
.branding-section {
  padding: var(--space-8) var(--space-6);
  background: var(--cp-cream-card);
  border-right: 1px solid var(--cp-border);
  display: flex;
  flex-direction: column;
}

.brand-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-8);
  flex-wrap: wrap;
}
.brand-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--cp-sage);
}
.brand-title h1 {
  font-size: 1.25rem;
  color: var(--cp-text-dark);
  line-height: 1;
}
.brand-title span {
  font-size: 0.75rem;
  font-style: italic;
  color: var(--cp-text-muted);
}
.badge-c2c {
  background: var(--cp-sage);
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: var(--r-pill);
  letter-spacing: 0.05em;
  margin-left: auto;
}

.brand-icon {
  width: 50px;
  height: 50px;
  background: white;
  border: 1px dashed var(--cp-border-mid);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-4);
  font-size: 1.25rem;
}

.hero-title {
  font-size: 1.8rem;
  line-height: 1.2;
  color: var(--cp-text-dark);
  margin-bottom: var(--space-4);
}
.hero-title em {
  color: var(--cp-sage-dark);
}
.hero-description {
  font-size: 0.95rem;
  color: var(--cp-text-body);
  margin-bottom: var(--space-6);
  line-height: 1.6;
}

.info-box-stacked {
  margin-bottom: auto;
}
.info-title {
  color: var(--cp-sage-dark);
  margin-bottom: var(--space-2);
}
.info-list {
  padding-left: 1.2rem;
  color: var(--cp-text-body);
  font-size: 0.85rem;
}
.info-list li {
  margin-bottom: 6px;
}

.brand-footer {
  margin-top: var(--space-8);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 0.8rem;
  color: var(--cp-text-muted);
}

/* ── RIGHT: Form ── */
.form-section {
  padding: var(--space-8) var(--space-10);
  display: flex;
  flex-direction: column;
}

.form-header {
  margin-bottom: var(--space-6);
}
.back-link {
  font-size: 0.8rem;
  color: var(--cp-text-muted);
  font-weight: 600;
}
.form-title-main {
  font-size: 1.8rem;
  color: var(--cp-text-dark);
  margin-top: 8px;
}
.form-description {
  font-size: 0.9rem;
  color: var(--cp-text-body);
  margin-top: 4px;
}

.register-form {
  display: flex;
  flex-direction: column;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.field-group {
  display: flex;
  flex-direction: column;
}
.mt-3 {
  margin-top: 1rem;
}
.mt-4 {
  margin-top: 1.5rem;
}
.w-full {
  width: 100%;
}

.role-selector {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--space-3);
}

.form-selector-card {
  text-align: center;
  font-size: 0.85rem;
  line-height: 1.2;
  padding: var(--space-3);
  color: var(--cp-text-body);
}

@media (max-width: 900px) {
  .register-container {
    grid-template-columns: 1fr;
  }
  .branding-section {
    display: none;
  }
  .form-section {
    padding: var(--space-6) var(--space-5);
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
  .role-selector {
    grid-template-columns: 1fr;
  }
}
</style>
