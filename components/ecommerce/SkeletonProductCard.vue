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
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sk-img {
  aspect-ratio: 1 / 1;
  background: #f0f0f0;
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
  background: #e2e2e2;
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
  background: #f0f0f0;
}

.sk-price {
  height: 18px;
  width: 50%;
  border-radius: 6px;
  background: #f0f0f0;
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
  background: #f0f0f0;
}

.sk-btn-wa {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: #f0f0f0;
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
