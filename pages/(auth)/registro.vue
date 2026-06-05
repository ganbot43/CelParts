<template>
  <div class="login-root">
    <!-- Ambient background -->
    <div class="ambient-bg">
      <div class="orb orb-1" />
      <div class="orb orb-2" />
      <div class="orb orb-3" />
      <div class="grid-overlay" />
    </div>

    <div class="login-wrapper">
      <!-- Card -->
      <div class="login-card" :class="{ 'card-shake': shaking }">
        <!-- Header -->
        <div class="card-header">
          <div class="logo-mark">
            <img src="/images/logo.png" alt="CelParts logo" />
          </div>
          <div class="header-text">
            <h1 class="app-name">{{ companyName }}</h1>
            <p class="app-subtitle">Crea una cuenta para cotizar</p>
          </div>
        </div>

        <div class="divider" />

        <!-- Form -->
        <div class="form-body">
          <h2 class="form-title">Registro de Cliente</h2>

          <div class="field-group">
            <UFormField label="Nombre o Empresa" name="name">
              <div
                class="input-wrapper"
                :class="{ focused: focusedField === 'name' }"
              >
                <UInput
                  v-model="form.name"
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  class="smart-input pl-4"
                  :ui="inputUI"
                  @focus="focusedField = 'name'"
                  @blur="focusedField = ''"
                  @keyup.enter="register"
                />
              </div>
            </UFormField>

            <UFormField label="Correo electrónico" name="email">
              <div
                class="input-wrapper"
                :class="{ focused: focusedField === 'email' }"
              >
                <UInput
                  v-model="form.email"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  class="smart-input pl-4"
                  :ui="inputUI"
                  @focus="focusedField = 'email'"
                  @blur="focusedField = ''"
                  @keyup.enter="register"
                />
              </div>
            </UFormField>

            <UFormField label="Teléfono / Celular (Opcional)" name="phone">
              <div
                class="input-wrapper"
                :class="{ focused: focusedField === 'phone' }"
              >
                <UInput
                  v-model="form.phone"
                  type="tel"
                  placeholder="+51 999 999 999"
                  class="smart-input pl-4"
                  :ui="inputUI"
                  @focus="focusedField = 'phone'"
                  @blur="focusedField = ''"
                  @keyup.enter="register"
                />
              </div>
            </UFormField>

            <UFormField label="Contraseña" name="password">
              <div
                class="input-wrapper"
                :class="{ focused: focusedField === 'password' }"
              >
                <UInput
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  class="smart-input pl-4"
                  :ui="inputUI"
                  @focus="focusedField = 'password'"
                  @blur="focusedField = ''"
                  @keyup.enter="register"
                />
                <button
                  class="toggle-password"
                  type="button"
                  @click="showPassword = !showPassword"
                  tabindex="-1"
                >
                  <svg
                    v-if="!showPassword"
                    viewBox="0 0 20 20"
                    fill="none"
                    width="16"
                    height="16"
                  >
                    <path
                      d="M2.5 10s2.917-5 7.5-5 7.5 5 7.5 5-2.917 5-7.5 5-7.5-5-7.5-5z"
                      stroke="currentColor"
                      stroke-width="1.5"
                    />
                    <circle
                      cx="10"
                      cy="10"
                      r="2"
                      stroke="currentColor"
                      stroke-width="1.5"
                    />
                  </svg>
                  <svg
                    v-else
                    viewBox="0 0 20 20"
                    fill="none"
                    width="16"
                    height="16"
                  >
                    <path
                      d="M3.333 3.333l13.334 13.334M8.232 8.232A2 2 0 0011.77 11.77M4.444 5.834C3.2 6.97 2.5 10 2.5 10s2.917 5 7.5 5c1.303 0 2.49-.35 3.5-.944M7.5 4.166A7.936 7.936 0 0110 4c4.583 0 7.5 5 7.5 5a13.11 13.11 0 01-1.944 2.834"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                  </svg>
                </button>
              </div>
            </UFormField>
          </div>

          <!-- Error -->
          <Transition name="fade-slide">
            <div v-if="error" class="error-pill">
              {{ error }}
            </div>
          </Transition>

          <button
            class="submit-btn"
            :class="{ loading }"
            :disabled="loading"
            @click="register"
          >
            <span class="btn-content">
              <span v-if="!loading">Crear Cuenta</span>
              <span v-else class="loader-dots"> <span /><span /><span /> </span>
            </span>
            <span class="btn-shimmer" />
          </button>
        </div>

        <!-- Footer -->
        <div
          class="card-footer"
          style="flex-direction: column; gap: 10px; align-items: center"
        >
          <NuxtLink
            :to="`/login${route.query.redirect ? '?redirect=' + route.query.redirect : ''}`"
            class="back-link"
          >
            ¿Ya tienes cuenta? Inicia sesión
          </NuxtLink>
          <NuxtLink to="/" class="back-link" style="opacity: 0.7">
            Volver al sitio
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: "guest" });
useSeoMeta({ title: "Registro — CelParts" });

const config = useRuntimeConfig();
const companyName = config.public.companyName || "CelParts";

const form = reactive({ name: "", email: "", phone: "", password: "" });
const loading = ref(false);
const error = ref("");
const shaking = ref(false);
const showPassword = ref(false);
const focusedField = ref("");

const { fetch: fetchUserSession } = useUserSession();
const route = useRoute();

const inputUI = {
  base: "smart-input-inner",
  padding: { sm: "px-4" },
};

function triggerShake() {
  shaking.value = true;
  setTimeout(() => (shaking.value = false), 500);
}

async function register() {
  if (!form.name || !form.email || !form.password) {
    error.value = "Por favor completa todos los campos.";
    triggerShake();
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    await $fetch("/api/auth/register", {
      method: "POST",
      body: form,
    });

    await fetchUserSession();
    const redirect = route.query.redirect as string;
    if (redirect) {
      await navigateTo(redirect, { external: true });
    } else {
      await navigateTo("/mi-cuenta", { external: true });
    }
  } catch (e: any) {
    error.value =
      e?.data?.message ||
      e?.message ||
      "No se pudo crear la cuenta. Inténtalo de nuevo.";
    triggerShake();
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* REUSANDO LOS ESTILOS GLOBALES DEL LOGIN */
.login-root {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #080b14;
  font-family: "DM Sans", "Geist", system-ui, sans-serif;
  position: relative;
  overflow: hidden;
}

.ambient-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.18;
  animation: drift 12s ease-in-out infinite alternate;
}
.orb-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #6366f1, transparent);
  top: -100px;
  left: -100px;
  animation-duration: 14s;
}
.orb-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #8b5cf6, transparent);
  bottom: -80px;
  right: -80px;
  animation-duration: 10s;
  animation-delay: -4s;
}
.orb-3 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #06b6d4, transparent);
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-duration: 18s;
  opacity: 0.1;
}
.grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 48px 48px;
}
@keyframes drift {
  from {
    transform: translate(0, 0) scale(1);
  }
  to {
    transform: translate(30px, 20px) scale(1.08);
  }
}
.login-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}
.login-card {
  width: 100%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 20px;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.04) inset,
    0 24px 64px rgba(0, 0, 0, 0.5),
    0 0 80px rgba(99, 102, 241, 0.05);
  overflow: hidden;
  animation: card-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.card-shake {
  animation: shake 0.45s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
@keyframes shake {
  10%,
  90% {
    transform: translateX(-2px);
  }
  20%,
  80% {
    transform: translateX(4px);
  }
  30%,
  50%,
  70% {
    transform: translateX(-5px);
  }
  40%,
  60% {
    transform: translateX(5px);
  }
}
.card-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 1.75rem 1.75rem 1.25rem;
  animation: fade-up 0.5s 0.1s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.logo-mark {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  background: rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
}
.logo-mark img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  display: block;
}
.app-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: #f1f5f9;
  letter-spacing: -0.02em;
  line-height: 1.2;
}
.app-subtitle {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 1px;
  font-weight: 400;
  letter-spacing: 0.01em;
}
.divider {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.07) 30%,
    rgba(255, 255, 255, 0.07) 70%,
    transparent
  );
  margin: 0 1.75rem;
}
.form-body {
  padding: 1.5rem 1.75rem;
  animation: fade-up 0.5s 0.18s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.form-title {
  font-size: 0.7rem;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 1.25rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.field-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  transition:
    border-color 0.2s,
    background 0.2s,
    box-shadow 0.2s;
  overflow: hidden;
}
.input-wrapper.focused {
  border-color: rgba(99, 102, 241, 0.5);
  background: rgba(99, 102, 241, 0.06);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
}
.smart-input :deep(input) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  color: #e2e8f0 !important;
  font-size: 0.875rem !important;
  height: 44px !important;
  width: 100%;
}
.smart-input :deep(input::placeholder) {
  color: #334155 !important;
}
.smart-input :deep(input:focus) {
  outline: none !important;
  ring: none !important;
}
.smart-input :deep(.ring-1),
.smart-input :deep(.shadow) {
  display: none !important;
}
.smart-input {
  width: 100%;
}
.toggle-password {
  position: absolute;
  right: 12px;
  z-index: 2;
  color: #475569;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  transition: color 0.2s;
}
.toggle-password:hover {
  color: #94a3b8;
}
.error-pill {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #f87171;
  font-size: 0.8rem;
  padding: 8px 12px;
  border-radius: 8px;
}
.submit-btn {
  margin-top: 1.5rem;
  width: 100%;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition:
    transform 0.15s,
    box-shadow 0.15s,
    opacity 0.15s;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.35);
  letter-spacing: -0.01em;
}
.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 30px rgba(99, 102, 241, 0.45);
}
.submit-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(99, 102, 241, 0.3);
}
.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.btn-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(255, 255, 255, 0.15) 50%,
    transparent 60%
  );
  transform: translateX(-100%);
  transition: transform 0.5s;
}
.submit-btn:hover .btn-shimmer {
  transform: translateX(100%);
}
.loader-dots {
  display: flex;
  gap: 5px;
  align-items: center;
}
.loader-dots span {
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
  animation: bounce 0.9s ease-in-out infinite;
}
.loader-dots span:nth-child(2) {
  animation-delay: 0.15s;
}
.loader-dots span:nth-child(3) {
  animation-delay: 0.3s;
}
@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
}
.card-footer {
  padding: 0.75rem 1.75rem 1.5rem;
  display: flex;
  justify-content: center;
  animation: fade-up 0.5s 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8rem;
  color: #475569;
  text-decoration: none;
  transition: color 0.2s;
}
.back-link:hover {
  color: #94a3b8;
}
:deep(.form-field label),
:deep([data-label]) {
  color: #64748b !important;
  font-size: 0.78rem !important;
  font-weight: 500 !important;
  margin-bottom: 6px !important;
  display: block;
  letter-spacing: 0.01em;
}
</style>
