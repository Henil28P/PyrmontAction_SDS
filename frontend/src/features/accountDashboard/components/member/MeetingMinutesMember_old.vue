<template>
  <div class="page">
    <div class="header">
      <div>
        <h2 class="title">Meeting Minutes</h2>
        <p class="subtitle">Browse all published meeting minutes</p>
      </div>

      <div class="filters">
        <input
          v-model="q"
          class="input"
          placeholder="Search title or notes..."
        />
        <select v-model="year" class="input">
          <option :value="''">All years</option>
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>
    </div>

    <div class="card">
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th style="width:120px;">Date</th>
              <th>Title</th>
              <th style="width:160px;">Files</th>
              <th style="width:120px;">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="m in filtered" :key="m.id">
              <td class="td-date">{{ m.date }}</td>
              <td>
                <div class="t-title">{{ m.title }}</div>
                <div class="t-body" v-if="m.body">{{ truncate(m.body, 110) }}</div>
              </td>
              <td>
                <template v-if="m.files?.length">
                  <a
                    v-for="(f, i) in m.files"
                    :key="i"
                    class="fileBadge"
                    :href="fileURL(f)"
                    target="_blank"
                    rel="noopener"
                  >
                    {{ shortName(f.name) }}
                  </a>
                </template>
                <span v-else class="muted">—</span>
              </td>
              <td class="td-action">
                <button class="btn-view" @click="open(m)">View</button>
              </td>
            </tr>
            <tr v-if="!filtered.length">
              <td colspan="4" class="empty">No meeting minutes found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Viewer Modal -->
    <div v-if="viewer" class="modal">
      <div class="modalCard">
        <div class="modalHead">
          <h3 class="modalTtl">{{ viewer.title }}</h3>
          <button class="btn-close" @click="viewer = null">✕</button>
        </div>
        <div class="meta">Date: <b>{{ viewer.date }}</b></div>
        <p class="body">{{ viewer.body || '—' }}</p>

        <div class="subttl">Files</div>
        <ul class="files">
          <li v-for="(f,i) in viewer.files" :key="i">
            <a :href="fileURL(f)" target="_blank" rel="noopener">📄 {{ f.name }}</a>
          </li>
          <li v-if="!viewer.files?.length" class="muted">—</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({ items: { type: Array, default: () => [] } })

// Demo fallback
const demo = ref([
  { id: 1, date: '2025-06-01', title: 'Monthly Committee', body: 'Budget approvals and project updates.', status: 'published', files: [{ name: 'minutes-jun-2025.pdf' }] },
  { id: 2, date: '2025-05-12', title: 'Special Session', body: 'Park event planning; volunteers.', status: 'published', files: [] },
  { id: 3, date: '2025-04-10', title: 'Working Group', body: 'Infrastructure proposals and motions.', status: 'draft', files: [{ name: 'proposal-apr.pdf' }] },
])

const pdfMap = import.meta.glob('../assets/minutes/**/*.pdf', { eager: true, query: '?url', import: 'default' })
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

const list = computed(() => (props.items.length ? props.items : demo.value))
const published = computed(() => list.value
  .filter(x => x.status === 'published')
  .sort((a, b) => new Date(b.date) - new Date(a.date)))

const years = computed(() => {
  const s = new Set(published.value.map(m => new Date(m.date).getFullYear()))
  return Array.from(s).sort((a, b) => b - a)
})

const q = ref('')
const year = ref('')

const filtered = computed(() =>
  published.value.filter(m => {
    const okYear = year.value ? new Date(m.date).getFullYear() === Number(year.value) : true
    const text = (m.title + ' ' + (m.body || '')).toLowerCase()
    const okQ = q.value ? text.includes(q.value.toLowerCase()) : true
    return okYear && okQ
  })
)

function truncate(s, n) { return s && s.length > n ? s.slice(0, n - 1) + '…' : s }
function shortName(name) { return name.length > 18 ? name.slice(0, 16) + '…' : name }

function fileURL(f) {
  const v = typeof f === 'string' ? { name: f } : f
  if (!v?.name) return '#'
  const n = v.name
  if (/^https?:\/\//.test(n)) return n
  if (n.startsWith('/uploads/')) return API_BASE + n
  const key = Object.keys(pdfMap).find(k => k.endsWith('/' + n))
  return key ? pdfMap[key] : '#'
}

const viewer = ref(null)
function open(m) { viewer.value = m }
</script>

<style scoped>
.page {
  background: #f9fafb;
  min-height: 100vh;
  padding: 24px;
  color: #0f172a;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.title {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 800;
}
.subtitle {
  margin: 2px 0 0;
  color: #6b7280;
}
.filters {
  display: flex;
  gap: 10px;
  align-items: center;
}
.input {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 12px;
  background: #fff;
  font-size: 0.95rem;
}

/* Card + Table */
.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.04);
  padding: 20px;
}
.table-wrap { overflow-x: auto; }
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}
.table th, .table td {
  padding: 12px 14px;
  border-bottom: 1px solid #f1f3f5;
  text-align: left;
  vertical-align: top;
}
.table th {
  background: #f6f7f9;
  color: #475569;
  font-weight: 800;
}
.t-title { font-weight: 700; }
.t-body { color: #6b7280; font-size: 13px; margin-top: 4px; }
.fileBadge {
  display: inline-block;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 3px 8px;
  margin-right: 6px;
  font-size: 12px;
  text-decoration: none;
  color: #111;
}
.td-date { color: #64748b; white-space: nowrap; }
.td-action { text-align: right; }
.btn-view {
  display: inline-block;
  padding: 8px 12px;
  border-radius: 10px;
  font-weight: 700;
  text-decoration: none;
  color: #0ea5b7;
  background: #e6fbff;
  border: 1px solid #c8f4fb;
  cursor: pointer;
}
.btn-view:hover { filter: brightness(0.98); }
.empty { text-align: center; color: #64748b; }

/* Modal */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 1000;
}
.modalCard {
  max-width: min(700px, 96vw);
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.18);
}
.modalHead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.modalTtl {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
}
.btn-close {
  border: none;
  background: #f3f4f6;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  padding: 4px 8px;
}
.btn-close:hover { background: #e5e7eb; }
.meta { color: #6b7280; font-size: 13px; margin-bottom: 8px; }
.subttl { font-weight: 700; margin-top: 14px; }
.files { margin: 6px 0 0 20px; }
.body { white-space: pre-wrap; color: #1f2937; font-size: 0.95rem; line-height: 1.6; }
</style>
