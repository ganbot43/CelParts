<template>
  <div class="bg-white text-[#3A3A3A]">
    <LandingHeroSection />
    <!-- components/landing/CategoryGrid.vue -->

    <!-- <LandingFeaturedSection /> -->
    <LandingCatalogNuevosLanzamientos />

    <LandingCategoryGrid sectionId="1" />
    <LandingCategoryGrid sectionId="2" />
    <!-- <LandingBenefitsSection />
    <LandingAboutSection />
    <LandingGallerySection />
    <LandingLocationSection /> -->
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "landing",
});

useSeoMeta({
  title: "Joymar Utensilios | Utensilios de Cocina de Alta Calidad en Perú",
  ogTitle: "Joymar Utensilios | Artículos de Cocina Premium en Perú",

  description:
    "Joymar Utensilios ofrece artículos de cocina de alta calidad, previamente probados antes de su comercialización. Encuentra utensilios duraderos, funcionales y modernos para tu hogar. Tienda física en Villa El Salvador, Lima.",
  ogDescription:
    "Artículos de cocina seleccionados por su calidad, durabilidad y funcionalidad. Joymar Utensilios cuenta con tienda física en Villa El Salvador, Lima, y atención directa por WhatsApp.",

  keywords:
    "Joymar, Joymar Utensilios, utensilios de cocina, artículos de cocina, productos de cocina, menaje de cocina, accesorios de cocina, tienda de utensilios de cocina en Lima, utensilios de cocina en Perú, Villa El Salvador",

  ogType: "website",
  ogUrl: "https://joymarperu.com",
  ogImage: "https://joymarperu.com/images/logo.png",

  twitterCard: "summary_large_image",
  twitterTitle: "Joymar Utensilios | Utensilios de Cocina Premium",
  twitterDescription:
    "Artículos de cocina de alta calidad, seleccionados y probados antes de llegar a nuestros clientes. Atención en Villa El Salvador, Lima.",
  twitterImage: "https://joymarperu.com/images/logo.png",
});

useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Joymar Utensilios",
        url: "https://joymarperu.com",
        logo: "https://joymarperu.com/images/logo.png",
        sameAs: ["https://www.instagram.com/joymarutensilios/"],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          telephone: "+51 996 111 303",
          areaServed: "PE",
          availableLanguage: ["es"],
        },
      }),
    },
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Joymar Utensilios",
        url: "https://joymarperu.com",
        inLanguage: "es-PE",
      }),
    },
  ],
});
</script>
