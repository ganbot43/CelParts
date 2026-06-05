<template>
  <div>
    <LandingEncabezado />
    <!-- <LandingAppNavbar /> -->

    <!-- Global cart drawer for landing layout -->
    <ClientOnly>
      <!-- WhatsApp button -->
      <LandingWaFloat />
    </ClientOnly>
    <main>
      <slot />
    </main>
    <LandingPie />
  </div>
</template>

<script setup lang="ts">
// Layout para la landing corporativa — usa Header y Footer de la landing
import "~/assets/css/main.css";
</script>
