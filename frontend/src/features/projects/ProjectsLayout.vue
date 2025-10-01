<template>
  <div class="projects-layout">
    <header class="projects-header">
      <div class="header-content">
        <h1 class="brand-title">Project Showcase</h1>
      </div>
    </header>

    <main class="projects-main">
      <!-- The child route (ProjectsView) will be injected here -->
      <router-view />
    </main>


  </div>
</template>

<script setup>
// No special script needed unless you want dynamic content in the header/footer.
</script>

<style scoped>
/* Define reusable color variables for easy theme adjustments */
:root {
  --primary-color: #3498db;
  --secondary-color: #72c4e5;
  --background-color: #F5F9FC;
  --header-gradient-start: #eef7fc;
  --header-gradient-end: #f8fcff;
  --text-color: #333;
  --muted-text-color: #666;
  --footer-background: #fff;
  --box-shadow-color: rgba(0, 0, 0, 0.08);
}

/* Layout Container */
.projects-layout {
  font-family: "Inter", sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--background-color);
  color: var(--text-color);
  overflow-x: hidden; /* prevents wave or other shapes from causing horizontal scroll */
  margin: 0; /* ensure no default browser margin */
}

/* Header */
.projects-header {
  background: linear-gradient(135deg, var(--header-gradient-start) 0%, var(--header-gradient-end) 100%);
  box-shadow: 0 4px 10px var(--box-shadow-color);
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 1rem 2rem;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-title {
  font-family: "League Spartan", sans-serif;
  font-size: 1.8rem;
  margin: 0;
  background: linear-gradient(to right, var(--primary-color) 0%, var(--secondary-color) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

/* Main Content */
.projects-main {
  flex: 1;
  max-width: 1200px;
  margin: 2rem auto;
  width: 100%;
  padding: 0 1rem;
}

/* Footer */
.projects-footer {
  background-color: var(--footer-background);
  text-align: center;
  padding: 1rem;
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.05);
}

.footer-text {
  color: var(--muted-text-color);
  font-size: 0.9rem;
  margin: 0;
}
</style>
