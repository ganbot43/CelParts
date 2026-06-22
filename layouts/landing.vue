<template>
  <div>
    <LandingEncabezado />
    <!-- <LandingAppNavbar /> -->

    <!-- Global cart drawer for landing layout -->
    <ClientOnly>
      <EcommerceCarritoDrawer />
      <!-- WhatsApp button (behind cart if open) -->
      <!-- <LandingBotonWhatsapp /> -->
      <!-- <LandingWaIcon /> -->
    </ClientOnly>
    <main>
      <slot />
    </main>
    <ClientOnly>
      <LandingPie />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
// Layout para la landing corporativa — usa Header y Footer de la landing
import "~/assets/css/main.css";
</script>
