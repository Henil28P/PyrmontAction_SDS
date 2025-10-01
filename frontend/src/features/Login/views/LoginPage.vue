<template>
  <div class="login container">
    <h1>Login</h1>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button :disabled="loading">{{ loading ? "Logging in" : "Log in" }}</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const router = useRouter();
const { setUser } = useAuth();

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

async function login() {
  loading.value = true;
  error.value = "";
  try {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value, password: password.value })
    });
    const data = await res.json();
    if (!res.ok) {
      error.value = data?.message || "Login failed";
      loading.value = false;
      return;
    }
    const token = typeof data?.token === "string"
      ? data.token
      : (data?.token?.accessToken || null);

    if (!token) {
      error.value = "No token returned from server";
      loading.value = false;
      return;
    }

    // Save auth + go home
    setUser({ email: email.value, token, role: (data?.user?.role ?? 1) });
    router.push("/");
  } catch (e) {
    error.value = e.message || String(e);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.container{ max-width:480px; margin:40px auto; background:#fff; padding:20px; }
input{ width:100%; padding:10px; margin:8px 0 12px; }
button{ background:#111; color:#fff; border:0; padding:10px 14px; font-weight:700; }
.error{ color:#b42318; margin-top:12px; }
</style>
