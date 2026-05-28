<template>
  <div class="bg-white text-[#3A3A3A]">
    <LandingAboutSection />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "landing",
});

useSeoMeta({
  title: "Sobre Joymar | Utensilios de Cocina de Calidad",
  ogTitle: "Sobre Joymar | Utensilios de Cocina Premium en Perú",
  description:
    "Conoce la historia de Joymar Utensilios. Nacimos en el Perú con el propósito de llevar utensilios de cocina de alta calidad a cada hogar, con garantía comprobada y al precio justo.",
  ogDescription:
    "Descubre nuestra misión: ofrecer utensilios de cocina de alta calidad, seleccionados cuidadosamente, con garantía comprobada y al precio justo.",
  keywords:
    "Sobre Joymar, Joymar Utensilios, historia, misión, valores, calidad, garantía, precio justo",
  ogType: "website",
  ogUrl: "https://joymarperu.com/sobre-joymar",
  ogImage: "https://joymarperu.com/images/logo.png",
  twitterCard: "summary_large_image",
  twitterTitle: "Sobre Joymar | Utensilios de Cocina Premium",
  twitterDescription:
    "Conoce quiénes somos y por qué nos apasiona ofrecer utensilios de cocina de la mejor calidad.",
  twitterImage: "https://joymarperu.com/images/logo.png",
});
</script>
