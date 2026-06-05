<template>
  <section class="py-20 px-8 pt-40 lg:px-32 bg-base">
    <div class="max-w-4xl mx-auto px-4">
      <h2 class="text-4xl font-extrabold text-primary mb-6">
        Términos y Condiciones
      </h2>
      <p class="text-lg text-body mb-4">
        Bienvenido a Arigumi. Al utilizar nuestros servicios,
        aceptas cumplir con los siguientes términos y condiciones.
      </p>

      <div class="text-left text-body mt-8 space-y-6">
        <div>
          <h3 class="text-2xl font-semibold mb-2">
            1. Aceptación de los términos
          </h3>
          <p>
            Al acceder o utilizar nuestros servicios, aceptas estos términos en
            su totalidad. Si no estás de acuerdo, por favor no utilices nuestros
            servicios.
          </p>
        </div>

        <div>
          <h3 class="text-2xl font-semibold mb-2">2. Uso de los servicios</h3>
          <p>
            No puedes utilizar nuestros servicios para fines ilícitos o que
            infrinjan cualquier ley local, nacional o internacional.
          </p>
        </div>

        <div>
          <h3 class="text-2xl font-semibold mb-2">3. Propiedad intelectual</h3>
          <p>
            Todos los derechos de propiedad intelectual sobre el contenido y los
            servicios pertenecen a Arigumi. No puedes copiar,
            distribuir o modificar ningún material sin nuestro consentimiento
            previo.
          </p>
        </div>

        <div>
          <h3 class="text-2xl font-semibold mb-2">
            4. Limitación de responsabilidad
          </h3>
          <p>
            Arigumi no sera responsable por daños directos,
            indirectos, incidentales o consecuenciales derivados del uso o la
            imposibilidad de uso de nuestros servicios.
          </p>
        </div>

        <div>
          <h3 class="text-2xl font-semibold mb-2">5. Modificaciones</h3>
          <p>
            Nos reservamos el derecho de modificar estos términos en cualquier
            momento. Los cambios se publicarán en esta página y entrarán en
            vigor inmediatamente después de su publicación.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'landing' })

useSeoMeta({
  title: 'Terminos y Condiciones | Arigumi',
  description: 'Revisa los terminos y condiciones de uso del sitio y servicios de Arigumi.',
  ogTitle: 'Terminos y Condiciones | Arigumi',
  ogDescription: 'Condiciones de uso, limitaciones y responsabilidades aplicables en Arigumi.',
  ogType: 'article',
  ogUrl: 'https://arigumi.pe/terminos',
  ogImage: 'https://arigumi.pe/images/logo.png',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Terminos y Condiciones | Arigumi',
  twitterDescription: 'Consulta los terminos y condiciones de Arigumi.',
  twitterImage: 'https://arigumi.pe/images/logo.png',
})
</script>

<style scoped>
@import "@/assets/css/page.css";

section {
  line-height: 1.6;
}

h2,
h3 {
  color: var(--text-primary);
}
</style>
