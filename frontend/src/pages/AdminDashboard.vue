<template>
  <section class="wrap">
    <header class="hero">
      <h1>Welcome back!</h1>
      <p class="hint">Signed in as <strong>Content Manager</strong></p>
    </header>

    <Subnav v-model:current="tab" :items="adminTabs" />

    <div class="grid2">
      <StatCard title="Membership">
        <p v-if="!isPaid">Youre not a paid member yet.</p>
        <p v-else>Active paid member  renews {{ renewalDate }}</p>
        <template #action><a href="#">Become a member</a></template>
      </StatCard>

      <StatCard title="Upcoming event">
        <p v-if="!nextEvent">No events scheduled.</p>
        <p v-else>{{ nextEvent.title }}  {{ nextEvent.date }}</p>
        <template #action><a href="#">View all events </a></template>
      </StatCard>
    </div>

    <StatCard class="mt" title="Latest minutes">
      <p>{{ latestMinute.title }}</p>
      <template #action><a :href="latestMinute.pdf">PDF</a></template>
    </StatCard>

    <StatCard class="mt" title="Your role">
      <span class="badge blue">Content Manager</span>
    </StatCard>

    <div class="mt"><component :is="currentPanel" /></div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import Subnav from '../components/common/Subnav.vue'
import StatCard from '../components/common/StatCard.vue'
import MeetingMinutesAdmin from '../components/admin/MeetingMinutesAdmin.vue'
import EditorialDashboard from '../components/admin/EditorialDashboard.vue'
import BlogAdmin from '../components/admin/BlogAdmin.vue'
import MemberList from '../components/admin/MemberList.vue'

const tab = ref('dashboard')
const adminTabs = [
  { name:'dashboard', label:'Dashboard' },
  { name:'minutes',   label:'Minutes' },
  { name:'events',    label:'Events' },
  { name:'editorial', label:'Editorial' },
]

// mock
const isPaid = false
const renewalDate = '02 Nov'
const nextEvent = null
const latestMinute = { title:'June 2025 Community Garden Committee Meeting', pdf:'#' }

const panelMap = {
  dashboard:{ component:{ template:'<div />' } },
  minutes:  { component: MeetingMinutesAdmin },
  events:   { component:{ template:'<div class="placeholder">Events admin here</div>' } },
  editorial:{ component: EditorialDashboard },
}
const currentPanel = computed(() => panelMap[tab.value]?.component || { template:'<div />' })
</script>

<style scoped>
.wrap{ max-width:1200px; margin:0 auto; padding:28px 16px 40px; }
.hero{ text-align:center; margin:6px 0 14px; }
.hero h1{ font-size:36px; font-weight:800; letter-spacing:.2px; margin:0 0 6px; }
.hint{ color:#64748b; margin:0; }
.grid2{ display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-top:8px; }
.mt{ margin-top:18px; }
.badge{ display:inline-block; padding:7px 12px; border-radius:999px; font-weight:700; font-size:12.5px; }
.blue{ background:#e6f6ff; color:#075985; border:1px solid #bae6fd; }
.placeholder{ padding:12px; border:1px dashed #d9e2ec; border-radius:12px; color:#64748b; }
@media(max-width:900px){ .grid2{ grid-template-columns:1fr; } }
</style>
