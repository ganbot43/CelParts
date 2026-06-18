<template>
  <div class="catalog-page">
    <div class="catalog-body">
      <!-- Mobile filter toggle -->
      <button
        class="mobile-filter-toggle lg:hidden"
        @click="sidebarOpen = !sidebarOpen"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.8"
          stroke="currentColor"
          width="15"
          height="15"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
          />
        </svg>
        Filtros
        <span v-if="activeFilterCount" class="filter-badge">{{
          activeFilterCount
        }}</span>
      </button>

      <div class="catalog-layout">
        <!-- ── SIDEBAR ── -->
        <aside class="sidebar" :class="{ 'sidebar-open': sidebarOpen }">
          <div class="sidebar-inner">
            <!-- Mobile header -->
            <div class="sidebar-mobile-header lg:hidden">
              <div class="sidebar-mobile-title-row">
                <span class="sidebar-mobile-title">Filtros</span>
                <span v-if="activeFilterCount" class="sidebar-mobile-badge"
                  >{{ activeFilterCount }} activos</span
                >
              </div>
              <button
                @click="sidebarOpen = false"
                class="sidebar-close-btn"
                aria-label="Cerrar filtros"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2.2"
                  stroke="currentColor"
                  width="14"
                  height="14"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- ─ Búsqueda ─ -->
            <div class="filter-section">
              <button
                class="filter-section__header"
                @click="toggleSection('search')"
              >
                <span class="filter-section__title-row">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    width="13"
                    height="13"
                    class="filter-section__icon"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                  Búsqueda
                  <span v-if="filters.q" class="section-active-dot" />
                </span>
                <svg
                  class="collapse-chevron"
                  :class="{ 'collapse-chevron--open': openSections.search }"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2.2"
                  stroke="currentColor"
                  width="13"
                  height="13"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
              <Transition name="section">
                <div v-show="openSections.search" class="filter-section__body">
                  <form class="search-row" @submit.prevent="applySearch">
                    <UInput
                      v-model="searchDraft"
                      placeholder="Buscar productos..."
                      class="search-input w-full"
                    />
                    <button
                      type="submit"
                      class="search-btn"
                      aria-label="Buscar"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2.2"
                        stroke="currentColor"
                        width="14"
                        height="14"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        />
                      </svg>
                    </button>
                  </form>
                  <button
                    v-if="filters.q"
                    @click="clearSearch"
                    class="clear-field-btn"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      width="11"
                      height="11"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                    Limpiar búsqueda
                  </button>
                </div>
              </Transition>
            </div>

            <div class="filter-divider" />

            <!-- ─ Precio ─ -->
            <div class="filter-section">
              <button
                class="filter-section__header"
                @click="toggleSection('price')"
              >
                <span class="filter-section__title-row">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    width="13"
                    height="13"
                    class="filter-section__icon"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  Precio
                  <span
                    v-if="
                      filters.precioMin !== null || filters.precioMax !== null
                    "
                    class="section-active-dot"
                  />
                </span>
                <svg
                  class="collapse-chevron"
                  :class="{ 'collapse-chevron--open': openSections.price }"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2.2"
                  stroke="currentColor"
                  width="13"
                  height="13"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
              <Transition name="section">
                <div v-show="openSections.price" class="filter-section__body">
                  <div class="price-range-grid">
                    <div class="price-field">
                      <label class="price-field__label">Mínimo</label>
                      <div class="price-field__input-wrap">
                        <span class="price-field__prefix">S/</span>
                        <UInput
                          v-model.number="filters.precioMin"
                          type="number"
                          placeholder="0"
                          min="0"
                          @update:model-value="onFilterChange(filters)"
                          class="price-input w-full"
                        />
                      </div>
                    </div>
                    <div class="price-range-sep">—</div>
                    <div class="price-field">
                      <label class="price-field__label">Máximo</label>
                      <div class="price-field__input-wrap">
                        <span class="price-field__prefix">S/</span>
                        <UInput
                          v-model.number="filters.precioMax"
                          type="number"
                          placeholder="999"
                          min="0"
                          @update:model-value="onFilterChange(filters)"
                          class="price-input w-full"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    v-if="
                      filters.precioMin !== null || filters.precioMax !== null
                    "
                    @click="
                      () => {
                        filters.precioMin = null;
                        filters.precioMax = null;
                        onFilterChange(filters);
                      }
                    "
                    class="clear-field-btn"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      width="11"
                      height="11"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                    Limpiar precio
                  </button>
                </div>
              </Transition>
            </div>

            <div class="filter-divider" />

            <!-- ─ Ordenamiento ─ -->
            <div class="filter-section">
              <button
                class="filter-section__header"
                @click="toggleSection('sort')"
              >
                <span class="filter-section__title-row">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    width="13"
                    height="13"
                    class="filter-section__icon"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                    />
                  </svg>
                  Ordenar
                  <span v-if="filters.sort" class="section-active-dot" />
                </span>
                <svg
                  class="collapse-chevron"
                  :class="{ 'collapse-chevron--open': openSections.sort }"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2.2"
                  stroke="currentColor"
                  width="13"
                  height="13"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
              <Transition name="section">
                <div v-show="openSections.sort" class="filter-section__body">
                  <div class="sort-options">
                    <button
                      v-for="opt in sortOptions"
                      :key="opt.value"
                      @click="
                        () => {
                          filters.sort = opt.value;
                          onFilterChange(filters);
                        }
                      "
                      :class="[
                        'sort-option',
                        filters.sort === opt.value && 'sort-option--active',
                      ]"
                    >
                      <span class="sort-option__radio">
                        <span
                          v-if="filters.sort === opt.value"
                          class="sort-option__radio-dot"
                        />
                      </span>
                      <span class="sort-option__icon" aria-hidden="true">{{
                        opt.icon
                      }}</span>
                      <span class="sort-option__label">{{ opt.label }}</span>
                    </button>
                  </div>
                </div>
              </Transition>
            </div>

            <div class="filter-divider" />

            <!-- ─ Categorías ─ -->
            <div class="filter-section">
              <button
                class="filter-section__header"
                @click="toggleSection('cats')"
              >
                <span class="filter-section__title-row">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    width="13"
                    height="13"
                    class="filter-section__icon"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                    />
                  </svg>
                  Categorías
                  <span
                    v-if="
                      filters.categoria ||
                      filters.subcategoria ||
                      filters.nuevoLanzamiento
                    "
                    class="section-active-dot"
                  />
                </span>
                <svg
                  class="collapse-chevron"
                  :class="{ 'collapse-chevron--open': openSections.cats }"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2.2"
                  stroke="currentColor"
                  width="13"
                  height="13"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
              <Transition name="section">
                <div v-show="openSections.cats" class="filter-section__body">
                  <ul class="category-list">
                    <li>
                      <button
                        @click="toggleNuevoLanzamiento()"
                        :class="[
                          'category-btn',
                          filters.nuevoLanzamiento && 'category-btn--active',
                        ]"
                      >
                        <span
                          class="cat-pip"
                          :class="{
                            'cat-pip--active': filters.nuevoLanzamiento,
                          }"
                        />
                        <span class="cat-btn-label">Nuevo lanzamiento</span>
                      </button>
                    </li>
                    <li>
                      <button
                        @click="selectCategory(null)"
                        :class="[
                          'category-btn',
                          !filters.categoria &&
                            !filters.subcategoria &&
                            !filters.nuevoLanzamiento &&
                            'category-btn--active',
                        ]"
                      >
                        <span
                          class="cat-pip"
                          :class="{
                            'cat-pip--active':
                              !filters.categoria &&
                              !filters.subcategoria &&
                              !filters.nuevoLanzamiento,
                          }"
                        />
                        <span class="cat-btn-label">Todos los productos</span>
                      </button>
                    </li>
                    <li v-for="cat in categories?.data ?? []" :key="cat.slug">
                      <button
                        @click="selectCategory(cat.slug)"
                        :class="[
                          'category-btn',
                          filters.categoria === cat.slug &&
                            !filters.nuevoLanzamiento &&
                            'category-btn--active',
                        ]"
                      >
                        <span
                          class="cat-pip"
                          :class="{
                            'cat-pip--active':
                              filters.categoria === cat.slug &&
                              !filters.nuevoLanzamiento,
                          }"
                        />
                        <span class="cat-btn-label">{{ cat.name }}</span>
                        <!-- <span v-if="cat.productCount" class="cat-count-pill">{{
                          cat.productCount
                        }}</span> -->
                      </button>
                      <Transition name="subcats">
                        <ul
                          v-if="
                            filters.categoria === cat.slug &&
                            cat.subcategories?.length
                          "
                          class="subcategory-list"
                        >
                          <li v-for="sub in cat.subcategories" :key="sub.slug">
                            <button
                              @click="selectSubcategory(sub.slug)"
                              :class="[
                                'subcategory-btn',
                                filters.subcategoria === sub.slug &&
                                  'subcategory-btn--active',
                              ]"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="2.5"
                                stroke="currentColor"
                                width="10"
                                height="10"
                                class="shrink-0"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                                />
                              </svg>
                              {{ sub.name }}
                            </button>
                          </li>
                        </ul>
                      </Transition>
                    </li>
                  </ul>
                </div>
              </Transition>
            </div>

            <!-- Reset global -->
            <Transition name="fade">
              <button
                v-if="activeFilterCount"
                @click="resetFilters"
                class="reset-btn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  width="13"
                  height="13"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                Limpiar todos los filtros
                <span class="reset-btn__badge">{{ activeFilterCount }}</span>
              </button>
            </Transition>
          </div>
        </aside>

        <!-- Overlay mobile -->
        <div
          v-if="sidebarOpen"
          class="sidebar-overlay lg:hidden"
          @click="sidebarOpen = false"
        />

        <!-- ── MAIN ── -->
        <main class="products-main">
          <!-- Toolbar -->
          <div class="toolbar">
            <div class="results-info">
              <template v-if="!pending">
                <span class="count-num">{{ products?.data?.length ?? 0 }}</span>
                <span class="count-label">productos encontrados</span>
              </template>
              <span v-else class="count-searching">
                <span class="dot" /><span class="dot" /><span class="dot" />
                Buscando...
              </span>
            </div>
            <div class="toolbar-right">
              <div v-if="activeFilterCount && filters.q" class="filter-chips">
                <span class="chip">
                  "{{ filters.q }}"
                  <button
                    @click="clearSearch"
                    class="chip-remove"
                    aria-label="Quitar filtro"
                  >
                    ×
                  </button>
                </span>
              </div>
              <!-- Sort quick access desktop -->
              <div class="toolbar-sort">
                <select
                  v-model="filters.sort"
                  @change="onFilterChange(filters)"
                  class="toolbar-select"
                  aria-label="Ordenar por"
                >
                  <option
                    v-for="opt in sortOptions"
                    :key="opt.value"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Grid -->
          <div class="products-grid">
            <template v-if="pending">
              <div v-for="i in 8" :key="`sk-${i}`" class="product-skeleton" />
            </template>
            <template v-else>
              <EcommerceTarjetaProducto
                v-for="product in products?.data ?? []"
                :key="product.id"
                :product="product"
                :mostrar-boton="true"
                @agregar-al-carrito="manejarAgregarAlCarrito"
              />
            </template>

            <!-- Empty state -->
            <div
              v-if="!pending && (products?.data?.length ?? 0) === 0"
              class="empty-state"
            >
              <div class="empty-icon-wrap">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.2"
                  stroke="currentColor"
                  width="36"
                  height="36"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </div>
              <p class="empty-title">Sin resultados</p>
              <p class="empty-sub">
                Prueba con otros filtros o términos de búsqueda
              </p>
              <button @click="resetFilters" class="btn-primary">
                Limpiar filtros
              </button>
            </div>
          </div>

          <!-- Load more -->
          <div
            v-if="(products?.data?.length ?? 0) >= filters.limit"
            class="load-more-wrap"
          >
            <button
              @click="filters.page++"
              :disabled="pending"
              class="btn-load-more"
            >
              <svg
                v-if="!pending"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                width="15"
                height="15"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                />
              </svg>
              {{ pending ? "Cargando..." : "Cargar más productos" }}
            </button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "landing" });

useSeoMeta({
  title: "Catálogo — Joymar Utensilios",
  description: "Explora toda nuestra gama de productos de cocina y hogar.",
});

const route = useRoute();
const sidebarOpen = ref(false);
const searchDraft = ref("");

const sortOptions = [
  { value: "", label: "Recomendado", icon: "⭐" },
  { value: "precio-asc", label: "Precio: menor a mayor", icon: "↑" },
  { value: "precio-desc", label: "Precio: mayor a menor", icon: "↓" },
  { value: "nombre-asc", label: "Nombre: A → Z", icon: "A" },
  { value: "nombre-desc", label: "Nombre: Z → A", icon: "Z" },
];

const openSections = reactive({
  search: false,
  price: false,
  sort: false,
  cats: false,
});

function syncOpenSectionsFromFilters() {
  openSections.search = Boolean(filters.q);
  openSections.price = filters.precioMin !== null || filters.precioMax !== null;
  openSections.sort = Boolean(filters.sort);
  openSections.cats =
    Boolean(filters.categoria) ||
    Boolean(filters.subcategoria) ||
    filters.nuevoLanzamiento;
}

function toggleSection(key: keyof typeof openSections) {
  openSections[key] = !openSections[key];
}

type CatalogProduct = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category?: { name: string } | null;
  subcategory?: { name: string } | null;
  images?: Array<{ id: number; url: string; isPrimary: boolean }>;
  isFeatured: boolean;
};

const { data: categories } = await useFetch("/api/categories", {
  query: { active: true },
  server: false,
  lazy: true,
});

const toNumberOrNull = (v: any) => {
  if (v == null) return null;
  const val = Array.isArray(v) ? v[0] : v;
  const n = Number(val);
  return Number.isNaN(n) ? null : n;
};

const readQueryValue = (value: unknown) =>
  Array.isArray(value) ? value[0] : value;

const toQueryStringOrNull = (value: unknown) => {
  const normalized = readQueryValue(value);
  if (normalized == null) return null;
  const stringValue = String(normalized).trim();
  return stringValue ? stringValue : null;
};

const filters = reactive({
  categoria: toQueryStringOrNull(route.query.categoria) as string | null,
  subcategoria: toQueryStringOrNull(route.query.subcategoria) as string | null,
  nuevoLanzamiento:
    String(readQueryValue(route.query.nuevoLanzamiento) ?? '') === '1' ||
    String(readQueryValue(route.query.nuevoLanzamiento) ?? '') === 'true',
  q: (readQueryValue(route.query.q) ?? "") as string,
  precioMin: toNumberOrNull(route.query.precioMin),
  precioMax: toNumberOrNull(route.query.precioMax),
  sort: (readQueryValue(route.query.sort) ?? "") as string,
  page: (() => {
    const p = readQueryValue(route.query.page);
    const n = Number(p);
    return Number.isNaN(n) ? 1 : n;
  })(),
  limit: (() => {
    const l = readQueryValue(route.query.limit);
    const n = Number(l);
    return Number.isNaN(n) ? 24 : n;
  })(),
});

const syncFiltersFromRoute = () => {
  filters.categoria = toQueryStringOrNull(route.query.categoria) as string | null;
  filters.subcategoria = toQueryStringOrNull(route.query.subcategoria) as string | null;
  filters.nuevoLanzamiento =
    String(readQueryValue(route.query.nuevoLanzamiento) ?? '') === '1' ||
    String(readQueryValue(route.query.nuevoLanzamiento) ?? '') === 'true';
  filters.q = (readQueryValue(route.query.q) ?? "") as string;
  filters.precioMin = toNumberOrNull(route.query.precioMin);
  filters.precioMax = toNumberOrNull(route.query.precioMax);
  filters.sort = (readQueryValue(route.query.sort) ?? "") as string;
  searchDraft.value = filters.q;
  const routePage = Number(readQueryValue(route.query.page));
  filters.page = Number.isNaN(routePage) ? 1 : routePage;
  const routeLimit = Number(readQueryValue(route.query.limit));
  filters.limit = Number.isNaN(routeLimit) ? 24 : routeLimit;
  syncOpenSectionsFromFilters();
};

watch(
  () => route.query,
  () => {
    syncFiltersFromRoute();
  },
  { deep: true },
);

syncFiltersFromRoute();

const activeFilterCount = computed(() => {
  let count = 0;
  if (filters.categoria) count++;
  if (filters.subcategoria) count++;
  if (filters.nuevoLanzamiento) count++;
  if (filters.q) count++;
  if (filters.precioMin !== null) count++;
  if (filters.precioMax !== null) count++;
  if (filters.sort) count++;
  return count;
});

const queryParams = computed(() => {
  const q: Record<string, any> = {}
  if (filters.categoria != null) q.categoria = String(filters.categoria)
  if (filters.subcategoria != null) q.subcategoria = String(filters.subcategoria)
  if (filters.nuevoLanzamiento) q.nuevoLanzamiento = '1'
  if (filters.q) q.q = filters.q
  if (filters.precioMin != null) q.precioMin = String(filters.precioMin)
  if (filters.precioMax != null) q.precioMax = String(filters.precioMax)
  if (filters.sort) q.sort = filters.sort
  if (filters.page != null) q.page = String(filters.page)
  if (filters.limit != null) q.limit = String(filters.limit)
  return q
})

const { data: products, pending } = await useFetch<{
  data: CatalogProduct[];
  page: number;
  limit: number;
  total: number;
}>("/api/products", {
  query: queryParams,
  watch: [queryParams],
});

const cartStore = useCartStore();
const toast = useAppToast();
const addingIds = ref(new Set<number>());

async function manejarAgregarAlCarrito(producto: any) {
  addingIds.value.add(producto.id);
  cartStore.add({
    id: producto.id,
    name: producto.name,
    price: producto.price,
    quantity: 1,
    image: producto.images?.length
      ? (producto.images.find((i: any) => i.isPrimary)?.url ??
        producto.images[0].url)
      : null,
  });
  toast.add({
    title: "Agregado al carrito",
    description: producto.name,
    color: "success",
  });
  await new Promise((r) => setTimeout(r, 450));
  addingIds.value.delete(producto.id);
}

function selectCategory(slug: string | null) {
  filters.categoria = slug;
  filters.subcategoria = null;
  filters.nuevoLanzamiento = false;
  openSections.cats = true;
  onFilterChange(filters);
}

function toggleNuevoLanzamiento() {
  filters.nuevoLanzamiento = !filters.nuevoLanzamiento;
  if (filters.nuevoLanzamiento) {
    filters.categoria = null;
    filters.subcategoria = null;
  }
  openSections.cats = true;
  onFilterChange(filters);
}

function selectSubcategory(slug: string) {
  filters.subcategoria = slug;
  filters.nuevoLanzamiento = false;
  openSections.cats = true;
  onFilterChange(filters);
}

function resetFilters() {
  filters.categoria = null;
  filters.subcategoria = null;
  filters.q = "";
  filters.precioMin = null;
  filters.precioMax = null;
  filters.sort = "";
  filters.nuevoLanzamiento = false;
  searchDraft.value = "";
  onFilterChange(filters);
}

function onFilterChange(f: any) {
  Object.assign(filters, f);
  filters.page = 1;
  const q: Record<string, any> = {
    ...(filters.categoria != null
      ? { categoria: String(filters.categoria) }
      : {}),
    ...(filters.subcategoria != null
      ? { subcategoria: String(filters.subcategoria) }
      : {}),
    ...(filters.nuevoLanzamiento ? { nuevoLanzamiento: "1" } : {}),
    ...(filters.q ? { q: String(filters.q) } : {}),
    ...(filters.precioMin != null
      ? { precioMin: String(filters.precioMin) }
      : {}),
    ...(filters.precioMax != null
      ? { precioMax: String(filters.precioMax) }
      : {}),
    ...(filters.sort ? { sort: String(filters.sort) } : {}),
    page: String(filters.page),
    limit: String(filters.limit),
  };
  navigateTo({ path: "/productos", query: q, replace: true });
}

function applySearch() {
  filters.q = searchDraft.value.trim();
  openSections.search = true;
  onFilterChange(filters);
}

function clearSearch() {
  searchDraft.value = "";
  filters.q = "";
  openSections.search = false;
  onFilterChange(filters);
}
</script>

<style scoped>
/* ═══════════════════════════════════
   TOKENS
═══════════════════════════════════ */
.catalog-page {

  min-height: 100vh;
  background: var(--bg-page);
}

/* ─── Body ──────────────────────────────────────────────── */
.catalog-body {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.75rem 1.25rem 5rem;
}

/* ─── Mobile filter toggle ──────────────────────────────── */
.mobile-filter-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.55rem 1.1rem;
  background: var(--bg-surface);
  border: 1.5px solid var(--border-mid);
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-body);
  cursor: pointer;
  letter-spacing: 0.02em;
  transition:
    border-color 0.15s,
    color 0.15s,
    background 0.15s;
}
.mobile-filter-toggle:hover {
  border-color: var(--cp-electric);
  color: var(--cp-electric);
  background: rgba(0, 174, 239, 0.08);
}
.filter-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: var(--cp-electric);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 800;
  border-radius: 999px;
}

/* ─── Layout ────────────────────────────────────────────── */
.catalog-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
@media (min-width: 1024px) {
  .catalog-layout {
    grid-template-columns: 276px 1fr;
  }
}

/* ─── Sidebar ───────────────────────────────────────────── */
.sidebar {
  display: none;
}
@media (min-width: 1024px) {
  .sidebar {
    display: block;
  }
}

@media (max-width: 1023px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 300px;
    height: 100vh;
    z-index: 50;
    transform: translateX(-100%);
    transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    display: block;
  }
  .sidebar.sidebar-open {
    transform: translateX(0);
  }
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 40;
  backdrop-filter: blur(2px);
}

.sidebar-inner {
  background: var(--bg-surface);
  border-radius: 18px;
  border: 1px solid var(--border-light);
  padding: 0;
  position: sticky;
  top: 1.5rem;
  overflow: hidden;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 8px 24px rgba(17, 17, 17, 0.04), inset 0 1px 0 rgba(255,255,255,0.4);
}
@media (max-width: 1023px) {
  .sidebar-inner {
    border-radius: 0;
    height: 100%;
    overflow-y: auto;
    position: static;
  }
}

/* ─── Sidebar mobile header ─────────────────────────────── */
.sidebar-mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.1rem;
  border-bottom: 1px solid var(--border-light);
  background: var(--bg-alt);
}
.sidebar-mobile-title-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.sidebar-mobile-title {
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: 0.01em;
}
.sidebar-mobile-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 999px;
  background: rgba(0, 174, 239, 0.08);
  border: 1px solid rgba(0, 174, 239, 0.22);
  color: var(--cp-electric);
  letter-spacing: 0.04em;
}
.sidebar-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.15s;
}
.sidebar-close-btn:hover {
  background: rgba(0, 174, 239, 0.08);
  border-color: rgba(0, 174, 239, 0.22);
  color: var(--cp-electric);
}

/* ═══════════════════════════════════
   FILTER SECTIONS — COLLAPSIBLE
═══════════════════════════════════ */
.filter-section {
  border-bottom: none;
}

.filter-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.85rem 1.1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.13s;
  gap: 0.5rem;
}
.filter-section__header:hover {
  background: rgba(45, 106, 79, 0.04);
}

.filter-section__title-row {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-body);
}
.filter-section__icon {
  color: var(--cp-electric);
  flex-shrink: 0;
}

.section-active-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--cp-electric);
  flex-shrink: 0;
  box-shadow: 0 0 0 2px rgba(45, 106, 79, 0.2);
}

.collapse-chevron {
  color: var(--text-muted);
  flex-shrink: 0;
  transition:
    transform 0.22s ease,
    color 0.15s;
}
.collapse-chevron--open {
  transform: rotate(180deg);
  color: var(--cp-electric);
}

.filter-section__body {
  padding: 0 1.1rem 1rem;
}

/* Transition for sections */
.section-enter-active,
.section-leave-active {
  transition:
    opacity 0.2s ease,
    max-height 0.22s ease,
    padding 0.22s ease;
  overflow: hidden;
}
.section-enter-from,
.section-leave-to {
  opacity: 0;
  max-height: 0;
  padding-bottom: 0;
}
.section-enter-to,
.section-leave-from {
  opacity: 1;
  max-height: 500px;
}

.filter-divider {
  height: 1px;
  background: var(--border-light);
  margin: 0;
}

/* ─── Search field ──────────────────────────────────────── */
.search-row {
  display: flex;
  align-items: stretch;
  gap: 0.4rem;
}
.search-btn {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  border: none;
  background: var(--cp-electric);
  color: #fff;
  cursor: pointer;
  transition:
    background 0.15s,
    transform 0.13s;
}
.search-btn:hover {
  background: var(--cp-blue);
  transform: translateY(-1px);
}
.search-input :deep(input) {
  background: var(--bg-alt) !important;
  border-color: var(--border-light) !important;
  color: var(--text-primary) !important;
  font-size: 0.85rem !important;
  border-radius: 7px !important;
  height: 36px !important;
}
.search-input :deep(input:focus) {
  border-color: var(--cp-electric) !important;
  box-shadow: 0 0 0 3px rgba(45, 106, 79, 0.09) !important;
  background: var(--bg-surface) !important;
}
.search-input :deep(input::placeholder) {
  color: var(--text-muted) !important;
}

.clear-field-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.13s;
}
.clear-field-btn:hover {
  color: var(--cp-electric);
}

/* ─── Price range ───────────────────────────────────────── */
.price-range-grid {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
}
.price-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-width: 0;
}
.price-field__label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.price-field__input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.price-field__prefix {
  position: absolute;
  left: 9px;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--cp-electric);
  pointer-events: none;
  z-index: 1;
  line-height: 1;
}
.price-input :deep(input) {
  background: var(--bg-alt) !important;
  border-color: var(--border-light) !important;
  color: var(--text-primary) !important;
  font-size: 0.85rem !important;
  border-radius: 7px !important;
  height: 36px !important;
  padding-left: 24px !important;
}
.price-input :deep(input:focus) {
  border-color: var(--cp-electric) !important;
  box-shadow: 0 0 0 3px rgba(45, 106, 79, 0.09) !important;
  background: var(--bg-surface) !important;
}
.price-input :deep(input::placeholder) {
  color: var(--text-muted) !important;
}
.price-range-sep {
  font-size: 0.8rem;
  color: var(--border-mid);
  font-weight: 600;
  padding-bottom: 0.5rem;
  flex-shrink: 0;
}

/* ─── Sort options ──────────────────────────────────────── */
.sort-options {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.sort-option {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.55rem 0.7rem;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition:
    background 0.13s,
    border-color 0.13s;
}
.sort-option:hover {
  background: rgba(0, 174, 239, 0.08);
  border-color: rgba(0, 174, 239, 0.22);
}
.sort-option--active {
  background: rgba(0, 174, 239, 0.08);
  border-color: rgba(0, 174, 239, 0.34);
}
.sort-option__radio {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 1.5px solid var(--border-mid);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.13s;
}
.sort-option--active .sort-option__radio {
  border-color: var(--cp-electric);
}
.sort-option__radio-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--cp-electric);
}
.sort-option__icon {
  font-size: 0.7rem;
  font-weight: 800;
  width: 18px;
  text-align: center;
  color: var(--text-muted);
  flex-shrink: 0;
}
.sort-option--active .sort-option__icon {
  color: var(--cp-electric);
}
.sort-option__label {
  font-size: 0.84rem;
  font-weight: 500;
  color: var(--text-body);
  transition: color 0.13s;
}
.sort-option:hover .sort-option__label,
.sort-option--active .sort-option__label {
  color: var(--cp-electric);
  font-weight: 600;
}

/* ─── Categories ────────────────────────────────────────── */
.category-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.category-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  text-align: left;
  padding: 0.52rem 0.65rem;
  border-radius: 8px;
  cursor: pointer;
  background: transparent;
  border: 1px solid transparent;
  transition:
    background 0.13s,
    border-color 0.13s;
}
.category-btn:hover {
  background: rgba(0, 174, 239, 0.08);
  border-color: rgba(0, 174, 239, 0.22);
}
.category-btn--active {
  background: rgba(0, 174, 239, 0.08);
  border-color: rgba(0, 174, 239, 0.34);
}
.cat-pip {
  width: 3px;
  height: 16px;
  border-radius: 2px;
  background: var(--border-mid);
  flex-shrink: 0;
  transition: background 0.13s;
}
.cat-pip--active {
  background: var(--cp-electric);
}
.cat-btn-label {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-body);
  transition: color 0.13s;
  line-height: 1.3;
}
.category-btn:hover .cat-btn-label,
.category-btn--active .cat-btn-label {
  color: var(--cp-electric);
  font-weight: 600;
}
.cat-count-pill {
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--text-muted);
  background: var(--bg-alt);
  border: 1px solid var(--border-light);
  padding: 1px 6px;
  border-radius: 999px;
  flex-shrink: 0;
  transition: all 0.13s;
}
.category-btn--active .cat-count-pill {
  background: rgba(0, 174, 239, 0.08);
  border-color: rgba(0, 174, 239, 0.22);
  color: var(--cp-electric);
}

/* ─── Subcategories ─────────────────────────────────────── */
.subcategory-list {
  list-style: none;
  margin: 0.15rem 0 0.25rem 1.1rem;
  padding: 0 0 0 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 1px;
  border-left: 2px solid rgba(0, 174, 239, 0.22);
}
.subcategory-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  width: 100%;
  text-align: left;
  padding: 0.38rem 0.5rem;
  border-radius: 6px;
  font-size: 0.815rem;
  font-weight: 500;
  color: var(--text-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  transition:
    color 0.13s,
    background 0.13s;
}
.subcategory-btn:hover {
  color: var(--cp-electric);
  background: rgba(0, 174, 239, 0.08);
}
.subcategory-btn--active {
  color: var(--cp-electric);
  font-weight: 700;
}
.subcats-enter-active,
.subcats-leave-active {
  transition:
    opacity 0.18s ease,
    max-height 0.2s ease;
  overflow: hidden;
}
.subcats-enter-from,
.subcats-leave-to {
  opacity: 0;
  max-height: 0;
}
.subcats-enter-to,
.subcats-leave-from {
  opacity: 1;
  max-height: 400px;
}

/* ─── Reset button ──────────────────────────────────────── */
.reset-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  margin: 0.75rem 1.1rem 1.1rem;
  padding: 0.6rem 0.75rem;
  width: calc(100% - 2.2rem);
  border: 1.5px solid rgba(0, 174, 239, 0.34);
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--cp-electric);
  cursor: pointer;
  background: rgba(0, 174, 239, 0.08);
  transition: all 0.15s;
  letter-spacing: 0.01em;
}
.reset-btn:hover {
  background: rgba(0, 174, 239, 0.14);
  border-color: var(--cp-electric);
}
.reset-btn__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: var(--cp-electric);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 800;
}

/* fade for reset button */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ─── Toolbar ───────────────────────────────────────────── */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding: 0.75rem 1rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  background: var(--bg-surface);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 8px 24px rgba(17, 17, 17, 0.04), inset 0 1px 0 rgba(255,255,255,0.4);
}
.results-info {
  display: flex;
  align-items: baseline;
  gap: 0.45rem;
}
.count-num {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--cp-electric);
  line-height: 1;
}
.count-label {
  font-size: 0.875rem;
  color: var(--text-muted);
  font-weight: 500;
}
.count-searching {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.875rem;
  color: var(--text-muted);
}
.dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--cp-electric);
  animation: blink 1.2s infinite;
}
.dot:nth-child(2) {
  animation-delay: 0.2s;
}
.dot:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes blink {
  0%,
  80%,
  100% {
    opacity: 0.2;
  }
  40% {
    opacity: 1;
  }
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
}
.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.65rem;
  background: rgba(0, 174, 239, 0.08);
  border: 1px solid rgba(0, 174, 239, 0.22);
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--cp-electric);
}
.chip-remove {
  font-size: 1rem;
  line-height: 1;
  color: var(--cp-electric);
  cursor: pointer;
  opacity: 0.65;
  background: none;
  border: none;
  padding: 0;
}
.chip-remove:hover {
  opacity: 1;
}

/* Toolbar sort select */
.toolbar-sort {
  position: relative;
}
.toolbar-select {
  appearance: none;
  padding: 0.45rem 2rem 0.45rem 0.75rem;
  background: var(--bg-alt)
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2.5' stroke='%232D6A4F' width='12' height='12'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E")
    no-repeat right 0.55rem center;
  border: 1.5px solid var(--border-light);
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-body);
  cursor: pointer;
  min-width: 160px;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
}
.toolbar-select:hover {
  border-color: rgba(0, 174, 239, 0.34);
}
.toolbar-select:focus {
  outline: none;
  border-color: var(--cp-electric);
  box-shadow: 0 0 0 3px rgba(45, 106, 79, 0.09);
}

/* ─── Products grid ─────────────────────────────────────── */
.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
@media (min-width: 540px) {
  .products-grid {
    gap: 1.1rem;
  }
}
@media (min-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (min-width: 1280px) {
  .products-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.15rem;
  }
}

/* ─── Skeleton ──────────────────────────────────────────── */
.product-skeleton {
  background: linear-gradient(100deg, rgba(255,255,255,0.72) 8%, rgba(241,239,234,0.95) 20%, rgba(255,255,255,0.72) 36%);
  background-size: 300% 100%;
  animation: shimmer 1.5s ease infinite;
  border-radius: 12px;
  aspect-ratio: 3/4;
  border: 1px solid var(--border-light);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
@keyframes shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}

/* ─── Empty state ───────────────────────────────────────── */
.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 4rem 2rem;
  background: var(--bg-surface);
  border: 1.5px dashed var(--border-mid);
  border-radius: 18px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.empty-icon-wrap {
  width: 68px;
  height: 68px;
  background: var(--bg-alt);
  border: 1.5px solid var(--border-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.1rem;
  color: var(--text-muted);
}
.empty-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.35rem;
}
.empty-sub {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 1.4rem;
  max-width: 300px;
}

/* ─── Buttons ───────────────────────────────────────────── */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.65rem 1.6rem;
  background: var(--cp-electric);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  transition:
    background 0.18s,
    transform 0.15s,
    box-shadow 0.18s;
}
.btn-primary:hover {
  background: var(--cp-blue);
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(0, 174, 239, 0.22);
}
.btn-primary:active {
  transform: translateY(0);
}

.btn-load-more {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 2rem;
  background: var(--bg-surface);
  color: var(--text-body);
  font-size: 0.875rem;
  font-weight: 600;
  border: 1.5px solid var(--border-mid);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.18s;
}
.btn-load-more:hover:not(:disabled) {
  border-color: var(--cp-electric);
  color: var(--cp-electric);
  background: rgba(0, 174, 239, 0.08);
}
.btn-load-more:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.load-more-wrap {
  margin-top: 2.5rem;
  display: flex;
  justify-content: center;
}
.products-main {
  min-width: 0;
}

/* ─── Responsive tweaks ─────────────────────────────────── */
@media (max-width: 480px) {
  .catalog-body {
    padding: 1rem 0.85rem 4rem;
  }
  .toolbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  .toolbar-sort {
    width: 100%;
  }
  .toolbar-select {
    width: 100%;
  }
  .products-grid {
    gap: 0.75rem;
  }
}
</style>
