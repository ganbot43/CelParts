<template>
  <div v-if="productos.length" class="seccion-similares">
    <!-- Encabezado -->
    <div v-if="showHeader" class="similares-encabezado">
      <div>
        <p v-if="subtitulo" class="similares-subtitulo">{{ subtitulo }}</p>
        <h2 v-if="titulo" class="similares-titulo">{{ titulo }}</h2>
      </div>
    </div>

    <!-- Carrusel -->
    <div class="similares-contenedor" ref="contenedorRef">
      <!-- Flecha izquierda -->
      <button
        class="similares-flecha similares-flecha-izquierda"
        @click="scrollCarrusel(-1)"
        aria-label="Anterior"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2.5"
          stroke="currentColor"
          width="18"
          height="18"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      <!-- Flecha derecha -->
      <button
        class="similares-flecha similares-flecha-derecha"
        @click="scrollCarrusel(1)"
        aria-label="Siguiente"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2.5"
          stroke="currentColor"
          width="18"
          height="18"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>

      <!-- Track del carrusel -->
      <div class="similares-carrusel" ref="carruselRef">
        <div
          v-for="(producto, index) in productosInfinitos"
          :key="`${producto.id}-${index}`"
          class="similares-item"
          :style="{
            width: `${itemWidth}px`,
            minWidth: `${itemWidth}px`,
            maxWidth: `${itemWidth}px`,
          }"
        >
          <EcommerceTarjetaProducto
            :product="producto"
            @agregar-al-carrito="manejarAgregar"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  productos: any[];
  subtitulo?: string;
  titulo?: string;
  columnas?: number; // Cuántos productos mostrar por "página"
}>();

const showHeader = computed(() => Boolean(props.subtitulo || props.titulo));

const emit = defineEmits<{
  agregarAlCarrito: [producto: any];
}>();

const carruselRef = ref<HTMLElement | null>(null);
const contenedorRef = ref<HTMLElement | null>(null);

// Ancho calculado de cada item según el contenedor y las columnas pedidas
const columnas = computed(() => props.columnas ?? 4);
const gap = 16;

const itemWidth = ref(240);

function calcularItemWidth() {
  const el = contenedorRef.value;
  if (!el) return;
  const anchoContenedor = el.clientWidth;

  let cols = columnas.value;

  // Responsive automático si no se pasa prop columnas
  if (!props.columnas) {
    if (anchoContenedor < 480) {
      cols = 1;
    } else if (anchoContenedor < 768) {
      cols = 2;
    } else if (anchoContenedor < 1024) {
      cols = 3;
    } else {
      cols = 4;
    }
  }

  itemWidth.value = Math.floor((anchoContenedor - gap * (cols - 1)) / cols);
}

// Paso de scroll: exactamente N items completos
const itemStep = computed(() => itemWidth.value + gap);
const scrollPaso = computed(() => itemStep.value * columnas.value);

// Triplicamos para efecto infinito
const productosInfinitos = computed(() => [
  ...props.productos,
  ...props.productos,
  ...props.productos,
]);

const bloqueAncho = computed(() => props.productos.length * itemStep.value);

let isScrolling = false;

function scrollCarrusel(dir: 1 | -1) {
  const el = carruselRef.value;
  if (!el || isScrolling) return;

  isScrolling = true;
  el.scrollBy({ left: dir * scrollPaso.value, behavior: "smooth" });

  setTimeout(() => {
    recentrarSiNecesario();
    isScrolling = false;
  }, 450);
}

function recentrarSiNecesario() {
  const el = carruselRef.value;
  if (!el) return;
  const bloque = bloqueAncho.value;
  if (el.scrollLeft >= bloque * 2) el.scrollLeft -= bloque;
  if (el.scrollLeft < bloque) el.scrollLeft += bloque;
}

function manejarAgregar(producto: any) {
  emit("agregarAlCarrito", producto);
}

// Recalcular al montar y al redimensionar
const resizeObserver = ref<ResizeObserver | null>(null);

onMounted(() => {
  nextTick(() => {
    calcularItemWidth();
    nextTick(() => {
      const el = carruselRef.value;
      if (el) el.scrollLeft = bloqueAncho.value;
    });
  });

  resizeObserver.value = new ResizeObserver(() => {
    calcularItemWidth();
    // Reajustar posición al bloque del medio tras resize
    nextTick(() => {
      const el = carruselRef.value;
      if (el) el.scrollLeft = bloqueAncho.value;
    });
  });

  if (contenedorRef.value) {
    resizeObserver.value.observe(contenedorRef.value);
  }
});

onUnmounted(() => {
  resizeObserver.value?.disconnect();
});
</script>

<style scoped>
.seccion-similares {
}

.similares-encabezado {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
}

.similares-subtitulo {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--cp-electric);
  margin: 0;
}

.similares-titulo {
  font-family: var(--font-display);
  font-size: clamp(20px, 4vw, 28px);
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  margin: 6px 0 0 0;
}

.similares-contenedor {
  position: relative;
  width: 100%;
}

/* Flechas — ocultas en móvil, visibles desde tablet */
.similares-flecha {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--border-light);
  background: var(--bg-surface);
  box-shadow: 0 2px 12px rgba(0, 174, 239, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  cursor: pointer;
  transition:
    background 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.similares-flecha:hover {
  background: var(--cp-electric);
  border-color: var(--cp-electric);
  color: var(--cp-white);
  box-shadow: 0 4px 20px rgba(0, 174, 239, 0.22);
  transform: translateY(-50%) scale(1.07);
}

.similares-flecha-izquierda {
  left: -22px;
}
.similares-flecha-derecha {
  right: -22px;
}

/* Carrusel */
.similares-carrusel {
  display: flex;
  gap: 16px;
  overflow-x: scroll;
  scroll-behavior: smooth;
  padding: 8px 0 16px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  /* Permite swipe táctil natural */
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
}
.similares-carrusel::-webkit-scrollbar {
  display: none;
}

.similares-item {
  flex-shrink: 0;
  scroll-snap-align: start;
}

/* ─── RESPONSIVE ─────────────────────────────────────────── */

/* Móvil — ocultar flechas, padding lateral para que se vea el siguiente card */
@media (max-width: 639px) {
  .similares-flecha {
    display: none;
  }

  .similares-contenedor {
    /* Sangría negativa para que el carrusel llegue a los bordes */
    margin: 0 -16px;
    width: calc(100% + 32px);
  }

  .similares-carrusel {
    padding: 8px 16px 16px;
    gap: 12px;
  }

  .similares-encabezado {
    margin-bottom: 16px;
  }
}

/* Tablet — flechas más pequeñas y pegadas */
@media (min-width: 640px) and (max-width: 1023px) {
  .similares-flecha {
    width: 36px;
    height: 36px;
  }

  .similares-flecha-izquierda {
    left: -18px;
  }
  .similares-flecha-derecha {
    right: -18px;
  }
}

@media (max-width: 479px) {
  .similares-contenedor {
    margin: 0;
    width: 100%;
  }

  .similares-carrusel {
    padding: 8px 0 16px;
  }
}
</style>
