<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
    <!-- Navbar ecommerce público -->
    <header class="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <NuxtLink to="/" class="font-bold text-xl text-primary-600 hover:text-primary-500 transition-colors">
          {{ config.public.appName }}
        </NuxtLink>
        <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
          <NuxtLink to="/" class="hover:text-primary-600 transition-colors">Inicio</NuxtLink>
          <NuxtLink to="/productos" class="hover:text-primary-600 transition-colors">Catálogo</NuxtLink>
        </nav>
        <div class="flex items-center gap-3">
        </div>
      </div>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
      © {{ new Date().getFullYear() }} {{ config.public.appName }} — Todos los derechos reservados
    </footer>

    <!-- Cart Drawer deleted -->

    <!-- WhatsApp flotante -->
    <SharedBotonWhatsapp />
  </div>
</template>

<script setup lang="ts">
const config    = useRuntimeConfig()
</script>