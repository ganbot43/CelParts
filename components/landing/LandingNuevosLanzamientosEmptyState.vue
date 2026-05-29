<template>
  <div class="empty-state">
    <!-- Ícono central -->
    <div class="empty-state__icon-ring">
      <svg
        class="empty-state__icon"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M8 20h32M8 20v18a2 2 0 002 2h28a2 2 0 002-2V20M8 20l4-10h24l4 10"
          stroke="#2D6A4F"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M24 10V8M20 28h8M24 24v8"
          stroke="#E9C46A"
          stroke-width="2.2"
          stroke-linecap="round"
        />
      </svg>
    </div>

    <!-- Textos -->
    <p class="empty-state__eyebrow">Pronto disponible</p>
    <h3 class="empty-state__title">Nuevos lanzamientos en camino</h3>
    <p class="empty-state__subtitle">
      Estamos seleccionando los mejores productos para ti.<br />
      Vuelve pronto y sé el primero en descubrirlos.
    </p>

    <!-- CTA principal -->
    <NuxtLink to="/productos" class="empty-state__btn">
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
      Ver catálogo completo
    </NuxtLink>

    <!-- Divisor -->
    <div class="empty-state__divider" aria-hidden="true" />

    <!-- Categorías sugeridas -->
    <p class="empty-state__tags-label">
      Mientras tanto, explora nuestras categorías
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
  { label: "Ollas y sartenes", slug: "ollas-y-sartenes" },
  { label: "Cuchillos", slug: "cuchillos" },
  { label: "Accesorios", slug: "accesorios-de-cocina" },
  { label: "Almacenamiento", slug: "menaje-de-hogar" },
];
</script>

<style scoped>
.empty-state {
  --clr-primary: #2D6A4F;
  --clr-primary-dark: #1E4D38;
  --clr-yellow: #E9C46A;
  --clr-bg: #FFFFFF;
  --clr-bg-soft: #F8F7F4;
  --clr-bg-pink: #F1EFEA;
  --clr-border: #E2E0D9;
  --clr-border-pink: #E2E0D9;
  --clr-text: #111111;
  --clr-text-mid: #66625A;
  --clr-text-muted: #9E9A91;
  --clr-text-hint: #A5A39C;

  /* Layout — ocupa el grid completo */
  grid-column: 1 / -1;

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 64px 40px;
  background: var(--clr-bg);
  /* border: 1.5px solid var(--clr-border); */
  border-radius: 20px;
}

/* ── Ícono ─────────────────────────────────────────────────── */
.empty-state__icon-ring {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: var(--clr-bg-pink);
  border: 1.5px solid var(--clr-border-pink);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  flex-shrink: 0;
}

.empty-state__icon {
  width: 38px;
  height: 38px;
}

/* ── Textos ────────────────────────────────────────────────── */
.empty-state__eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: var(--clr-primary);
  margin: 0 0 10px;
}

.empty-state__title {
  font-size: clamp(1.2rem, 3vw, 1.4rem);
  font-weight: 800;
  color: var(--clr-text);
  margin: 0 0 10px;
  line-height: 1.2;
}

.empty-state__subtitle {
  font-size: 0.95rem;
  color: var(--clr-text-muted);
  line-height: 1.75;
  max-width: 360px;
  margin: 0 0 32px;
}

/* ── Botón CTA ─────────────────────────────────────────────── */
.empty-state__btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--clr-primary);
  color: #FFFFFF;
  font-size: 0.875rem;
  font-weight: 700;
  padding: 12px 28px;
  border-radius: 999px;
  text-decoration: none;
  margin-bottom: 36px;
  transition:
    background 0.2s ease,
    transform 0.15s ease,
    box-shadow 0.2s ease;
  box-shadow: 0 4px 16px rgba(45, 106, 79, 0.22);
}

.empty-state__btn:hover {
  background: var(--clr-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 6px 22px rgba(45, 106, 79, 0.32);
}

.empty-state__btn:active {
  transform: scale(0.97);
}

/* ── Divisor ───────────────────────────────────────────────── */
.empty-state__divider {
  width: 100%;
  max-width: 440px;
  height: 1px;
  background: var(--clr-border);
  margin-bottom: 28px;
}

/* ── Tags categorías ───────────────────────────────────────── */
.empty-state__tags-label {
  font-size: 12px;
  color: var(--clr-text-hint);
  margin: 0 0 14px;
  letter-spacing: 0.3px;
}

.empty-state__tags {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.empty-state__tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--clr-bg-soft);
  border: 1px solid var(--clr-border);
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 500;
  color: var(--clr-text-mid);
  transition:
    border-color 0.2s ease,
    color 0.2s ease;
}

.empty-state__tag-link {
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  color: inherit;
  transition: color 0.2s ease;
}

.empty-state__tag:hover,
.empty-state__tag:hover .empty-state__tag-link {
  border-color: var(--clr-primary);
  color: var(--clr-primary);
}

.empty-state__tag-dot {
  font-size: 10px;
  color: var(--clr-primary);
}

/* ── Responsive ────────────────────────────────────────────── */
@media (max-width: 640px) {
  .empty-state {
    padding: 48px 24px;
  }

  .empty-state__icon-ring {
    width: 72px;
    height: 72px;
  }

  .empty-state__icon {
    width: 30px;
    height: 30px;
  }
}
</style>
