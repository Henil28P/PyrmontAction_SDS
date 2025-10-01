<!--src/layouts/AboutLayout.vue-->


<template>
  <div class="about-layout">
    <main class="about-main">
      <router-view />
    </main>

  </div>
</template>

<script setup>
// A simple layout for the About page
</script>

<style scoped>
.about-layout {
  font-family: 'League Spartan', sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #F5F9FC;
  color: #333;
  overflow-x: hidden;
  /* Increase or remove if you prefer a full-width layout */
}

.about-header {
  background-color: #FFFFFF;
  padding: 1rem 7%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.about-header h1 {
  font-size: 2.2rem;
  margin: 0;
  color: #3498DB;
  font-weight: 700;
}

.about-main {
  flex: 1;
}

.about-footer {
  background-color: #FFFFFF;
  padding: 1rem 7%;
  text-align: center;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
}

.footer-text {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}
</style>
