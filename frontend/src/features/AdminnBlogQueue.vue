<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const pending = ref([]);

async function load() {
  const res = await axios.get('http://localhost:5000/api/blog/admin/pending');
  pending.value = res.data;
}

async function approve(id) {
  await axios.patch(`http://localhost:5000/api/blog/admin/${id}/approve`);
  pending.value = pending.value.filter(p => p._id !== id);
}

async function reject(id) {
  await axios.patch(`http://localhost:5000/api/blog/admin/${id}/reject`);
  pending.value = pending.value.filter(p => p._id !== id);
}

onMounted(load);
</script>

<template>
  <div class="page">
    <h1>Pending Blog Posts</h1>
    <table>
      <thead><tr><th>Title</th><th>Author</th><th>Actions</th></tr></thead>
      <tbody>
        <tr v-for="p in pending" :key="p._id">
          <td>{{ p.title }}</td>
          <td>{{ p.authorEmail }}</td>
          <td>
            <button @click="approve(p._id)">Approve</button>
            <button @click="reject(p._id)">Reject</button>
          </td>
        </tr>
        <tr v-if="pending.length === 0"><td colspan="3">No pending posts.</td></tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.page { padding:20px; }
button {
  margin-right:6px;
  background:#007bff;
  color:white;
  border:none;
  padding:5px 10px;
  border-radius:6px;
  cursor:pointer;
}
button:last-child { background:#dc3545; }
</style>
