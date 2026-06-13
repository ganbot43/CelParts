<script setup lang="ts">
const { waLink } = useArigumi()
</script>

<template>
  <div class="wa-float">
    <div class="wa-float-tooltip">¡Escríbenos!</div>
    <a
      :href="waLink('Hola Arigumi, vi su web y quisiera consultar')"
      class="wa-float-btn"
      target="_blank"
      rel="noopener"
      aria-label="Contactar por WhatsApp"
    >
      <LandingWaIcon :size="28" />
    </a>
  </div>
</template>

<style scoped>
.wa-float {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.wa-float-tooltip {
  background: var(--text-title);
  color: #fff;
  font-size: .8rem;
  font-weight: 600;
  padding: .4rem .85rem;
  border-radius: 999px;
  white-space: nowrap;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity .2s ease, transform .2s ease;
  pointer-events: none;
}

.wa-float:hover .wa-float-tooltip {
  opacity: 1;
  transform: translateY(0);
}

.wa-float-btn {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: #25D366;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(37,211,102,.4);
  transition: transform .18s ease, box-shadow .18s ease;
  color: #fff;
  position: relative;
}

.wa-float-btn:hover {
  transform: scale(1.1) translateY(-2px);
  box-shadow: 0 8px 28px rgba(37,211,102,.5);
}

.wa-float-btn::before {
  content: '';
  position: absolute;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: rgba(37,211,102,.35);
  animation: waPulse 2.4s ease infinite;
}

@keyframes waPulse {
  0%   { transform: scale(1); opacity: .8; }
  70%  { transform: scale(1.55); opacity: 0; }
  100% { transform: scale(1.55); opacity: 0; }
}
</style>
