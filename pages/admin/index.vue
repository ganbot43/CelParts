<template>
  <div class="dash-page">
    <!-- Toolbar -->
    <div class="sp-page-toolbar" style="margin-bottom: 1.75rem">
      <div>
        <h1 class="sp-page-toolbar__title">Panel de Control (SuperAdmin)</h1>
        <p class="sp-page-toolbar__sub">
          Gestión centralizada del sistema Arigumi · {{ today }}
        </p>
      </div>
      <div class="dash-live-dot" title="Sistema en línea">
        <span class="dash-live-pulse" />
        En línea
      </div>
    </div>

    <!-- ── Overview ── -->
    <div class="dash-automation admin-fade-in" style="animation-delay: 180ms">
      <div class="dash-automation__header">
        <div>
          <h2 class="dash-table-title">Bienvenido al Panel de Administración C2C</h2>
          <p class="dash-table-sub">
            Desde aquí puedes gestionar la configuración global, categorías, banners promocionales y revisar el libro de reclamaciones.
          </p>
        </div>
      </div>

      <div class="dash-automation__grid" style="margin-top: 20px;">
        <NuxtLink to="/admin/configuracion" class="dash-automation-card" style="text-decoration: none;">
          <span class="dash-automation-kicker">Ajustes</span>
          <strong>Configuración Global</strong>
          <p>Manejo de WhatsApp, logo y datos de contacto de la empresa.</p>
        </NuxtLink>
        <NuxtLink to="/admin/categorias" class="dash-automation-card" style="text-decoration: none;">
          <span class="dash-automation-kicker">Catálogo</span>
          <strong>Categorías</strong>
          <p>Administra las categorías de tapetes y tejidos para el filtro de la página.</p>
        </NuxtLink>
        <NuxtLink to="/admin/banners" class="dash-automation-card" style="text-decoration: none;">
          <span class="dash-automation-kicker">Marketing</span>
          <strong>Banners Principales</strong>
          <p>Sube las imágenes que se mostrarán en la portada a todos los visitantes.</p>
        </NuxtLink>
        <NuxtLink to="/admin/reclamaciones" class="dash-automation-card" style="text-decoration: none;">
          <span class="dash-automation-kicker">Legal</span>
          <strong>Reclamaciones</strong>
          <p>Revisa y responde las quejas del Libro de Reclamaciones.</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth", layout: "admin" });
useSeoMeta({ title: "Dashboard — Admin" });

const today = new Intl.DateTimeFormat("es-PE", {
  timeZone: "America/Lima",
  weekday: "long",
  day: "numeric",
  month: "long",
}).format(new Date());
</script>

<style scoped>
.dash-page {
  padding: 1.5rem;
}

/* ── Live indicator ── */
.dash-live-dot {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: var(--sp-text-xs);
  font-weight: 700;
  color: var(--sp-text-soft);
  background: var(--sp-surface-subtle);
  border: 1px solid var(--sp-border);
  border-radius: var(--sp-radius-pill);
  padding: 0.3rem 0.7rem;
  font-family: var(--sp-font);
}

.dash-live-pulse {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--sp-success);
  position: relative;
  flex-shrink: 0;
}

.dash-live-pulse::after {
  content: "";
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  background: var(--sp-success);
  opacity: 0.3;
  animation: dash-pulse 1.8s ease-in-out infinite;
}

@keyframes dash-pulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.9); opacity: 0; }
}

/* ── Automation panel ── */
.dash-automation {
  background: var(--sp-surface-solid);
  border: 1px solid var(--sp-border);
  border-radius: var(--sp-radius-xl);
  box-shadow: var(--sp-shadow-sm);
  padding: 1.2rem;
  margin-bottom: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dash-automation__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.dash-table-title {
  font-size: var(--sp-text-md);
  font-weight: 800;
  color: var(--sp-text-strong);
  letter-spacing: -0.025em;
  margin: 0;
  font-family: var(--sp-font);
}

.dash-table-sub {
  font-size: var(--sp-text-xs);
  color: var(--sp-text-soft);
  margin: 0.15rem 0 0;
  font-family: var(--sp-font);
}

.dash-automation__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.85rem;
}

.dash-automation-card {
  border: 1px solid var(--sp-border);
  border-radius: var(--sp-radius-lg);
  background: var(--sp-surface-subtle);
  padding: 1rem;
  transition: transform var(--sp-t-fast) var(--sp-ease), box-shadow var(--sp-t-fast);
}

.dash-automation-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--sp-shadow-md);
  background: var(--sp-surface-solid);
}

.dash-automation-card strong {
  display: block;
  margin-top: 0.35rem;
  font-size: var(--sp-text-lg);
  color: var(--sp-text-strong);
  font-family: var(--sp-font-display);
}

.dash-automation-card p {
  margin: 0.35rem 0 0;
  color: var(--sp-text-soft);
  font-size: var(--sp-text-xs);
  font-family: var(--sp-font);
}

.dash-automation-kicker {
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--sp-primary);
  font-weight: 800;
}

@media (max-width: 1024px) {
  .dash-automation__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 640px) {
  .dash-automation__grid {
    grid-template-columns: 1fr;
  }
}
</style>
