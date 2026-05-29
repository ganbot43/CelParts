<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
    <EcommerceTarjetaProducto
      v-for="product in products"
      :key="product.id"
      :product="product"
    />
    <!-- Skeleton loader -->
    <template v-if="loading">
      <div
        v-for="i in 8"
        :key="`sk-${i}`"
        class="grid-skeleton"
        style="aspect-ratio: 0.8/1;"
      />
    </template>
    <!-- Empty state -->
    <div
      v-if="!loading && products.length === 0"
      class="col-span-full text-center py-16 text-gray-400"
    >
      <UIcon name="i-heroicons-magnifying-glass" class="w-12 h-12 mx-auto mb-4 opacity-40" />
      <p class="text-lg">No se encontraron productos</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'
defineProps<{ products: Product[]; loading?: boolean }>()
</script>

<style scoped>
.grid-skeleton {
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(226, 224, 217, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 4px 16px rgba(17, 17, 17, 0.03), inset 0 1px 0 rgba(255,255,255,0.4);
}

.grid-empty {
  color: #66625a;
}
</style>
