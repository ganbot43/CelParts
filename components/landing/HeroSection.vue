<template>
  <section class="hero" id="inicio">
    <div class="hero-image-wrap">
      <img src="/images/hero2.jpeg" alt="Utensilios de cocina Joymar" />
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
.hero {
  width: 100%;
  position: relative;
  overflow: hidden;
  line-height: 0;
}

.hero-image-wrap {
  width: 100%;
  height: 62vh;
  min-height: 400px;
  overflow: hidden;
}

.hero-image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

/* Responsive */
@media (max-width: 1100px) {
  .hero-image-wrap {
    height: 50vh;
    min-height: 320px;
  }
}

@media (max-width: 700px) {
  .hero-image-wrap {
    height: 40vh;
    min-height: 250px;
  }

  .hero-image-wrap img {
    object-position: center top;
  }
}
</style>
