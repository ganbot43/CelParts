<template>
  <div class="landing-page">
    <LandingCatalogSection />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "landing",
});

useSeoMeta({
  title: "Arigumi | Tejido Comunitario & Hilando Sonrisas",
  description: "Arigumi es un espacio cálido sin comisiones para que adultos mayores compren y vendan sus tejidos directamente por WhatsApp.",
});
</script>

<style scoped>
.landing-page {
  background-color: var(--cp-cream-bg);
  min-height: calc(100vh - var(--header-height));
}
</style>