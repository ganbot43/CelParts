<template>
  <div class="galeria-producto">
    <!-- Imagen principal -->
    <div class="galeria-imagen-principal-contenedor">
      <img
        v-if="imagenSeleccionada"
        :src="imagenSeleccionada"
        :alt="producto?.name"
        class="galeria-imagen-principal"
      />
      <div v-else class="galeria-placeholder">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1"
          stroke="currentColor"
          class="galeria-placeholder-icono"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
        <span class="galeria-placeholder-texto">Sin imagen</span>
      </div>

      <!-- Badge destacado -->
      <span v-if="producto?.isFeatured" class="galeria-insignia">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="galeria-insignia-icono"
        >
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
        Destacado
      </span>

      <!-- Overlay gradiente -->
      <div class="galeria-overlay" />

      <!-- Categoría -->
      <span v-if="producto?.category" class="galeria-categoria">
        {{ producto.category.name }}
      </span>
    </div>

    <!-- Miniaturas -->
    <div v-if="producto?.images?.length > 1" class="galeria-miniaturas">
      <button
        v-for="(img, idx) in producto.images"
        :key="idx"
        @click="imagenSeleccionada = img.url"
        class="galeria-miniatura-boton"
        :class="{ activa: imagenSeleccionada === img.url }"
        :aria-label="`Ver imagen ${idx + 1}`"
      >
        <img
          :src="img.url"
          :alt="`${producto.name} ${idx + 1}`"
          class="galeria-miniatura-imagen"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  producto: any;
}>();

const imagenSeleccionada = ref<string | null>(null);

watch(
  () => props.producto,
  (nuevoProducto) => {
    if (nuevoProducto?.images?.length) {
      imagenSeleccionada.value =
        nuevoProducto.images.find((i: any) => i.isPrimary)?.url ??
        nuevoProducto.images[0].url;
    } else {
      imagenSeleccionada.value = null;
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.galeria-producto {
  --kite-green: #2D6A4F;
  --kite-green-glow: rgba(45, 106, 79, 0.22);
  --kite-green-line: rgba(45, 106, 79, 0.2);
  --jm-card-border: #e8e8e8;
  --jm-card-border-hover: rgba(45, 106, 79, 0.35);
  --jm-img-bg: #f5f5f5;
  --radius: 14px;
  --radius-sm: 10px;
  --border: #e5e5e5;
  --transition: 0.18s ease;
}

.galeria-produto {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.galeria-produto {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Reutilizar layout igual que vf-card */
.galeria-producto {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* ── Imagen principal ── */
.galeria-imagen-principal-contenedor {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: var(--radius);
  background: var(--jm-img-bg);
  border: 1px solid var(--jm-card-border);
  transition:
    border-color 0.22s ease,
    box-shadow 0.22s ease;
}

.galeria-imagen-principal-contenedor:hover {
  border-color: var(--jm-card-border-hover);
  box-shadow:
    0 0 0 1px var(--kite-green-line),
    0 12px 40px rgba(0, 0, 0, 0.08),
    0 0 28px var(--kite-green-glow);
}

.galeria-imagen-principal {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  display: block;
}

.galeria-imagen-principal-contenedor:hover .galeria-imagen-principal {
  transform: scale(1.04);
}

/* ── Overlay ── */
.galeria-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 45%,
    rgba(0, 0, 0, 0.45) 100%
  );
  pointer-events: none;
}

/* ── Placeholder ── */
.galeria-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #d0d0d0;
}

.galeria-placeholder-icono {
  width: 52px;
  height: 52px;
}

.galeria-placeholder-texto {
  font-size: 13px;
  color: #c0c0c0;
  font-weight: 500;
  letter-spacing: 0.02em;
}

/* ── Badge destacado ── */
.galeria-insignia {
  position: absolute;
  top: 10px;
  left: 10px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: var(--kite-green);
  color: #fff;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 999px;
  box-shadow: 0 2px 10px var(--kite-green-glow);
}

.galeria-insignia-icono {
  width: 12px;
  height: 12px;
  color: #E9C46A;
  flex-shrink: 0;
}

/* ── Categoría ── */
.galeria-categoria {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fff;
  background: rgba(45, 106, 79, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 3px 9px;
  border-radius: 999px;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

/* ── Miniaturas ── */
.galeria-miniaturas {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 2px;
  scrollbar-width: none;
}

.galeria-miniaturas::-webkit-scrollbar {
  display: none;
}

.galeria-miniatura-boton {
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  border: 1px solid var(--jm-card-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  cursor: pointer;
  background: var(--jm-img-bg);
  transition:
    border-color var(--transition),
    transform var(--transition),
    box-shadow var(--transition);
  padding: 0;
}

.galeria-miniatura-boton:hover {
  border-color: rgba(45, 106, 79, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--kite-green-glow);
}

.galeria-miniatura-boton.activa {
  border: 1.5px solid var(--kite-green);
  box-shadow: 0 0 0 1px var(--kite-green-line);
}

.galeria-miniatura-imagen {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.galeria-miniatura-boton:hover .galeria-miniatura-imagen {
  transform: scale(1.08);
}

@media (max-width: 480px) {
  .galeria-miniatura-boton {
    width: 60px;
    height: 60px;
  }
}
</style>
