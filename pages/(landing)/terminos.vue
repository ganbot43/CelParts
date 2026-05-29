<template>
  <section class="py-20 text-[#333333] px-8 pt-40 lg:px-32 bg-white">
    <div class="max-w-4xl mx-auto px-4">
      <h2 class="text-4xl font-extrabold text-[#1A1A1A] mb-6">
        Términos y Condiciones
      </h2>
      <p class="text-lg text-[#333333] mb-4">
        Bienvenido a Kite. Al utilizar nuestros servicios,
        aceptas cumplir con los siguientes términos y condiciones.
      </p>

      <div class="text-left text-[#333333] mt-8 space-y-6">
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
            servicios pertenecen a Kite. No puedes copiar,
            distribuir o modificar ningún material sin nuestro consentimiento
            previo.
          </p>
        </div>

        <div>
          <h3 class="text-2xl font-semibold mb-2">
            4. Limitación de responsabilidad
          </h3>
          <p>
            Kite no sera responsable por daños directos,
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
  title: 'Terminos y Condiciones | Kite',
  description: 'Revisa los terminos y condiciones de uso del sitio y servicios de Kite.',
  ogTitle: 'Terminos y Condiciones | Kite',
  ogDescription: 'Condiciones de uso, limitaciones y responsabilidades aplicables en Kite.',
  ogType: 'article',
  ogUrl: 'https://kite.pe/terminos',
  ogImage: 'https://kite.pe/images/logo.png',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Terminos y Condiciones | Kite',
  twitterDescription: 'Consulta los terminos y condiciones de Kite.',
  twitterImage: 'https://kite.pe/images/logo.png',
})
</script>

<style scoped>
@import "@/assets/css/page.css";

section {
  line-height: 1.6;
}

h2,
h3 {
  color: #1a1a1a;
}
</style>
