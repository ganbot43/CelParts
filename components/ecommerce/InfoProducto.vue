<template>
  <div class="info-producto">
    <!-- Categoría + Título -->
    <div class="info-encabezado">
      <p v-if="producto?.category" class="info-categoria">
        {{ producto.category.name }}
      </p>
      <h1 class="info-titulo">{{ producto?.name }}</h1>
    </div>

    <!-- Descripción -->
    <p v-if="producto?.description" class="info-descripcion">
      {{ producto.description }}
    </p>

    <!-- Precio + Stock -->
    <div class="info-precio-contenedor">
      <div class="info-precio-bloque">
        <span class="info-etiqueta">Precio</span>
        <p class="info-precio">{{ formatPrice.format(producto?.price) }}</p>
      </div>
      <div class="info-divider-vertical" />
      <div class="info-stock-bloque">
        <span class="info-etiqueta">Disponibilidad</span>
        <div
          class="info-stock-badge"
          :class="(producto?.stock ?? 0) > 0 ? 'en-stock' : 'sin-stock'"
        >
          <span class="info-stock-dot" />
          {{ (producto?.stock ?? 0) > 0 ? "En stock" : "Agotado" }}
        </div>
      </div>
    </div>

    <!-- Cantidad + CTAs -->
    <div class="info-controles">
      <div class="info-cantidad-wrap">
        <span class="info-etiqueta">Cantidad</span>
        <div class="info-cantidad-botonera">
          <button
            class="info-cantidad-boton"
            @click="cantidad--"
            :disabled="cantidad <= 1"
            aria-label="Reducir cantidad"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              width="14"
              height="14"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5 12h14"
              />
            </svg>
          </button>
          <input
            v-model.number="cantidad"
            type="number"
            class="info-cantidad-entrada"
            min="1"
            max="999"
          />
          <button
            class="info-cantidad-boton"
            @click="cantidad++"
            aria-label="Aumentar cantidad"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              width="14"
              height="14"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Botones acción -->
      <div class="info-botones">
        <!-- Agregar al carrito -->
        <button
          class="info-boton-agregar"
          @click="manejarAgregar"
          :disabled="estoyAgregando"
        >
          <svg
            v-if="!estoyAgregando"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="info-boton-icono"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
          <svg
            v-else
            class="info-boton-spinner"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          {{ estoyAgregando ? "Agregando..." : "Agregar al carrito" }}
        </button>

        <!-- WhatsApp -->

        <a
          :href="waLink(`Hola, me interesa el producto: ${producto?.name}`)"
          target="_blank"
          rel="noopener noreferrer"
          class="info-boton-wa"
          :title="`Consultar por ${producto?.name}`"
        >
          <svg class="info-boton-icono" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"
            />
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  producto: any;
  estoyAgregando?: boolean;
}>();

const emit = defineEmits<{
  agregarAlCarrito: [cantidad: number];
}>();

const formatPrice = useFormatPrice();
const { waLink } = useKite();
const cantidad = ref(1);

async function manejarAgregar() {
  emit("agregarAlCarrito", cantidad.value);
  cantidad.value = 1;
}
</script>

<style scoped>
/* ─── Variables ────────────────────────────────────────────── */
.info-producto {
  --primary: #2D6A4F;
  --primary-dark: #1E4D38;
  --primary-glow: rgba(45, 106, 79, 0.22);
  --primary-line: rgba(45, 106, 79, 0.2);
  --accent: #E9C46A;
  --radius: 14px;
  --radius-sm: 8px;
  --border: #e5e5e5;
  --bg: #ffffff;
  --bg2: #f5f5f5;
  --text: #2b2b2b;
  --text2: #777777;
  --green: #059669;
  --wa: #25d366;
  --wa-dark: #128c4a;
  --wa-glow: rgba(37, 211, 102, 0.22);
  --transition: 0.18s ease;
}

.info-produto {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-produto {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-produto {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-produto {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-produto {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-produto {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-produto {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-produto {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-produto {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ─── Layout ── */
.info-producto {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ─── Encabezado ── */
.info-encabezado {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-categoria {
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fff;
  background: rgba(45, 106, 79, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 3px 9px;
  border-radius: 999px;
  width: fit-content;
  backdrop-filter: blur(6px);
}

.info-titulo {
  font-size: clamp(22px, 4vw, 30px);
  font-weight: 700;
  color: var(--text);
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

/* ─── Descripción ── */
.info-descripcion {
  margin: 0;
  font-size: 14px;
  color: #555555;
  line-height: 1.7;
  padding: 14px 16px;
  background: var(--bg2);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
}

/* ─── Precio + stock ── */
.info-precio-contenedor {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.info-precio-bloque,
.info-stock-bloque {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-divider-vertical {
  width: 1px;
  height: 40px;
  background: #d9d9d9;
  flex-shrink: 0;
}

.info-etiqueta {
  display: block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--text2);
}

.info-precio {
  font-size: 26px;
  font-weight: 800;
  color: var(--primary);
  margin: 0;
  letter-spacing: -0.03em;
  line-height: 1;
}

/* ─── Stock badge ── */
.info-stock-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  width: fit-content;
}

.info-stock-badge.en-stock {
  background: #f0fdf4;
  color: #15803d;
}

.info-stock-badge.sin-stock {
  background: #fef2f2;
  color: #dc2626;
}

.info-stock-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.en-stock .info-stock-dot {
  background: #16a34a;
}
.sin-stock .info-stock-dot {
  background: #dc2626;
}

/* ─── Controles ── */
.info-controles {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-cantidad-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-cantidad-botonera {
  display: flex;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--bg);
  width: fit-content;
}

.info-cantidad-boton {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: var(--text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--transition);
  flex-shrink: 0;
}

.info-cantidad-boton:hover:not(:disabled) {
  background: #ffffff;
  color: var(--primary);
}

.info-cantidad-boton:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.info-cantidad-entrada {
  width: 56px;
  height: 40px;
  border: none;
  border-left: 1px solid var(--border);
  border-right: 1px solid var(--border);
  background: transparent;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  color: var(--text);
  outline: none;
}

.info-cantidad-entrada::-webkit-outer-spin-button,
.info-cantidad-entrada::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.info-cantidad-entrada[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}

/* ─── Botones acción ── */
.info-botones {
  display: flex;
  gap: 0.5rem;
}

/* ─── Botón agregar ── */
.info-boton-agregar {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  background: var(--primary);
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  box-shadow: 0 2px 12px var(--primary-glow);
  transition:
    background var(--transition),
    transform 0.18s ease,
    box-shadow var(--transition);
  position: relative;
  overflow: hidden;
}

.info-boton-agregar::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.12);
  opacity: 0;
  transition: opacity 0.2s ease;
}
.info-boton-agregar:hover:not(:disabled)::before {
  opacity: 1;
}

.info-boton-agregar:hover:not(:disabled) {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(45, 106, 79, 0.38);
}

.info-boton-agregar:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: none;
}

.info-boton-agregar:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* ─── Botón WhatsApp ── */
.info-boton-wa {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 0.75rem;
  background: #25d366;
  color: #fff;
  border-radius: var(--radius-sm);
  text-decoration: none;
  box-shadow: 0 2px 12px rgba(37, 211, 102, 0.22);
  transition:
    background var(--transition),
    transform 0.18s ease,
    box-shadow var(--transition);
}

.info-boton-wa:hover {
  background: #128c4a;
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(37, 211, 102, 0.38);
}

.info-boton-wa:active {
  transform: translateY(0);
}

/* ─── Íconos ── */
.info-boton-icono {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.info-boton-spinner {
  width: 15px;
  height: 15px;
  animation: spin 0.75s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ─── Responsive ── */
@media (max-width: 600px) {
  .info-producto {
    gap: 16px;
  }
  .info-precio-contenedor {
    gap: 14px;
    padding: 14px;
  }
  .info-precio {
    font-size: 22px;
  }
}

@media (max-width: 380px) {
  .info-precio {
    font-size: 20px;
  }
}
</style>
