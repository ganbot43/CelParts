<template>
  <div class="login-root">
    <div class="login-container">
      <!-- Left Branding Section -->
      <div class="branding-section">
        <div class="brand-header">
          <img :src="logoUrl" alt="Arigumi logo" class="brand-logo" />
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
          <span class="form-subtitle">¡QUÉ ALEGRÍA TENERTE DE VUELTA!</span>
          <h2 class="form-title-main">Ingresar a Arigumi</h2>
        </div>

        <form class="login-form" @submit.prevent="login">
          <div class="field-group">
            <label for="email">Correo Electrónico o Usuario</label>
            <input 
              id="email" 
              v-model="form.email" 
              type="text" 
              placeholder="Ej. clara@arigumi.pe" 
              required
            />
            <span class="field-hint">Sugerencias: clara@arigumi.pe o ricardo@arigumi.pe</span>
          </div>

          <div class="field-group">
            <div class="label-row">
              <label for="password">Contraseña </label>
              <a href="#" class="forgot-password">¿Olvidaste tu contraseña?</a>
            </div>
            <input 
              id="password" 
              v-model="form.password" 
              type="password" 
              placeholder="••••••••" 
            />
          </div>

          <!-- Error / Success -->
          <Transition name="fade-slide">
            <div v-if="successMsg" class="alert alert-success">
              {{ successMsg }}
            </div>
          </Transition>

          <Transition name="fade-slide">
            <div v-if="error" class="alert alert-error">
              {{ error }}
            </div>
          </Transition>

          <button type="submit" class="btn btn-primary btn-lg w-full mt-4" :disabled="loading">
            <span v-if="!loading">Ingresar a mi cuenta</span>
            <span v-else>Cargando...</span>
          </button>
        </form>

        <div class="divider-text">
          <span>O TAMBIÉN</span>
        </div>

        <button type="button" class="btn btn-outline btn-lg w-full btn-google">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="google-icon" />
          Iniciar sesión con Google
        </button>

        <div class="register-prompt">
          ¿Aún no tienes cuenta? <NuxtLink to="/registro">Regístrate aquí</NuxtLink>
        </div>

        <!-- Quick Access Test -->
        <div class="quick-access">
          <span class="quick-access-title">🚀 ACCESO RÁPIDO DE PRUEBA (CLIC ÚNICO):</span>
          <div class="quick-access-buttons">
            <button class="quick-acc-btn" @click.prevent="quickLogin('clara@arigumi.pe', 'admin123')">
              <div class="qa-avatar">
                <img src="https://i.pravatar.cc/150?u=clara" alt="Clara" />
              </div>
              <div class="qa-info">
                <strong>Abuela Clara</strong>
                <span>Vendedor y Comprador</span>
              </div>
            </button>
            <button class="quick-acc-btn" @click.prevent="quickLogin('ricardo@arigumi.pe', 'admin123')">
              <div class="qa-avatar">
                <img src="https://i.pravatar.cc/150?u=ricardo" alt="Ricardo" />
              </div>
              <div class="qa-info">
                <strong>Don Ricardo</strong>
                <span>Vendedor y Comprador</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "auth", middleware: 'guest' })
useSeoMeta({ title: "Arigumi — Iniciar sesión" })

const form = reactive({ email: "", password: "" })
const loading = ref(false)
const error = ref('')

// Load business config for dynamic logo
const businessConfig = useBusinessConfig()
const logoUrl = computed(() => businessConfig.value?.logoUrl || '/images/logo.png')

const authStore = useAuthStore();
const route = useRoute()

const successMsg = computed(() => {
  if (route.query.registered) {
    return "¡Registro exitoso! Por favor, ingresa a tu cuenta."
  }
  return ""
})

async function login() {
  if (!form.email || !form.password) {
    error.value = "Por favor completa todos los campos."
    return
  }

  loading.value = true
  error.value = ""

  try {
    await authStore.login(form.email, form.password)
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || "Credenciales inválidas. Inténtalo de nuevo."
  } finally {
    loading.value = false
  }
}

function quickLogin(email: string, pass: string) {
  form.email = email
  form.password = pass
  login()
}
</script>

<style scoped>
.login-root {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--cp-cream-bg);
  background-image: radial-gradient(var(--cp-border-mid) 0.75px, transparent 0.75px);
  background-size: 24px 24px;
  padding: var(--space-4);
}

.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
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
  padding: var(--space-10) var(--space-8);
  background: var(--cp-cream-card);
  border-right: 1px solid var(--cp-border);
  display: flex;
  flex-direction: column;
}

.brand-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-8);
}
.brand-logo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--cp-sage);
}
.brand-title h1 {
  font-size: 1.5rem;
  color: var(--cp-text-dark);
  line-height: 1;
}
.brand-title span {
  font-size: 0.8rem;
  font-style: italic;
  color: var(--cp-text-muted);
}
.badge-c2c {
  margin-left: auto;
  background: var(--cp-sage);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: var(--r-pill);
  letter-spacing: 0.05em;
}

.brand-icon {
  width: 60px;
  height: 60px;
  background: white;
  border: 1px dashed var(--cp-border-mid);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-4);
  font-size: 1.5rem;
}

.hero-title {
  font-size: 2.2rem;
  line-height: 1.2;
  color: var(--cp-text-dark);
  margin-bottom: var(--space-4);
}
.hero-title em {
  color: var(--cp-sage-dark);
}
.hero-description {
  font-size: 1rem;
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
  font-size: 0.9rem;
}
.info-list li {
  margin-bottom: 6px;
}

.brand-footer {
  margin-top: var(--space-8);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 0.85rem;
  color: var(--cp-text-muted);
}
.brand-footer .dot {
  font-size: 1.2rem;
}

/* ── RIGHT: Form ── */
.form-section {
  padding: var(--space-10) var(--space-12);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-header {
  margin-bottom: var(--space-6);
}
.form-subtitle {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--cp-earth-mid);
  text-transform: uppercase;
}
.form-title-main {
  font-size: 2rem;
  color: var(--cp-text-dark);
  margin-top: 4px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.forgot-password {
  font-size: 0.8rem;
  color: var(--cp-text-muted);
}
.field-hint {
  display: block;
  font-size: 0.75rem;
  color: var(--cp-text-faint);
  margin-top: 4px;
  font-style: italic;
}

.w-full {
  width: 100%;
}
.mt-4 {
  margin-top: 1rem;
}

.divider-text {
  text-align: center;
  margin: var(--space-6) 0;
  position: relative;
}
.divider-text::before,
.divider-text::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 35%;
  height: 1px;
  background: var(--cp-border);
}
.divider-text::before { left: 0; }
.divider-text::after { right: 0; }
.divider-text span {
  font-size: 0.75rem;
  color: var(--cp-text-faint);
  letter-spacing: 0.1em;
}

.btn-google {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}
.google-icon {
  width: 20px;
  height: 20px;
}

.register-prompt {
  text-align: center;
  margin-top: var(--space-4);
  font-size: 0.9rem;
  color: var(--cp-text-body);
}
.register-prompt a {
  font-weight: 700;
  color: var(--cp-sage-dark);
}

.quick-access {
  margin-top: var(--space-8);
  padding: var(--space-4);
  background: var(--cp-cream-card);
  border: 1px dashed var(--cp-border-mid);
  border-radius: var(--r-md);
}
.quick-access-title {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--cp-earth-mid);
  margin-bottom: var(--space-3);
  letter-spacing: 0.05em;
}
.quick-access-buttons {
  display: flex;
  gap: var(--space-3);
}
.quick-acc-btn {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--cp-cream-surface);
  border: 1px solid var(--cp-border);
  border-radius: var(--r-sm);
  padding: 8px;
  transition: all var(--t-fast) ease;
  text-align: left;
}
.quick-acc-btn:hover {
  border-color: var(--cp-sage);
  background: var(--cp-sage-light);
}
.qa-avatar img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
.qa-info {
  display: flex;
  flex-direction: column;
}
.qa-info strong {
  font-size: 0.8rem;
  color: var(--cp-text-dark);
}
.qa-info span {
  font-size: 0.65rem;
  color: var(--cp-text-muted);
}

@media (max-width: 900px) {
  .login-container {
    grid-template-columns: 1fr;
  }
  .branding-section {
    display: none;
  }
  .form-section {
    padding: var(--space-6) var(--space-5);
  }
}
</style>
