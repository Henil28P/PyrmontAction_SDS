<template>
  <section class="joinus">
    <div class="container">
      <h1 class="title">Become a Member</h1>
      <p class="subtitle">Fill in your details and join the Pyrmont Action community</p>

      <!-- Signup form -->
      <form v-if="!paidSuccess" class="form" @submit.prevent="onSubmit">
        <!-- Login -->
        <div class="form-section">
          <h3 class="section-heading">Login Details</h3>

          <input
            v-model.trim="form.email"
            type="email"
            placeholder="Email address"
            required
            autocomplete="email"
          />

          <div class="password-wrap">
            <input
              v-model="form.password"
              type="password"
              placeholder="Password"
              required
              autocomplete="new-password"
              :class="{ invalid: passwordTouched && !isPasswordValid }"
              @blur="passwordTouched = true"
            />
            <ul class="rules">
              <li :class="{ ok: hasMin }">At least 10 characters</li>
              <li :class="{ ok: hasUpper }">At least one upper-case letter</li>
              <li :class="{ ok: hasLower }">At least one lower-case letter</li>
              <li :class="{ ok: hasDigit }">At least one digit</li>
              <li :class="{ ok: hasSymbol }">At least one symbol</li>
            </ul>
          </div>
        </div>

        <!-- Personal -->
        <div class="form-section">
          <h3 class="section-heading">Personal Details</h3>
          <div class="grid">
            <input v-model.trim="form.firstName" placeholder="First Name" />
            <input v-model.trim="form.lastName" placeholder="Last Name" />
          </div>
          <input v-model.trim="form.mobilePhone" placeholder="Mobile Phone" />
          <input v-model.trim="form.areaOfInterest" placeholder="Area of Interest" />
        </div>

        <!-- Address -->
        <div class="form-section">
          <h3 class="section-heading">Address Details</h3>
          <input v-model.trim="form.streetName" placeholder="Street Name" />
          <div class="grid">
            <input v-model.trim="form.city" placeholder="City" />
            <input v-model.trim="form.state" placeholder="State" />
          </div>
          <input v-model.trim="form.postcode" placeholder="Postcode" />
        </div>

        <button
          type="submit"
          class="btn btn-gold"
          :disabled="loading || (passwordTouched && !isPasswordValid)"
        >
          {{ loading ? "Processing..." : "Sign Up & Pay" }}
        </button>
      </form>

      <!-- Payment success -->
      <div v-else class="successWrap">
        <p class="success">✅ Payment complete — your account is now active. Redirecting to login...</p>
        <p>
          If you are not redirected automatically,
          <RouterLink to="/login">click here to login</RouterLink>.
        </p>
      </div>

      <!-- Error -->
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const route = useRoute();
const router = useRouter();

const form = ref({
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  mobilePhone: "",
  areaOfInterest: "",
  streetName: "",
  city: "",
  state: "",
  postcode: ""
});

const loading = ref(false);
const error = ref("");
const paidSuccess = computed(() => route.query?.status === "success");

// --- password rule checks ---
const passwordTouched = ref(false);
const hasMin    = computed(() => form.value.password.length >= 10);
const hasUpper  = computed(() => /[A-Z]/.test(form.value.password));
const hasLower  = computed(() => /[a-z]/.test(form.value.password));
const hasDigit  = computed(() => /\d/.test(form.value.password));
const hasSymbol = computed(() => /[^A-Za-z0-9]/.test(form.value.password));
const isPasswordValid = computed(
  () => hasMin.value && hasUpper.value && hasLower.value && hasDigit.value && hasSymbol.value
);

// Redirect after 3s when payment is successful
watch(paidSuccess, (v) => {
  if (v) setTimeout(() => router.push("/login"), 3000);
});

async function onSubmit() {
  try {
    error.value = "";
    passwordTouched.value = true;
    if (!isPasswordValid.value) return;

    loading.value = true;
    const res = await fetch(`${API}/api/join/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form.value)
    });

    // in case server returns non-JSON
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { url: text }; }

    if (!res.ok) {
      error.value = data?.message || data?.error || "Failed to start checkout";
      return;
    }
    if (data?.url) {
      window.location.href = data.url; // Stripe or success URL
    } else {
      error.value = "No checkout URL returned.";
    }
  } catch (e) {
    error.value = e?.message || String(e);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.joinus { padding: 60px 20px; background: #fafafa; }
.container {
  max-width: 800px; margin: 0 auto; background: #fff;
  padding: 30px; border: 1px solid #eee; border-radius: 8px;
}
.title { font-size: 2rem; font-weight: 800; margin-bottom: 10px; text-align: center; }
.subtitle { font-size: 1.1rem; color: var(--muted); margin-bottom: 30px; text-align: center; }

.form-section { margin-bottom: 28px; text-align: left; }
.section-heading { font-size: 1.1rem; margin-bottom: 12px; font-weight: 700; color: var(--gold); }

.form input {
  width: 100%; padding: 10px 14px; margin-bottom: 12px;
  border: 1px solid #ddd; border-radius: 4px; background: #eef4ff;
}
.form input.invalid { border-color: #b42318; background: #fff7f7; }

.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.password-wrap { position: relative; }
.rules { font-size: .85rem; margin-top: 4px; padding-left: 18px; color: #b42318; }
.rules li { margin-bottom: 2px; list-style: disc; }
.rules li.ok { color: #198754; }

.btn { padding: 12px 16px; border-radius: 6px; font-weight: 700; cursor: pointer; width: 100%; }
.btn-gold { background: var(--gold); color: #fff; border: 1px solid var(--gold); }
.btn-gold[disabled] { opacity: .7; cursor: not-allowed; }
.btn-gold:not([disabled]):hover { opacity: .92; }

.error { color: #b42318; margin-top: 12px; text-align: center; }
.success { color: #0a7a3f; margin-top: 12px; font-weight: 700; }
.successWrap { text-align: center; padding: 20px; }
</style>
