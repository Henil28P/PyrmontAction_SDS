import { onMounted } from 'vue';
import axios from 'axios';

onMounted(async () => {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session_id');

  if (sessionId) {
    try {
      const res = await axios.get(`/api/payments/status?session_id=${sessionId}`);
      console.log('Updated payment info:', res.data);
      window.location.href = '/member-dashboard'; // reload cleanly
    } catch (err) {
      console.error('Error verifying payment:', err);
    }
  }
});

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, RouterLink, useRoute } from 'vue-router'
import { useUserStore } from '../../../stores/authStore'
import services from '../accountServices'
import AccountDetailsComponent from '../components/AccountDetailsComponent.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const userData = ref(null)
const paymentStatus = ref('')

// Run on component mount
onMounted(async () => {
  try {
    // Handle post-payment redirect
    if (route.query.success === 'true') {
      paymentStatus.value = '✅ Payment successful! Thank you for renewing your membership.'
      await confirmPayment(route.query.session_id)
      setTimeout(() => {
        paymentStatus.value = ''
      }, 4000)
    }

    // Check authentication and load data
    if (!userStore.isAuthenticated) {
      console.warn('User not authenticated, redirecting to login.')
      logout()
      return
    }

    // Use token from store for API calls
    const response = await services.getCurrentUserDetails(userStore.getToken)
    console.log('API Response:', response)
    userData.value = response
    // ✅ Check if payment just succeeded (Stripe redirect)
    if (route.query.paid === 'true') {
      // Set expiry to 1 year from today
      const newExpiry = new Date();
      newExpiry.setFullYear(newExpiry.getFullYear() + 1);
      userData.value.membershipExpiry = newExpiry.toISOString();

      alert('✅ Payment successful! Your membership has been renewed.');
}

  } catch (error) {
    console.error('Failed to load member data:', error)
    logout()
  }
})

const logout = async () => {
  const router = useRouter()
  const userStore = useUserStore()
  userStore.logout()
  await router.push('/login')
}

const minutes = ref([
  { id: 1, title: "AGM Minutes – July 2025", date: "Jul 28, 2025", url: "#" },
  { id: 2, title: "Committee Meeting – Aug 2025", date: "Aug 18, 2025", url: "#" },
  { id: 3, title: "General Meeting – Sept 2025", date: "Sep 10, 2025", url: "#" }
])

function handleEditPersonalDetails() {
  showEditModal.value = true
}

function closeEditPersonalDetailsModal() {
  showEditModal.value = false
}

function handleUserUpdated(updatedUserData) {
  userData.value = updatedUserData
  console.log('User updated successfully:', updatedUserData)
}

// ✅ Stripe membership checkout
async function startMembershipCheckout() {
  try {
    const email = userData.value?.email || 'test@example.com'
    const res = await fetch('/api/payments/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()
    if (data.url) {
      window.location.href = data.url // Redirect to Stripe Checkout
    } else {
      alert('Failed to start checkout')
    }
  } catch (err) {
    console.error(err)
    alert('Error starting payment')
  }
}

// ✅ Confirm payment with backend (updates DB)
async function confirmPayment(sessionId) {
  try {
    if (!sessionId) return
    await fetch('/api/payments/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
    })
    console.log('Payment confirmation sent for session:', sessionId)
  } catch (err) {
    console.error('Error confirming payment:', err)
  }
}
</script>

<template>
  <div class="page">
    <main class="container content">
      <!-- ✅ Payment Success Message -->
      <div v-if="paymentStatus" class="payment-message">
        {{ paymentStatus }}
      </div>

      <!-- Hero -->
      <section class="hero">
        <h1 class="hero__title">
          Welcome back, {{ userData?.firstName }}
          <span class="wave">👋</span>
        </h1>
        <p class="hero__sub">Here's a quick snapshot of your membership.</p>
      </section>

      <!-- Top Summary Cards -->
      <section class="cards-row">
        <article class="summary-card">
          <div class="summary-head">
            <span class="summary-label">Account Type</span>
          </div>
          <div class="summary-value">{{ userStore?.getRole }}</div>
        </article>

        <article class="summary-card">
          <div class="summary-head">
            <span class="summary-label">Payment Expiry</span>
          </div>
          <div class="summary-value">
            {{ userData?.membershipExpiry ? new Date(userData.membershipExpiry).toLocaleDateString() : 'Not set' }}
          </div>

          <button class="link-btn" @click="startMembershipCheckout">
            Renew membership
          </button>
        </article>

        <article class="summary-card">
          <div class="summary-head">
            <span class="summary-label">Status</span>
          </div>
          <div
            class="summary-value pill"
            :class="userData?.isActive ? 'pill--green' : 'pill--red'"
          >
            <span class="dot" :class="userData?.isActive ? 'dot--green' : 'dot--red'"></span>
            {{ userData?.isActive ? "Active" : "Deactivated" }}
          </div>
        </article>
      </section>

      <!-- Account Details Component -->
      <AccountDetailsComponent 
        v-if="userData"
        :userData="userData"
        @userUpdated="handleUserUpdated"
      />

      <!-- Meeting Minutes -->
      <section class="minutes-card">
        <div class="minutes-head">
          <div class="minutes-title">
            <h2>Meeting Minutes</h2>
            <p class="muted">Latest published minutes</p>
          </div>

          <RouterLink to="/member/minutes" class="btn-all" aria-label="View all minutes">
            View all
          </RouterLink>
        </div>

        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Title</th>
                <th class="th-date">Date</th>
                <th class="th-action">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in minutes" :key="m.id">
                <td>
                  <div class="title-cell">
                    <span class="paper-emoji">📄</span>
                    <span>{{ m.title }}</span>
                  </div>
                </td>
                <td class="td-date">{{ m.date }}</td>
                <td class="td-action">
                  <a :href="m.url" target="_blank" rel="noopener" class="btn-view">View</a>
                </td>
              </tr>
              <tr v-if="!minutes.length">
                <td colspan="3" class="empty">No minutes available.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* page + container */
.page { background:#f9fafb; min-height:100vh; color:#0f172a; }
.container { max-width:1080px; margin:0 auto; padding:28px 20px 60px; }

/* ✅ Payment Message */
.payment-message {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  padding: 10px 16px;
  margin-bottom: 16px;
  border-radius: 6px;
  font-weight: 500;
}

/* hero */
.hero__title{ font-size:clamp(28px,4vw,48px); font-weight:800; margin:0; }
.hero__sub{ margin:6px 0 20px; color:#6b7280; }
.wave{ margin-left:6px; }

/* summary cards */
.cards-row{
  display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
  gap:20px; margin-bottom:32px;
}
.summary-card{
  background:#fff; border:1px solid #e5e7eb; border-radius:14px;
  padding:18px 20px; box-shadow:0 3px 10px rgba(0,0,0,.04);
}
.summary-head{ display:flex; align-items:center; gap:10px; margin-bottom:6px; }
.summary-label{ font-size:.9rem; color:#6b7280; font-weight:600; }
.summary-value{ font-size:1.2rem; font-weight:800; margin:4px 0; }
.link-btn{ border:0; background:0; color:#0ea5b7; font-weight:700; cursor:pointer; }

/* pills */
.pill{ display:inline-flex; align-items:center; gap:8px; padding:6px 12px; border-radius:999px; font-weight:700; font-size:.95rem; }
.pill--green{ background:#e7f7ed; color:#0a7a3f; }
.pill--red{ background:#fdecec; color:#b42318; }
.dot{ width:10px; height:10px; border-radius:50%; }
.dot--green{ background:#16a34a; }
.dot--red{ background:#ef4444; }

/* minutes card */
.minutes-card{
  background:#fff; border:1px solid #e5e7eb; border-radius:16px;
  box-shadow:0 4px 16px rgba(0,0,0,.04); padding:20px;
}
.minutes-head{ display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:12px; }
.minutes-title h2{ margin:0 0 4px 0; font-size:1.2rem; font-weight:800; }
.minutes-title .muted{ margin:0; color:#6b7280; }

/* table */
.table-wrap{ overflow:auto; }
.table{ width:100%; border-collapse:separate; border-spacing:0; font-size:.95rem;
  border:1px solid #eef0f2; border-radius:12px; overflow:hidden; }
.table thead th{ text-align:left; background:#f6f7f9; color:#475569; font-weight:800;
  padding:12px 14px; border-bottom:1px solid #eef0f2; }
.table tbody td{ padding:12px 14px; border-bottom:1px solid #f1f3f5; }
.table tbody tr:last-child td{ border-bottom:0; }
.title-cell{ display:flex; align-items:center; gap:10px; font-weight:700; }
.th-date,.td-date{ width:160px; white-space:nowrap; color:#64748b; }
.th-action,.td-action{ width:120px; text-align:right; }
.btn-view{
  display:inline-block; padding:8px 12px; border-radius:10px; font-weight:800;
  text-decoration:none; color:#0ea5b7; background:#e6fbff; border:1px solid #c8f4fb;
}
.btn-view:hover{ filter:brightness(.98); }
.empty{ text-align:center; color:#64748b; }
</style>
