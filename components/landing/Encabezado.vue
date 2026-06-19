<template>
  <header class="cp-header" :class="{ 'cp-header--scrolled': scrolled }">



    <!-- BACKDROP -->
    <div class="cp-header__blur" />

    <div class="cp-header__container">

      <!-- LEFT -->
      <div class="cp-header__left">
        <!-- MOBILE MENU BTN -->
        <button type="button" class="cp-mobile-btn" :class="{ open: mobileMenuOpen }" @click="toggleMobileMenu"
          aria-label="Abrir menú">
          <span />
          <span />
          <span />
        </button>

        <!-- LOGO -->
        <NuxtLink to="/" class="cp-logo" aria-label="CelParts — Inicio">
          <template v-if="businessState?.logoUrl">
            <img :src="businessState.logoUrl" :alt="businessState?.name || 'Logo'" class="cp-logo__img" style="object-fit: contain; width: auto; max-height: 48px; max-width: 200px;" />
          </template>
          <template v-else>
            <img src="/images/logo.png" alt="CelParts" class="cp-logo__img" />
          </template>
          <img src="/images/logo-letra.png" alt="CelParts" class="cp-logo-letra__img" />
        </NuxtLink>
      </div>

      <!-- CENTER NAV -->
      <nav class="cp-nav">
        <a v-for="link in simpleNavLinks" :key="link.path" :href="link.path"
          :class="['cp-nav__link', activeSection === link.path && 'active']"
          @click.prevent="scrollToSection(link.path)">
          {{ link.name }}
        </a>

        <!-- DROPDOWN PRODUCTOS -->
        <div class="cp-products" ref="triggerRef" @mouseenter="openMenuOnHover" @mouseleave="scheduleClose">
          <button type="button" class="cp-nav__link cp-nav__button" :class="{ active: megaOpen || isProductsPage }"
            @click="toggleMega">
            Productos
            <svg class="cp-chevron" :class="{ open: megaOpen }" width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </button>

          <!-- MEGA MENU -->
          <Transition name="cp-fade">
            <div v-if="megaOpen" class="cp-mega" ref="megaRef" @mouseenter="cancelClose" @mouseleave="scheduleClose">


              <div class="cp-mega__grid">
                <!-- CATEGORÍAS -->
                <div class="cp-mega__categories">
                  <p class="cp-mega__label">Categorías</p>

                  <button type="button" class="cp-cat" :class="{ active: activeCatId === null }"
                    @mouseenter="previewCategory(null)" @click="goToCategory(null)">
                    <span class="cp-cat__dot" />
                    <span>Todos</span>
                    <small>{{ totalProductCount }}</small>
                  </button>

                  <button v-for="cat in categories" :key="cat.id" type="button" class="cp-cat"
                    :class="{ active: activeCatId === cat.id }" @mouseenter="previewCategory(cat.id)"
                    @click="goToCategory(cat.id)">
                    <span class="cp-cat__dot" />
                    <span>{{ cat.name }}</span>
                    <small>{{ subCountForCat(cat.id) }}</small>
                  </button>
                </div>

                <!-- SUBCATEGORÍAS -->
                <div class="cp-mega__subs">
                  <p class="cp-mega__label">Subcategorías</p>

                  <a v-for="sub in filteredSubs" :key="sub.id"
                    :href="`/productos?categoria=${activeCategorySlug}&subcategoria=${sub.slug}`" class="cp-sub"
                    @click="closeMega">
                    <span class="cp-sub__icon" aria-hidden="true">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12H19M13 6L19 12L13 18" stroke="currentColor" stroke-width="2.2"
                          stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </span>
                    {{ sub.name }}
                  </a>
                </div>
              </div>
            </div>
          </Transition>
        </div>
        <a v-for="link in trailingNavLinks" :key="link.path" :href="link.path"
          :class="['cp-nav__link', activeSection === link.path && 'active']"
          @click.prevent="scrollToSection(link.path)">
          {{ link.name }}
        </a>
      </nav>

      <!-- RIGHT -->
      <div class="cp-header__right">
        <ClientOnly>
          <div class="cp-auth-nav">
            <template v-if="loggedIn">
              <NuxtLink v-if="user?.role === 'admin'" to="/admin" class="cp-auth-btn">Panel Admin</NuxtLink>
              <NuxtLink v-else to="/mi-cuenta" class="cp-auth-btn">Mi Cuenta</NuxtLink>
            </template>
            <template v-else>
              <NuxtLink to="/login" class="cp-auth-btn">Ingresar</NuxtLink>
            </template>
          </div>

          <button class="cp-cart" @click="cartStore.isOpen = true">
            <div class="cp-cart__icon">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <span v-if="cartStore.itemCount > 0" class="cp-cart__badge">
                {{ cartStore.itemCount }}
              </span>
            </div>
            <div class="cp-cart__info">
              <span class="cp-cart__label">Mi carrito</span>
              <span class="cp-cart__amount">{{ cartTotalLabel }}</span>
            </div>
          </button>
        </ClientOnly>
      </div>
    </div>

    <!-- MOBILE NAV -->
    <Transition name="mobile-slide">
      <nav v-if="mobileMenuOpen" class="cp-mobile">
        <div class="cp-mobile__inner">
          <a v-for="link in allNavLinks" :key="link.path" :href="link.path" class="cp-mobile__link"
            @click.prevent="handleMobileNavClick(link.path)">
            {{ link.name }}
          </a>

          <div class="cp-mobile-products">
            <button type="button" class="cp-mobile-products__toggle" @click="mobileProductsOpen = !mobileProductsOpen">
              Productos
              <svg class="cp-chevron" :class="{ open: mobileProductsOpen }" width="10" height="10" viewBox="0 0 10 10"
                fill="none">
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </button>

            <div v-if="mobileProductsOpen" class="cp-mobile-products__items">
              <a href="/productos" class="cp-mobile-products__item">
                Todos los productos
              </a>
              <a v-for="cat in categories" :key="cat.id" :href="`/productos?categoria=${cat.slug}`"
                class="cp-mobile-products__item">
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
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useCartStore } from "~/stores/cart";
import { useFormatPrice } from "~/composables/useFormatPrice";

const { loggedIn, user } = useUserSession();
const cartStore = useCartStore();
const formatPrice = useFormatPrice();
const businessState = useBusinessConfig();

interface Category { id: number; name: string; slug: string; productCount?: number; }
interface Subcategory { id: number; categoryId: number; name: string; slug: string; productCount?: number; }
interface NavLink { name: string; path: string; }

const route = useRoute();
const scrolled = ref(false);

const simpleNavLinks: NavLink[] = [
  { name: "Inicio", path: "#inicio" },
  { name: "Beneficios", path: "#beneficios" },
  { name: "Lanzamientos", path: "#nuevos-lanzamientos" },
  
];
const trailingNavLinks: NavLink[] = [
  { name: "Galería", path: "#galeria" },
  { name: "Contacto", path: "#contacto" },
];
const allNavLinks = [...simpleNavLinks, ...trailingNavLinks];

const activeSection = ref("#inicio");
const mobileMenuOpen = ref(false);
const mobileProductsOpen = ref(false);

const cartTotalLabel = computed(() => formatPrice.format(cartStore.total));

/* ── SCROLL ── */
const resolveActiveSection = () => {
  if (route.path !== "/") { activeSection.value = ""; return; }
  scrolled.value = window.scrollY > 10;
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

const scrollToSection = (hash: string) => {
  if (window.location.pathname !== "/") {
    window.location.href = `${window.location.origin}/${hash}`; return;
  }
  const el = document.querySelector(hash);
  if (!el) return;
  activeSection.value = hash;
  history.replaceState(null, "", hash);
  el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const toggleMobileMenu = () => { mobileMenuOpen.value = !mobileMenuOpen.value; };
const handleMobileNavClick = (hash: string) => { mobileMenuOpen.value = false; scrollToSection(hash); };
watch(mobileMenuOpen, (open) => { document.body.style.overflow = open ? "hidden" : ""; });

/* ── MEGA MENU ── */
const megaOpen = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const megaRef = ref<HTMLElement | null>(null);
let closeTimer: ReturnType<typeof setTimeout> | null = null;

const categories = ref<Category[]>([]);
const subcategories = ref<Subcategory[]>([]);
const activeCatId = ref<number | null>(null);

const activeCategorySlug = computed(() =>
  activeCatId.value === null
    ? ""
    : categories.value.find(c => c.id === activeCatId.value)?.slug ?? ""
);
const filteredSubs = computed(() =>
  activeCatId.value === null
    ? subcategories.value
    : subcategories.value.filter(s => s.categoryId === activeCatId.value)
);
const totalProductCount = computed(() =>
  categories.value.reduce((t, c) => t + (c.productCount ?? 0), 0)
);
const subCountForCat = (id: number) =>
  categories.value.find(c => c.id === id)?.productCount ?? 0;
const isProductsPage = computed(() => route.path.includes("/productos"));

const fetchCatalog = async () => {
  try {
    const res = await $fetch<{ data: Array<Category & { subcategories?: Subcategory[] }> }>(
      "/api/categories?active=true"
    );
    categories.value = res.data.map(({ subcategories: _s, ...c }) => c);
    subcategories.value = res.data.flatMap(c =>
      (c.subcategories ?? []).map(s => ({ ...s, categoryId: c.id }))
    );
  } catch (e) { console.error(e); }
};

const openMega = async () => {
  megaOpen.value = true;
  if (!categories.value.length) await fetchCatalog();
  if (categories.value.length && activeCatId.value === null)
    activeCatId.value = categories.value[0].id;
};
const closeMega = () => { megaOpen.value = false; };
const toggleMega = () => { megaOpen.value ? closeMega() : openMega(); };
const previewCategory = (id: number | null) => { activeCatId.value = id; };
const goToCategory = (id: number | null) => {
  closeMega();
  const slug = id === null ? "" : categories.value.find(c => c.id === id)?.slug ?? "";
  window.location.assign(id === null ? "/productos" : `/productos?categoria=${slug}`);
};
const openMenuOnHover = () => { if (closeTimer) clearTimeout(closeTimer); openMega(); };
const scheduleClose = () => {
  if (closeTimer) clearTimeout(closeTimer);
  closeTimer = setTimeout(closeMega, 180);
};
const cancelClose = () => { if (closeTimer) clearTimeout(closeTimer); };

const handleOutsideClick = (e: MouseEvent) => {
  if (triggerRef.value && !triggerRef.value.contains(e.target as Node)) closeMega();
};

onMounted(() => {
  resolveActiveSection();
  window.addEventListener("scroll", resolveActiveSection, { passive: true });
  document.addEventListener("click", handleOutsideClick);
});
onUnmounted(() => {
  window.removeEventListener("scroll", resolveActiveSection);
  document.removeEventListener("click", handleOutsideClick);
  document.body.style.overflow = "";
});
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════
   APPHEADER — CELPARTS
   100% tokens de main.css (--cp-* / --brand-* / --grad-*)
   Cero colores hardcodeados.
═══════════════════════════════════════════════════════ */

/* ── BASE ── */
.cp-header {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  transition:
    box-shadow var(--t-slow) var(--ease-smooth),
    border-color var(--t-slow) var(--ease-smooth);
}



/* ── BACKDROP ── */
.cp-header__blur {
  position: absolute;
  inset: 0;
  backdrop-filter: blur(20px) saturate(1.4);
  -webkit-backdrop-filter: blur(20px) saturate(1.4);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: var(--card-shadow-sm);
  transition:
    background var(--t-slow) var(--ease-smooth),
    box-shadow var(--t-slow) var(--ease-smooth),
    border-color var(--t-slow) var(--ease-smooth);
}

.cp-header--scrolled .cp-header__blur {
  background: rgba(255, 255, 255, 0.97);
  box-shadow: var(--card-shadow);
}

/* ── CONTAINER ── */
.cp-header__container {
  position: relative;
  z-index: 2;
  max-width: 1400px;
  height: var(--header-height);
  margin: 0 auto;
  padding: 0 var(--space-8);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
}

/* ── LEFT ── */
.cp-header__left {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-shrink: 0;
}

/* ── LOGO ── */
.cp-logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;
  transition: opacity var(--t-fast) var(--ease-smooth);
}

.cp-logo-letra__img {
  width: 180px;
  height: auto;
  object-fit: contain;
}

.cp-logo:hover {
  opacity: 0.88;
}

.cp-logo__img {
  width: 110px;
  height: auto;
  object-fit: contain;
}

/* ── NAV ── */
.cp-nav {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
  justify-content: center;
}

.cp-nav__link {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  height: 36px;
  padding: 0 var(--space-3);
  border-radius: var(--r-pill);
  color: var(--text-muted);
  text-decoration: none;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  border: 1px solid transparent;
  white-space: nowrap;
  transition:
    color var(--t-base) var(--ease-smooth),
    background var(--t-base) var(--ease-smooth),
    border-color var(--t-base) var(--ease-smooth);
}

.cp-nav__link:hover {
  color: var(--cp-navy);
  background: var(--bg-alt);
  border-color: var(--border-light);
}

.cp-nav__link.active {
  color: var(--cp-navy);
  background: var(--cp-frost);
  border-color: var(--cp-mist);
  font-weight: 600;
}

/* Punto azul eléctrico en el item activo */
.cp-nav__link.active::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--cp-electric);
}

.cp-nav__button {
  border: none;
  cursor: pointer;
  font-family: var(--font-body);
  background: transparent;
}

.cp-chevron {
  margin-left: 3px;
  flex-shrink: 0;
  transition: transform var(--t-base) var(--ease-smooth);
  color: currentColor;
  opacity: 0.6;
}

.cp-chevron.open {
  transform: rotate(180deg);
}

/* ── AUTH ── */
.cp-header__right {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-shrink: 0;
}

.cp-auth-nav {
  display: flex;
  align-items: center;
}

.cp-auth-btn {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--cp-electric);
  text-decoration: none;
  padding: 8px 16px;
  border-radius: var(--r-pill);
  border: 1px solid rgba(0, 174, 239, 0.2);
  background: rgba(0, 174, 239, 0.04);
  transition: all var(--t-fast);
}

.cp-auth-btn:hover {
  background: var(--cp-electric);
  color: white;
  border-color: var(--cp-electric);
}

/* ── CARRITO ── */
.cp-cart {
  height: 44px;
  padding: 0 var(--space-4) 0 var(--space-1);
  border-radius: var(--r-pill);
  border: 1px solid var(--border-light);
  background: var(--bg-surface);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
  box-shadow: var(--card-shadow-sm);
  transition:
    transform var(--t-fast) var(--ease-snappy),
    box-shadow var(--t-base) var(--ease-smooth),
    border-color var(--t-base) var(--ease-smooth),
    background var(--t-base) var(--ease-smooth);
}

.cp-cart:hover {
  transform: translateY(-1px);
  border-color: var(--border-mid);
  box-shadow: var(--card-shadow);
  background: var(--bg-alt);
}

.cp-cart__icon {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--cp-navy);
  flex-shrink: 0;
}

.cp-cart__badge {
  position: absolute;
  top: 5px;
  right: 4px;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  border-radius: var(--r-pill);
  background: var(--cp-electric);
  color: var(--cp-navy);
  font-size: 0.625rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--bg-surface);
  line-height: 1;
}

.cp-cart__info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1px;
}

.cp-cart__label {
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-faint);
  line-height: 1;
  font-weight: 600;
}

.cp-cart__amount {
  font-family: var(--font-display);
  font-size: 0.8125rem;
  font-weight: 800;
  color: var(--cp-navy);
  letter-spacing: -0.02em;
  line-height: 1;
}

/* ═══════════════════════════════════════════════════════
   MEGA MENU
═══════════════════════════════════════════════════════ */
.cp-products {
  position: relative;
}

.cp-mega {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  width: 720px;
  border-radius: var(--r-lg);
  overflow: hidden;
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  box-shadow: var(--card-shadow-hover);
}



.cp-mega__label {
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-faint);
  margin: 0 0 var(--space-3);
  padding: 0 2px;
}

.cp-mega__grid {
  display: grid;
  grid-template-columns: 240px 1fr;
  align-items: start;
}

/* Sidebar categorías */
.cp-mega__categories {
  padding: var(--space-5) var(--space-3);
  border-right: 1px solid var(--border-light);
  background: var(--bg-muted);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-height: 280px;
}

.cp-cat {
  min-height: 42px;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--r-sm);
  border: 1px solid transparent;
  background: transparent;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  cursor: pointer;
  width: 100%;
  transition:
    background var(--t-base) var(--ease-smooth),
    border-color var(--t-base) var(--ease-smooth),
    transform var(--t-base) var(--ease-snappy);
}

.cp-cat:hover {
  background: var(--bg-surface);
  border-color: var(--border-light);
  transform: translateX(2px);
}

.cp-cat.active {
  background: var(--cp-ice);
  border-color: var(--cp-mist);
  transform: translateX(2px);
}

.cp-cat__dot {
  display: none;
}

.cp-cat span {
  font-size: 0.84375rem;
  font-weight: 500;
  color: var(--text-body);
  flex: 1;
  text-align: left;
  line-height: 1.3;
}

.cp-cat.active span {
  color: var(--cp-navy);
  font-weight: 600;
}

.cp-cat small {
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--text-faint);
  background: var(--bg-surface);
  padding: 2px 8px;
  border-radius: var(--r-pill);
  border: 1px solid var(--border-light);
  flex-shrink: 0;
}

/* Panel subcategorías */
.cp-mega__subs {
  padding: var(--space-5) var(--space-4);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cp-sub {
  min-height: 40px;
  padding: 0 var(--space-3);
  border-radius: var(--r-sm);
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--text-body);
  text-decoration: none;
  font-size: 0.84375rem;
  font-weight: 500;
  transition:
    background var(--t-fast) var(--ease-smooth),
    border-color var(--t-fast) var(--ease-smooth),
    color var(--t-fast) var(--ease-smooth),
    transform var(--t-fast) var(--ease-snappy);
}

.cp-sub:hover {
  background: var(--cp-ice);
  border-color: var(--cp-mist);
  color: var(--cp-navy);
  transform: translateX(3px);
}

.cp-sub__icon {
  color: var(--text-faint);
  display: flex;
  align-items: center;
  flex-shrink: 0;
  transition: color var(--t-fast) var(--ease-smooth), transform var(--t-fast) var(--ease-snappy);
}

.cp-sub:hover .cp-sub__icon {
  color: var(--cp-electric);
  transform: translateX(2px);
}

/* ═══════════════════════════════════════════════════════
   MOBILE — BOTÓN HAMBURGUESA
═══════════════════════════════════════════════════════ */
.cp-mobile-btn {
  display: none;
}

.cp-mobile {
  display: none;
}

/* ═══════════════════════════════════════════════════════
   ANIMACIONES
═══════════════════════════════════════════════════════ */
.cp-fade-enter-active,
.cp-fade-leave-active {
  transition:
    opacity var(--t-base) var(--ease-smooth),
    transform var(--t-base) var(--ease-snappy);
}

.cp-fade-enter-from,
.cp-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-6px) scale(0.98);
}

.mobile-slide-enter-active,
.mobile-slide-leave-active {
  transition:
    opacity var(--t-base) var(--ease-smooth),
    transform var(--t-base) var(--ease-snappy);
}

.mobile-slide-enter-from,
.mobile-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ═══════════════════════════════════════════════════════
   RESPONSIVE — TABLET (≤1024px)
═══════════════════════════════════════════════════════ */
@media (max-width: 1024px) {
  .cp-nav {
    display: none;
  }

  .cp-mobile-btn {
    width: 40px;
    height: 40px;
    border-radius: var(--r-sm);
    border: 1px solid var(--border-light);
    background: var(--bg-surface);
    box-shadow: var(--card-shadow-sm);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    cursor: pointer;
    transition:
      background var(--t-base) var(--ease-smooth),
      border-color var(--t-base) var(--ease-smooth);
  }

  .cp-mobile-btn:hover {
    background: var(--bg-alt);
    border-color: var(--border-mid);
  }

  .cp-mobile-btn span {
    width: 15px;
    height: 1.5px;
    background: var(--cp-navy);
    border-radius: var(--r-pill);
    transition:
      transform var(--t-base) var(--ease-snappy),
      opacity var(--t-base) var(--ease-smooth);
  }

  .cp-mobile-btn.open span:nth-child(1) {
    transform: translateY(5.5px) rotate(45deg);
  }

  .cp-mobile-btn.open span:nth-child(2) {
    opacity: 0;
    transform: scaleX(0);
  }

  .cp-mobile-btn.open span:nth-child(3) {
    transform: translateY(-5.5px) rotate(-45deg);
  }

  /* Panel mobile */
  .cp-mobile {
    display: block;
    position: relative;
    z-index: 4;
    background: var(--bg-surface);
    border-top: 1px solid var(--border-light);
    box-shadow: var(--card-shadow);
  }

  .cp-mobile__inner {
    padding: var(--space-4) var(--space-5) var(--space-6);
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .cp-mobile__link,
  .cp-mobile-products__toggle,
  .cp-mobile-products__item {
    min-height: 48px;
    border-radius: var(--r-md);
    padding: 0 var(--space-4);
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--text-body);
    text-decoration: none;
    background: var(--bg-alt);
    border: 1px solid var(--border-light);
    font-family: var(--font-body);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition:
      background var(--t-base) var(--ease-smooth),
      border-color var(--t-base) var(--ease-smooth),
      color var(--t-base) var(--ease-smooth);
  }

  .cp-mobile__link:hover,
  .cp-mobile-products__toggle:hover,
  .cp-mobile-products__item:hover {
    background: var(--cp-ice);
    border-color: var(--cp-mist);
    color: var(--cp-navy);
  }

  .cp-mobile-products {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .cp-mobile-products__items {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    padding-left: var(--space-3);
  }

  .cp-mobile-products__item {
    min-height: 44px;
    font-size: 0.8125rem;
  }

  .cp-mega {
    width: 95vw;
  }
}

/* ═══════════════════════════════════════════════════════
   RESPONSIVE — MOBILE (≤640px)
═══════════════════════════════════════════════════════ */
@media (max-width: 640px) {
  .cp-header__container {
    height: 62px;
    padding: 0 var(--space-4);
    gap: var(--space-3);
  }

  .cp-logo__img {
    width: 88px;
  }

  /* Carrito sin texto en mobile */
  .cp-cart__info {
    display: none;
  }

  .cp-cart {
    width: 44px;
    padding: 0;
    justify-content: center;
    border-radius: var(--r-sm);
  }

  .cp-mega__grid {
    grid-template-columns: 1fr;
  }

  .cp-mega__categories {
    border-right: none;
    border-bottom: 1px solid var(--border-light);
    min-height: unset;
  }
}
</style>