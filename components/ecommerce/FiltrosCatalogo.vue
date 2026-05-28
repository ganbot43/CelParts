<template>
  <aside class="w-full">
    <!-- Búsqueda -->
    <div class="mb-6">
      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Buscar</label>
      <UInput
        v-model="filters.q"
        placeholder="Buscar productos..."
        icon="i-heroicons-magnifying-glass"
        @input="emit('change', filters)"
        class="w-full"
      />
    </div>

    <!-- Categorías -->
    <div class="mb-6">
      <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">Categorías</h3>
      <ul class="space-y-1">
        <li>
          <button
            @click="selectCategory(null)"
            class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
            :class="!filters.categoria ? 'bg-primary-50 text-primary-700 font-semibold dark:bg-primary-900/30 dark:text-primary-400' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'"
          >
            Todos los productos
          </button>
        </li>
        <li v-for="cat in categories" :key="cat.id">
          <button
            @click="selectCategory(cat.id)"
            class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
            :class="filters.categoria === cat.id ? 'bg-primary-50 text-primary-700 font-semibold dark:bg-primary-900/30 dark:text-primary-400' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'"
          >
            {{ cat.name }}
          </button>
          <!-- Subcategorías -->
          <ul v-if="filters.categoria === cat.id && cat.subcategories?.length" class="ml-3 mt-1 space-y-1">
            <li v-for="sub in cat.subcategories" :key="sub.id">
              <button
                @click="selectSubcategory(sub.id)"
                class="w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors"
                :class="filters.subcategoria === sub.id ? 'text-primary-600 font-semibold' : 'text-gray-500 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-200'"
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
