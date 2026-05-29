<template>
  <div class="sk-card" :style="{ '--count': count }">
    <template v-for="n in count" :key="n">
      <div class="sk-item">
        <div class="sk-img shimmer">
          <div class="sk-badge shimmer-inner" />
        </div>
        <div class="sk-body">
          <div class="sk-line shimmer" style="width: 90%" />
          <div class="sk-line shimmer" style="width: 65%" />
          <div class="sk-price shimmer" />
        </div>
        <div class="sk-footer">
          <div class="sk-btn-cart shimmer" />
          <div class="sk-btn-wa shimmer" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ count?: number }>(), {
  count: 4,
});
</script>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.sk-card {
  display: contents;
}

.sk-item {
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(226, 224, 217, 0.5);
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(17, 17, 17, 0.03), inset 0 1px 0 rgba(255,255,255,0.4);
}

.sk-img {
  aspect-ratio: 1 / 1;
  background: rgba(241, 239, 234, 0.9);
  position: relative;
  overflow: hidden;
}

.sk-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 64px;
  height: 18px;
  border-radius: 999px;
  background: rgba(45, 106, 79, 0.12);
}

.sk-body {
  padding: 0.9rem 1rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.sk-line {
  height: 12px;
  border-radius: 6px;
  background: rgba(45, 106, 79, 0.08);
}

.sk-price {
  height: 18px;
  width: 50%;
  border-radius: 6px;
  background: rgba(45, 106, 79, 0.12);
  margin-top: 4px;
}

.sk-footer {
  padding: 0 0.75rem 0.75rem;
  display: flex;
  gap: 8px;
}

.sk-btn-cart {
  flex: 1;
  height: 34px;
  border-radius: 8px;
  background: rgba(45, 106, 79, 0.08);
}

.sk-btn-wa {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: rgba(233, 196, 106, 0.12);
  flex-shrink: 0;
}

.shimmer {
  position: relative;
  overflow: hidden;
}

.shimmer::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.55) 50%,
    transparent 100%
  );
  animation: shimmer 1.4s ease-in-out infinite;
}
</style>
