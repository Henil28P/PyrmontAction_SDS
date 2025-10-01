<template>
  <section class="features">
    <div class="container">
      <h2 class="title">Our Key Features</h2>
      <div class="grid">
        <div class="feature-card">
          <h3>Community Projects</h3>
          <p>Support and participate in ongoing local projects.</p>
        </div>
        <div class="feature-card">
          <h3>Events & Meetups</h3>
          <p>Join our regular events and connect with like-minded people.</p>
        </div>
        <div class="feature-card">
          <h3>Resources</h3>
          <p>Access a library of documents and media to stay informed.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.features{ padding:60px 20px; background:#fff; text-align:center; }
.title{ font-size:1.8rem; font-weight:800; margin-bottom:30px; }
.grid{ display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:20px; }
.feature-card{ background:#fafafa; padding:20px; border:1px solid #eee; border-radius:8px; }
.feature-card h3{ font-size:1.2rem; font-weight:700; margin-bottom:10px; }
.feature-card p{ color:var(--muted); font-size:0.95rem; }
</style>
