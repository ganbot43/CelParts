<template>
  <header class="kite-header" :class="{ 'kite-header--scrolled': scrolled }">
    <!-- BACKDROP BLUR -->
    <div class="kite-header__blur" />

    <div class="kite-header__container">
      <!-- LEFT -->
      <div class="kite-header__left">
        <!-- MOBILE MENU -->
        <button type="button" class="kite-mobile-btn" :class="{ open: mobileMenuOpen }" @click="toggleMobileMenu"
          aria-label="Abrir menú">
          <span />
          <span />
          <span />
        </button>

        <!-- LOGO -->
        <NuxtLink to="/" class="kite-logo" aria-label="Kite — Inicio">
          <img src="/images/logo.png" alt="Kite" class="kite-logo__icon" />

          <img src="/images/logo_letra.png" alt="Kite" class="kite-logo__text" />
        </NuxtLink>
      </div>

      <!-- CENTER NAV -->
      <nav class="kite-nav">
        <a v-for="link in simpleNavLinks" :key="link.path" :href="link.path" :class="[
          'kite-nav__link',
          activeSection === link.path && 'active'
        ]" @click.prevent="scrollToSection(link.path)">
          {{ link.name }}
        </a>

        <!-- PRODUCTOS -->
        <div class="kite-products" ref="triggerRef" @mouseenter="openMenuOnHover" @mouseleave="scheduleClose">
          <button type="button" class="kite-nav__link kite-nav__button" :class="{
            active: megaOpen || isProductsPage
          }" @click="toggleMega">
            Productos

            <svg class="kite-chevron" :class="{ open: megaOpen }" width="10" height="10" viewBox="0 0 10 10"
              fill="none">
              <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </button>

          <!-- MEGA MENU -->
          <Transition name="kite-fade">
            <div v-if="megaOpen" class="kite-mega" ref="megaRef" @mouseenter="cancelClose" @mouseleave="scheduleClose">
              <div class="kite-mega__grid">
                <!-- CATEGORIES -->
                <div class="kite-mega__categories">
                  <button type="button" class="kite-cat" :class="{ active: activeCatId === null }"
                    @mouseenter="previewCategory(null)" @click="goToCategory(null)">
                    <span>Todos</span>
                    <small>{{ totalProductCount }}</small>
                  </button>

                  <button v-for="cat in categories" :key="cat.id" type="button" class="kite-cat"
                    :class="{ active: activeCatId === cat.id }" @mouseenter="previewCategory(cat.id)"
                    @click="goToCategory(cat.id)">
                    <span>{{ cat.name }}</span>
                    <small>{{ subCountForCat(cat.id) }}</small>
                  </button>
                </div>

                <!-- SUBCATEGORIES -->
                <div class="kite-mega__subs">
                  <a v-for="sub in filteredSubs" :key="sub.id"
                    :href="`/productos?categoria=${activeCategorySlug}&subcategoria=${sub.slug}`" class="kite-sub"
                    @click="closeMega">
                    <span class="kite-sub__dot" />
                    {{ sub.name }}
                  </a>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <a v-for="link in trailingNavLinks" :key="link.path" :href="link.path" :class="[
          'kite-nav__link',
          activeSection === link.path && 'active'
        ]" @click.prevent="scrollToSection(link.path)">
          {{ link.name }}
        </a>
      </nav>

      <!-- RIGHT -->
      <div class="kite-header__right">
        <ClientOnly>
          <button class="kite-cart" @click="cartStore.isOpen = true">
            <div class="kite-cart__icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>

              <span v-if="cartStore.itemCount > 0" class="kite-cart__badge">
                {{ cartStore.itemCount }}
              </span>
            </div>

            <div class="kite-cart__info">
              <span class="kite-cart__label">
                Mi carrito
              </span>

              <span class="kite-cart__amount">
                {{ cartTotalLabel }}
              </span>
            </div>
          </button>
        </ClientOnly>
      </div>
    </div>

    <!-- MOBILE -->
    <Transition name="mobile-slide">
      <nav v-if="mobileMenuOpen" class="kite-mobile">
        <div class="kite-mobile__inner">
          <a v-for="link in allNavLinks" :key="link.path" :href="link.path" class="kite-mobile__link"
            @click.prevent="handleMobileNavClick(link.path)">
            {{ link.name }}
          </a>

          <div class="kite-mobile-products">
            <button type="button" class="kite-mobile-products__toggle"
              @click="mobileProductsOpen = !mobileProductsOpen">
              Productos
            </button>

            <div v-if="mobileProductsOpen" class="kite-mobile-products__items">
              <a href="/productos" class="kite-mobile-products__item">
                Todos los productos
              </a>

              <a v-for="cat in categories" :key="cat.id" :href="`/productos?categoria=${cat.slug}`"
                class="kite-mobile-products__item">
                {{ cat.name }}
              </a>
            </div>
          </div>
        </div>
      </nav>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  watch
} from "vue";

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
  productCount?: number;
}

interface NavLink {
  name: string;
  path: string;
}

const route = useRoute();

const scrolled = ref(false);

const simpleNavLinks: NavLink[] = [
  { name: "Inicio", path: "#inicio" },
  { name: "Lanzamientos", path: "#nuevos-lanzamientos" },
  { name: "Beneficios", path: "#beneficios" },
];

const trailingNavLinks: NavLink[] = [
  // { name: "Nosotros", path: "#nosotros" },
  { name: "Galería", path: "#galeria" },
  { name: "Ubicación", path: "#tienda" },
  { name: "Contacto", path: "#contacto" },
];

const allNavLinks = [
  ...simpleNavLinks,
  ...trailingNavLinks
];

const activeSection = ref("#inicio");

const mobileMenuOpen = ref(false);
const mobileProductsOpen = ref(false);

const cartTotalLabel = computed(() =>
  formatPrice.format(cartStore.total)
);

/* =========================================
   SCROLL
========================================= */

const resolveActiveSection = () => {
  if (route.path !== "/") {
    activeSection.value = "";
    return;
  }

  scrolled.value = window.scrollY > 10;

  const line =
    window.scrollY +
    window.innerHeight * 0.35;

  const links = [
    ...simpleNavLinks,
    ...trailingNavLinks
  ];

  let current =
    links[0]?.path ?? "#inicio";

  for (const link of links) {
    const el = document.querySelector(link.path);

    if (!el) continue;

    if (
      line >=
      (el as HTMLElement).offsetTop
    ) {
      current = link.path;
    }
  }

  activeSection.value = current;
};

const scrollToSection = (hash: string) => {
  if (window.location.pathname !== "/") {
    window.location.href =
      `${window.location.origin}/${hash}`;

    return;
  }

  const el = document.querySelector(hash);

  if (!el) return;

  activeSection.value = hash;

  history.replaceState(null, "", hash);

  el.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value =
    !mobileMenuOpen.value;
};

const handleMobileNavClick = (
  hash: string
) => {
  mobileMenuOpen.value = false;

  scrollToSection(hash);
};

watch(mobileMenuOpen, (open) => {
  document.body.style.overflow =
    open ? "hidden" : "";
});

/* =========================================
   MEGA MENU
========================================= */

const megaOpen = ref(false);

const triggerRef =
  ref<HTMLElement | null>(null);

const megaRef =
  ref<HTMLElement | null>(null);

let closeTimer:
  | ReturnType<typeof setTimeout>
  | null = null;

const categories = ref<Category[]>([]);
const subcategories = ref<Subcategory[]>([]);

const activeCatId =
  ref<number | null>(null);

const activeCategorySlug =
  computed(() =>
    activeCatId.value === null
      ? ""
      : categories.value.find(
        (c) =>
          c.id === activeCatId.value
      )?.slug ?? ""
  );

const filteredSubs = computed(() =>
  activeCatId.value === null
    ? subcategories.value
    : subcategories.value.filter(
      (s) =>
        s.categoryId ===
        activeCatId.value
    )
);

const totalProductCount = computed(() =>
  categories.value.reduce(
    (t, c) =>
      t + (c.productCount ?? 0),
    0
  )
);

const subCountForCat = (id: number) =>
  categories.value.find(
    (c) => c.id === id
  )?.productCount ?? 0;

const isProductsPage = computed(() =>
  route.path.includes("/productos")
);

const fetchCatalog = async () => {
  try {
    const res = await $fetch<{
      data: Array<
        Category & {
          subcategories?: Subcategory[];
        }
      >;
    }>("/api/categories?active=true");

    categories.value = res.data.map(
      ({ subcategories: _s, ...c }) => c
    );

    subcategories.value =
      res.data.flatMap((c) =>
        (c.subcategories ?? []).map(
          (s) => ({
            ...s,
            categoryId: c.id
          })
        )
      );
  } catch (e) {
    console.error(e);
  }
};

const openMega = async () => {
  megaOpen.value = true;

  if (!categories.value.length) {
    await fetchCatalog();
  }

  if (
    categories.value.length &&
    activeCatId.value === null
  ) {
    activeCatId.value =
      categories.value[0].id;
  }
};

const closeMega = () => {
  megaOpen.value = false;
};

const toggleMega = () => {
  megaOpen.value
    ? closeMega()
    : openMega();
};

const previewCategory = (
  id: number | null
) => {
  activeCatId.value = id;
};

const goToCategory = (
  id: number | null
) => {
  closeMega();

  const slug =
    id === null
      ? ""
      : categories.value.find(
        (c) => c.id === id
      )?.slug ?? "";

  window.location.assign(
    id === null
      ? "/productos"
      : `/productos?categoria=${slug}`
  );
};

const openMenuOnHover = () => {
  if (closeTimer) {
    clearTimeout(closeTimer);
  }

  openMega();
};

const scheduleClose = () => {
  if (closeTimer) {
    clearTimeout(closeTimer);
  }

  closeTimer = setTimeout(() => {
    closeMega();
  }, 180);
};

const cancelClose = () => {
  if (closeTimer) {
    clearTimeout(closeTimer);
  }
};

const handleOutsideClick = (
  e: MouseEvent
) => {
  if (
    triggerRef.value &&
    !triggerRef.value.contains(
      e.target as Node
    )
  ) {
    closeMega();
  }
};

onMounted(() => {
  resolveActiveSection();

  window.addEventListener(
    "scroll",
    resolveActiveSection,
    { passive: true }
  );

  document.addEventListener(
    "click",
    handleOutsideClick
  );
});

onUnmounted(() => {
  window.removeEventListener(
    "scroll",
    resolveActiveSection
  );

  document.removeEventListener(
    "click",
    handleOutsideClick
  );

  document.body.style.overflow = "";
});
</script>

<style scoped>
:root {
  color-scheme: light;
}

/* =========================================
   HEADER
========================================= */

.kite-header {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  transition:
    background 0.35s ease,
    border-color 0.35s ease,
    box-shadow 0.35s ease,
    transform 0.35s ease;
}

.kite-header__blur {
  position: absolute;
  inset: 0;

  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);

  background:
    linear-gradient(135deg,
      rgba(255, 255, 255, 0.72),
      rgba(255, 255, 255, 0.58));

  border-bottom:
    1px solid rgba(255, 255, 255, 0.35);

  box-shadow:
    0 8px 30px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.55);
}

.kite-header--scrolled .kite-header__blur {
  background:
    linear-gradient(135deg,
      rgba(255, 255, 255, 0.84),
      rgba(255, 255, 255, 0.70));

  box-shadow:
    0 14px 40px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.kite-header__container {
  position: relative;
  z-index: 2;

  max-width: 1400px;
  height: 76px;

  margin: 0 auto;
  padding: 0 32px;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* =========================================
   LEFT
========================================= */

.kite-header__left {
  display: flex;
  align-items: center;
  gap: 18px;
}

/* =========================================
   LOGO
========================================= */

.kite-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.kite-logo__icon {
  width: 40px;
  height: 40px;
  object-fit: contain;

  filter:
    drop-shadow(0 8px 18px rgba(0, 0, 0, 0.08));
}

.kite-logo__text {
  height: 20px;
  width: auto;
  object-fit: contain;

  opacity: 0.92;
  filter: brightness(0);
}

/* =========================================
   NAV
========================================= */

.kite-nav {
  display: flex;
  align-items: center;
  gap: 6px;
}

.kite-nav__link {
  position: relative;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  height: 40px;
  padding: 0 14px;

  border-radius: 999px;

  color: #4d4d4d;
  text-decoration: none;

  font-size: 0.95rem;
  font-size: 0.88rem;
  font-weight: 500;
  letter-spacing: -0.01em;

  transition:
    background 0.28s ease,
    color 0.28s ease,
    transform 0.28s ease,
    box-shadow 0.28s ease,
    border-color 0.28s ease;

  border:
    1px solid transparent;
}

.kite-nav__link::before {
  content: "";

  position: absolute;
  inset: 0;

  border-radius: inherit;

  opacity: 0;
  transition: opacity 0.28s ease;

  background:
    linear-gradient(135deg,
      rgba(255, 255, 255, 0.42),
      rgba(255, 255, 255, 0.12));
}

.kite-nav__link:hover {
  color: #111;

  background:
    rgba(255, 255, 255, 0.34);

  border-color:
    rgba(255, 255, 255, 0.42);

  backdrop-filter: blur(16px);

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.55),
    0 8px 20px rgba(0, 0, 0, 0.05);
}

.kite-nav__link:hover::before {
  opacity: 1;
}

.kite-nav__link.active {
  color: #111;

  background:
    linear-gradient(135deg,
      rgba(255, 255, 255, 0.60),
      rgba(255, 255, 255, 0.30));

  border:
    1px solid rgba(255, 255, 255, 0.55);

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    0 10px 24px rgba(0, 0, 0, 0.06);
}

.kite-nav__button {
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.kite-chevron {
  margin-left: 6px;
  transition: transform 0.28s ease;
}

.kite-chevron.open {
  transform: rotate(180deg);
}

/* =========================================
   CART
========================================= */

.kite-cart {
  height: 44px;
  padding: 0 16px 0 0;

  border-radius: 999px;
  border:
    1px solid rgba(255, 255, 255, 0.35);

  background:
    linear-gradient(135deg,
      rgba(255, 255, 255, 0.22),
      rgba(255, 255, 255, 0.10));

  backdrop-filter: blur(20px);

  color: #111;

  display: flex;
  align-items: center;
  gap: 12px;

  cursor: pointer;

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.45),
    0 12px 28px rgba(0, 0, 0, 0.05);

  transition:
    transform 0.28s ease,
    box-shadow 0.28s ease,
    background 0.28s ease;
}

.kite-cart:hover {
  transform: translateY(-1px);

  background:
    linear-gradient(135deg,
      rgba(255, 255, 255, 0.30),
      rgba(255, 255, 255, 0.16));

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.6),
    0 16px 34px rgba(0, 0, 0, 0.08);
}

.kite-cart__icon {
  position: relative;

  width: 44px;
  height: 44px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.kite-cart__badge {
  position: absolute;
  top: 7px;
  right: 7px;

  min-width: 17px;
  height: 17px;
  padding: 0 4px;

  border-radius: 999px;

  background: #111;
  color: #fff;

  font-size: 10px;
  font-weight: 700;

  display: flex;
  align-items: center;
  justify-content: center;
}

.kite-cart__info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.kite-cart__label {
  font-size: 10px;
  text-transform: uppercase;
  opacity: 0.55;
}

.kite-cart__amount {
  font-size: 13px;
  font-weight: 700;
}

/* =========================================
   MEGA MENU — LIQUID GLASS
========================================= */

.kite-products {
  position: relative;
}

.kite-mega {
  position: absolute;
  top: calc(100% + 12px);
  left: 50%;

  transform: translateX(-50%);

  width: 760px;

  border-radius: 28px;

  overflow: hidden;

  background:
    linear-gradient(135deg,
      rgba(255, 255, 255, 0.72),
      rgba(255, 255, 255, 0.46));

  backdrop-filter:
    blur(34px) saturate(190%);

  -webkit-backdrop-filter:
    blur(34px) saturate(190%);

  border:
    1px solid rgba(255, 255, 255, 0.55);

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.7),
    0 30px 80px rgba(0, 0, 0, 0.10),
    0 8px 24px rgba(255, 255, 255, 0.22);
}

.kite-mega::before {
  content: "";

  position: absolute;
  inset: 0;

  background:
    linear-gradient(145deg,
      rgba(255, 255, 255, 0.32),
      rgba(255, 255, 255, 0.05));

  pointer-events: none;
}

.kite-mega__grid {
  position: relative;
  z-index: 2;

  display: grid;
  grid-template-columns: 220px 1fr;
  align-items: start;
}

/* =========================================
   CATEGORIES
========================================= */

.kite-mega__categories {
  padding: 18px;

  border-right:
    1px solid rgba(255, 255, 255, 0.32);

  background:
    linear-gradient(to bottom,
      rgba(255, 255, 255, 0.14),
      rgba(255, 255, 255, 0.04));

  display: flex;
  flex-direction: column;
  gap: 8px;
}

.kite-cat {
  min-height: 44px;

  padding: 0 14px;

  border-radius: 14px;

  border:
    1px solid transparent;

  background:
    rgba(255, 255, 255, 0.22);

  display: flex;
  align-items: center;
  justify-content: space-between;

  cursor: pointer;

  transition:
    background 0.28s ease,
    border-color 0.28s ease,
    transform 0.28s ease,
    box-shadow 0.28s ease;
}

.kite-cat:hover,
.kite-cat.active {
  background:
    linear-gradient(135deg,
      rgba(255, 255, 255, 0.55),
      rgba(255, 255, 255, 0.26));

  border-color:
    rgba(255, 255, 255, 0.45);

  transform: translateY(-1px);

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.7),
    0 10px 24px rgba(0, 0, 0, 0.06);
}

.kite-cat span {
  font-size: 14px;
  font-weight: 600;
  color: #1d1d1d;
}

.kite-cat small {
  font-size: 11px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.45);
}

/* =========================================
   SUBS
========================================= */

.kite-mega__subs {
  padding: 18px;

  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 10px;
}

.kite-sub {
  position: relative;

  min-height: 48px;

  padding: 0 14px;

  border-radius: 16px;

  border:
    1px solid rgba(255, 255, 255, 0.38);

  background:
    linear-gradient(135deg,
      rgba(255, 255, 255, 0.36),
      rgba(255, 255, 255, 0.14));

  backdrop-filter: blur(16px);

  display: flex;
  align-items: center;
  gap: 12px;

  color: #111;
  text-decoration: none;

  font-size: 14px;
  font-weight: 600;
  line-height: 1.45;

  transition:
    transform 0.28s ease,
    background 0.28s ease,
    box-shadow 0.28s ease,
    border-color 0.28s ease;
}

.kite-sub::before {
  content: "";

  position: absolute;
  inset: 0;

  border-radius: inherit;

  background:
    linear-gradient(145deg,
      rgba(255, 255, 255, 0.24),
      transparent);

  opacity: 0;
  transition: opacity 0.28s ease;
}

.kite-sub:hover {
  transform:
    translateY(-2px) scale(1.01);

  background:
    linear-gradient(135deg,
      rgba(255, 255, 255, 0.56),
      rgba(255, 255, 255, 0.22));

  border-color:
    rgba(255, 255, 255, 0.58);

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.7),
    0 14px 30px rgba(0, 0, 0, 0.07);
}

.kite-sub:hover::before {
  opacity: 1;
}

.kite-sub__dot {
  width: 6px;
  height: 6px;

  border-radius: 999px;

  background:
    linear-gradient(135deg,
      #111,
      #666);

  flex-shrink: 0;
}

/* =========================================
   MOBILE
========================================= */

.kite-mobile-btn {
  display: none;
}

.kite-mobile {
  display: none;
}

@media (max-width: 1024px) {
  .kite-nav {
    display: none;
  }

  .kite-mobile-btn {
    width: 44px;
    height: 44px;

    border-radius: 14px;

    border:
      1px solid rgba(255, 255, 255, 0.35);

    background:
      rgba(255, 255, 255, 0.32);

    backdrop-filter: blur(18px);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;

    cursor: pointer;
  }

  .kite-mobile-btn span {
    width: 16px;
    height: 1.5px;

    background: #111;

    border-radius: 999px;
  }

  .kite-mobile {
    display: block;

    position: relative;
    z-index: 4;

    background:
      rgba(255, 255, 255, 0.84);

    backdrop-filter: blur(28px);

    border-top:
      1px solid rgba(255, 255, 255, 0.4);
  }

  .kite-mobile__inner {
    padding: 20px;

    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .kite-mobile__link,
  .kite-mobile-products__toggle,
  .kite-mobile-products__item {
    min-height: 50px;

    border-radius: 18px;

    padding: 0 16px;

    display: flex;
    align-items: center;

    color: #111;
    text-decoration: none;

    background:
      rgba(255, 255, 255, 0.4);

    border:
      1px solid rgba(255, 255, 255, 0.42);

    font-size: 14px;
    font-weight: 600;

    backdrop-filter: blur(18px);
  }

  .kite-mobile-products {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .kite-mobile-products__items {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .kite-mega {
    width: 95vw;
  }
}

@media (max-width: 640px) {
  .kite-header__container {
    height: 74px;
    padding: 0 16px;
  }

  .kite-logo__text {
    height: 20px;
  }

  .kite-cart__info {
    display: none;
  }

  .kite-cart {
    width: 50px;
    padding: 0;
    justify-content: center;
  }

  .kite-mega__grid {
    grid-template-columns: 1fr;
  }

  .kite-mega__categories {
    border-right: none;
    border-bottom:
      1px solid rgba(255, 255, 255, 0.28);
  }

  .kite-mega__categories,
  .kite-mega__subs {
    padding: 14px;
  }

  .kite-mega__subs {
    grid-template-columns: 1fr;
  }
}

/* =========================================
   ANIMATIONS
========================================= */

.kite-fade-enter-active,
.kite-fade-leave-active {
  transition:
    opacity 0.24s ease,
    transform 0.24s ease;
}

.kite-fade-enter-from,
.kite-fade-leave-to {
  opacity: 0;
  transform:
    translateX(-50%) translateY(-12px) scale(0.98);
}

.mobile-slide-enter-active,
.mobile-slide-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.mobile-slide-enter-from,
.mobile-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>