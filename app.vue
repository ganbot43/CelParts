<template>
  <UApp>
    <div>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
    <SharedToastHost />
  </UApp>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const { isLoggedIn: loggedIn } = storeToRefs(authStore);
const route = useRoute()
const runtimeConfig = useRuntimeConfig()

// Cargar la configuración global del negocio
const { data: globalConfig } = await useFetch('/api/business-config')
const businessConfig = useBusinessConfig()
if (globalConfig.value) {
  businessConfig.value = globalConfig.value as any
}

const siteUrl = computed(() => {
  const raw = String(runtimeConfig.public.siteUrl || 'https://arigumi.pe')
  return raw.replace(/\/$/, '')
})

const canonicalUrl = computed(() => {
  const path = route.path?.startsWith('/') ? route.path : `/${route.path || ''}`
  if (path === '/') {
    return `${siteUrl.value}/`
  }
  return `${siteUrl.value}${path}`
})

useHead(() => ({
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
  meta: [
    { property: 'og:url', content: canonicalUrl.value },
    { name: 'twitter:url', content: canonicalUrl.value },
  ],
}))

// Validar sesión cuando carga la app
watch(() => route.path, async (newPath) => {
  // Si está en una ruta protegida y no está autenticado, ir a login
  if (newPath.startsWith('/admin') && !loggedIn.value) {
    await navigateTo('/login')
  }
}, { immediate: true })
</script>

<style>
</style>
