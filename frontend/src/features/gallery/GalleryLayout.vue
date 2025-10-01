<template>
  <div class="gallery-layout">
    <main class="gallery-main">
      <router-view />
    </main>


  </div>
</template>

<script setup>
// No specific script needed for a simple layout
</script>

<style scoped>
/* Add styles specific to the gallery layout wrapper */
.gallery-layout {
  font-family: 'League Spartan', sans-serif; /* Or your preferred font */
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fdfdfd; /* Slightly different background? Or keep F5F9FC */
  color: #333;
  overflow-x: hidden; /* Prevent horizontal scroll */
}

/* Optional gallery-specific header styles */
/*
.gallery-header {
  background-color: #FFFFFF;
  padding: 1rem 7%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
*/

.gallery-main {
  flex: 1; /* Takes up available space */
  /* Add padding if needed, or let GalleryView handle it */
  /* padding: 2rem 7%; */
}

/* Reusing footer style from other layouts */
.gallery-footer {
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
