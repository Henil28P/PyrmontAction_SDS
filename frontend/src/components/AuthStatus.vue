<template>
  <div class="auth-status">
    <template v-if="isLoggedIn">
      <span class="user-email">{{ email }}</span>
      <button class="btn-logout" @click="handleLogout">Sign out</button>
    </template>
    <template v-else>
      <RouterLink class="btn-login" to="/login">Login</RouterLink>
    </template>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const { email, isLoggedIn, logout } = useAuth();

function handleLogout() {
  logout();
  router.push("/");
}
</script>

<style scoped>
.auth-status { display: inline-flex; align-items: center; gap: 12px; }
.user-email { font-weight: 600; }
.btn-login, .btn-logout {
  border: 0; padding: 6px 10px; font-weight: 600; cursor: pointer;
  text-decoration: none; color: #111; background: #f3f3f3; border-radius: 6px;
}
.btn-login:hover, .btn-logout:hover { filter: brightness(0.95); }
</style>
