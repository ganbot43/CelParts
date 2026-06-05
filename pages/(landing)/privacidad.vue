<template>
  <section class="py-20 px-8 pt-40 lg:px-32 bg-base">
    <div class="max-w-4xl mx-auto text-body">
      <h2 class="text-4xl font-extrabold text-center mb-8 text-primary">
        Política de Privacidad
      </h2>
      <p class="text-lg mb-6">
        En <span class="font-semibold text-primary">Arigumi</span>, respetamos y
        valoramos la privacidad de nuestros usuarios. Esta política de
        privacidad describe cómo recopilamos, utilizamos y protegemos su
        información personal.
      </p>
      <h3 class="text-2xl font-semibold mb-4">
        1. Información que Recopilamos
      </h3>
      <p class="mb-4">
        Podemos recopilar información personal como nombre, correo electrónico,
        número de teléfono y cualquier otro dato necesario para prestar nuestros
        servicios. La recopilación se realiza de manera justa y transparente.
      </p>
      <h3 class="text-2xl font-semibold mb-4">2. Uso de la Información</h3>
      <p class="mb-4">
        Utilizamos la información recopilada para brindar, mantener y mejorar
        nuestros servicios, así como para comunicarnos con usted en relación con
        consultas o solicitudes.
      </p>
      <h3 class="text-2xl font-semibold mb-4">
        3. Protección de la Información
      </h3>
      <p class="mb-4">
        Implementamos medidas de seguridad adecuadas para proteger su
        información contra accesos no autorizados, alteración o divulgación.
      </p>
      <h3 class="text-2xl font-semibold mb-4">
        4. Compartición de Información
      </h3>
      <p class="mb-4">
        No compartimos su información personal con terceros, excepto cuando sea
        necesario para cumplir con la ley o prestar servicios específicos
        solicitados por el usuario.
      </p>
      <h3 class="text-2xl font-semibold mb-4">5. Derechos del Usuario</h3>
      <p class="mb-4">
        Usted tiene derecho a acceder, rectificar o eliminar sus datos
        personales en cualquier momento. Para ejercer estos derechos, puede
        ponerse en contacto con nosotros.
      </p>
      <h3 class="text-2xl font-semibold mb-4">6. Cambios en la Política</h3>
      <p class="mb-4">
        Nos reservamos el derecho de modificar esta política de privacidad en
        cualquier momento. Los cambios se publicarán en esta página.
      </p>
      <p class="mt-8 text-body">
        Si tiene alguna duda o consulta sobre nuestra política de privacidad, no
        dude en contactarnos a través de nuestro formulario de contacto.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'landing' })

useSeoMeta({
  title: 'Politica de Privacidad | Arigumi',
  description: 'Conoce como Arigumi recopila, usa y protege tus datos personales en nuestro sitio web.',
  ogTitle: 'Politica de Privacidad | Arigumi',
  ogDescription: 'Informacion sobre tratamiento de datos personales y derechos del usuario en Arigumi.',
  ogType: 'article',
  ogUrl: 'https://arigumi.pe/privacidad',
  ogImage: 'https://arigumi.pe/images/logo.png',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Politica de Privacidad | Arigumi',
  twitterDescription: 'Consulta la politica de privacidad de Arigumi.',
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
