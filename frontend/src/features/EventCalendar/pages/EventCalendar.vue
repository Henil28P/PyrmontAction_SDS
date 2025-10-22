<template>
  <div class="ec-page">
    <div class="ec-toolbar">
      <h2 class="ec-title">Edit Events</h2>
      <button class="btn add-btn" @click="openEditor('create')">+ Add event</button>
    </div>
    <section class="ec-list">
      <div v-if="groupedByDay.length === 0" class="empty-state">
        <div class="muted">No events yet.</div>
        <!-- toolbar Add button is enough — removed duplicate here -->
      </div>

      <div v-for="group in groupedByDay" :key="group.date" class="day-group">
        <div class="dayHead">
          <div>
            <div class="dayTitle">{{ labelFor(group.date) }}</div>
            <div class="daySub">{{ fmtDate(group.date) }}</div>
          </div>
        </div>

        <div class="grid">
          <EventCard
            v-for="e in group.items"
            :key="e.id"
            :event="e"
            @select="openViewer(e)"
            @edit="openEditor('edit', $event)"
            @delete="promptDelete"
          />
        </div>
      </div>
    </section>

    <!-- Viewer modal -->
    <div v-if="viewerOpen" class="modal" @click.self="closeViewer">
      <div class="modalCard">
        <h3 class="modalTitle">{{ viewerEvent.title }}</h3>
        <div class="modalContent">
          <div class="modalLeft">
            <p class="muted">{{ fmtDate(viewerEvent.date) }} • {{ fmtTime(viewerEvent.date) }}</p>
            <p><strong>Location:</strong> {{ viewerEvent.location || '—' }}</p>
            <p class="muted" style="margin-top:8px;">{{ viewerEvent.description }}</p>
          </div>
          <div class="modalRight">
            <img v-if="viewerEvent.image" :src="viewerEvent.image" style="max-width:100%; max-height:100%; object-fit:cover; border-radius:8px;" />
            <div v-else class="imgPh">No image</div>
          </div>
        </div>

        <div class="formActions" style="margin-top:12px;">
          <button class="btn" @click="openEditor('edit', viewerEvent)">Edit</button>
          <button class="btn btn--ghost" @click="closeViewer">Close</button>
        </div>
      </div>
    </div>

    <!-- Editor modal -->
    <div v-if="editor.open" class="modal" @click.self="closeEditor">
      <div class="modalCard">
        <div class="modalTitle">{{ editor.mode === 'create' ? 'Create event' : 'Edit event' }}</div>
        <div class="modalContent">
          <div class="modalLeft">
            <div class="form">
              <input class="input" v-model="editor.form.title" placeholder="Title" />
              <div class="timeRow">
                <input class="input" type="date" v-model="editor.form.date" />
                <input class="input" type="time" v-model="editor.form.time" />
              </div>
              <input class="input" v-model="editor.form.location" placeholder="Location" />
              <input class="input" v-model="editor.form.organizer" placeholder="Organizer" />
              <textarea class="input" v-model="editor.form.description" placeholder="Description" rows="4"></textarea>
              <!-- file upload opens explorer and sets editor.form.image as data URL -->
              <input type="file" accept="image/*" @change="handleFileUpload" />
            </div>
            <div class="formActions">
              <button class="btn" @click="saveEditor">Save</button>
              <button class="btn btn--ghost" @click="closeEditor">Cancel</button>
              <button v-if="editor.mode === 'edit'" class="btn btn--danger" @click="deleteFromEditor">Delete</button>
            </div>
          </div>
          <div class="modalRight">
            <div class="imgPreview">
              <img v-if="editor.form.image" :src="editor.form.image" style="max-width:100%; max-height:100%; object-fit:cover; border-radius:8px;" />
              <div v-else class="imgPh">Image preview</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete confirmation modal -->
    <div v-if="deleteModalOpen" class="modal" @click.self="cancelDelete">
      <div class="modalCard small">
        <h3 class="modalTitle">Confirm delete</h3>
        <p class="muted" style="margin:12px 0;">
          Are you sure you want to delete <strong>{{ deleteTargetTitle }}</strong>?
          This action cannot be undone.
        </p>
        <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:12px;">
          <button class="btn btn--ghost" @click="cancelDelete">Cancel</button>
          <button class="btn btn--danger" @click="confirmDelete">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import EventCard from '../components/EventCard.vue'

const LS_KEY = 'pa_events_v1'
const now = new Date()
const selectedMonth = ref(new Date(now.getFullYear(), now.getMonth(), 1))
const searchQuery = ref('')

const events = ref([])

function seedEvents() {
  const m = new Date()
  return [
    { id: 1, title: 'Community Townhall', date: new Date(m.getFullYear(), m.getMonth(), 5, 18, 0).toISOString(), location: 'Community Hall', organizer: 'Pyrmont Action', description: 'Monthly update and Q&A with residents.' },
    { id: 2, title: 'Park Cleanup', date: new Date(m.getFullYear(), m.getMonth(), 12, 9, 30).toISOString(), location: 'Riverside Park', organizer: 'Volunteers', description: 'Bring gloves and water. Family friendly.' },
    { id: 3, title: 'Art in the Square', date: new Date(m.getFullYear(), m.getMonth(), 22, 11, 0).toISOString(), location: 'Town Square', organizer: 'Arts Council', description: 'Local artists exhibiting works. Food stalls available.' },
    { id: 4, title: 'Planning Committee Meeting', date: new Date(m.getFullYear(), m.getMonth()+1, 3, 19, 0).toISOString(), location: 'Online (Zoom)', organizer: 'Council', description: 'Agenda: new development proposals.' }
  ]
}

function loadEvents() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) {
      events.value = seedEvents()
      saveEvents()
      return
    }
    events.value = JSON.parse(raw).map(e => ({ ...e }))
  } catch (e) {
    events.value = seedEvents()
    saveEvents()
  }
}

function saveEvents() {
  localStorage.setItem(LS_KEY, JSON.stringify(events.value))
}

onMounted(loadEvents)

const filteredEvents = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  let list = events.value.slice()
  // apply search only — show all events (no month filtering)
  list = list.filter(e => {
    if (!q) return true
    return [e.title, e.location, e.organizer, e.description].join(' ').toLowerCase().includes(q)
  })
  return list.sort((a,b) => new Date(a.date) - new Date(b.date))
})

const groupedByDay = computed(() => {
  const map = {}
  filteredEvents.value.forEach(ev => {
    const d = new Date(ev.date)
    const dayKey = startOfDay(d).toISOString().slice(0,10)
    if (!map[dayKey]) map[dayKey] = []
    map[dayKey].push(ev)
  })
  return Object.keys(map).sort().map(k => ({ date: k, items: map[k].sort((a,b)=>new Date(a.date)-new Date(b.date)) }))
})

function fmtDate(d){ return new Date(d).toLocaleDateString(undefined, { day:'numeric', month:'long', year:'numeric' }) }
function fmtTime(d){ return new Date(d).toLocaleTimeString(undefined, { hour:'numeric', minute:'2-digit' }) }
function labelFor(dateStr){ const d = new Date(dateStr); return d.toLocaleString(undefined, { weekday:'long' }) }
function startOfDay(d){ const x = new Date(d); x.setHours(0,0,0,0); return x }

let nextId = (() => {
  const max = events.value.length ? Math.max(...events.value.map(e => e.id)) : 4
  return max + 1
})()

/* Viewer */
const viewerOpen = ref(false)
const viewerEvent = ref({})
function openViewer(ev){
  viewerEvent.value = ev
  viewerOpen.value = true
}
function closeViewer(){ viewerOpen.value = false; viewerEvent.value = {} }

/* Editor */
const editor = ref({
  open: false,
  mode: 'create',
  form: { id:null, title:'', date: '', time: '12:00', location:'', organizer:'', description:'', image:'' }
})

/* --- handle file upload and convert to data URL --- */
function handleFileUpload(ev) {
  const file = ev?.target?.files && ev.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    editor.value.form.image = e.target.result // base64 data URL for preview and saving
  }
  reader.readAsDataURL(file)
}
/* ----------------------------------------------------- */

function openEditor(mode = 'create', event = null){
  if (mode === 'create') {
    const d = selectedMonth.value
    editor.value.form = { id: null, title:'', date: toDateInput(new Date(d.getFullYear(), d.getMonth(), Math.min(10, d.getDate()) )), time: '12:00', location:'', organizer:'', description:'', image:'' }
  } else if (event) {
    const d = new Date(event.date)
    editor.value.form = { id: event.id, title: event.title, date: toDateInput(d), time: toTimeInput(d), location: event.location || '', organizer: event.organizer || '', description: event.description || '', image: event.image || '' }
  }
  editor.value.mode = mode
  editor.value.open = true
  viewerOpen.value = false
}

function closeEditor(){ editor.value.open = false }

function toDateInput(d){ const yyyy = d.getFullYear(); const mm = String(d.getMonth()+1).padStart(2,'0'); const dd = String(d.getDate()).padStart(2,'0'); return `${yyyy}-${mm}-${dd}` }
function toTimeInput(d){ return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0') }
function combineDateTime(dateStr, timeStr){ const [y,m,da] = dateStr.split('-').map(Number); const [hh,mm] = timeStr.split(':').map(Number); return new Date(y, m-1, da, hh, mm).toISOString() }

function saveEditor(){
  const f = editor.value.form
  if (!f.title || !f.date) { alert('Title and date required'); return }
  const iso = combineDateTime(f.date, f.time || '12:00')
  if (editor.value.mode === 'create') {
    const item = { id: ++nextId, title: f.title, date: iso, location: f.location, organizer: f.organizer, description: f.description, image: f.image }
    events.value.push(item)
  } else {
    const idx = events.value.findIndex(x => x.id === f.id)
    if (idx !== -1) {
      events.value[idx] = { ...events.value[idx], title: f.title, date: iso, location: f.location, organizer: f.organizer, description: f.description, image: f.image }
    }
  }
  saveEvents()
  editor.value.open = false
}

/* --- Delete confirmation UI state --- */
const deleteModalOpen = ref(false)
const deleteTargetId = ref(null)
const deleteTargetTitle = ref('')

function promptDelete(id) {
  const ev = events.value.find(x => x.id === id)
  deleteTargetId.value = id
  deleteTargetTitle.value = ev ? ev.title : 'this event'
  deleteModalOpen.value = true
}

function cancelDelete() {
  deleteModalOpen.value = false
  deleteTargetId.value = null
  deleteTargetTitle.value = ''
}

function confirmDelete() {
  const id = deleteTargetId.value
  if (id == null) { cancelDelete(); return }
  events.value = events.value.filter(e => e.id !== id)
  saveEvents()
  cancelDelete()
}

/* --- DEPRECATED: old handleDelete (kept for compatibility if used elsewhere) --- */
function handleDelete(id){
  // now uses modal UI — forward to promptDelete
  promptDelete(id)
}
</script> 

<style scoped>
.ec-page { padding:20px; max-width:1100px; margin:0 auto; }
.ec-toolbar { display:flex; align-items:center; gap:16px; margin-bottom:16px; }
.ec-title { margin:0; font-size:20px; font-weight:700; color:#1e293b; }
.add-btn { margin-left:auto; background:#0ea5a4; color:#fff; border:none; padding:8px 14px; border-radius:8px; font-weight:700; cursor:pointer; }
.add-btn:hover { background:#089191; transform:translateY(-1px); }
.muted { color:#6b7280; margin:0; font-size:14px; text-align:center; padding:40px; }

.ec-list .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:16px; margin-top:12px; }

.dayHead { display:flex; align-items:center; gap:12px; margin-top:24px; padding:12px 0; border-bottom:2px solid #e5e7eb; }
.dayTitle { font-weight:700; font-size:18px; color:#1e293b; }
.daySub { font-size:14px; color:#64748b; margin-top:2px; }

.modal { position:fixed; inset:0; background:rgba(0,0,0,.5); display:flex; align-items:center; justify-content:center; z-index:60; }
.modalCard { background:#fff; padding:24px; border-radius:12px; width:800px; max-width:95%; box-shadow:0 8px 24px rgba(0,0,0,.2); }
.modalCard.small { width:420px; max-width:92%; padding:18px; }
.modalTitle { text-align:center; font-size:20px; font-weight:700; margin-bottom:16px; color:#1e293b; }
.modalContent { display:flex; gap:20px; }
.modalLeft { flex:1; }
.modalRight { width:320px; display:flex; align-items:center; justify-content:center; border-radius:8px; background:#f8fafc; padding:12px; }
.imgPh { font-size:13px; color:#94a3b8; text-align:center; }
.form { display:flex; flex-direction:column; gap:10px; }
.input { border:1px solid #cbd5e1; border-radius:6px; padding:10px; font-size:14px; }
.imgPreview { width:100%; height:240px; border-radius:8px; background:#fff; display:flex; align-items:center; justify-content:center; overflow:hidden; border:1px solid #e5e7eb; }
.formActions { display:flex; gap:8px; justify-content:flex-end; margin-top:16px; }
.timeRow { display:flex; gap:8px; }
.btn { padding:10px 16px; border-radius:6px; background:#1e293b; color:#fff; border:none; cursor:pointer; font-weight:600; font-size:14px; transition:all 0.2s; }
.btn:hover { background:#334155; }
.btn--ghost { background:transparent; border:1px solid #cbd5e1; color:#1e293b; }
.btn--ghost:hover { background:#f1f5f9; }
.btn--danger { background:#dc2626; color:#fff; border:none; }
.btn--danger:hover { background:#b91c1c; }
.empty-state { display:flex; align-items:center; gap:12px; padding:28px; border:1px dashed #e6edf3; border-radius:8px; background:#fbfdff; }
.empty-actions { margin-left:auto; display:flex; gap:8px; }
</style>