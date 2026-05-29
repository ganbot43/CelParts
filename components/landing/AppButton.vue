<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'outline' | 'wa' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  target?: string
}>()
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    :target="target"
    :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
    class="btn"
    :class="[`btn-${variant ?? 'primary'}`, size ? `btn-${size}` : '']"
  >
    <slot />
  </component>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  font-size: .92rem;
  border-radius: var(--radius-sm);
  padding: .7rem 1.4rem;
  cursor: pointer;
  border: none;
  transition: transform .18s ease, box-shadow .18s ease, background .18s ease, color .18s ease;
  white-space: nowrap;
  text-decoration: none;
}

.btn-primary {
  background: #2D6A4F;
  color: #fff;
  box-shadow: 0 4px 14px rgba(45, 106, 79, 0.15);
}
.btn-primary:hover {
  background: #1E4D38;
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(45, 106, 79, 0.25);
}

.btn-outline {
  background: transparent;
  color: #2D6A4F;
  border: 2px solid #2D6A4F;
}
.btn-outline:hover {
  background: #2D6A4F;
  color: #fff;
  transform: translateY(-2px);
}

.btn-wa {
  background: #25D366;
  color: #fff;
  box-shadow: 0 4px 14px rgba(37, 211, 102, 0.20);
}
.btn-wa:hover {
  background: #1ebe59;
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(37, 211, 102, .3);
}

.btn-accent {
  background: #E9C46A;
  color: #111111;
  font-weight: 700;
}
.btn-accent:hover {
  background: #D9AF49;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(233, 196, 106, 0.30);
}

.btn-sm { padding: .45rem .85rem; font-size: .82rem; }
.btn-lg { padding: .85rem 1.8rem; font-size: 1rem; border-radius: 10px; }
</style>
