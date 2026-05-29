<template>
  <div class="bg-(--k-bg) text-(--k-text)">
    <!-- HERO -->
    <LandingHeroSection />

    <!-- BENEFICIOS / CONFIANZA -->
    <LandingBenefitsSection />

    <!-- LANZAMIENTOS -->
    <LandingCatalogNuevosLanzamientos />

    <!-- DESTACADOS -->
    <LandingFeaturedSection />

    <!-- CATEGORÍAS -->
    <LandingCategoryGrid sectionId="1" />
    <LandingCategoryGrid sectionId="2" />

    <!-- SOBRE NOSOTROS -->
    <LandingAboutSection />

    <!-- GALERÍA -->
    <LandingGallerySection />

    <!-- UBICACIÓN -->
    <LandingLocationSection />

    <!-- CONTACTO -->
    <LandingContactSection />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "landing",
});

/* =========================================
   SEO
========================================= */

useSeoMeta({
  title:
    "Kite | Cocina, Hogar y Estilo de Vida",

  ogTitle:
    "Kite | Productos para Cocina y Hogar en Perú",

  description:
    "Kite ofrece productos modernos para cocina, hogar y estilo de vida. Diseños funcionales, elegantes y de alta calidad para transformar tus espacios.",

  ogDescription:
    "Descubre productos de cocina y hogar cuidadosamente seleccionados por Kite. Calidad, diseño y funcionalidad en un solo lugar.",

  keywords:
    "Kite, cocina, hogar, utensilios, accesorios de cocina, decoración, menaje, productos para el hogar, tienda online Perú, artículos de cocina",

  ogType: "website",

  ogUrl:
    "https://kite.pe",

  ogImage:
    "https://kite.pe/images/logo.png",

  twitterCard:
    "summary_large_image",

  twitterTitle:
    "Kite | Cocina y Hogar",

  twitterDescription:
    "Productos funcionales y modernos para cocina y hogar. Diseño, calidad y estilo en cada detalle.",

  twitterImage:
    "https://kite.pe/images/logo.png",
});

/* =========================================
   STRUCTURED DATA
========================================= */

useHead({
  script: [
    {
      type: "application/ld+json",

      innerHTML: JSON.stringify({
        "@context": "https://schema.org",

        "@type": "Organization",

        name: "Kite",

        url: "https://kite.pe",

        logo: "https://kite.pe/images/logo.png",

        sameAs: [
          "https://www.instagram.com/kite.pe/",
        ],

        contactPoint: {
          "@type": "ContactPoint",

          contactType:
            "customer service",

          telephone:
            "+51 996 111 303",

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

        name: "Kite",

        url: "https://kite.pe",

        inLanguage: "es-PE",
      }),
    },
  ],
});
</script>