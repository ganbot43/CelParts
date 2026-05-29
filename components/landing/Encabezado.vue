<template>
  <div class="header-shell">
    <!-- ══ LOGO BAND ══ -->
    <div class="logo-band">
      <div class="logo-band-inner">
        <!-- Texto izquierda -->
        <div class="logo-side logo-side--left">
          <span class="logo-side-text">Lima, Perú · Desde 2023</span>
        </div>

        <!-- LOGO -->
        <NuxtLink to="/" class="logo" aria-label="Joymar Utensilios — Inicio">
          <div class="logo-img-wrap">
            <img
              src="/images/logo.png"
              alt="JOYMAR UTENSILIOS"
              width="64"
              height="60"
              class="logo-img--main"
            />
            <img
              src="/images/logo_letra.png"
              alt="JOYMAR UTENSILIOS"
              class="logo-img--letra"
            />
          </div>
        </NuxtLink>

        <!-- Acciones derecha -->
        <div class="logo-side logo-side--right">
          <div
            v-if="!cartReady"
            class="cart-btn cart-btn--skeleton"
            aria-hidden="true"
          >
            <span class="cart-skeleton__icon" />
            <span class="cart-skeleton__text">
              <span class="cart-skeleton__line cart-skeleton__line--sm" />
              <span class="cart-skeleton__line cart-skeleton__line--lg" />
            </span>
          </div>

          <ClientOnly v-else>
            <button
              id="cart-toggle-btn"
              @click="cartStore.isOpen = true"
              class="cart-btn"
              aria-label="Abrir carrito"
            >
              <span class="cart-icon-wrap">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                <span
                  v-if="cartStore.itemCount > 0"
                  class="cart-badge"
                  aria-hidden="true"
                  >{{ cartStore.itemCount }}</span
                >
              </span>

              <span class="cart-info" v-if="cartStore.itemCount > 0">
                <span class="cart-label">Mi carrito</span>
                <span class="cart-amount">{{ cartTotalLabel }}</span>
              </span>
              <span class="cart-info" v-else>
                <span class="cart-label cart-label--empty">Mi carrito</span>
              </span>
            </button>
          </ClientOnly>

          <!-- Hamburger (mobile) -->
          <button
            type="button"
            class="menu-btn"
            :class="{ 'menu-btn--open': mobileMenuOpen }"
            aria-label="Abrir menú"
            :aria-expanded="mobileMenuOpen"
            @click="toggleMobileMenu"
          >
            <span class="menu-btn__line" />
            <span class="menu-btn__line" />
            <span class="menu-btn__line" />
          </button>
        </div>
      </div>
    </div>

    <!-- ══ NAV HORIZONTAL DESKTOP ══ -->
    <nav class="nav-bar" aria-label="Navegación principal">
      <div class="nav-bar-inner">
        <div class="nav-links">
          <a
            v-for="link in simpleNavLinks"
            :key="link.path"
            :href="link.path"
            :class="[
              'nav-link',
              activeSection === link.path && 'nav-link--active',
            ]"
            @click.prevent="scrollToSection(link.path)"
            >{{ link.name }}</a
          >

          <!-- Dropdown Productos -->
          <div
            class="productos-trigger"
            ref="triggerRef"
            @mouseenter="openMenuOnHover"
            @mouseleave="scheduleClose"
          >
            <button
              type="button"
              :class="[
                'nav-link',
                'nav-link--btn',
                megaOpen && 'nav-link--open',
                isProductsPage && 'nav-link--active',
              ]"
              aria-haspopup="true"
              :aria-expanded="megaOpen"
              aria-controls="mega-menu"
              @click="toggleMega"
            >
              Productos
              <svg
                class="chevron"
                :class="{ 'chevron--open': megaOpen }"
                width="9"
                height="9"
                viewBox="0 0 10 10"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 3.5L5 6.5L8 3.5"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>

            <!-- MEGAMENÚ -->
            <div
              id="mega-menu"
              ref="megaRef"
              :class="['mega-menu', megaOpen && 'mega-menu--open']"
              role="dialog"
              aria-label="Menú de productos"
              @mouseenter="cancelClose"
              @mouseleave="scheduleClose"
            >
              <div class="mega-arrow" aria-hidden="true" />

              <div class="mega-header">
                <span class="mega-header-title">Catálogo de productos</span>
                <a href="/productos" class="mega-all-link" @click="closeMega">
                  Ver todo
                  <svg
                    width="9"
                    height="9"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 10L10 2M10 2H5M10 2V7"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </a>
              </div>

              <div class="mega-body">
                <div class="mega-categories" role="list">
                  <template v-if="loadingCategories">
                    <div v-for="n in 5" :key="n" class="cat-skeleton" />
                  </template>
                  <template v-else>
                    <button
                      type="button"
                      :class="[
                        'cat-item',
                        activeCatId === null && 'cat-item--active',
                      ]"
                      role="listitem"
                      @click="goToCategory(null)"
                      @mouseenter="previewCategory(null)"
                    >
                      <span class="cat-name">Todos los productos</span>
                      <span class="cat-count">{{ totalProductCount }}</span>
                    </button>
                    <button
                      v-for="cat in categories"
                      :key="cat.id"
                      type="button"
                      :class="[
                        'cat-item',
                        activeCatId === cat.id && 'cat-item--active',
                      ]"
                      role="listitem"
                      @click="goToCategory(cat.id)"
                      @mouseenter="previewCategory(cat.id)"
                    >
                      <span class="cat-name">{{ cat.name }}</span>
                      <span class="cat-count">{{
                        subCountForCat(cat.id)
                      }}</span>
                    </button>
                  </template>
                </div>

                <div class="mega-subcategories">
                  <template v-if="loadingSubcategories">
                    <div v-for="n in 6" :key="n" class="sub-skeleton" />
                  </template>
                  <div v-else-if="filteredSubs.length === 0" class="mega-empty">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                      aria-hidden="true"
                    >
                      <path
                        d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"
                      />
                      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                    </svg>
                    <span>Sin subcategorías</span>
                  </div>
                  <a
                    v-else
                    v-for="sub in filteredSubs"
                    :key="sub.id"
                    :href="`/productos?categoria=${activeCategorySlug}&subcategoria=${sub.slug}`"
                    class="sub-item"
                    @click="closeMega"
                  >
                    <span class="sub-dot" aria-hidden="true" />
                    <span class="sub-name">{{ sub.name }}</span>
                  </a>
                </div>
              </div>

              <!-- <div class="mega-footer">
                <a
                  :href="
                    activeCatId
                      ? `/productos?categoria=${activeCatId}`
                      : '/productos'
                  "
                  class="mega-footer-btn"
                  @click="closeMega"
                >
                  {{
                    activeCatId
                      ? `Ver ${activeCategoryName}`
                      : "Ver todos los productos"
                  }}
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 10L10 2M10 2H5M10 2V7"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </a>
                <span class="mega-footer-hint">🇵🇪 Envíos a todo el Perú</span>
              </div> -->
            </div>
          </div>
          <!-- fin dropdown -->

          <a
            v-for="link in trailingNavLinks"
            :key="link.path"
            :href="link.path"
            :class="[
              'nav-link',
              activeSection === link.path && 'nav-link--active',
            ]"
            @click.prevent="scrollToSection(link.path)"
            >{{ link.name }}</a
          >
        </div>
      </div>
    </nav>

    <!-- ══ LÍNEA DECORATIVA ══ -->
    <div class="brand-line" aria-hidden="true" />

    <!-- ══ NAV MOBILE (drawer) ══ -->
    <nav
      id="mobile-nav"
      class="mobile-nav"
      :class="{ 'mobile-nav--open': mobileMenuOpen }"
      aria-label="Navegación móvil"
    >
      <div class="mobile-nav__inner">
        <a
          v-for="link in allNavLinks"
          :key="link.path"
          :href="link.path"
          :class="[
            'mob-link',
            activeSection === link.path && 'mob-link--active',
          ]"
          @click.prevent="handleMobileNavClick(link.path)"
        >
          <span class="mob-dot" aria-hidden="true" />
          {{ link.mobileName || link.name }}
        </a>

        <div class="mob-products-section">
          <button
            type="button"
            class="mob-products-toggle"
            :class="{ open: mobileProductsOpen }"
            @click="mobileProductsOpen = !mobileProductsOpen"
          >
            <span class="mob-dot" aria-hidden="true" />
            Productos
            <svg
              class="mob-chevron"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
            >
              <path
                d="M2 3.5L5 6.5L8 3.5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </button>
          <div class="mob-categories" :class="{ open: mobileProductsOpen }">
            <template v-if="loadingCategories || !catalogReady">
              <span
                v-for="n in 5"
                :key="`mob-cat-sk-${n}`"
                class="mob-cat-skeleton"
              />
            </template>
            <template v-else>
              <a
                href="/productos"
                class="mob-cat-link mob-cat-link--all"
                @click="mobileMenuOpen = false"
              >
                Todos los productos
              </a>
              <template v-for="cat in categories" :key="cat.id">
                <a
                  :href="`/productos?categoria=${cat.slug}`"
                  class="mob-cat-link"
                  @click="mobileMenuOpen = false"
                >
                  {{ cat.name }}
                </a>
              </template>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Overlay mobile -->
    <div
      v-if="mobileMenuOpen"
      class="mobile-overlay"
      @click="mobileMenuOpen = false"
      aria-hidden="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useCartStore } from "~/stores/cart";
import { useFormatPrice } from "~/composables/useFormatPrice";
const cartStore = useCartStore();
const formatPrice = useFormatPrice();

interface Category {
  id: number;
  name: string;
  slug: string;
  productCount?: number;
}
interface Subcategory {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  sortOrder?: number;
  isActive: boolean;
  productCount?: number;
  category?: Category | null;
}
interface NavLink {
  name: string;
  path: string;
  mobileName?: string;
}

const route = useRoute();

const simpleNavLinks: NavLink[] = [
  { name: "Inicio", path: "#inicio" },
  { name: "Lanzamientos", path: "#nuevos-lanzamientos", mobileName: "Lanzamientos" },
  { name: "Beneficios", path: "#beneficios" },
];
const trailingNavLinks: NavLink[] = [
  { name: "Nosotros", path: "#nosotros" },
  { name: "Galería", path: "#galeria" },
  { name: "Ubicación", path: "#tienda" },
  { name: "Contacto", path: "#contacto" },
];
const allNavLinks: NavLink[] = [
  { name: "Inicio", path: "#inicio" },
  { name: "Lanzamientos", path: "#nuevos-lanzamientos", mobileName: "Lanzamientos" },
  { name: "Beneficios", path: "#beneficios" },
  { name: "Nosotros", path: "#nosotros" },
  { name: "Galería", path: "#galeria" },
  { name: "Ubicación", path: "#tienda" },
  { name: "Contacto", path: "#contacto" },
];

const activeSection = ref("#inicio");
const mobileMenuOpen = ref(false);
const mobileProductsOpen = ref(false);
const cartReady = ref(false);
const catalogReady = ref(false);
const cartTotalLabel = computed(() => formatPrice.format(cartStore.total));

const resolveActiveSection = () => {
  if (route.path !== "/") {
    activeSection.value = "";
    return;
  }
  const line = window.scrollY + window.innerHeight * 0.35;
  const links = [...simpleNavLinks, ...trailingNavLinks];
  let current = links[0]?.path ?? "#inicio";
  for (const link of links) {
    const el = document.querySelector(link.path);
    if (!el) continue;
    if (line >= (el as HTMLElement).offsetTop) current = link.path;
  }
  activeSection.value = current;
};

const handleScroll = () => {
  resolveActiveSection();
};
const handleResize = () => {
  if (window.innerWidth >= 1024) mobileMenuOpen.value = false;
};
const syncFromHash = () => {
  if (route.path !== "/") {
    activeSection.value = "";
    return;
  }
  const hash = window.location.hash;
  if (hash) activeSection.value = hash;
};

onMounted(() => {
  cartReady.value = true;
  syncFromHash();
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("hashchange", syncFromHash);
  window.addEventListener("resize", handleResize, { passive: true });
  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("click", handleOutsideClick);
  fetchCatalog();
});
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("hashchange", syncFromHash);
  window.removeEventListener("resize", handleResize);
  document.removeEventListener("keydown", handleKeydown);
  document.removeEventListener("click", handleOutsideClick);
  document.body.style.overflow = "";
  if (closeTimer) clearTimeout(closeTimer);
});

const scrollToSection = (hash: string) => {
  if (window.location.pathname !== "/") {
    window.location.href = `${window.location.origin}/${hash}`;
    return;
  }
  const el = document.querySelector(hash);
  if (!el) return;
  activeSection.value = hash;
  history.replaceState(null, "", hash);
  el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};
const handleMobileNavClick = (hash: string) => {
  mobileMenuOpen.value = false;
  if (hash.startsWith("#")) {
    scrollToSection(hash);
    return;
  }
  window.location.href = hash;
};

watch(mobileMenuOpen, (open) => {
  document.body.style.overflow = open ? "hidden" : "";
  if (!open) mobileProductsOpen.value = false;
});

/* ── MEGAMENÚ ── */
const megaOpen = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const megaRef = ref<HTMLElement | null>(null);
let closeTimer: ReturnType<typeof setTimeout> | null = null;

const categories = ref<Category[]>([]);
const subcategories = ref<Subcategory[]>([]);
const loadingCategories = ref(false);
const loadingSubcategories = ref(false);
const activeCatId = ref<number | null>(null);
const catalogLoaded = ref(false);
let ongoingCatalogFetch: Promise<void> | null = null;
const activeCategorySlug = computed(() =>
  activeCatId.value === null
    ? ""
    : (categories.value.find((c) => c.id === activeCatId.value)?.slug ?? ""),
);

const fetchCatalog = async (force = false) => {
  if (catalogLoaded.value && !force) return;
  if (ongoingCatalogFetch) return ongoingCatalogFetch;

  loadingCategories.value = true;
  loadingSubcategories.value = true;
  ongoingCatalogFetch = (async () => {
    try {
      const res = await $fetch<{
        data: Array<Category & { subcategories?: Subcategory[] }>;
      }>("/api/categories?active=true");

      if (Array.isArray(res.data) && res.data.length > 0) {
        // Do not filter out categories here — include all active categories.
        categories.value = res.data.map(({ subcategories: _s, ...c }) => c);
        subcategories.value = res.data.flatMap((c) =>
          (c.subcategories ?? [])
            .filter((s) => (s.productCount ?? 0) > 0)
            .map((s) => ({ ...s, categoryId: c.id })),
        );
      }

      catalogLoaded.value = true;
    } catch (e) {
      console.error("[Header]", e);
    } finally {
      catalogReady.value = true;
      loadingCategories.value = false;
      loadingSubcategories.value = false;
      ongoingCatalogFetch = null;
    }
  })();

  return ongoingCatalogFetch;
};

const filteredSubs = computed<Subcategory[]>(() =>
  activeCatId.value === null
    ? subcategories.value
    : subcategories.value.filter((s) => s.categoryId === activeCatId.value),
);
const activeCategoryName = computed<string>(() =>
  activeCatId.value === null
    ? ""
    : (categories.value.find((c) => c.id === activeCatId.value)?.name ?? ""),
);
const totalProductCount = computed(() =>
  categories.value.reduce((t, c) => t + (c.productCount ?? 0), 0),
);
const subCountForCat = (id: number) =>
  categories.value.find((c) => c.id === id)?.productCount ?? 0;
const isProductsPage = computed(() => route.path.includes("/productos"));

const openMega = async () => {
  megaOpen.value = true;
  await fetchCatalog();
  if (categories.value.length && activeCatId.value === null)
    activeCatId.value = categories.value[0].id;
};
const closeMega = () => {
  megaOpen.value = false;
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
};
const toggleMega = () => {
  megaOpen.value ? closeMega() : openMega();
};
const previewCategory = (id: number | null) => {
  activeCatId.value = id;
};
const goToCategory = (id: number | null) => {
  previewCategory(id);
  closeMega();
  const slug = id === null ? "" : categories.value.find((c) => c.id === id)?.slug ?? "";
  window.location.assign(id === null || !slug ? "/productos" : `/productos?categoria=${slug}`);
};

const openMenuOnHover = () => {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
  openMega();
};
const scheduleClose = () => {
  if (closeTimer) {
    clearTimeout(closeTimer);
  }
  closeTimer = setTimeout(closeMega, 220);
};
const cancelClose = () => {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
};
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && megaOpen.value) closeMega();
};
const handleOutsideClick = (e: MouseEvent) => {
  if (triggerRef.value && !triggerRef.value.contains(e.target as Node))
    closeMega();
};
</script>

<style scoped>
/* ═══════════════════════════════════
   TOKENS
═══════════════════════════════════ */
.header-shell {
  --jm-magenta: #d4229f;
  --jm-magenta-dark: #9c1275;
  --jm-magenta-glow: rgba(212, 34, 159, 0.55);
  --jm-magenta-soft: rgba(212, 34, 159, 0.14);
  --jm-magenta-line: rgba(212, 34, 159, 0.4);
  --jm-yellow: #f7d21e;
  --jm-yellow-dim: rgba(247, 210, 30, 0.9);
  --jm-black: #080808;
  --jm-surface: #111111;
  --jm-text: #ffffff;
  --jm-text-dim: rgba(255, 255, 255, 0.72);
  --jm-border: rgba(255, 255, 255, 0.1);

  position: sticky;
  top: 0;
  z-index: 60;
  width: 100%;
  overflow-x: clip;
}

/* ═══════════════════════════════════
   LOGO BAND
═══════════════════════════════════ */
/* Desktop */
.logo-band {
  background: linear-gradient(180deg, #0d0d0d 0%, var(--jm-black) 100%);
  border-bottom: 1px solid var(--jm-border);
  padding: 36px 0 34px; /* antes 26px/24px */
}
.logo-band-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  box-sizing: border-box;
}

.logo-side {
  flex: 1;
  display: flex;
  align-items: center;
}
.logo-side--left {
  justify-content: flex-start;
}
.logo-side--right {
  justify-content: flex-end;
  gap: 12px;
}
.logo-side-text {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}

/* LOGO */
.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  flex-shrink: 0;
}
.logo-img-wrap {
  height: 104px;
  width: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.logo-img--main {
  height: 104px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 2px 14px var(--jm-magenta-glow));
  transition: filter 0.3s;
  display: block;
}
.logo-img--letra {
  display: none;
}
.logo:hover .logo-img--main {
  filter: drop-shadow(0 2px 24px rgba(176, 24, 131, 0.7));
}

/* ═══════════════════════════════════
   CARRITO — REDISEÑO PROFESIONAL
═══════════════════════════════════ */
.cart-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 0;
  border: 1px solid rgba(247, 210, 30, 0.5);
  border-radius: 12px;
 background: rgba(247, 210, 30, 0.08);  
  color: #fff;
  cursor: pointer;
  overflow: hidden;
  transition:
    border-color 0.2s,
    background 0.2s,
    transform 0.15s;
}
.cart-btn:hover {
  border-color: #F7D21E;                        /* ← antes: var(--jm-magenta) */
  background: rgba(247, 210, 30, 0.15);         /* ← antes: rgba(212,34,159,0.16) */
  transform: translateY(-1px);
}
.cart-btn:active {
  transform: translateY(0);
}
/* Skeleton base — igual que antes en desktop */
.cart-btn--skeleton {
  pointer-events: none;
  border-color: rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
}
.cart-skeleton__icon {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.08) 25%,
    rgba(255, 255, 255, 0.16) 50%,
    rgba(255, 255, 255, 0.08) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.2s linear infinite;
}
.cart-skeleton__text {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-right: 14px;
}
.cart-skeleton__line {
  display: block;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.08) 25%,
    rgba(255, 255, 255, 0.16) 50%,
    rgba(255, 255, 255, 0.08) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.2s linear infinite;
}
.cart-skeleton__line--sm {
  width: 58px;
  height: 8px;
}
.cart-skeleton__line--lg {
  width: 82px;
  height: 11px;
}

/* Mobile: skeleton = solo el ícono, mismo tamaño que .cart-icon-wrap */
@media (max-width: 640px) {
  .cart-btn--skeleton {
    border-radius: 10px;
    width: 42px;
    height: 42px;
    padding: 0;
    overflow: hidden;
  }
  .cart-skeleton__icon {
    width: 42px;
    height: 42px;
  }
  .cart-skeleton__text {
    display: none;
  }
}
.cart-skeleton__icon {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.08) 25%,
    rgba(255, 255, 255, 0.16) 50%,
    rgba(255, 255, 255, 0.08) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.2s linear infinite;
}
.cart-skeleton__text {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-right: 14px;
}
.cart-skeleton__line {
  display: block;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.08) 25%,
    rgba(255, 255, 255, 0.16) 50%,
    rgba(255, 255, 255, 0.08) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.2s linear infinite;
}
.cart-skeleton__line--sm {
  width: 58px;
  height: 8px;
}
.cart-skeleton__line--lg {
  width: 82px;
  height: 11px;
}

/* Sección izquierda — ícono + badge */
.cart-icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: #F7D21E;
  flex-shrink: 0;
  color: #121212;
}

/* Badge de cantidad — reposicionado sobre el ícono */
.cart-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  background: var(--jm-yellow);
  color: #1a0a00;
  font-size: 9px;
  font-weight: 800;
  line-height: 16px;
  text-align: center;
  letter-spacing: 0;
  border: 1.5px solid rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
}

/* Sección derecha — textos */
.cart-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1px;
  padding-right: 14px;
}
.cart-label {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1;
}
.cart-label--empty {
  color: rgba(255, 255, 255, 0.4);
}
.cart-amount {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.01em;
  line-height: 1.2;
  white-space: nowrap;
}

/* ═══════════════════════════════════
   HAMBURGER
═══════════════════════════════════ */
.menu-btn {
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 38px;
  height: 38px;
  border: 1px solid rgba(247, 210, 30, 0.5);
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  transition:
    border-color 0.18s,
    background 0.18s,
    box-shadow 0.18s;
}
.menu-btn:hover {
  border-color: #F7D21E;                              /* ← antes: var(--jm-magenta) */
  background: rgba(247, 210, 30, 0.1);               /* ← antes: var(--jm-magenta-soft) */
  box-shadow: 0 0 12px rgba(247, 210, 30, 0.35);     /* ← antes: var(--jm-magenta-glow) */
}
.menu-btn__line {
  display: block;
  width: 15px;
  height: 1.5px;
  background: #F7D21E;
  border-radius: 2px;
  transition:
    transform 0.22s ease,
    opacity 0.22s ease;
}
.menu-btn--open .menu-btn__line:nth-child(1) {
  transform: translateY(6.5px) rotate(45deg);
}
.menu-btn--open .menu-btn__line:nth-child(2) {
  opacity: 0;
}
.menu-btn--open .menu-btn__line:nth-child(3) {
  transform: translateY(-6.5px) rotate(-45deg);
}

/* ═══════════════════════════════════
   NAV BAR HORIZONTAL
═══════════════════════════════════ */
.nav-bar {
  background: #161616;
  border-top: 1px solid var(--jm-magenta-line);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow:
    0 6px 40px rgba(0, 0, 0, 0.7),
    0 1px 0 var(--jm-magenta-line);
}
.nav-bar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  position: relative;
  box-sizing: border-box;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 0;
}
.nav-link {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.75);
  padding: 0 14px;
  height: 46px;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  white-space: nowrap;
  position: relative;
  cursor: pointer;
  border: none;
  background: transparent;
  transition: color 0.18s;
}
.nav-link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: var(--jm-magenta);
  border-radius: 2px 2px 0 0;
  transition: width 0.22s ease;
}
.nav-link:hover {
  color: #fff;
}
.nav-link:hover::after {
  width: 60%;
}
.nav-link--active {
  color: #fff;
}
.nav-link--active::after {
  width: 60%;
}
.nav-link--btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: inherit;
}
.nav-link--open {
  color: #fff;
}
.nav-link--open::after {
  width: 60%;
}
.chevron {
  color: var(--jm-text-dim);
  transition:
    transform 0.22s ease,
    color 0.18s;
  flex-shrink: 0;
}
.chevron--open {
  transform: rotate(180deg);
  color: var(--jm-yellow);
}
.nav-link + .nav-link::before,
.productos-trigger + .nav-link::before,
.nav-link + .productos-trigger > .nav-link::before {
  content: "";
  position: absolute;
  left: 0;
  top: 30%;
  height: 40%;
  width: 1px;
  background: var(--jm-border);
}

/* ═══════════════════════════════════
   LÍNEA BRAND
═══════════════════════════════════ */
.brand-line {
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(212, 34, 159, 0.6) 15%,
    rgba(247, 210, 30, 1) 50%,
    rgba(212, 34, 159, 0.6) 85%,
    transparent
  );
  box-shadow: 0 0 12px rgba(247, 210, 30, 0.4);
}

/* ═══════════════════════════════════
   MEGAMENÚ
═══════════════════════════════════ */
.productos-trigger {
  position: relative;
}
.mega-menu {
  position: absolute;
  top: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  width: 600px;
  background: #0d0d0d;
  border: 1px solid var(--jm-magenta-line);
  border-radius: 14px;
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.9),
    0 0 40px rgba(176, 24, 131, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  opacity: 0;
  pointer-events: none;
  transform-origin: top center;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  overflow: hidden;
}
.mega-menu--open {
  opacity: 1;
  pointer-events: auto;
  transform: translateX(-50%) translateY(0);
}
.mega-arrow {
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 12px;
  height: 12px;
  background: #0d0d0d;
  border-left: 1px solid var(--jm-magenta-line);
  border-top: 1px solid var(--jm-magenta-line);
}
.mega-header {
  padding: 13px 20px 11px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(176, 24, 131, 0.04);
}
.mega-header-title {
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--jm-yellow-dim);
  display: flex;
  align-items: center;
  gap: 8px;
}
.mega-header-title::before {
  content: "";
  width: 3px;
  height: 11px;
  background: var(--jm-magenta);
  border-radius: 2px;
  flex-shrink: 0;
}
.mega-all-link {
  font-size: 10px;
  color: var(--jm-text-dim);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: color 0.15s;
}
.mega-all-link:hover {
  color: var(--jm-yellow);
}
.mega-body {
  display: flex;
  min-height: 200px;
}
.mega-categories {
  width: 195px;
  flex-shrink: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  padding: 6px 0;
  overflow-y: auto;
}
.cat-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 13px 8px 18px;
  cursor: pointer;
  border: none;
  background: transparent;
  position: relative;
  text-align: left;
  transition: background 0.13s;
}
.cat-item:hover,
.cat-item--active {
  background: var(--jm-magenta-soft);
}
.cat-item--active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 16px;
  background: var(--jm-magenta);
  border-radius: 0 2px 2px 0;
}
.cat-name {
  font-size: 12px;
  font-weight: 500;
  color: var(--jm-text-dim);
  transition: color 0.13s;
}
.cat-item:hover .cat-name,
.cat-item--active .cat-name {
  color: #fff;
}
.cat-count {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.06);
  padding: 1px 6px;
  border-radius: 20px;
  flex-shrink: 0;
}
.cat-item--active .cat-count {
  background: rgba(176, 24, 131, 0.18);
  color: rgba(176, 24, 131, 0.85);
}
.cat-skeleton {
  height: 34px;
  margin: 3px 10px;
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.03) 25%,
    rgba(176, 24, 131, 0.07) 50%,
    rgba(255, 255, 255, 0.03) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
.mega-subcategories {
  flex: 1;
  padding: 10px 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3px;
  align-content: start;
  overflow-y: auto;
}
.sub-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 10px;
  border-radius: 7px;
  text-decoration: none;
  border: 1px solid transparent;
  transition:
    background 0.13s,
    border-color 0.13s;
}
.sub-item:hover {
  background: var(--jm-magenta-soft);
  border-color: var(--jm-magenta-line);
}
.sub-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(176, 24, 131, 0.5);
  flex-shrink: 0;
  transition: background 0.13s;
}
.sub-item:hover .sub-dot {
  background: var(--jm-yellow);
}
.sub-name {
  font-size: 11.5px;
  color: var(--jm-text-dim);
  transition: color 0.13s;
  line-height: 1.3;
}
.sub-item:hover .sub-name {
  color: #fff;
}
.sub-skeleton {
  height: 34px;
  border-radius: 7px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.02) 25%,
    rgba(176, 24, 131, 0.05) 50%,
    rgba(255, 255, 255, 0.02) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
.mega-empty {
  grid-column: 1/-1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 36px;
  color: var(--jm-text-dim);
  font-size: 12px;
}
.mega-empty svg {
  opacity: 0.3;
}
.mega-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: 11px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.35);
}
.mega-footer-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: var(--jm-magenta);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 9px 18px;
  border-radius: 7px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition:
    background 0.18s,
    transform 0.15s,
    box-shadow 0.18s;
  white-space: nowrap;
}
.mega-footer-btn:hover {
  background: var(--jm-magenta-dark);
  transform: translateY(-1px);
  box-shadow: 0 6px 18px var(--jm-magenta-glow);
}
.mega-footer-hint {
  font-size: 10px;
  color: var(--jm-text-dim);
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* ═══════════════════════════════════
   MOBILE NAV
═══════════════════════════════════ */
.mobile-nav {
  display: none;
  position: relative;
  z-index: 56;
  background: #080808;
  border-bottom: 1px solid var(--jm-border);
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-6px);
  transition:
    max-height 0.28s ease,
    opacity 0.28s ease,
    transform 0.28s ease;
}
.mobile-nav--open {
  max-height: 620px;
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}
.mobile-nav__inner {
  padding: 10px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.mob-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 12px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--jm-text-dim);
  text-decoration: none;
  border-radius: 8px;
  border: 1px solid transparent;
  transition:
    color 0.18s,
    background 0.18s,
    border-color 0.18s;
}
.mob-link:hover,
.mob-link--active {
  color: #fff;
  background: var(--jm-magenta-soft);
  border-color: var(--jm-magenta-line);
}
.mob-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(176, 24, 131, 0.7);
  flex-shrink: 0;
  transition: background 0.18s;
}
.mob-link--active .mob-dot {
  background: var(--jm-yellow);
}
.mob-products-section {
  display: flex;
  flex-direction: column;
}
.mob-products-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 12px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--jm-text-dim);
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition:
    color 0.18s,
    background 0.18s,
    border-color 0.18s;
}
.mob-products-toggle:hover {
  color: #fff;
  background: var(--jm-magenta-soft);
}
.mob-products-toggle.open {
  color: #fff;
  background: var(--jm-magenta-soft);
  border-color: var(--jm-magenta-line);
}
.mob-chevron {
  margin-left: auto;
  color: currentColor;
  transition: transform 0.2s;
}
.mob-products-toggle.open .mob-chevron {
  transform: rotate(180deg);
  color: var(--jm-yellow);
}
.mob-categories {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition:
    max-height 0.25s ease,
    opacity 0.25s ease;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-left: 26px;
}
.mob-categories.open {
  max-height: 400px;
  opacity: 1;
}
.mob-cat-skeleton {
  display: block;
  height: 30px;
  border-radius: 6px;
  margin-right: 8px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.04) 25%,
    rgba(176, 24, 131, 0.09) 50%,
    rgba(255, 255, 255, 0.04) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.2s linear infinite;
}
.mob-cat-link {
  display: block;
  padding: 8px 12px;
  font-size: 12px;
  color: var(--jm-text-dim);
  text-decoration: none;
  border-radius: 6px;
  transition:
    color 0.15s,
    background 0.15s;
}
.mob-cat-link:hover {
  color: #fff;
  background: var(--jm-magenta-soft);
}
.mob-cat-link--all {
  color: var(--jm-yellow-dim);
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.08em;
}
.mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 55;
  backdrop-filter: blur(2px);
}

/* ═══════════════════════════════════
   RESPONSIVE
═══════════════════════════════════ */
@media (max-width: 1023px) {
  .menu-btn {
    display: inline-flex;
  }
  .mobile-nav {
    display: block;
  }
  .nav-bar {
    display: none;
  }
  .brand-line {
    display: none;
  }
  .logo-band-inner {
    padding: 0 16px;
  }
  .logo-side--left {
    display: none;
  }
  .logo-band {
    padding: 28px 0; /* antes 20px */
  }

  /* Logo mobile: solo logo_letra.png centrado */
  .logo {
    flex-direction: row;
    gap: 0;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  .logo-img-wrap {
    height: 52px;
    width: auto;
  }
  .logo-img--main {
    display: none;
  }
  .logo-img--letra {
    display: block;
    height: 44px;
    width: auto;
    object-fit: contain;
    filter: brightness(0) invert(1) contrast(1);
  }

  /* Para que el logo absoluto no rompa el layout */
  .logo-band-inner {
    position: relative;
  }

  /* Carrito mobile — más compacto */
  .cart-icon-wrap {
    width: 40px;
    height: 40px;
  }
  .cart-info {
    padding-right: 10px;
  }
  .cart-amount {
    font-size: 13px;
  }
}
@media (max-width: 640px) {
  .logo-band {
    padding: 24px 0;
  }

  .logo-band-inner {
    padding: 0 14px;
  }
  .logo-img--letra {
    height: 36px;
  }

  /* En pantallas muy pequeñas ocultar el texto y mostrar solo ícono */
  .cart-info {
    display: none;
  }
  .cart-btn {
    border-radius: 10px;
  }
  .cart-icon-wrap {
    width: 42px;
    height: 42px;
    border-radius: 10px;
  }
}
</style>
