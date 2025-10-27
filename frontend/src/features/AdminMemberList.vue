<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';

const members = ref([]);
const q = ref('');
const status = ref('all');
const loading = ref(false);

async function fetchMembers() {
  loading.value = true;
  try {
    const params = {};
    if (q.value) params.q = q.value;
    if (status.value !== 'all') params.status = status.value;
    const res = await axios.get('http://localhost:5000/api/admin/members', { params });
    members.value = res.data;
  } finally {
    loading.value = false;
  }
}

onMounted(fetchMembers);
watch([q, status], fetchMembers);
</script>

<template>
  <div class="page">
    <h1>Members</h1>

    <div class="filters">
      <input v-model="q" placeholder="Search by name or email" />
      <select v-model="status">
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="expired">Expired</option>
      </select>
    </div>

    <table class="table">
      <thead>
        <tr><th>Name</th><th>Email</th><th>Expiry</th><th>Status</th></tr>
      </thead>
      <tbody>
        <tr v-for="m in members" :key="m._id">
          <td>{{ m.name }}</td>
          <td>{{ m.email }}</td>
          <td>{{ m.membershipExpiry ? new Date(m.membershipExpiry).toLocaleDateString() : '—' }}</td>
          <td>
            <span :class="new Date(m.membershipExpiry) >= new Date() ? 'active' : 'expired'">
              {{ new Date(m.membershipExpiry) >= new Date() ? 'Active' : 'Expired' }}
            </span>
          </td>
        </tr>
        <tr v-if="!loading && members.length===0">
          <td colspan="4">No members found.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.page { padding:20px; }
.filters { display:flex; gap:12px; margin-bottom:16px; }
.table { width:100%; border-collapse:collapse; }
.table th, .table td { border-bottom:1px solid #eee; padding:10px; }
.active { background:#e7f7ed; color:#0a7a3f; padding:4px 8px; border-radius:8px; }
.expired { background:#fdecec; color:#b42318; padding:4px 8px; border-radius:8px; }
</style>
