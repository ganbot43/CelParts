<template>
  <div class="empty-state">
    <!-- Ícono central -->
    <div class="empty-state__icon-ring">
      <svg class="empty-state__icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true">
        <path d="M8 20h32M8 20v18a2 2 0 002 2h28a2 2 0 002-2V20M8 20l4-10h24l4 10" stroke="#2D6A4F" stroke-width="2.2"
          stroke-linecap="round" stroke-linejoin="round" />
        <path d="M24 10V8M20 28h8M24 24v8" stroke="#E9C46A" stroke-width="2.2" stroke-linecap="round" />
      </svg>
    </div>

    <!-- Textos -->
    <p class="empty-state__eyebrow">Próximamente</p>

    <h3 class="empty-state__title">
      Nuevos productos en camino
    </h3>

    <p class="empty-state__subtitle">
      Estamos incorporando nuevos repuestos y accesorios para las principales
      marcas de celulares. Vuelve pronto para descubrir las últimas novedades.
    </p>

    <!-- CTA principal -->
    <NuxtLink to="/productos" class="empty-state__btn">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
      Ver catálogo completo
    </NuxtLink>

    <!-- Divisor -->
    <div class="empty-state__divider" aria-hidden="true" />

    <!-- Categorías sugeridas -->
    <p class="empty-state__tags-label">
      Explora nuestras categorías disponibles
    </p>
    <ul class="empty-state__tags" aria-label="Categorías disponibles">
      <li v-for="cat in categories" :key="cat.slug" class="empty-state__tag">
        <NuxtLink :to="`/productos?categoria=${cat.slug}`" class="empty-state__tag-link">
          <span class="empty-state__tag-dot" aria-hidden="true">✦</span>
          {{ cat.label }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface Category {
  label: string;
  slug: string;
}

const categories: Category[] = [
  { label: "Pantallas", slug: "pantallas" },
  { label: "Baterías", slug: "baterias" },
  { label: "Cases", slug: "cases" },
  { label: "Cargadores", slug: "cargadores" },
  { label: "Protectores", slug: "protectores" },
];
</script>

<style scoped>
.empty-state {
  --cp-bg: #0A0A0A;
  --cp-cyan: #00AEEF;
  --cp-cyan-dark: #0077C8;
  --cp-cyan-light: #50D0FF;
  --cp-ice: #A8EDFF;
  --cp-white: #FFFFFF;
  --cp-text: rgba(168, 237, 255, 0.82);
  --cp-border: rgba(0, 174, 239, 0.20);

  grid-column: 1 / -1;

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  padding: 70px 40px;

  background:
    rgba(0, 174, 239, 0.04);

  border: 1px solid var(--cp-border);

  border-radius: 24px;

  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

/* ICONO */

.empty-state__icon-ring {
  width: 90px;
  height: 90px;

  border-radius: 50%;

  background:
    rgba(0, 174, 239, 0.08);

  border: 1px solid var(--cp-border);

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 24px;
}

.empty-state__icon {
  width: 40px;
  height: 40px;
}

.empty-state__icon path:first-child {
  stroke: #50D0FF;
}

.empty-state__icon path:last-child {
  stroke: #00AEEF;
}

/* TEXTOS */

.empty-state__eyebrow {
  margin: 0 0 12px;

  color: var(--cp-cyan-light);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.empty-state__title {
  margin: 0 0 12px;

  color: var(--cp-white);

  font-size: clamp(1.4rem, 3vw, 1.8rem);

  font-weight: 800;
}

.empty-state__subtitle {
  margin: 0 0 34px;

  max-width: 480px;

  color: var(--cp-text);

  line-height: 1.8;

  font-size: .95rem;
}

/* BOTÓN */

.empty-state__btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  text-decoration: none;

  color: white;

  font-size: .9rem;
  font-weight: 700;

  padding: 14px 28px;

  border-radius: 999px;

  background:
    linear-gradient(
      135deg,
      var(--cp-cyan),
      var(--cp-cyan-dark)
    );

  border: 1px solid rgba(80,208,255,.2);

  box-shadow:
    0 10px 30px rgba(0,174,239,.25);

  transition:
    transform .2s ease,
    box-shadow .2s ease;
}

.empty-state__btn:hover {
  transform: translateY(-2px);

  box-shadow:
    0 16px 42px rgba(0,174,239,.45);
}

/* DIVIDER */

.empty-state__divider {
  width: 100%;
  max-width: 480px;

  height: 1px;

  background:
    rgba(0,174,239,.15);

  margin: 34px 0 28px;
}

/* TAGS */

.empty-state__tags-label {
  margin: 0 0 16px;

  color: rgba(168,237,255,.55);

  font-size: 12px;
}

.empty-state__tags {
  list-style: none;

  margin: 0;
  padding: 0;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  gap: 10px;
}

.empty-state__tag {
  border-radius: 999px;

  background:
    rgba(0,174,239,.05);

  border: 1px solid var(--cp-border);

  transition: .2s ease;
}

.empty-state__tag:hover {
  border-color: rgba(0,174,239,.45);

  box-shadow:
    0 0 18px rgba(0,174,239,.15);
}

.empty-state__tag-link {
  display: flex;
  align-items: center;
  gap: 6px;

  padding: 8px 14px;

  text-decoration: none;

  color: var(--cp-text);

  font-size: 12px;
  font-weight: 600;
}

.empty-state__tag-dot {
  color: var(--cp-cyan);
}

/* MOBILE */

@media (max-width: 640px) {
  .empty-state {
    padding: 50px 22px;
  }

  .empty-state__icon-ring {
    width: 74px;
    height: 74px;
  }

  .empty-state__icon {
    width: 32px;
    height: 32px;
  }
}
</style>