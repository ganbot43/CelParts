<template>
  <aside class="w-full filtros-panel">
    <!-- Búsqueda -->
    <div class="mb-6">
      <label class="filtros-label">Buscar</label>
      <UInput
        v-model="filters.q"
        placeholder="Buscar productos..."
        icon="i-heroicons-magnifying-glass"
        @input="emit('change', filters)"
        class="w-full filtros-input"
      />
    </div>

    <!-- Categorías -->
    <div class="mb-6">
      <h3 class="filtros-title">Categorías</h3>
      <ul class="space-y-1">
        <li>
          <button
            @click="selectCategory(null)"
            class="filtros-chip"
            :class="!filters.categoria ? 'active' : ''"
          >
            Todos los productos
          </button>
        </li>
        <li v-for="cat in categories" :key="cat.id">
          <button
            @click="selectCategory(cat.id)"
            class="filtros-chip"
            :class="filters.categoria === cat.id ? 'active' : ''"
          >
            {{ cat.name }}
          </button>
          <!-- Subcategorías -->
          <ul v-if="filters.categoria === cat.id && cat.subcategories?.length" class="ml-3 mt-1 space-y-1">
            <li v-for="sub in cat.subcategories" :key="sub.id">
              <button
                @click="selectSubcategory(sub.id)"
                class="filtros-subchip"
                :class="filters.subcategoria === sub.id ? 'active' : ''"
              >
                → {{ sub.name }}
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { Category } from '~/types'

const props  = defineProps<{ categories: Category[] }>()
const emit   = defineEmits<{ change: [filters: any] }>()
const route  = useRoute()

const filters = reactive({
  q:            (route.query.q as string) || '',
  categoria:    route.query.categoria ? Number(route.query.categoria) : null,
  subcategoria: route.query.subcategoria ? Number(route.query.subcategoria) : null,
})

function selectCategory(id: number | null) {
  filters.categoria    = id
  filters.subcategoria = null
  emit('change', filters)
}

function selectSubcategory(id: number) {
  filters.subcategoria = id
  emit('change', filters)
}

watch(filters, () => emit('change', filters))
</script>

<style scoped>
.filtros-panel {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: var(--r-xl);
  padding: var(--space-4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--card-shadow-sm);
}

.filtros-label,
.filtros-title {
  display: block;
  color: var(--text-primary);
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.filtros-title {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  margin-bottom: 0.75rem;
}

.filtros-chip,
.filtros-subchip {
  width: 100%;
  text-align: left;
  border: 1px solid var(--border-light);
  background: var(--bg-alt);
  color: var(--text-muted);
  border-radius: var(--r-sm);
  transition: all var(--t-fast) var(--ease-smooth);
}

.filtros-chip {
  padding: 0.6rem 0.8rem;
  font-size: 0.875rem;
}

.filtros-subchip {
  padding: 0.45rem 0.7rem;
  font-size: 0.78rem;
}

.filtros-chip:hover,
.filtros-subchip:hover {
  border-color: rgba(0, 174, 239, 0.3);
  background: rgba(0, 174, 239, 0.04);
  color: var(--cp-electric);
}

.filtros-chip.active,
.filtros-subchip.active {
  border-color: var(--cp-electric);
  background: rgba(0, 174, 239, 0.08);
  color: var(--cp-electric);
  font-weight: 700;
}

:deep(.filtros-input input) {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: var(--r-sm);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
</style>
