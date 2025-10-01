<template>
  <section class="join">
    <div class="container">
      <h1 class="title">Join Pyrmont Action</h1>
      <p class="subtitle">Be part of our community and make a difference</p>
      <form class="join-form">
        <input type="text" placeholder="First name" required />
        <input type="text" placeholder="Last name" required />
        <input type="email" placeholder="Email" required />
         param($m) if($m.Value -match 'type='){$m.Value}else{$m.Value -replace '<button','<button type="submit"'} Sign up</button>
      </form>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.join{ padding:60px 20px; background:#fafafa; text-align:center; }
.title{ font-size:2rem; font-weight:800; margin-bottom:10px; }
.subtitle{ font-size:1.1rem; color:var(--muted); margin-bottom:30px; }
.join-form{ display:flex; flex-direction:column; gap:14px; max-width:400px; margin:0 auto; }
input{ padding:10px 14px; border:1px solid #ddd; border-radius:4px; }
</style>

