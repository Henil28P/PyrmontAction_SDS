<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../../stores/authStore';
import services from '../dashboardServices';
import AccountDetailsComponent from '../components/AccountDetailsComponent.vue';
import MeetingMinutesMember from '../components/member/MeetingMinutesMember.vue';
import { formatDate } from '@/utils/dateUtils';
import DeleteButton from '../components/DeleteAccountButton.vue';

const router = useRouter();
const userStore = useUserStore();

const userData = ref(null);

// Run on component mount at startup of webpage
onMounted(async () => {
  // Make alerts based on Payment events  
  const queryParams = new URLSearchParams(window.location.search);
  const status = queryParams.get('status');
  if (status === 'cancelled') {
      alert('Payment was cancelled. Please try again to renew your membership.');
  } else if (status === 'success') {
      alert('Payment successful! Your membership has been renewed.');
  }


  try {
    // Check authentication and load data
    if (!userStore.isAuthenticated) {
      console.warn('User not authenticated, redirecting to login.');
      logout();
      return;
    }

    // Use token from store for API calls
    const response = await services.getCurrentUserDetails(userStore.getToken);
    console.log('API Response:', response); // Debug log
    
    userData.value = response;
    
  } catch (error) {
    console.error('Failed to load member data:', error);
    logout();
  }

  const logout = async () => {
    const router = useRouter();
    const userStore = useUserStore();

    // Clear token from store
    userStore.logout();
    await router.push('/login');
  };
});

const isActive = computed(() => {
  if (!userData.value || !userData.value.memberExpiryDate) {
    return false; // Default to inactive if data is not loaded
  }

  const todayDate = new Date();
  const expiryDate = new Date(userData.value.memberExpiryDate);

  return expiryDate >= todayDate;
});

function handleUserUpdated(updatedUserData) {
  userData.value = { ...userData.value, ...updatedUserData };
  console.log('User updated successfully:', updatedUserData);
}

async function openRenewCheckout() {
  try {
    const response = await services.createRenewCheckout(userStore.getToken); // Fixed reference to `services`
    if (response.checkoutUrl) {
      window.location.href = response.checkoutUrl; // Redirect to Stripe Checkout
    } 
  } catch (error) {
    console.error('Error during renewal checkout:', error);
    alert('Failed to initiate renewal checkout. Please try again later.');
  }
}
</script>

<template>
  <div class="page">
    <main class="container content">
      <!-- Hero -->
      <section class="hero" v-if="userData">
        <h1 class="hero__title">
          Welcome back, {{ userData?.firstName }}
          <span class="wave">👋</span>
        </h1>
        <p class="hero__sub">Here's a quick snapshot of your membership.</p>
      </section>

      <!-- Top Summary Cards -->
      <section class="cards-row" v-if="userData">
        <article class="summary-card">
          <div class="summary-head">
            <!-- <span class="summary-icon">O</span> -->
            <span class="summary-label">Account Type</span>
          </div>
          <div class="summary-value">Community Member</div>
        </article>

        <article class="summary-card">
          <div class="summary-head">
            <!-- <span class="summary-icon">O</span> -->
            <span class="summary-label">Payment Expiry</span>
          </div>
          <div class="summary-value">{{ formatDate(userData?.memberExpiryDate) }}</div>
          <button class="link-btn" @click="openRenewCheckout">Renew membership</button>
        </article>

        <article class="summary-card">
          <div class="summary-head">
            <!-- <span class="summary-icon">O</span> -->
            <span class="summary-label">Status</span>
          </div>
          <div
            class="summary-value pill"
            :class="isActive ? 'pill--green' : 'pill--red'"
          >
            <span class="dot" :class="isActive ? 'dot--green' : 'dot--red'"></span>
            {{ isActive ? "Active" : "Deactivated" }}
          </div>
        </article>
      </section>

      <!-- Account Details Component -->
      <AccountDetailsComponent 
        v-if="userData"
        :userData="userData"
        @userUpdated="handleUserUpdated"
      />

      <!-- Meeting Minutes Component -->
      <MeetingMinutesMember v-if="userData"/>
      
      <!-- Delete Button Component -->
      <DeleteButton v-if="userData"/>
    </main>
  </div>
</template>



<style scoped>
/* page + container */
.page { background:#f9fafb; min-height:100vh; color:#0f172a; }
.container { max-width:1080px; margin:0 auto; padding:28px 20px 60px; }

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
.summary-icon{ font-size:20px; }
.summary-label{ font-size:.9rem; color:#6b7280; font-weight:600; }
.summary-value{ font-size:1.2rem; font-weight:800; margin:4px 0; }
.link-btn{ border:0; background:0; color:#0ea5b7; font-weight:700; cursor:pointer; }



/* pills */
.pill{
  display:inline-flex; align-items:center; gap:8px;
  padding:6px 12px; border-radius:999px; font-weight:700; font-size:.95rem;
}
.pill--green{ background:#e7f7ed; color:#0a7a3f; }
.pill--red{ background:#fdecec; color:#b42318; }
.dot{ width:10px; height:10px; border-radius:50%; }
.dot--green{ background:#16a34a; }
.dot--red{ background:#ef4444; }
</style>
