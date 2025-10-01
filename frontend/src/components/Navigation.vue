<template>
  <header class="site-header">
    <div class="container nav-wrap">
      <RouterLink class="brand" to="/">PYRMONTACTION</RouterLink>

      <nav class="main-nav">
        <RouterLink class="nav-link" to="/projects">Projects</RouterLink>
        <RouterLink class="nav-link" to="/about">About us</RouterLink>
        <RouterLink class="nav-link" to="/gallery">Gallery</RouterLink>
        <RouterLink class="nav-link" to="/contact">Contact</RouterLink>
        <RouterLink class="nav-link" to="/joinus">Join us</RouterLink>

        <!-- Right side: auth -->
        <RouterLink v-if="!isAuthed" class="btn btn-outline" to="/login">Login</RouterLink>
        <div v-else class="auth-right">
          <span class="email">{{ auth.state.email }}</span>
          <button class="btn btn-dark" @click="logout">Sign out</button>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const auth = useAuth();
const isAuthed = auth.isAuthed;

function logout() {
  auth.logout();
  router.push("/");
}
</script>

<style scoped>
:root{
  --gold:#dda23b;
  --black:#111;
  --muted:#6b7280;
}
.site-header{ background:#fff; border-bottom:1px solid #eee; }
.container{ max-width:1100px; margin:0 auto; padding:12px 16px; }
.nav-wrap{ display:flex; align-items:center; justify-content:space-between; gap:16px; }
.brand{ font-weight:800; letter-spacing:.5px; color:var(--black); text-decoration:none; }
.main-nav{ display:flex; gap:18px; align-items:center; flex-wrap:wrap; }
.nav-link{ color:#111; text-decoration:none; font-weight:600; opacity:.85 }
.nav-link:hover{ opacity:1 }
.auth-right{ display:flex; align-items:center; gap:10px; }
.email{ font-weight:700; color:#111; }
.btn{ padding:6px 12px; border-radius:4px; cursor:pointer; font-weight:700; }
.btn-outline{ border:1px solid var(--black); color:var(--black); background:#fff; }
.btn-outline:hover{ background:#f5f5f5; }
.btn-dark{ background:var(--black); color:#fff; border:1px solid var(--black); }
.btn-dark:hover{ opacity:.9 }
</style>
