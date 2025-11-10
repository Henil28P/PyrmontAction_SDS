<script setup>
import { ref } from 'vue';

const minutes = ref([
  { id: 1, title: "AGM Minutes â€“ July 2025", date: "Jul 28, 2025", url: "#" },
  { id: 2, title: "Committee Meeting â€“ Aug 2025", date: "Aug 18, 2025", url: "#" },
  { id: 3, title: "General Meeting â€“ Sept 2025", date: "Sep 10, 2025", url: "#" }
]);
</script>

<template>
  <section class="minutes-card">
    <div class="minutes-head">
      <div class="minutes-title">
        <h2>Meeting Minutes</h2>
        <p class="muted">Latest published minutes</p>
      </div>

      <!-- View all button (right side) -->
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
                <span class="paper-emoji">O</span>
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
</template>

<style scoped>
/* minutes card */
.minutes-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  padding: 20px;
}
.minutes-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}
.minutes-title h2 {
  margin: 0 0 4px 0;
  font-size: 1.2rem;
  font-weight: 800;
}
.minutes-title .muted {
  margin: 0;
  color: #6b7280;
}

/* table */
.table-wrap {
  overflow: auto;
}
.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.95rem;
  border: 1px solid #eef0f2;
  border-radius: 12px;
  overflow: hidden;
}
.table thead th {
  text-align: left;
  background: #f6f7f9;
  color: #475569;
  font-weight: 800;
  padding: 12px 14px;
  border-bottom: 1px solid #eef0f2;
}
.table tbody td {
  padding: 12px 14px;
  border-bottom: 1px solid #f1f3f5;
}
.table tbody tr:last-child td {
  border-bottom: 0;
}
.title-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
}
.paper-emoji {
  font-size: 18px;
}
.th-date,
.td-date {
  width: 160px;
  white-space: nowrap;
  color: #64748b;
}
.th-action,
.td-action {
  width: 120px;
  text-align: right;
}
.btn-view {
  display: inline-block;
  padding: 8px 12px;
  border-radius: 10px;
  font-weight: 800;
  text-decoration: none;
  color: #0ea5b7;
  background: #e6fbff;
  border: 1px solid #c8f4fb;
}
.btn-view:hover {
  filter: brightness(0.98);
}
.empty {
  text-align: center;
  color: #64748b;
}
</style>