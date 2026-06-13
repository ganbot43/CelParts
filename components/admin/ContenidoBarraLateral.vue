<template>
  <div class="sp-sidebar-inner">
    <!-- Brand -->
    <div class="sp-sidebar__brand">
      <NuxtLink to="/admin" class="sp-brand" @click="emit('close')">
        <img :src="logoUrl" alt="Logo" class="sp-brand__logo" />
        <div class="sp-brand__text">
          <span class="sp-brand__name">{{ configName }}</span>
          <span class="sp-brand__role">
            {{ user?.role === "superadmin" ? "Super Admin" : "Administrador" }}
          </span>
        </div>
      </NuxtLink>
    </div>

    <!-- Navigation -->
    <nav class="sp-sidebar__nav">
      <div class="sp-nav-group">
        <span class="sp-nav-group__label">General</span>
        <NuxtLink
          v-for="item in baseItems"
          :key="item.to"
          :to="item.to"
          class="sp-nav-item"
          :class="{ 'sp-nav-item--active': isActive(item.to) }"
          @click="emit('close')"
        >
          <span class="sp-nav-item__icon" v-html="item.svg" />
          <span class="sp-nav-item__label">{{ item.label }}</span>
          <span v-if="isActive(item.to)" class="sp-nav-item__dot" />
        </NuxtLink>
      </div>

      <div v-if="user?.role === 'superadmin'" class="sp-nav-group">
        <span class="sp-nav-group__label">Sistema</span>
        <NuxtLink
          v-for="item in superadminItems"
          :key="item.to"
          :to="item.to"
          class="sp-nav-item"
          :class="{ 'sp-nav-item--active': isActive(item.to) }"
          @click="emit('close')"
        >
          <span class="sp-nav-item__icon" v-html="item.svg" />
          <span class="sp-nav-item__label">{{ item.label }}</span>
          <span v-if="isActive(item.to)" class="sp-nav-item__dot" />
        </NuxtLink>
      </div>
    </nav>

    <!-- Footer -->
    <div class="sp-sidebar__footer">
      <NuxtLink to="/" target="_blank" class="sp-footer-link">
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3M9 2h5m0 0v5m0-5L7 10"
            stroke="currentColor"
            stroke-width="1.4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Ver tienda
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ user: any }>();
const emit = defineEmits<{ (e: "close"): void }>();

const route = useRoute();
const businessConfig = useBusinessConfig();
const logoUrl = computed(() => businessConfig.value?.logoUrl || '/images/logo.png');
const configName = computed(() => businessConfig.value?.name || 'Smart Panel');

const baseItems = [
  {
    to: "/admin",
    label: "Dashboard",
    svg: `<svg viewBox="0 0 18 18" fill="none"><rect x="1.5" y="1.5" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.4"/><rect x="10.5" y="1.5" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.4"/><rect x="1.5" y="10.5" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.4"/><rect x="10.5" y="10.5" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.4"/></svg>`,
  },
  {
    to: "/admin/categorias",
    label: "Categorías",
    svg: `<svg viewBox="0 0 18 18" fill="none"><path d="M2 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H3a1 1 0 01-1-1V4zM11 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zM2 11a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H3a1 1 0 01-1-1v-3zM11 11a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3z" stroke="currentColor" stroke-width="1.4"/></svg>`,
  },
  {
    to: "/admin/subcategories",
    label: "Subcategorías",
    svg: `<svg viewBox="0 0 18 18" fill="none"><path d="M3 4h12v2H3zM3 8h12v2H3zM3 12h12v2H3z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  },
  {
    to: "/admin/materiales",
    label: "Materiales",
    svg: `<svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.2"/><path d="M9 3v12M3 9h12" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  },
  {
    to: "/admin/reclamaciones",
    label: "Libro de Reclamaciones",
    svg: `<svg viewBox="0 0 18 18" fill="none"><rect x="2" y="3" width="14" height="12" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M5.5 7h7M5.5 10h7M5.5 13h4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  },
];

const superadminItems = [
  {
    to: "/admin/configuracion",
    label: "Configuración",
    svg: `<svg viewBox="0 0 18 18" fill="none"><path d="M9 13.5A4.5 4.5 0 1 0 9 4.5a4.5 4.5 0 0 0 0 9Z" stroke="currentColor" stroke-width="1.4"/><path d="M12 2.5a6.5 6.5 0 0 1 5 5h1M1 10.5h1a6.5 6.5 0 0 1 5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  },
  {
    to: "/admin/perfil",
    label: "Mi Perfil",
    svg: `<svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="5" r="3" stroke="currentColor" stroke-width="1.4"/><path d="M3 15a6 6 0 0 1 12 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  },
];

function isActive(path: string) {
  if (path === "/admin") return route.path === "/admin";
  return route.path.startsWith(path);
}
</script>

<style scoped>
.sp-sidebar-inner {
  width: 15.5rem;
  min-height: 100dvh;
  background: var(--sp-sidebar-bg);
  border-right: 1px solid var(--sp-sidebar-border);
  display: flex;
  flex-direction: column;
  font-family: var(--sp-font);
}

.sp-sidebar__brand {
  padding: 1.2rem 1rem 1rem;
  border-bottom: 1px solid var(--sp-sidebar-border);
}

.sp-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  border-radius: 10px;
  padding: 6px 8px;
  margin: -6px -8px;
  transition: background var(--sp-t) var(--sp-ease);
}

.sp-brand:hover {
  background: var(--sp-sidebar-hover-bg);
}

.sp-brand__logo {
  width: 34px;
  height: 34px;
  object-fit: contain;
  border-radius: 8px;
  background: var(--sp-sidebar-logo-bg);
  padding: 3px;
  flex-shrink: 0;
}

.sp-brand__text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.sp-brand__name {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--sp-sidebar-brand-name);
  letter-spacing: -0.02em;
  line-height: 1.2;
  white-space: nowrap;
}

.sp-brand__role {
  font-size: 0.62rem;
  color: var(--sp-sidebar-brand-role);
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
}

.sp-sidebar__nav {
  flex: 1;
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow-y: auto;
}

.sp-nav-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sp-nav-group__label {
  display: block;
  padding: 0.4rem 0.75rem;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--sp-sidebar-label);
}

.sp-nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.75rem;
  border-radius: var(--sp-radius-md);
  text-decoration: none;
  color: var(--sp-sidebar-text);
  font-size: 0.85rem;
  font-weight: 500;
  transition:
    color var(--sp-t) var(--sp-ease),
    background var(--sp-t) var(--sp-ease);
  position: relative;
}

.sp-nav-item:hover {
  background: var(--sp-sidebar-hover-bg);
  color: var(--sp-sidebar-text-hover);
}

.sp-nav-item--active {
  background: var(--sp-sidebar-active-bg);
  color: var(--sp-sidebar-text-active);
}

.sp-nav-item__icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 2px;
}

.sp-nav-item__label {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sp-nav-item__dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--sp-sidebar-active-dot);
  flex-shrink: 0;
}

.sp-sidebar__footer {
  padding: 1rem 0.75rem;
  border-top: 1px solid var(--sp-sidebar-border);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sp-footer-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.75rem;
  border-radius: var(--sp-radius-md);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--sp-sidebar-footer-link);
  text-decoration: none;
  transition:
    color var(--sp-t) var(--sp-ease),
    background var(--sp-t) var(--sp-ease);
}

.sp-footer-link:hover {
  background: var(--sp-sidebar-footer-bg);
  color: var(--sp-sidebar-footer-hover);
}

.sp-footer-link svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}
</style>
