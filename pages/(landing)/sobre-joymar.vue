<template>
  <div class="bg-base text-body">
    <LandingAboutSection />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "landing",
});

useSeoMeta({
  title: "Sobre CelParts | Repuestos & Accesorios de Calidad",
  ogTitle: "Sobre CelParts | Repuestos Premium en Perú",
  description:
    "Conoce la historia de CelParts. Nacimos en el Perú con el propósito de llevar repuestos y accesorios de alta calidad para celulares, con garantía comprobada y al precio justo.",
  ogDescription:
    "Descubre nuestra misión: ofrecer repuestos de alta calidad, seleccionados cuidadosamente, con garantía comprobada y al precio justo.",
  keywords:
    "Sobre CelParts, CelParts, repuestos, accesorios, celulares, calidad, garantía, precio justo",
  ogType: "website",
  ogUrl: "https://celparts.pe/sobre-nosotros",
  ogImage: "https://celparts.pe/images/logo.png",
  twitterCard: "summary_large_image",
  twitterTitle: "Sobre CelParts | Repuestos Premium",
  twitterDescription:
    "Conoce quiénes somos y por qué nos apasiona ofrecer accesorios y repuestos de la mejor calidad.",
  twitterImage: "https://celparts.pe/images/logo.png",
});
</script>
