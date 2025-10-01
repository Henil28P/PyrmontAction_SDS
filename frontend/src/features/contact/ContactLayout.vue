<!-- src/layouts/ContactLayout.vue -->
<template>
  <div class="contact-layout">

    <main class="contact-main">
      <router-view />
    </main>

  </div>
</template>

<script setup>
</script>

<style scoped>
.contact-layout {
  font-family: 'League Spartan', sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #F5F9FC;
  color: #333;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* HEADER */
.contact-header {
  background-color: #FFFFFF;
  padding: 0;
  box-shadow: none;
}

/* MAIN CONTENT */
.contact-main {
  flex: 1;
  margin: 0;
  padding: 0;
  padding-bottom: 3%;
}

/* FOOTER */
.contact-footer {
  background-color: #FFFFFF;
  text-align: center;
  padding: 0;
  box-shadow: none;
}

.footer-text {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
  padding: 1rem;
}
</style>
