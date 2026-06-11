<template>
  <header class="site-header" :class="{ 'scrolled': scrolled }">
    <div class="container header-container">
      
      <!-- LEFT: Logo -->
      <NuxtLink to="/" class="logo-area">
        <img :src="logoUrl" alt="Arigumi" class="logo-img" />
        <div class="logo-text-group">
          <span class="logo-text">{{ configName }}</span>
          <span class="logo-subtext">Hilando sonrisas</span>
        </div>
      </NuxtLink>

      <!-- CENTER: Tejido Comunitario Text -->
      <div class="center-text hidden-mobile">
        <span class="tejido-badge">🌟 TEJIDO COMUNITARIO 🌟</span>
        <span class="tejido-quote">"Cada nudo guarda un recuerdo entrañable..."</span>
      </div>

      <!-- RIGHT: Actions & User -->
      <div class="right-actions">
        <!-- New Publication Button (Only if logged in and is a seller) -->
        <ClientOnly>
          <NuxtLink 
            v-if="loggedIn && (user?.role === 'vendedor' || user?.role === 'vendedor_comprador' || user?.role === 'admin' || user?.role === 'superadmin')" 
            to="/mi-cuenta/productos/nuevo" 
            class="btn btn-primary btn-sm btn-pill"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            Nueva Publicación
          </NuxtLink>

          <!-- User Dropdown / Auth Links -->
          <div class="auth-section">
            <template v-if="loggedIn">
              <div class="user-dropdown-container" @mouseenter="dropdownOpen = true" @mouseleave="dropdownOpen = false">
                <button class="user-trigger">
                  <div class="user-avatar">
                    <img :src="'https://ui-avatars.com/api/?name=' + (user?.name || 'U') + '&background=7d8e74&color=fff'" alt="Avatar" />
                  </div>
                  <div class="user-info-pill hidden-mobile">
                    <span class="user-name-pill">{{ user?.name || 'Abuela/o Clara' }}</span>
                    <span class="user-role-pill">{{ user?.role ? user.role.replace('_', ' ') : 'VENDEDOR' }}</span>
                  </div>
                  <svg class="chevron" :class="{ open: dropdownOpen }" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                <Transition name="fade-slide">
                  <div v-if="dropdownOpen" class="menu-dropdown">
                    <!-- Dropdown Header -->
                    <div class="dropdown-profile-header">
                      <div class="dropdown-avatars">👵 👴</div>
                      <div class="dropdown-profile-text">
                        <strong>{{ user?.name || 'Clara Gisbert Mendoza' }}</strong>
                        <span>@{{ user?.username || (user?.name ? user.name.split(' ')[0].toLowerCase() : 'abuelaclara') }}</span>
                      </div>
                    </div>
                    
                    <!-- Menu Items -->
                    <div class="dropdown-items">
                      <NuxtLink to="/" class="dropdown-item active-item">
                        <span class="item-icon">🏡</span> Ver Catálogo General
                      </NuxtLink>
                      
                      <NuxtLink v-if="user?.role === 'admin' || user?.role === 'superadmin'" to="/admin" class="dropdown-item">
                        <span class="item-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        </span> Panel Administrativo
                      </NuxtLink>
                      
                      <template v-else>
                        <NuxtLink to="/mi-cuenta" class="dropdown-item">
                          <span class="item-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M9 14h6"></path><path d="M9 18h6"></path><path d="M9 10h.01"></path></svg>
                          </span> Mis Publicaciones
                        </NuxtLink>
                        
                        <NuxtLink to="/mi-cuenta/detalles" class="dropdown-item">
                          <span class="item-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                          </span> Detalles de mi Cuenta
                        </NuxtLink>
                      </template>
                    </div>

                    <div class="dropdown-divider-dashed"></div>
                    
                    <button class="dropdown-item item-danger" @click="logout">
                      <span class="item-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                      </span> Cerrar Sesión
                    </button>

                    <div class="dropdown-footer">
                      Conectado como {{ user?.role ? user.role.replace('_', ' y ') : 'Vendedor y Comprador' }}
                    </div>
                  </div>
                </Transition>
              </div>
            </template>
            <template v-else>
              <NuxtLink to="/login" class="nav-link">Ingresar</NuxtLink>
              <NuxtLink to="/registro" class="btn btn-outline btn-sm btn-pill hidden-mobile">Registrarse</NuxtLink>
            </template>
          </div>
        </ClientOnly>
      </div>

    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue"

const authStore = useAuthStore();
const { user, isLoggedIn: loggedIn } = storeToRefs(authStore);
const clear = authStore.clearAuth;
const businessConfig = useBusinessConfig()

const logoUrl = computed(() => businessConfig.value?.logoUrl || '/images/logo.png')
const configName = computed(() => businessConfig.value?.name || 'Arigumi')

const scrolled = ref(false)
const dropdownOpen = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 10
}

const logout = async () => {
  await clear()
  await navigateTo('/')
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

/* ── LOGO ── */
.logo-area {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  text-decoration: none;
}
.logo-img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--cp-sage);
}
.logo-text-group {
  display: flex;
  flex-direction: column;
}
.logo-text {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--cp-sage-dark);
  line-height: 1;
}
.logo-subtext {
  font-size: 0.85rem;
  color: var(--cp-text-muted);
  font-style: italic;
  margin-top: 2px;
}

/* ── CENTER ── */
.center-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.tejido-badge {
  color: var(--cp-earth-mid);
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.tejido-quote {
  font-size: 0.9rem;
  color: var(--cp-text-muted);
  font-style: italic;
  font-family: 'Georgia', serif;
}

/* ── RIGHT ── */
.right-actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.btn-pill {
  border-radius: var(--r-pill);
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
}
.btn-primary.btn-pill {
  background: var(--cp-sage);
  border-color: var(--cp-sage);
}
.btn-primary.btn-pill:hover {
  background: var(--cp-sage-dark);
  border-color: var(--cp-sage-dark);
}

.auth-section {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.nav-link {
  color: var(--cp-text-body);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: color var(--t-fast);
}
.nav-link:hover {
  color: var(--cp-sage-dark);
}

/* ── USER DROPDOWN ── */
.user-dropdown-container {
  position: relative;
  padding: 10px 0; /* buffer for hover */
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 1px solid var(--cp-border);
  cursor: pointer;
  padding: 4px 10px 4px 4px;
  border-radius: 40px;
  transition: all var(--t-fast);
  box-shadow: none; /* No shadow in wireframe */
}
.user-trigger:hover {
  border-color: var(--cp-sage);
}

.user-avatar img {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info-pill {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  justify-content: center;
}

.user-name-pill {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--cp-text-dark);
  line-height: 1.2;
}

.user-role-pill {
  font-size: 0.6rem;
  font-weight: 800;
  color: var(--cp-sage-dark);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1;
  margin-top: 1px;
}

.chevron {
  color: var(--cp-text-muted);
  transition: transform var(--t-fast);
}
.chevron.open {
  transform: rotate(180deg);
}

.menu-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 290px;
  background: #ffffff;
  border: 1px solid var(--cp-border);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.08);
  padding: 20px;
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.dropdown-profile-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.dropdown-avatars {
  font-size: 1.5rem;
  letter-spacing: -6px; /* overlap emojis */
  margin-right: 6px;
}

.dropdown-profile-text {
  display: flex;
  flex-direction: column;
}
.dropdown-profile-text strong {
  font-family: var(--font-display);
  font-size: 1.1rem;
  color: var(--cp-text-dark);
  line-height: 1.2;
}
.dropdown-profile-text span {
  font-family: monospace;
  font-size: 0.8rem;
  color: var(--cp-text-faint);
  margin-top: 2px;
}

.dropdown-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  color: var(--cp-earth-dark);
  text-decoration: none;
  font-weight: 700;
  font-size: 0.95rem;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background var(--t-fast);
}

.dropdown-item:hover, .dropdown-item.active-item {
  background: #f8faf9;
}

.item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7b7871; /* muted icon color matching wireframe */
}
.active-item .item-icon {
  color: inherit;
}

.dropdown-divider-dashed {
  border-top: 1px dashed var(--cp-border-mid);
  margin: 16px 0;
}

.item-danger {
  color: #e53e3e; /* distinct red */
}
.item-danger:hover {
  background: #fff5f5;
}
.item-danger .item-icon {
  color: #e53e3e;
}

.dropdown-footer {
  margin-top: 16px;
  text-align: center;
  font-size: 0.75rem;
  color: var(--cp-sage-dark);
  font-style: italic;
  font-weight: 700;
}

/* ── ANIMATIONS ── */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity var(--t-fast), transform var(--t-fast);
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

@media (max-width: 768px) {
  .hidden-mobile {
    display: none !important;
  }
}
</style>