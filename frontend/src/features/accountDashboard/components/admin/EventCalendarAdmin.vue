<template>
  <div class="page-wrapper">
    <div class="calendar container">
      <div class="topbar">
        <h1 class="ttl">Event Calendar (Admin)</h1>
        <button class="btn primary" @click="openCreate">+ Add Event</button>
      </div>

      <div v-for="(group, gi) in groups" :key="gi" class="day">
        <div class="dayHead">
          <div class="dayTitle">{{ group.label }}</div>
          <div class="daySub">{{ group.sub }}</div>
        </div>

        <div v-if="!group.events.length" class="nothing">Nothing Planned yet</div>

        <div v-for="ev in group.events" :key="ev.id" class="eventRow" @click="openView(ev)">
          <div class="icon">🔔</div>
          <div class="thumb" :style="imageStyle(ev.image)">
            <span v-if="!hasImage(ev.image)" class="imgPh">Image</span>
          </div>

          <div class="info">
            <div><b>Name:</b> {{ ev.title }}</div>
            <div><b>Location:</b> {{ ev.location }}</div>
          </div>

          <div class="times">
            <div><b>Start:</b> {{ fmtTime(ev.start) }}</div>
            <div><b>End:</b> {{ fmtTime(ev.end) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- View Modal -->
    <div v-if="viewer" class="modal">
      <div class="modalCard">
        <h3 class="modalTitle">{{ viewer.title }}</h3>
        <div class="modalContent">
          <div class="modalLeft">
            <p><b>Date:</b> {{ fmtDate(viewer.start) }}</p>
            <p><b>Time:</b> {{ fmtTime(viewer.start) }} - {{ fmtTime(viewer.end) }}</p>
            <p><b>Location:</b> {{ viewer.location }}</p>

            <div class="modalSection">
              <b>Details</b>
              <ul>
                <li v-for="(d,i) in viewer.details" :key="i">{{ d }}</li>
                <li v-if="!viewer.details?.length" class="muted">—</li>
              </ul>
            </div>

            <div class="modalSection">
              <b>Why It Matters</b>
              <p>{{ viewer.why || '—' }}</p>
            </div>
          </div>

          <div class="modalRight" :style="imageStyle(viewer.image, true)">
            <span v-if="!hasImage(viewer.image)" class="imgPh">Image</span>
          </div>
        </div>
        <button class="btn primary" @click="viewer=null">Close</button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="editor.open" class="modal">
      <div class="modalCard addModal">
        <h3 class="modalTitle">{{ editor.mode === 'create' ? 'Add New Event' : 'Edit Event' }}</h3>
        <form class="form" @submit.prevent="saveEditor">
          <label>Event Title</label>
          <input v-model="editor.form.title" class="input" required />

          <label>Date</label>
          <input v-model="editor.form.date" type="date" class="input" required />

          <div class="timeRow">
            <div>
              <label>Start Time</label>
              <input v-model="editor.form.startTime" type="time" class="input" required />
            </div>
            <div>
              <label>End Time</label>
              <input v-model="editor.form.endTime" type="time" class="input" required />
            </div>
          </div>

          <label>Location</label>
          <input v-model="editor.form.location" class="input" placeholder="Venue or Address" required />

          <label>Details (one per line)</label>
          <textarea v-model="editor.form.detailsRaw" class="input" rows="3"></textarea>

          <label>Why It Matters</label>
          <textarea v-model="editor.form.why" class="input" rows="3"></textarea>

          <!-- ===== Image inputs (Assets filename / URL / Local preview) ===== -->
          <label>Image (from <code>frontend/src/assets/Events/</code>)</label>
          <select v-model="editor.form.image" class="input">
            <option value="">— Select a file in assets/Events —</option>
            <option v-for="opt in assetOptions" :key="opt.name" :value="opt.name">{{ opt.name }}</option>
          </select>

          <label>Or paste a full image URL (optional)</label>
          <input v-model="editor.form.image" class="input" placeholder="https://..." />

          <label>Choose File (for preview only; dev copies to assets later)</label>
          <input type="file" accept="image/*" @change="pickImage" />

          <div class="imgPreview" :style="imageStyle(editor.form.image, true)">
            <span v-if="!hasImage(editor.form.image)" class="imgPh">Preview</span>
          </div>

          <div class="formActions">
            <button type="submit" class="btn primary">{{ editor.mode === 'create' ? 'Save' : 'Save Changes' }}</button>
            <button type="button" class="btn" @click="closeEditor">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

/* ====== ASSETS: map files that exist in frontend/src/assets/Events ====== */
const assetMap = import.meta.glob('../assets/Events/*.{png,jpg,jpeg,webp}', {
  eager: true,
  query: '?url',
  import: 'default'
})
const assetOptions = Object.keys(assetMap).map(p => ({ name: p.split('/').pop(), url: assetMap[p] }))

/* ====== CONFIG (future friendly) ====== */
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

/* ====== DEMO DATA (UI-only) ====== */
const events = ref([
  {
    id: 1,
    title: 'Pyrmont Action Fundraiser',
    location: 'Pyrmont Bay Park',
    start: setTime(new Date(), 9, 0),
    end:   setTime(new Date(), 17, 0),
    details: ['Guest Speakers', 'Live Music', 'Raffle Prizes'],
    why: 'Support a more connected Pyrmont with community-led action.',
    image: '' // store just a filename like "fundraiser.jpg" OR a full URL
  }
])

/* ====== MODALS ====== */
const viewer = ref(null)
function openView(ev){ viewer.value = ev }

const editor = ref({
  open: false,
  mode: 'create',
  form: { title:'', date:'', startTime:'', endTime:'', location:'', detailsRaw:'', why:'', image:'', file:null }
})

function openCreate(){
  editor.value = { open:true, mode:'create', form: { title:'', date: todayISO(), startTime:'09:00', endTime:'17:00', location:'', detailsRaw:'', why:'', image:'', file:null } }
}
function closeEditor(){ editor.value.open = false }

/* ====== IMAGE helpers ====== */
function pickImage(e){
  const file = e.target.files?.[0]
  if (!file) return
  editor.value.form.file = file
  // preview only – DOES NOT write into assets automatically
  editor.value.form.image = { src: URL.createObjectURL(file) }
}

function hasImage(img){
  if (!img) return false
  if (typeof img === 'string') return !!img
  if (typeof img === 'object') return !!img.src
  return false
}

function resolveImageURL(img){
  if (!img) return null
  if (typeof img === 'object' && img.src) return img.src        // preview object
  if (typeof img !== 'string') return null
  if (/^https?:\/\//.test(img)) return img                    // full URL
  if (img.startsWith('/uploads/')) return API_BASE + img        // future backend uploads
  // treat as assets filename
  const key = Object.keys(assetMap).find(k => k.endsWith('/' + img))
  return key ? assetMap[key] : null
}

function imageStyle(img, large = false){
  const w = large ? 320 : 160
  const h = large ? 200 : 96
  const base = { width: w+'px', height: h+'px', border: '1px solid #ccc', borderRadius: '10px', overflow: 'hidden', background: '#fff', backgroundSize: 'cover', backgroundPosition: 'center' }
  const url = resolveImageURL(img)
  return url ? { ...base, backgroundImage: `url('${url}')` } : base
}

/* ====== SAVE ====== */
function saveEditor(){
  const f = editor.value.form
  const start = combineDateTime(f.date, f.startTime)
  const end   = combineDateTime(f.date, f.endTime)

  // Only store STRING (filename or URL). Ignore preview object when saving.
  const imageField = typeof f.image === 'string' ? f.image : ''

  const base = {
    id: Date.now(),
    title: f.title.trim(),
    location: f.location.trim(),
    start, end,
    details: (f.detailsRaw || '').split('\n').map(s => s.trim()).filter(Boolean),
    why: f.why.trim(),
    image: imageField
  }
  events.value.push(base)
  editor.value.open = false
}

/* ====== GROUPING ====== */
const groups = computed(() => {
  const byDay = groupByDate(events.value)
  return byDay.map(({ date, items }) => ({ label: labelFor(date), sub: fmtDate(items[0]?.start ?? date), events: items.sort((a,b)=>a.start-b.start) }))
})

/* ====== DATE HELPERS ====== */
function addDays(d, n){ const x = new Date(d); x.setDate(x.getDate()+n); return x }
function setTime(d, h, m){ const x = new Date(d); x.setHours(h, m, 0, 0); return x }
function startOfDay(d){ const x = new Date(d); x.setHours(0, 0, 0, 0); return x }
function sameDay(a,b){ return a.toDateString() === b.toDateString() }
function groupByDate(list){
  const map = new Map()
  list.forEach(ev => {
    const key = startOfDay(ev.start).toDateString()
    if (!map.has(key)) map.set(key, { date: new Date(key), items: [] })
    map.get(key).items.push(ev)
  })
  return [...map.values()].sort((a,b)=>a.date-b.date)
}
function labelFor(date){
  const today = startOfDay(new Date())
  const d = startOfDay(date)
  if (sameDay(d, today)) return 'Today'
  if (sameDay(d, addDays(today, 1))) return 'Tomorrow'
  return d.toLocaleDateString(undefined, { weekday: 'long' })
}
function fmtDate(d){ return new Date(d).toLocaleDateString(undefined, { day:'numeric', month:'long' }) }
function fmtTime(t){ return new Date(t).toLocaleTimeString(undefined, { hour:'numeric', minute:'2-digit' }) }
function todayISO(){ const d = new Date(); return d.toISOString().slice(0,10) }
function combineDateTime(dateStr, timeStr){ const [y,m,da] = dateStr.split('-').map(Number); const [hh,mm] = timeStr.split(':').map(Number); return new Date(y, m-1, da, hh, mm) }
</script>

<style scoped>
.page-wrapper { display:flex; justify-content:center; padding:40px; background:#fafafa; }
.container { width: 720px; background:#fff; border-radius:16px; box-shadow:0 4px 20px rgba(0,0,0,.05); padding:32px; }
.topbar { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; }
.ttl { font-size:24px; font-weight:700; }
.dayHead { display:flex; align-items:center; gap:8px; margin-top:24px; border-bottom:1px solid #ccc; padding-bottom:4px; }
.dayTitle { font-weight:700; }
.daySub { font-size:14px; color:#777; }
.eventRow { display:grid; grid-template-columns:40px 160px 1fr 160px; align-items:center; gap:12px; border:1px solid #000; border-radius:6px; margin-top:12px; padding:12px; }
.icon { text-align:center; }
.nothing { text-align:center; color:#777; margin:12px 0; }
.btn { cursor:pointer; border:none; padding:8px 14px; border-radius:6px; font-weight:600; }
.btn.primary { background:#111; color:#fff; }
.modal { position:fixed; inset:0; background:rgba(0,0,0,.4); display:flex; align-items:center; justify-content:center; }
.modalCard { background:#fff; padding:24px; border-radius:12px; width:680px; box-shadow:0 8px 24px rgba(0,0,0,.15); }
.modalTitle { text-align:center; font-size:20px; font-weight:700; margin-bottom:16px; }
.modalContent { display:flex; justify-content:space-between; gap:16px; }
.modalLeft { flex:1; }
.modalRight { width:320px; height:200px; border:1px solid #000; display:flex; align-items:center; justify-content:center; border-radius:8px; background:#fff; }
.imgPh { font-size:12px; color:#999; }
.form { display:flex; flex-direction:column; gap:12px; }
.input { border:1px solid #ccc; border-radius:6px; padding:8px; }
.imgPreview { width:320px; height:200px; border:1px solid #000; border-radius:8px; margin-top:8px; display:flex; align-items:center; justify-content:center; }
.formActions { display:flex; gap:12px; justify-content:flex-end; margin-top:16px; }
.timeRow { display:flex; gap:12px; }
.muted { color:#6b7280; }
</style>
