<template>
  <header class="sp-topbar">
    <!-- Dentro de tu sp-topbar, al inicio del lado izquierdo, agrega: -->
    <button
      class="sp-sidebar-toggle"
      @click="sidebarRef?.openDrawer()"
      aria-label="Abrir menú"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M2 4h12M2 8h12M2 12h12"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
    </button>

    <!-- Breadcrumb / título -->
    <div class="sp-topbar__title-group">
      <span class="sp-topbar__section-label">Panel</span>
      <span class="sp-topbar__sep">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M4 2l4 4-4 4"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
      <h1 class="sp-topbar__page-title">{{ pageTitle }}</h1>
    </div>

    <!-- Acciones -->
    <div class="sp-topbar__actions">
      <!-- Hora -->
      <!-- <div class="sp-topbar__clock" aria-label="Hora actual">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <circle
            cx="8"
            cy="8"
            r="6.5"
            stroke="currentColor"
            stroke-width="1.4"
          />
          <path
            d="M8 5v3.5l2 1.5"
            stroke="currentColor"
            stroke-width="1.4"
            stroke-linecap="round"
          />
        </svg>
        {{ currentTime }}
      </div>

      <div class="sp-topbar__divider" role="separator"></div> -->

      <!-- Usuario -->
      <NuxtLink to="/admin/perfil" class="sp-topbar__user" style="text-decoration:none; color:inherit">
        <div class="sp-topbar__avatar" aria-hidden="true" style="overflow: hidden; padding: 0;">
          <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" style="width:100%; height:100%; object-fit:cover" />
          <span v-else style="display:flex; align-items:center; justify-content:center; width:100%; height:100%">{{ initials }}</span>
        </div>
        <div class="sp-topbar__user-info">
          <span class="user-name">{{ session?.name || 'Admin' }}</span>
        </div>
      </NuxtLink>

      <div class="sp-topbar__divider" role="separator"></div>

      <!-- Logout -->
      <button
        class="sp-topbar__logout"
        :class="{ 'sp-topbar__logout--loading': loggingOut }"
        :disabled="loggingOut"
        @click="logout"
        aria-label="Cerrar sesión"
      >
        <svg
          v-if="!loggingOut"
          width="15"
          height="15"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            d="M10 11l3-3-3-3"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M13 8H6"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
        <svg
          v-else
          class="sp-topbar__spinner"
          width="15"
          height="15"
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
        <span class="sp-topbar__logout-label">Salir</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
const route = useRoute();
const isScrolled = ref(false);

const loggingOut = ref(false);
const authStore = useAuthStore();
const { user: session } = storeToRefs(authStore);
const clearSession = authStore.clearAuth;
const sidebarRef = inject<{ openDrawer: () => void } | null>('sidebarRef', null);

const avatarUrl = ref('');
watch(
  () => session.value?.profileImageUrl,
  async (newUrl) => {
    if (!newUrl) {
      avatarUrl.value = '';
      return;
    }
    if (newUrl.includes('.amazonaws.com/')) {
      try {
        const res: any = await $fetch(`/api/upload/presigned?url=${encodeURIComponent(newUrl)}`);
        avatarUrl.value = res.presignedUrl || newUrl;
      } catch (e) {
        avatarUrl.value = newUrl;
      }
    } else {
      avatarUrl.value = newUrl;
    }
  },
  { immediate: true }
);

const { formatTime } = useFormatDateTime();

/* ── Título de página ── */
const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/categorias": "Categorías",
  "/admin/banners": "Banners",
  "/admin/configuracion": "Configuración",
  "/admin/reclamaciones": "Libro de Reclamaciones",
};

const pageTitle = computed(() => {
  for (const [path, title] of Object.entries(pageTitles)) {
    if (
      route.path.startsWith(path) &&
      (path === "/admin" ? route.path === "/admin" : true)
    ) {
      return title;
    }
  }
  return "Admin";
});

/* ── Iniciales del usuario ── */
const userDisplayName = computed(() => {
  const user = session.value as Record<string, unknown> | undefined;
  return (
    (typeof user?.name === "string" && user.name) ||
    (typeof user?.fullName === "string" && user.fullName) ||
    (typeof user?.email === "string" && user.email) ||
    "Admin"
  );
});

const initials = computed(() => {
  const name = userDisplayName.value ?? "A";
  return name
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
});

/* ── Reloj ── */
const currentTime = ref("");
let clockTimer: ReturnType<typeof setInterval>;

function updateClock() {
  currentTime.value = formatTime(new Date());
}

onMounted(() => {
  updateClock();
  clockTimer = setInterval(updateClock, 10_000);
});
onUnmounted(() => clearInterval(clockTimer));

/* ── Logout ── */
async function logout() {
  loggingOut.value = true;
  await $fetch("/api/auth/logout", { method: "POST" });
  await clearSession();
  try {
    const authStore = useAuthStore()
    authStore.user = null
  } catch (e) {
    const { parseError } = useApiError();
    console.error('Logout error:', parseError(e))
  }
  await navigateTo("/login");
}
</script>
