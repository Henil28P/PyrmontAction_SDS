<!-- src/pages/MemberDashboard.vue -->
<template>
  <div class="page">
    <main class="container content">
      <!-- Hero -->
      <section class="hero">
        <h1 class="hero__title">
          Welcome back, {{ profile?.name || "John" }}
          <span class="wave">ðŸ‘‹</span>
        </h1>
        <p class="hero__sub">Here's a quick snapshot of your membership.</p>
      </section>

      <!-- Top Summary Cards -->
      <section class="cards-row">
        <article class="summary-card">
          <div class="summary-head">
            <span class="summary-icon">ðŸ’³</span>
            <span class="summary-label">Membership Type</span>
          </div>
          <div class="summary-value">{{ profile?.membershipType }}</div>
        </article>

        <article class="summary-card">
          <div class="summary-head">
            <span class="summary-icon">ðŸ“…</span>
            <span class="summary-label">Payment Expiry</span>
          </div>
          <div class="summary-value">{{ expiryDate }}</div>
          <button class="link-btn" @click="openRenewForm">Renew membership</button>
        </article>

        <article class="summary-card">
          <div class="summary-head">
            <span class="summary-icon">ðŸ›¡ï¸</span>
            <span class="summary-label">Status</span>
          </div>
          <div
            class="summary-value pill"
            :class="profile?.status === 'active' ? 'pill--green' : 'pill--red'"
          >
            <span class="dot" :class="profile?.status === 'active' ? 'dot--green' : 'dot--red'"></span>
            {{ profile?.status === "active" ? "Active" : "Deactivated" }}
          </div>
        </article>
      </section>

      <!-- Member Details -->
      <section class="details">
        <div class="details-head">
          <h2>Member Details</h2>
          <p class="muted">Manage your personal information</p>
          <button class="btn-edit" @click="handleEdit">âœï¸ Edit</button>
        </div>

        <div class="details-grid">
          <div class="field">
            <label>Full Name</label>
            <div class="field-value">{{ profile?.fullName }}</div>
          </div>
          <div class="field">
            <label>Email Address</label>
            <div class="field-value">{{ profile?.email }}</div>
          </div>
          <div class="field">
            <label>Phone Number</label>
            <div class="field-value">{{ profile?.phone }}</div>
          </div>
          <div class="field">
            <label>Address</label>
            <div class="field-value">{{ profile?.address }}</div>
          </div>
          <div class="field">
            <label>Join Date</label>
            <div class="field-value">{{ profile?.joinDate }}</div>
          </div>
          <div class="field">
            <label>Renewal Date</label>
            <div class="field-value">{{ expiryDate }}</div>
          </div>

        </div>
      </section>

      <!-- Meeting Minutes -->
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
                    <span class="paper-emoji">ðŸ“„</span>
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

<script setup>
import { ref } from "vue"
import { useRouter, RouterLink } from "vue-router"

const router = useRouter()

// Mock profile data (replace with real API data)
const profile = ref({
  name: "John",
  fullName: "John Smith",
  email: "john.smith@email.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main St, Apt 4B, New York, NY 10001",
  status: "active",
  membershipType: "Premium",
  joinDate: "Jan 15, 2023",
  emergencyContact: "Jane Smith (+1 (555) 987-6543)"
})

// Mock expiry and minutes (replace with real API data)
const expiryDate = ref("Jan 15, 2024")
const minutes = ref([
  { id: 1, title: "AGM Minutes â€“ July 2025", date: "Jul 28, 2025", url: "#" },
  { id: 2, title: "Committee Meeting â€“ Aug 2025", date: "Aug 18, 2025", url: "#" },
  { id: 3, title: "General Meeting â€“ Sept 2025", date: "Sep 10, 2025", url: "#" }
])

function handleEdit() {
  router.push("/member/edit")
}
function openRenewForm() {
  alert("Open renew membership form")
}
</script>

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

/* details card */
.details{
  background:#fff; border:1px solid #e5e7eb; border-radius:16px;
  box-shadow:0 4px 16px rgba(0,0,0,.04); padding:20px; margin-bottom:22px;
}
.details-head{ display:flex; align-items:center; gap:12px; margin-bottom:18px; }
.details-head h2{ margin:0; font-size:1.2rem; font-weight:800; flex:1; }
.btn-edit{
  margin-left:auto; background:#111; color:#fff; border:0; border-radius:8px;
  padding:6px 14px; font-weight:700; cursor:pointer;
}
.btn-edit:hover{ background:#333; }
.details-grid{
  display:grid; grid-template-columns:1fr 1fr; gap:18px;
}
@media(max-width:760px){ .details-grid{ grid-template-columns:1fr; } }
.field label{ display:block; font-size:.85rem; color:#6b7280; margin-bottom:4px; }
.field-value{
  background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px; padding:10px 12px; font-weight:600;
}

/* minutes card */
.minutes-card{
  background:#fff; border:1px solid #e5e7eb; border-radius:16px;
  box-shadow:0 4px 16px rgba(0,0,0,.04); padding:20px;
}
.minutes-head{
  display:flex; align-items:center; justify-content:space-between;
  gap:16px; margin-bottom:12px;
}
.minutes-title h2{ margin:0 0 4px 0; font-size:1.2rem; font-weight:800; }
.minutes-title .muted{ margin:0; }

/* "View all" button */
.btn-all{
  display:inline-flex; align-items:center; justify-content:center;
  padding:8px 14px; border-radius:10px; font-weight:800; text-decoration:none;
  color:#0ea5b7; background:#e6fbff; border:1px solid #c8f4fb;
}
.btn-all:hover{ filter:brightness(.98); }

/* table */
.table-wrap{ overflow:auto; }
.table{
  width:100%; border-collapse:separate; border-spacing:0; font-size:.95rem;
  border:1px solid #eef0f2; border-radius:12px; overflow:hidden;
}
.table thead th{
  text-align:left; background:#f6f7f9; color:#475569; font-weight:800;
  padding:12px 14px; border-bottom:1px solid #eef0f2;
}
.table tbody td{ padding:12px 14px; border-bottom:1px solid #f1f3f5; }
.table tbody tr:last-child td{ border-bottom:0; }
.title-cell{ display:flex; align-items:center; gap:10px; font-weight:700; }
.paper-emoji{ font-size:18px; }
.th-date,.td-date{ width:160px; white-space:nowrap; color:#64748b; }
.th-action,.td-action{ width:120px; text-align:right; }
.btn-view{
  display:inline-block; padding:8px 12px; border-radius:10px; font-weight:800;
  text-decoration:none; color:#0ea5b7; background:#e6fbff; border:1px solid #c8f4fb;
}
.btn-view:hover{ filter:brightness(.98); }
.empty{ text-align:center; color:#64748b; }

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
