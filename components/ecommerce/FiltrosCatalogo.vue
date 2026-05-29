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
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(226, 224, 217, 0.5);
  border-radius: 18px;
  padding: 1rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 6px 22px rgba(17, 17, 17, 0.03), inset 0 1px 0 rgba(255,255,255,0.4);
}

.filtros-label,
.filtros-title {
  display: block;
  color: #111111;
  font-weight: 700;
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
  border: 1px solid rgba(226, 224, 217, 0.6);
  background: rgba(255, 255, 255, 0.72);
  color: #66625a;
  border-radius: 12px;
  transition: all 0.18s ease;
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
  border-color: rgba(45, 106, 79, 0.28);
  background: rgba(45, 106, 79, 0.06);
  color: #2D6A4F;
}

.filtros-chip.active,
.filtros-subchip.active {
  border-color: rgba(45, 106, 79, 0.34);
  background: rgba(45, 106, 79, 0.08);
  color: #2D6A4F;
  font-weight: 700;
  box-shadow: 0 0 0 1px rgba(45, 106, 79, 0.12);
}

:deep(.filtros-input input) {
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(226, 224, 217, 0.5);
  border-radius: 12px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
</style>
