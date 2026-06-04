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
    <!--<LandingLocationSection />-->

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
    "CelParts | Repuestos y Accesorios para Celulares en Perú",

  ogTitle:
    "CelParts | Repuestos y Accesorios para Celulares en Perú",

  description:
    "CelParts ofrece repuestos y accesorios de alta calidad para celulares en Perú. ¡Compra ahora y encuentra lo que necesitas!",

  ogDescription:
    "CelParts ofrece repuestos y accesorios de alta calidad para celulares en Perú. ¡Compra ahora y encuentra lo que necesitas!",

  keywords:
    "CelParts, repuestos, accesorios, celulares, Perú",

  ogType: "website",

  ogUrl:
    "https://kite.pe",

  ogImage:
    "https://kite.pe/images/logo.png",

  twitterCard:
    "summary_large_image",

  twitterTitle:
    "CelParts | Repuestos y Accesorios para Celulares en Perú",

  twitterDescription:
    "CelParts ofrece repuestos y accesorios de alta calidad para celulares en Perú. ¡Compra ahora y encuentra lo que necesitas!",

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