<template>
  <header class="cp-header" :class="{ 'cp-header--scrolled': scrolled }">
    <!-- BACKDROP -->
    <div class="cp-header__blur" />

    <div class="cp-header__container">
      <!-- LEFT -->
      <div class="cp-header__left">
        <!-- MOBILE MENU BTN -->
        <button
          type="button"
          class="cp-mobile-btn"
          :class="{ open: mobileMenuOpen }"
          @click="toggleMobileMenu"
          aria-label="Abrir menú"
        >
          <span />
          <span />
          <span />
        </button>

        <!-- LOGO -->
        <NuxtLink to="/" class="cp-logo" aria-label="CelParts — Inicio">
          <img src="/images/logo.png" alt="CelParts" class="cp-logo__icon" />
          <img src="/images/logo_letra.png" alt="CelParts" class="cp-logo__text" />
        </NuxtLink>
      </div>

      <!-- CENTER NAV -->
      <nav class="cp-nav">
        <a
          v-for="link in simpleNavLinks"
          :key="link.path"
          :href="link.path"
          :class="['cp-nav__link', activeSection === link.path && 'active']"
          @click.prevent="scrollToSection(link.path)"
        >
          {{ link.name }}
        </a>

        <!-- PRODUCTOS -->
        <div class="cp-products" ref="triggerRef" @mouseenter="openMenuOnHover" @mouseleave="scheduleClose">
          <button
            type="button"
            class="cp-nav__link cp-nav__button"
            :class="{ active: megaOpen || isProductsPage }"
            @click="toggleMega"
          >
            Productos
            <svg
              class="cp-chevron"
              :class="{ open: megaOpen }"
              width="10" height="10" viewBox="0 0 10 10" fill="none"
            >
              <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </button>

          <!-- MEGA MENU -->
          <Transition name="cp-fade">
            <div
              v-if="megaOpen"
              class="cp-mega"
              ref="megaRef"
              @mouseenter="cancelClose"
              @mouseleave="scheduleClose"
            >
              <!-- glow interno -->
              <div class="cp-mega__glow" aria-hidden="true" />

              <div class="cp-mega__grid">
                <!-- CATEGORIES -->
                <div class="cp-mega__categories">
                  <p class="cp-mega__label">Categorías</p>

                  <button
                    type="button"
                    class="cp-cat"
                    :class="{ active: activeCatId === null }"
                    @mouseenter="previewCategory(null)"
                    @click="goToCategory(null)"
                  >
                    <span class="cp-cat__dot" />
                    <span>Todos</span>
                    <small>{{ totalProductCount }}</small>
                  </button>

                  <button
                    v-for="cat in categories"
                    :key="cat.id"
                    type="button"
                    class="cp-cat"
                    :class="{ active: activeCatId === cat.id }"
                    @mouseenter="previewCategory(cat.id)"
                    @click="goToCategory(cat.id)"
                  >
                    <span class="cp-cat__dot" />
                    <span>{{ cat.name }}</span>
                    <small>{{ subCountForCat(cat.id) }}</small>
                  </button>
                </div>

                <!-- SUBCATEGORIES -->
                <div class="cp-mega__subs">
                  <p class="cp-mega__label">Subcategorías</p>

                  <a
                    v-for="sub in filteredSubs"
                    :key="sub.id"
                    :href="`/productos?categoria=${activeCategorySlug}&subcategoria=${sub.slug}`"
                    class="cp-sub"
                    @click="closeMega"
                  >
                    <span class="cp-sub__icon" aria-hidden="true">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12H19M13 6L19 12L13 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </span>
                    {{ sub.name }}
                  </a>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <a
          v-for="link in trailingNavLinks"
          :key="link.path"
          :href="link.path"
          :class="['cp-nav__link', activeSection === link.path && 'active']"
          @click.prevent="scrollToSection(link.path)"
        >
          {{ link.name }}
        </a>
      </nav>

      <!-- RIGHT -->
      <div class="cp-header__right">
        <ClientOnly>
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
          <a
            v-for="link in allNavLinks"
            :key="link.path"
            :href="link.path"
            class="cp-mobile__link"
            @click.prevent="handleMobileNavClick(link.path)"
          >
            {{ link.name }}
          </a>

          <div class="cp-mobile-products">
            <button
              type="button"
              class="cp-mobile-products__toggle"
              @click="mobileProductsOpen = !mobileProductsOpen"
            >
              Productos
              <svg
                class="cp-chevron"
                :class="{ open: mobileProductsOpen }"
                width="10" height="10" viewBox="0 0 10 10" fill="none"
              >
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </button>

            <div v-if="mobileProductsOpen" class="cp-mobile-products__items">
              <a href="/productos" class="cp-mobile-products__item">
                Todos los productos
              </a>
              <a
                v-for="cat in categories"
                :key="cat.id"
                :href="`/productos?categoria=${cat.slug}`"
                class="cp-mobile-products__item"
              >
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
  { name: "Inicio",        path: "#inicio" },
  { name: "Lanzamientos",  path: "#nuevos-lanzamientos" },
  { name: "Beneficios",    path: "#beneficios" },
];
const trailingNavLinks: NavLink[] = [
  { name: "Galería",   path: "#galeria" },
  //{ name: "Ubicación", path: "#tienda" },
  { name: "Contacto",  path: "#contacto" },
];
const allNavLinks = [...simpleNavLinks, ...trailingNavLinks];

const activeSection      = ref("#inicio");
const mobileMenuOpen     = ref(false);
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
const megaOpen    = ref(false);
const triggerRef  = ref<HTMLElement | null>(null);
const megaRef     = ref<HTMLElement | null>(null);
let closeTimer: ReturnType<typeof setTimeout> | null = null;

const categories    = ref<Category[]>([]);
const subcategories = ref<Subcategory[]>([]);
const activeCatId   = ref<number | null>(null);

const activeCategorySlug = computed(() =>
  activeCatId.value === null ? "" : categories.value.find(c => c.id === activeCatId.value)?.slug ?? ""
);
const filteredSubs = computed(() =>
  activeCatId.value === null ? subcategories.value : subcategories.value.filter(s => s.categoryId === activeCatId.value)
);
const totalProductCount = computed(() => categories.value.reduce((t, c) => t + (c.productCount ?? 0), 0));
const subCountForCat = (id: number) => categories.value.find(c => c.id === id)?.productCount ?? 0;
const isProductsPage = computed(() => route.path.includes("/productos"));

const fetchCatalog = async () => {
  try {
    const res = await $fetch<{ data: Array<Category & { subcategories?: Subcategory[] }> }>("/api/categories?active=true");
    categories.value    = res.data.map(({ subcategories: _s, ...c }) => c);
    subcategories.value = res.data.flatMap(c => (c.subcategories ?? []).map(s => ({ ...s, categoryId: c.id })));
  } catch (e) { console.error(e); }
};

const openMega = async () => {
  megaOpen.value = true;
  if (!categories.value.length) await fetchCatalog();
  if (categories.value.length && activeCatId.value === null) activeCatId.value = categories.value[0].id;
};
const closeMega   = () => { megaOpen.value = false; };
const toggleMega  = () => { megaOpen.value ? closeMega() : openMega(); };
const previewCategory = (id: number | null) => { activeCatId.value = id; };
const goToCategory = (id: number | null) => {
  closeMega();
  const slug = id === null ? "" : categories.value.find(c => c.id === id)?.slug ?? "";
  window.location.assign(id === null ? "/productos" : `/productos?categoria=${slug}`);
};
const openMenuOnHover = () => { if (closeTimer) clearTimeout(closeTimer); openMega(); };
const scheduleClose   = () => { if (closeTimer) clearTimeout(closeTimer); closeTimer = setTimeout(closeMega, 180); };
const cancelClose     = () => { if (closeTimer) clearTimeout(closeTimer); };

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
/* ═══════════════════════════════════
   HEADER — CELPARTS TECH DARK
═══════════════════════════════════ */
.cp-header {
  --cp-cyan:        #00AEEF;
  --cp-cyan-dark:   #0077C8;
  --cp-cyan-deep:   #003F8A;
  --cp-cyan-light:  #50D0FF;
  --cp-ice:         #A8EDFF;
  --cp-fog:         #C0E8FF;
  --cp-bg:          #0A0A0A;
  --cp-surface:     #111827;
  --cp-border:      rgba(0, 174, 239, 0.18);
  --cp-border-dim:  rgba(0, 174, 239, 0.10);
  --cp-text:        #FFFFFF;
  --cp-text-muted:  rgba(168, 237, 255, 0.70);

  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  transition:
    background 0.35s ease,
    border-color 0.35s ease,
    box-shadow 0.35s ease;
}

/* ── BACKDROP ── */
.cp-header__blur {
  position: absolute;
  inset: 0;
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  background:
    linear-gradient(135deg,
      rgba(10, 10, 10, 0.82),
      rgba(17, 24, 39, 0.76));
  border-bottom: 1px solid var(--cp-border);
  box-shadow:
    0 8px 30px rgba(0, 0, 0, 0.50),
    inset 0 1px 0 rgba(0, 174, 239, 0.12);
}

.cp-header--scrolled .cp-header__blur {
  background:
    linear-gradient(135deg,
      rgba(10, 10, 10, 0.92),
      rgba(17, 24, 39, 0.88));
  border-bottom-color: rgba(0, 174, 239, 0.26);
  box-shadow:
    0 14px 40px rgba(0, 0, 0, 0.60),
    0 0 0 1px rgba(0, 174, 239, 0.08),
    inset 0 1px 0 rgba(0, 174, 239, 0.16);
}

/* ── CONTAINER ── */
.cp-header__container {
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

/* ═══════════════════════════════════
   LEFT
═══════════════════════════════════ */
.cp-header__left {
  display: flex;
  align-items: center;
  gap: 18px;
}

/* ═══════════════════════════════════
   LOGO
═══════════════════════════════════ */
.cp-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.cp-logo__icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
  filter:
    drop-shadow(0 0 10px rgba(0, 174, 239, 0.45))
    drop-shadow(0 4px 12px rgba(0, 0, 0, 0.40));
}

.cp-logo__text {
  height: 20px;
  width: auto;
  object-fit: contain;
  filter: brightness(0) invert(1);
  opacity: 0.92;
}

/* ═══════════════════════════════════
   NAV
═══════════════════════════════════ */
.cp-nav {
  display: flex;
  align-items: center;
  gap: 4px;
}

.cp-nav__link {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  color: var(--cp-text-muted);
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  border: 1px solid transparent;
  transition:
    background 0.22s ease,
    color 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease,
    transform 0.22s ease;
}

.cp-nav__link:hover {
  color: var(--cp-cyan-light);
  background: rgba(0, 174, 239, 0.10);
  border-color: var(--cp-border);
  box-shadow: 0 0 14px rgba(0, 174, 239, 0.14);
}

.cp-nav__link.active {
  color: var(--cp-cyan-light);
  background: rgba(0, 174, 239, 0.12);
  border-color: rgba(0, 174, 239, 0.28);
  box-shadow:
    inset 0 1px 0 rgba(80, 208, 255, 0.18),
    0 0 18px rgba(0, 174, 239, 0.16);
}

.cp-nav__button {
  border: none;
  cursor: pointer;
  font-family: inherit;
  background: transparent;
}

.cp-chevron {
  margin-left: 6px;
  transition: transform 0.24s ease;
  color: currentColor;
}
.cp-chevron.open { transform: rotate(180deg); }

/* ═══════════════════════════════════
   CART
═══════════════════════════════════ */
.cp-cart {
  height: 44px;
  padding: 0 18px 0 0;
  border-radius: 999px;
  border: 1px solid var(--cp-border);
  background: rgba(0, 174, 239, 0.08);
  backdrop-filter: blur(20px);
  color: var(--cp-text);
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  box-shadow:
    inset 0 1px 0 rgba(0, 174, 239, 0.14),
    0 8px 24px rgba(0, 0, 0, 0.30);
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    background 0.22s ease,
    border-color 0.22s ease;
}

.cp-cart:hover {
  transform: translateY(-1px);
  background: rgba(0, 174, 239, 0.14);
  border-color: rgba(0, 174, 239, 0.34);
  box-shadow:
    inset 0 1px 0 rgba(80, 208, 255, 0.20),
    0 0 20px rgba(0, 174, 239, 0.22),
    0 14px 30px rgba(0, 0, 0, 0.40);
}

.cp-cart__icon {
  position: relative;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--cp-cyan-light);
}

.cp-cart__badge {
  position: absolute;
  top: 7px;
  right: 7px;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  border-radius: 999px;
  background: var(--cp-cyan);
  color: var(--cp-bg);
  font-size: 10px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cp-cart__info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.cp-cart__label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--cp-text-muted);
}

.cp-cart__amount {
  font-size: 13px;
  font-weight: 700;
  color: var(--cp-cyan-light);
}

/* ═══════════════════════════════════
   MEGA MENU
═══════════════════════════════════ */
.cp-products { position: relative; }

.cp-mega {
  position: absolute;
  top: calc(100% + 14px);
  left: 50%;
  transform: translateX(-50%);
  width: 780px;
  border-radius: 28px;
  overflow: hidden;
  background:
    linear-gradient(135deg,
      rgba(10, 10, 10, 0.90),
      rgba(17, 24, 39, 0.88));
  backdrop-filter: blur(36px) saturate(160%);
  -webkit-backdrop-filter: blur(36px) saturate(160%);
  border: 1px solid rgba(0, 174, 239, 0.22);
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.70),
    0 0 0 1px rgba(0, 174, 239, 0.08),
    inset 0 1px 0 rgba(0, 174, 239, 0.16);
}

.cp-mega__glow {
  position: absolute;
  top: -60px;
  right: -60px;
  width: 260px;
  height: 260px;
  border-radius: 999px;
  background: rgba(0, 174, 239, 0.14);
  filter: blur(80px);
  pointer-events: none;
}

.cp-mega__label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(0, 174, 239, 0.55);
  margin: 0 0 12px;
  padding: 0 4px;
}

.cp-mega__grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 230px 1fr;
  align-items: start;
}

/* ── CATEGORIES ── */
.cp-mega__categories {
  padding: 20px 16px;
  border-right: 1px solid rgba(0, 174, 239, 0.14);
  background: rgba(0, 63, 138, 0.10);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cp-cat {
  min-height: 44px;
  padding: 0 14px;
  border-radius: 14px;
  border: 1px solid transparent;
  background: rgba(0, 174, 239, 0.06);
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition:
    background 0.22s ease,
    border-color 0.22s ease,
    transform 0.22s ease,
    box-shadow 0.22s ease;
}

.cp-cat:hover,
.cp-cat.active {
  background: rgba(0, 174, 239, 0.14);
  border-color: rgba(0, 174, 239, 0.28);
  transform: translateX(3px);
  box-shadow: 0 0 14px rgba(0, 174, 239, 0.14);
}

.cp-cat__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--cp-border);
  flex-shrink: 0;
  transition: background 0.22s ease, box-shadow 0.22s ease;
}

.cp-cat.active .cp-cat__dot,
.cp-cat:hover .cp-cat__dot {
  background: var(--cp-cyan);
  box-shadow: 0 0 8px rgba(0, 174, 239, 0.80);
}

.cp-cat span {
  font-size: 14px;
  font-weight: 600;
  color: rgba(168, 237, 255, 0.82);
  flex: 1;
  text-align: left;
}

.cp-cat small {
  font-size: 11px;
  font-weight: 600;
  color: rgba(0, 174, 239, 0.45);
}

/* ── SUBS ── */
.cp-mega__subs {
  padding: 20px 18px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.cp-mega__subs .cp-mega__label {
  margin-bottom: 14px;
}

.cp-sub {
  position: relative;
  min-height: 44px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(192, 232, 255, 0.72);
  text-decoration: none;
  font-size: 13.5px;
  font-weight: 500;
  transition:
    background 0.20s ease,
    border-color 0.20s ease,
    color 0.20s ease,
    transform 0.20s ease;
}

.cp-sub:hover {
  background: rgba(0, 174, 239, 0.10);
  border-color: rgba(0, 174, 239, 0.20);
  color: var(--cp-cyan-light);
  transform: translateX(4px);
}

.cp-sub__icon {
  color: rgba(0, 174, 239, 0.40);
  display: flex;
  align-items: center;
  flex-shrink: 0;
  transition: color 0.20s ease;
}

.cp-sub:hover .cp-sub__icon {
  color: var(--cp-cyan);
}

/* ═══════════════════════════════════
   MOBILE
═══════════════════════════════════ */
.cp-mobile-btn { display: none; }
.cp-mobile     { display: none; }

@media (max-width: 1024px) {
  .cp-nav { display: none; }

  .cp-mobile-btn {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    border: 1px solid var(--cp-border);
    background: rgba(0, 174, 239, 0.08);
    backdrop-filter: blur(18px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    cursor: pointer;
    transition: background 0.22s ease, border-color 0.22s ease;
  }

  .cp-mobile-btn:hover {
    background: rgba(0, 174, 239, 0.14);
    border-color: rgba(0, 174, 239, 0.30);
  }

  .cp-mobile-btn span {
    width: 16px;
    height: 1.5px;
    background: var(--cp-cyan-light);
    border-radius: 999px;
    transition: transform 0.22s ease, opacity 0.22s ease;
  }

  .cp-mobile-btn.open span:nth-child(1) { transform: translateY(5.5px) rotate(45deg); }
  .cp-mobile-btn.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .cp-mobile-btn.open span:nth-child(3) { transform: translateY(-5.5px) rotate(-45deg); }

  .cp-mobile {
    display: block;
    position: relative;
    z-index: 4;
    background: rgba(10, 10, 10, 0.95);
    backdrop-filter: blur(28px);
    border-top: 1px solid var(--cp-border);
  }

  .cp-mobile__inner {
    padding: 16px 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .cp-mobile__link,
  .cp-mobile-products__toggle,
  .cp-mobile-products__item {
    min-height: 50px;
    border-radius: 16px;
    padding: 0 18px;
    display: flex;
    align-items: center;
    color: rgba(168, 237, 255, 0.82);
    text-decoration: none;
    background: rgba(0, 174, 239, 0.07);
    border: 1px solid var(--cp-border-dim);
    font-size: 14px;
    font-weight: 600;
    backdrop-filter: blur(18px);
    transition: background 0.20s ease, border-color 0.20s ease, color 0.20s ease;
    cursor: pointer;
    font-family: inherit;
    justify-content: space-between;
  }

  .cp-mobile__link:hover,
  .cp-mobile-products__toggle:hover,
  .cp-mobile-products__item:hover {
    background: rgba(0, 174, 239, 0.14);
    border-color: rgba(0, 174, 239, 0.28);
    color: var(--cp-cyan-light);
  }

  .cp-mobile-products {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .cp-mobile-products__items {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-left: 12px;
  }

  .cp-mobile-products__item {
    min-height: 44px;
    font-size: 13px;
    opacity: 0.85;
  }

  .cp-mega {
    width: 95vw;
  }
}

@media (max-width: 640px) {
  .cp-header__container {
    height: 68px;
    padding: 0 16px;
  }

  .cp-logo__text {
    height: 18px;
  }

  .cp-cart__info {
    display: none;
  }

  .cp-cart {
    width: 48px;
    padding: 0;
    justify-content: center;
    border-radius: 14px;
  }

  .cp-mega__grid {
    grid-template-columns: 1fr;
  }

  .cp-mega__categories {
    border-right: none;
    border-bottom: 1px solid rgba(0, 174, 239, 0.14);
  }

  .cp-mega__categories,
  .cp-mega__subs {
    padding: 14px;
  }
}

/* ═══════════════════════════════════
   ANIMATIONS
═══════════════════════════════════ */
.cp-fade-enter-active,
.cp-fade-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.cp-fade-enter-from,
.cp-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px) scale(0.98);
}

.mobile-slide-enter-active,
.mobile-slide-leave-active {
  transition: opacity 0.24s ease, transform 0.24s ease;
}
.mobile-slide-enter-from,
.mobile-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>