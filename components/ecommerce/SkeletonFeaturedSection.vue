<template>
  <div class="sk-featured-grid">
    <!-- Hero skeleton -->
    <div class="sk-card sk-card--hero">
      <div class="sk-img shimmer" />
      <div class="sk-body">
        <div class="sk-category shimmer" />
        <div class="sk-line shimmer" style="width: 85%" />
        <div class="sk-line shimmer" style="width: 60%" />
        <div class="sk-desc shimmer" style="width: 100%" />
        <div class="sk-desc shimmer" style="width: 75%" />
        <div class="sk-footer">
          <div class="sk-price shimmer" />
          <div class="sk-btn shimmer" />
        </div>
      </div>
    </div>

    <!-- Side cards skeleton -->
    <div v-for="n in 2" :key="n" class="sk-card">
      <div class="sk-img shimmer" />
      <div class="sk-body">
        <div class="sk-category shimmer" />
        <div class="sk-line shimmer" style="width: 80%" />
        <div class="sk-line shimmer" style="width: 55%" />
        <div class="sk-desc shimmer" style="width: 90%" />
        <div class="sk-footer">
          <div class="sk-price shimmer" />
          <div class="sk-btn shimmer" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.sk-featured-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 28px;
}

.sk-card {
  background: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 26px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.sk-card--hero {
  flex-direction: row;
}

.sk-img {
  background: #f0f0f0;
  aspect-ratio: 1;
  flex-shrink: 0;
}

.sk-card--hero .sk-img {
  width: 50%;
  aspect-ratio: auto;
}

.sk-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  justify-content: center;
}

.sk-category {
  height: 10px;
  width: 60px;
  border-radius: 6px;
  background: #f0f0f0;
  margin-bottom: 4px;
}

.sk-line {
  height: 14px;
  border-radius: 6px;
  background: #f0f0f0;
}

.sk-card--hero .sk-line {
  height: 18px;
}

.sk-desc {
  height: 11px;
  border-radius: 6px;
  background: #f0f0f0;
}

.sk-footer {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}

.sk-price {
  width: 70px;
  height: 20px;
  border-radius: 6px;
  background: #f0f0f0;
}

.sk-btn {
  width: 90px;
  height: 32px;
  border-radius: 999px;
  background: #f0f0f0;
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

@media (max-width: 900px) {
  .sk-featured-grid {
    grid-template-columns: 1fr 1fr;
  }
  .sk-card--hero {
    grid-column: span 2;
    flex-direction: column;
  }
  .sk-card--hero .sk-img {
    width: 100%;
    aspect-ratio: 16 / 9;
  }
}

@media (max-width: 600px) {
  .sk-featured-grid {
    grid-template-columns: 1fr;
  }
  .sk-card--hero {
    grid-column: span 1;
  }
}
</style>
