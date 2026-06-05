<template>
  <div class="empty-state">

    <!-- Ícono central -->
    <div class="empty-state__icon-ring">
      <svg class="empty-state__icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true">
        <!-- Caja / tienda -->
        <path d="M8 20h32M8 20v18a2 2 0 002 2h28a2 2 0 002-2V20M8 20l4-10h24l4 10"
          stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        <!-- Estrella / tilde de nuevo -->
        <path d="M24 28v4M22 30h4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
        <!-- Punto superior -->
        <circle cx="24" cy="10" r="1.5" fill="currentColor" opacity="0.5" />
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
/* ═══════════════════════════════════
   EMPTY STATE — NUEVOS LANZAMIENTOS
   100% tokens de main.css — sin hardcode
═══════════════════════════════════ */

.empty-state {
  grid-column: 1 / -1;

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  padding: var(--space-20) var(--space-10);

  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: var(--r-xl);
  box-shadow: var(--card-shadow);

  position: relative;
  overflow: hidden;
}

/* Línea técnica superior */
.empty-state::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--line-brand);
}

/* Halo de fondo sutil */
.empty-state::after {
  content: '';
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--cp-frost) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

/* Asegurar que el contenido quede sobre el pseudo */
.empty-state > * {
  position: relative;
  z-index: 1;
}

/* ── Ícono ── */
.empty-state__icon-ring {
  width: 88px;
  height: 88px;
  border-radius: 50%;

  background: var(--bg-alt);
  border: 1px solid var(--border-light);

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: var(--space-6);

  color: var(--cp-electric);
  box-shadow: var(--glow-soft);
}

.empty-state__icon {
  width: 38px;
  height: 38px;
}

/* ── Textos ── */
.empty-state__eyebrow {
  margin: 0 0 var(--space-3);

  color: var(--cp-electric);

  font-size: 0.70rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;

  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
}

.empty-state__eyebrow::before,
.empty-state__eyebrow::after {
  content: '';
  width: 18px;
  height: 1px;
  background: var(--cp-electric);
  opacity: 0.5;
}

.empty-state__title {
  margin: 0 0 var(--space-3);

  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 3vw, 1.9rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.empty-state__subtitle {
  margin: 0 0 var(--space-8);

  max-width: 460px;

  color: var(--text-muted);
  line-height: 1.8;
  font-size: 0.95rem;
}

/* ── Botón CTA ── */
.empty-state__btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);

  text-decoration: none;

  color: var(--btn-primary-text);
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 700;

  height: 46px;
  padding: 0 var(--space-6);
  border-radius: var(--r-pill);

  background: var(--btn-primary-bg);
  border: none;

  box-shadow: 0 4px 16px rgba(7, 30, 82, 0.20);

  transition:
    transform var(--t-fast) var(--ease-snappy),
    background var(--t-base) var(--ease-smooth),
    box-shadow var(--t-base) var(--ease-smooth);
}

.empty-state__btn:hover {
  transform: translateY(-2px);
  background: var(--btn-primary-hover);
  box-shadow: 0 8px 28px rgba(7, 30, 82, 0.28);
  color: var(--btn-primary-text);
}

.empty-state__btn:active {
  transform: translateY(0);
}

/* ── Divisor ── */
.empty-state__divider {
  width: 100%;
  max-width: 440px;
  height: 1px;
  background: var(--border-light);
  margin: var(--space-8) 0 var(--space-6);
}

/* ── Tags / Categorías ── */
.empty-state__tags-label {
  margin: 0 0 var(--space-4);
  color: var(--text-faint);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.empty-state__tags {
  list-style: none;
  margin: 0;
  padding: 0;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-2);
}

.empty-state__tag {
  border-radius: var(--r-pill);
  background: var(--bg-alt);
  border: 1px solid var(--border-light);
  transition:
    border-color var(--t-base) var(--ease-smooth),
    background var(--t-base) var(--ease-smooth),
    box-shadow var(--t-base) var(--ease-smooth);
}

.empty-state__tag:hover {
  border-color: var(--border-mid);
  background: var(--cp-frost);
  box-shadow: var(--card-shadow-sm);
}

.empty-state__tag-link {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: 7px var(--space-4);
  text-decoration: none;
  color: var(--text-body);
  font-size: 0.78rem;
  font-weight: 600;
  transition: color var(--t-base) var(--ease-smooth);
}

.empty-state__tag:hover .empty-state__tag-link {
  color: var(--text-primary);
}

.empty-state__tag-dot {
  color: var(--cp-electric);
  font-size: 0.55rem;
}

/* ── Responsive ── */
@media (max-width: 640px) {
  .empty-state {
    padding: var(--space-12) var(--space-6);
  }

  .empty-state__icon-ring {
    width: 72px;
    height: 72px;
  }

  .empty-state__icon {
    width: 30px;
    height: 30px;
  }

  .empty-state__btn {
    width: 100%;
    justify-content: center;
  }
}
</style>