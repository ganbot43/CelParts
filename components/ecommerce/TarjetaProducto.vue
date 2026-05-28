<template>
  <div v-if="product" class="vf-card">
    <NuxtLink :to="`/productos/${product.slug}`" class="vf-card__link">
      <!-- Imagen -->
      <div class="vf-card__img-wrap">
        <img
          v-if="primaryImage"
          :src="primaryImage"
          :alt="product.name"
          class="vf-card__img"
          loading="lazy"
        />
        <div v-else class="vf-card__img-placeholder">
          <UIcon name="i-heroicons-photo" class="vf-card__placeholder-icon" />
        </div>

        <!-- Overlay gradiente inferior -->
        <div class="vf-card__overlay" />

        <!-- Badge destacado -->
        <span v-if="product.isFeatured" class="vf-card__badge">
          <span class="vf-card__badge-dot" />
          Destacado
        </span>

        <!-- Categoría sobre la imagen -->
        <span v-if="product.category" class="vf-card__category">
          {{ product.category.name }}
        </span>
      </div>

      <!-- Info -->
      <div class="vf-card__body">
        <h3 class="vf-card__name">{{ product.name }}</h3>
        <p class="vf-card__price">{{ formatPrice.format(product.price) }}</p>
      </div>
    </NuxtLink>

    <!-- Botones -->
    <div class="vf-card__footer">
      <!-- Botón Agregar al carrito -->
      <button
        class="vf-card__btn vf-card__btn--cart"
        :class="{ 'vf-card__btn--loading': adding }"
        :disabled="adding"
        :title="adding ? 'Agregando...' : 'Agregar al carrito'"
        @click.prevent="addToCart"
      >
        <svg
          v-if="!adding"
          class="vf-card__btn-icon"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linejoin="round"
          />
          <path
            d="M3 6h18M16 10a4 4 0 0 1-8 0"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
          <path
            d="M12 13v4M10 15h4"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
        </svg>
        <svg
          v-else
          class="vf-card__btn-icon vf-card__btn-spin"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="rgba(255,255,255,0.35)"
            stroke-width="2"
          />
          <path
            d="M12 3a9 9 0 0 1 9 9"
            stroke="#fff"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        <span class="vf-card__btn-text">{{
          adding ? "Agregando..." : "Al carrito"
        }}</span>
      </button>

      <!-- Botón WhatsApp -->

      <a
        class="vf-card__btn vf-card__btn--wa"
        :href="waLink(`Hola, me interesa el producto: ${product!.name}`)"
        :title="`Consultar por ${product!.name}`"
        target="_blank"
        rel="noopener noreferrer"
        @click.stop
      >
        <svg class="vf-card__btn-icon" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"
          />
        </svg>
        <!-- <span class="vf-card__btn-text">Consultar</span> -->
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
type CardProduct = {
  id: number;
  name: string;
  slug: string;
  price: number;
  isFeatured?: boolean;
  category?: { name: string } | null;
  images?: Array<{ id: number; url: string; isPrimary: boolean }>;
} | null;

const props = defineProps<{ product?: CardProduct }>();
const cartStore = useCartStore();
const toast = useAppToast();
const formatPrice = useFormatPrice();
const { waLink } = useJoymar();
const adding = ref(false);

const primaryImage = computed(() => {
  const primary = props.product?.images?.find((i) => i.isPrimary);
  return primary?.url ?? props.product?.images?.[0]?.url ?? null;
});

async function addToCart() {
  adding.value = true;
  cartStore.add({
    id: props.product!.id,
    name: props.product!.name,
    price: props.product!.price,
    quantity: 1,
    image: primaryImage.value ?? undefined,
  });
  toast.add({
    title: "Agregado al carrito",
    description: props.product!.name,
    color: "success",
  });
  await new Promise((r) => setTimeout(r, 500));
  adding.value = false;
}
</script>

<style scoped>
/* ═══════════════════════════════════
   TOKENS JOYMAR — LIGHT
═══════════════════════════════════ */
.vf-card {
  --jm-magenta: #c01890;
  --jm-magenta-dark: #8c1068;
  --jm-magenta-glow: rgba(192, 24, 144, 0.22);
  --jm-magenta-soft: rgba(192, 24, 144, 0.07);
  --jm-magenta-line: rgba(192, 24, 144, 0.2);

  --jm-wa: #25d366;
  --jm-wa-dark: #128c4a;
  --jm-wa-glow: rgba(37, 211, 102, 0.22);

  /* Card surfaces */
  --jm-card-bg: #ffffff;
  --jm-card-border: #e8e8e8;
  --jm-card-border-hover: rgba(192, 24, 144, 0.35);
  --jm-img-bg: #f5f5f5;

  /* Text */
  --jm-text: #111111;
  --jm-text-dim: #555555;
  --jm-text-muted: #999999;
}

/* ── Card base ── */
.vf-card {
  position: relative;
  background: var(--jm-card-bg);
  border: 1px solid var(--jm-card-border);
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition:
    transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 0.22s cubic-bezier(0.2, 0.8, 0.2, 1),
    border-color 0.22s ease;
  cursor: pointer;
  height: 100%;
}

.vf-card:hover {
  transform: translateY(-5px);
  border-color: var(--jm-card-border-hover);
  box-shadow:
    0 0 0 1px var(--jm-magenta-line),
    0 12px 40px rgba(0, 0, 0, 0.1),
    0 0 28px var(--jm-magenta-glow);
}

/* ── Link wrapper ── */
.vf-card__link {
  display: flex;
  flex-direction: column;
  flex: 1;
  text-decoration: none;
  color: inherit;
}

/* ── Imagen ── */
.vf-card__img-wrap {
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: var(--jm-img-bg);
}

.vf-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  display: block;
}

.vf-card:hover .vf-card__img {
  transform: scale(1.07);
}

.vf-card__img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--jm-img-bg);
}

.vf-card__placeholder-icon {
  width: 3.5rem;
  height: 3.5rem;
  color: #cccccc;
}

/* Gradiente inferior sobre imagen */
.vf-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 45%,
    rgba(0, 0, 0, 0.45) 100%
  );
  pointer-events: none;
}

/* ── Badge destacado ── */
.vf-card__badge {
  position: absolute;
  top: 10px;
  left: 10px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: var(--jm-magenta);
  color: #fff;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 999px;
  box-shadow: 0 2px 10px var(--jm-magenta-glow);
}

.vf-card__badge-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #fff;
  flex-shrink: 0;
  animation: vf-pulse 1.8s ease-in-out infinite;
}

@keyframes vf-pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.45;
    transform: scale(0.7);
  }
}

/* ── Categoría ── */
.vf-card__category {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fff;
  background: rgba(192, 24, 144, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 3px 9px;
  border-radius: 999px;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

/* ── Body ── */
.vf-card__body {
  padding: 0.9rem 1rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
  background: var(--jm-card-bg);
  min-height: 0;
}

.vf-card__name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--jm-text);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.15s ease;
  margin: 0;
  min-height: calc(0.875rem * 1.4 * 2);
}

.vf-card:hover .vf-card__name {
  color: var(--jm-magenta);
}

.vf-card__price {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--jm-magenta);
  letter-spacing: -0.02em;
  margin: 0;
}

/* ── Footer / Botones ── */
.vf-card__footer {
  padding: 0 0.75rem 0.75rem;
  background: var(--jm-card-bg);
  display: flex;
  gap: 0.5rem;
}

/* ── Botón base compartido ── */
.vf-card__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.5rem 0.65rem;
  border-radius: 8px;
  border: none;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  text-decoration: none;
  overflow: hidden;
  transition:
    background 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.15s ease,
    opacity 0.15s ease;
}

/* ── Botón carrito ── */
.vf-card__btn--cart {
  flex: 1;
  min-width: 0;
  background: var(--jm-magenta);
  color: #fff;
  box-shadow: 0 2px 12px var(--jm-magenta-glow);
}

.vf-card__btn--cart:hover:not(:disabled) {
  background: var(--jm-magenta-dark);
  box-shadow: 0 4px 20px rgba(192, 24, 144, 0.38);
  transform: translateY(-1px);
}

.vf-card__btn--cart:active:not(:disabled) {
  transform: translateY(0);
}

.vf-card__btn--loading,
.vf-card__btn--cart:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
}

/* ── Botón WhatsApp ── */
.vf-card__btn--wa {
  flex-shrink: 0;
  background: #25d366;
  color: #fff;
  box-shadow: 0 2px 12px rgba(37, 211, 102, 0.22);
}

.vf-card__btn--wa:hover {
  background: #128c4a;
  box-shadow: 0 4px 20px rgba(37, 211, 102, 0.38);
  transform: translateY(-1px);
}

.vf-card__btn--wa:active {
  transform: translateY(0);
}

/* ── Íconos y texto ── */
.vf-card__btn-icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

.vf-card__btn-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@keyframes vf-spin {
  to {
    transform: rotate(360deg);
  }
}

.vf-card__btn-spin {
  animation: vf-spin 0.75s linear infinite;
}
</style>
