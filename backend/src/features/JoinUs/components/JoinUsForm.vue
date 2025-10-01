<template>
  <div class="join-wrapper">
    <div v-if="status === 'success'" class="alert success">
       Payment successful  check your email to log in.
    </div>
    <div v-else-if="status === 'cancel'" class="alert warn">
       Payment was cancelled. You can try again.
    </div>
    <div v-if="error" class="alert error">{{ error }}</div>

    <form class="join-form" @submit.prevent="startJoin">
      <section>
        <h2>Login Details</h2>
        <input v-model.trim="email" type="email" placeholder="Email address" required />
        <input v-model="password" type="password" placeholder="Password" required />
      </section>

      <section>
        <h2>Personal Details</h2>
        <div class="row">
          <input v-model.trim="firstName" type="text" placeholder="First Name" required />
          <input v-model.trim="lastName" type="text" placeholder="Last Name" required />
        </div>
        <input v-model.trim="mobilePhone" type="tel" placeholder="Mobile Phone" />
        <input v-model.trim="areaOfInterest" type="text" placeholder="Area of Interest" />
      </section>

      <section>
        <h2>Address Details</h2>
        <input v-model.trim="streetName" type="text" placeholder="Street Name" />
        <div class="row">
          <input v-model.trim="city" type="text" placeholder="City" />
          <select v-model="state">
            <option value="" disabled>State</option>
            <option>NSW</option><option>VIC</option><option>QLD</option>
            <option>SA</option><option>WA</option><option>TAS</option>
            <option>NT</option><option>ACT</option>
          </select>
        </div>
        <input v-model.trim="postcode" type="text" placeholder="Postcode" />
      </section>

      <button class="submit" :disabled="loading">
        <span v-if="!loading">Sign Up</span>
        <span v-else>Redirecting to Stripe</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const status = computed(() => route.query.status || '')

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const email = ref('')
const password = ref('')
const firstName = ref('')
const lastName = ref('')
const mobilePhone = ref('')
const areaOfInterest = ref('')
const streetName = ref('')
const city = ref('')
const state = ref('')
const postcode = ref('')

const loading = ref(false)
const error = ref('')

async function startJoin () {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Email and password are required.'
    return
  }
  loading.value = true
  try {
    const res = await fetch(`${API}/api/join/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        firstName: firstName.value,
        lastName: lastName.value,
        mobilePhone: mobilePhone.value,
        areaOfInterest: areaOfInterest.value,
        streetName: streetName.value,
        city: city.value,
        state: state.value,
        postcode: postcode.value
      })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.message || 'Unable to create checkout session')
    if (data?.url) {
      window.location.href = data.url
    } else {
      throw new Error('Stripe did not return a checkout URL')
    }
  } catch (e) {
    error.value = e.message || 'Something went wrong'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.join-wrapper { max-width: 980px; margin: 0 auto; }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.join-form { display: grid; gap: 18px; }
.join-form input, .join-form select {
  width: 100%; padding: 10px 12px; border: 1px solid #e5e7eb; border-radius: 8px;
}
.submit {
  width: 100%; padding: 12px; border-radius: 10px; border: 0; background: #e0a437; color: #fff;
  font-weight: 800; cursor: pointer;
}
.submit[disabled] { opacity: .7; cursor: not-allowed; }
.alert { padding: 10px 14px; border-radius: 8px; margin: 12px 0; font-weight: 700; }
.alert.success { background: #e7f7ed; color: #0a7a3f; }
.alert.warn { background: #fff7e6; color: #9a6b00; }
.alert.error { background: #fdecec; color: #b42318; }
section h2 { font-size: 1rem; font-weight: 800; margin: 4px 0 8px; }
</style>
