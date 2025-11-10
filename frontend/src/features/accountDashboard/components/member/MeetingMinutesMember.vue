<script setup>
import { ref } from 'vue';

const minutes = ref([
  { id: 1, title: "AGM Minutes â€“ July 2025", date: "Jul 28, 2025", url: "#" },
  { id: 2, title: "Committee Meeting â€“ Aug 2025", date: "Aug 18, 2025", url: "#" },
  { id: 3, title: "General Meeting â€“ Sept 2025", date: "Sep 10, 2025", url: "#" }
]);
</script>

<template>
  <div class="card">
    <div class="header">
      <h4><strong>Meeting Minutes</strong></h4>
      <RouterLink to="/member/minutes" class="view-all-btn" aria-label="View all minutes">
        View all
      </RouterLink>
    </div>

    <div class="minutes-table-container">
      <table>
        <thead>
          <tr>
            <th style="width: 10%;">Date</th>
            <th style="width: 60%;">Title</th>
            <th style="width: 30%; text-align: center;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in minutes" :key="m.id">
            <td class="date-cell">{{ m.date }}</td>
            <td class="title-cell">{{ m.title }}</td>
            <td class="action-cell">
              <a :href="m.url" target="_blank" rel="noopener" class="view-btn">View</a>
            </td>
          </tr>
          <tr v-if="!minutes.length">
            <td colspan="3" class="muted">No minutes available.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.card {
    padding: 24px;
    background: white;
    border-radius: 8px;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
}

.view-all-btn {
    background: #10b981;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
    display: inline-block;
}

.view-all-btn:hover {
    background: #059669;
}

.minutes-table-container {
    overflow-x: auto;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
}

table {
    width: 100%;
    border-collapse: collapse;
}

table thead {
    background: #f9fafb;
}

table th {
    padding: 12px 16px;
    text-align: left;
    font-weight: 600;
    color: #374151;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid #e5e7eb;
}

table tbody tr {
    transition: background 0.2s ease;
    background: white;
}

table tbody tr:hover {
    background: #f9fafb;
}

table td {
    padding: 14px 16px;
    border-bottom: 1px solid #f3f4f6;
    font-size: 14px;
}

.date-cell {
    white-space: nowrap;
    font-weight: 600;
    color: #111827;
}

.title-cell {
    font-weight: 600;
    color: #111827;
}

.action-cell {
    text-align: center;
    white-space: nowrap;
}

.view-btn {
    display: inline-block;
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    background: #3b82f6;
    color: white;
    text-decoration: none;
}

.view-btn:hover {
    background: #2563eb;
}

.muted {
    color: #6b7280;
    text-align: center;
}
</style>