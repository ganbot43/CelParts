<template>
  <div class="pagina-detalle">
    <!-- Breadcrumb -->
    <div class="barra-breadcrumb">
      <div class="contenedor">
        <nav class="nav-breadcrumb">
          <NuxtLink to="/productos" class="enlace-breadcrumb">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-3.5 h-3.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
            Productos
          </NuxtLink>
          <span class="separador-breadcrumb">/</span>
          <span class="breadcrumb-actual">{{ producto?.name ?? "..." }}</span>
        </nav>
      </div>
    </div>

    <div class="contenedor py-10 lg:py-16">
      <!-- Error -->
      <div v-if="productLoadError && !producto" class="estado-error">
        <div class="tarjeta-error">
          <span class="error-pill">No pudimos cargar el producto</span>
          <h2>La carga falló</h2>
          <p>{{ productErrorMessage }}</p>
          <button class="reintentar-btn" type="button" @click="retryProductFetch">
            Reintentar
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-else-if="!producto" class="estado-cargando">
        <div class="grilla-cargando">
          <div class="imagen-cargando" />
          <div class="info-cargando">
            <div class="linea-cargando w-1/3" />
            <div class="linea-cargando w-3/4 h-8" />
            <div class="linea-cargando w-full" />
            <div class="linea-cargando w-5/6" />
            <div class="linea-cargando w-1/4 h-10 mt-4" />
          </div>
        </div>
      </div>

      <!-- Product detail -->
      <div v-else class="grilla-producto">
        <!-- Galería -->
        <EcommerceGaleriaProducto :producto="producto" />

        <!-- Información del producto -->
        <EcommerceInfoProducto
          :producto="producto"
          :estoy-agregando="estoyAgregando"
          @agregar-al-carrito="manejarAgregarAlCarrito"
        />
      </div>

      <!-- Productos similares -->
      <EcommerceSeccionProductosSimilares
        class="mt-10"
        :productos="productoresSimilares"
        subtitulo="Descubre más"
        titulo="También te puede interesar"
        @agregar-al-carrito="manejarAgregarProductoSimilar"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "landing" });

useSeoMeta({
  title: "Producto — Celparts SAC",
  description: "Detalle del producto.",
});

const route = useRoute();
const cartStore = useCartStore();
const toast = useAppToast();

const producto = computed<any>(() => productData.value ?? null);
const estoyAgregando = ref(false);

async function fetchWithTimeout<T>(
  url: string,
  options: Record<string, any> = {},
  timeoutMs = 12000,
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return (await $fetch<T>(url, {
      ...options,
      signal: controller.signal,
    })) as T;
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      throw new Error(`La solicitud superó los ${Math.round(timeoutMs / 1000)}s`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

const { data: productData, error: productLoadError, refresh: refreshProduct } = await useAsyncData<any>(
  `producto-${String(route.params.slug)}`,
  async () => {
    return await fetchWithTimeout<any>(
      `/api/products/${String(route.params.slug)}`,
      {},
      12000,
    );
  },
  {
    server: false,
    lazy: true,
  },
);

const productErrorMessage = computed(() =>
  productLoadError.value?.message ?? 'No pudimos cargar el producto.',
);

const retryProductFetch = async () => {
  await refreshProduct();
};

const { data: datosSimilares } = await useAsyncData<{
  data: any[];
}>(
  `productos-similares-${String(route.params.slug)}`,
  async () => {
    if (!producto.value?.id) {
      return { data: [] };
    }

    return await fetchWithTimeout<{ data: any[] }>(
      `/api/products/similar?productId=${producto.value.id}`,
      {},
      12000,
    );
  },
  {
    server: false,
    lazy: true,
    watch: [() => producto.value?.id],
  },
);

const productoresSimilares = computed(() => datosSimilares.value?.data ?? []);

async function manejarAgregarAlCarrito(cantidad: number) {
  estoyAgregando.value = true;
  cartStore.add({
    id: producto.value.id,
    name: producto.value.name,
    price: producto.value.price,
    quantity: cantidad,
    image: producto.value.images?.length
      ? (producto.value.images.find((i: any) => i.isPrimary)?.url ??
        producto.value.images[0].url)
      : null,
  });
  toast.add({
    title: 'Agregado al carrito',
    description: producto.value.name,
    color: 'success',
  });
  await new Promise((r) => setTimeout(r, 450));
  estoyAgregando.value = false;
}

async function manejarAgregarProductoSimilar(productoSimilar: any) {
  cartStore.add({
    id: productoSimilar.id,
    name: productoSimilar.name,
    price: productoSimilar.price,
    quantity: 1,
    image: productoSimilar.images?.length
      ? (productoSimilar.images.find((i: any) => i.isPrimary)?.url ??
        productoSimilar.images[0].url)
      : null,
  });
  toast.add({
    title: 'Agregado al carrito',
    description: productoSimilar.name,
    color: 'success',
  });
}
</script>

<style scoped>
/* ═══════════════════════════════════
   DETALLE PRODUCTO — CELPARTS
   100% tokens de main.css
═══════════════════════════════════ */

/* ─── Base ───────────────────────────────────────────────── */
.pagina-detalle {
  min-height: 100vh;
  background: var(--bg-base);
  padding-bottom: 4rem;
}

.contenedor {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;
}
@media (min-width: 640px) {
  .contenedor {
    padding: 0 1.5rem;
  }
}
@media (min-width: 1024px) {
  .contenedor {
    padding: 0 2rem;
  }
}

/* ─── Breadcrumb ─────────────────────────────────────────── */
.barra-breadcrumb {
  padding: 1.5rem 0 0;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-light);
  padding-bottom: 1rem;
}
.nav-breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 0.82rem;
}
.enlace-breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: var(--text-muted);
  font-weight: 500;
  transition: color var(--t-fast) var(--ease-smooth);
  text-decoration: none;
}
.enlace-breadcrumb:hover {
  color: var(--cp-electric);
}
.separador-breadcrumb {
  color: var(--border-mid);
}
.breadcrumb-actual {
  color: var(--text-primary);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 240px;
}

/* ─── Loading skeleton ───────────────────────────────────── */
.estado-cargando,
.estado-error {
  padding: 2rem 0;
}
.tarjeta-error {
  max-width: 34rem;
  margin: 0 auto;
  padding: var(--space-8);
  border: 1px solid var(--border-light);
  border-radius: var(--r-xl);
  background: var(--bg-surface);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--card-shadow);
}
.error-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.7rem;
  border-radius: var(--r-pill);
  background: rgba(0, 174, 239, 0.08);
  color: var(--cp-electric);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.tarjeta-error h2 {
  margin: 1rem 0 0.5rem;
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}
.tarjeta-error p {
  margin: 0;
  color: var(--text-body);
  line-height: 1.6;
}
.reintentar-btn {
  margin-top: 1.5rem;
  border: 0;
  border-radius: var(--r-pill);
  padding: 0.9rem 1.5rem;
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: all var(--t-fast) var(--ease-snappy);
  box-shadow: 0 4px 16px rgba(7, 30, 82, 0.15);
}
.reintentar-btn:hover {
  background: var(--btn-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(7, 30, 82, 0.22);
}
.grilla-cargando {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}
@media (min-width: 1024px) {
  .grilla-cargando {
    grid-template-columns: 1fr 1fr;
  }
}
.imagen-cargando {
  aspect-ratio: 1/1;
  background: linear-gradient(110deg, var(--bg-alt) 8%, var(--bg-surface) 18%, var(--bg-alt) 33%);
  background-size: 200% 100%;
  animation: shimmer 1.4s linear infinite;
  border-radius: var(--r-xl);
  border: 1px solid var(--border-light);
}
.info-cargando {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding-top: var(--space-2);
}
.linea-cargando {
  height: 1rem;
  border-radius: var(--r-sm);
  background: linear-gradient(110deg, var(--bg-alt) 8%, var(--bg-surface) 18%, var(--bg-alt) 33%);
  background-size: 200% 100%;
  animation: shimmer 1.4s linear infinite;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ─── Product grid ───────────────────────────────────────── */
.grilla-producto {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
}
@media (min-width: 1024px) {
  .grilla-producto {
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: start;
  }
}
</style>
