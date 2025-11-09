<template>
  <div class="page">
    <main class="container content">
      <!-- Hero -->
      <section class="hero">
        <div class="hero-header">
          <div>
            <h1 v-if="useUserStore().getRole === 'admin'" class="hero__title">Administrator's Dashboard</h1>
            <h1 v-if="useUserStore().getRole === 'editor'" class="hero__title">Content Manager's Dashboard</h1>
            <p v-if="activeTab === 'account'" class="hero__sub">Manage your Account Details here.</p>
            <p v-if="activeTab === 'minutes'" class="hero__sub">Upload and manage meeting of minutes here.</p>
            <p v-if="activeTab === 'members-list'" class="hero__sub">View the members list here.</p>
            <p v-if="activeTab === 'manager'" class="hero__sub">Manage and create Accounts here.</p>
          </div>
          <button class="editorial-btn" @click="$router.push('/editorial-dashboard')">
            Editorial
          </button>
        </div>
      </section>

      <!-- Tab buttons -->
      <div class="tabs">
        <button
          v-for="t in filteredTabs"
          :key="t.key"
          class="tab"
          :class="{ active: activeTab === t.key }"
          @click="activeTab = t.key"
        >
          {{ t.label }}
        </button>
      </div>

      <!-- Conditional rendering of each section -->
      <div class="tab-content">
        <div v-if="activeTab === 'account'">
          <AccountDetailsComponent 
            v-if="userData"
            :userData="userData"
            @userUpdated="handleUserUpdated"
          />
        </div>

      <div v-else-if="activeTab === 'minutes'">
        <MeetingMinutes/>
      </div>

      <div v-else-if="activeTab === 'members-list'">
        <MembersList/>
      </div>

        <div v-else-if="activeTab === 'manager'">
          <AccountManager/>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '../../../stores/authStore'
  import services from '../dashboardServices'
  import MeetingMinutes from '../components/admin/MeetingMinutesAdmin.vue'
  import AccountDetailsComponent from '../components/AccountDetailsComponent.vue'
  import MembersList from '../components/admin/MembersListAdmin.vue'
  import AccountManager from '../components/admin/AccountManagerAdmin.vue'

  const router = useRouter()
  const userData = ref(null)
  const meetingsData = ref([])

  async function loadUserData() {
    try {    
      const fetchUserData = await services.getCurrentUserDetails(useUserStore().getToken)
      userData.value = fetchUserData
    } catch (error) {
      console.error('Failed to load admin data:', error)
    }
  }

  onMounted(() => {
    if (!useUserStore().isAuthenticated) {
      console.warn('User not authenticated, redirecting to login.')
      logout()
      return
    }
    loadUserData()
  })

  const logout = async () => {
    useUserStore().logout()
    await router.push('/login')
  }

  function handleUserUpdated(updatedUserData) {
    userData.value = { ...userData.value, ...updatedUserData }
    console.log('User updated successfully:', updatedUserData)
  }

  function handleMeetingsUpdated(updatedMeetingsData) {
      meetingsData.value = updatedMeetingsData
      console.log('Meetings updated successfully:', updatedMeetingsData)
  }

  const allTabs = [
    { key: 'account', label: 'My Account', roles: ['admin', 'editor'] },
    { key: 'minutes', label: 'Meeting Minutes', roles: ['admin'] }, // Only for admin
    { key: 'members-list', label: 'Members List', roles: ['admin'] }, // Only for admin
    { key: 'manager', label: 'Account Manager', roles: ['admin'] }, // Only for admin
  ];

  // Filter tabs based on user role
  const filteredTabs = computed(() => {
    return allTabs.filter(tab => tab.roles.includes(useUserStore().getRole));
  });

  // Change default tab here if you want:
  const activeTab = ref('account') // e.g. 'minutes' to open Minutes by default
</script>

<style scoped>
/* page + container */
.page { background:#f9fafb; min-height:100vh; color:#0f172a; }
.container { max-width:1080px; margin:0 auto; padding:28px 20px 60px; }

/* hero */
.hero__title{ font-size:clamp(28px,4vw,48px); font-weight:800; margin:0; }
.hero__sub{ margin:6px 0 20px; color:#6b7280; }

.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.editorial-btn {
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 15px;
  transition: background 0.2s;
}
.editorial-btn:hover {
  background: #155a8a;
}

/* tabs */
.tabs { 
  display: flex; 
  gap: 6px; 
  margin-bottom: 24px; 
}
.tab { 
  border: 1px solid #d1d5db; 
  background: #fff; 
  border-radius: 8px; 
  padding: 10px 16px; 
  cursor: pointer; 
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
}
.tab:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}
.tab.active { 
  background: #111; 
  color: #fff; 
  border-color: #111; 
}

/* tab content */
.tab-content {
  margin-top: 8px;
}
</style>
