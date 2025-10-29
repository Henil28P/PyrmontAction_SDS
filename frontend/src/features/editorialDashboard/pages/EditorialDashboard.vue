<template>
  <div class="editorial-dashboard-bg">
    <div class="editorial-dashboard">
      <aside class="sidebar">
        <nav>
          <button
            v-for="tab in tabs"
            :key="tab.name"
            :class="{ active: currentTab === tab.name }"
            @click="currentTab = tab.name"
          >
            <span class="icon" :style="{ color: tab.color }">{{ tab.icon }}</span>
            {{ tab.label }}
          </button>
        </nav>
      </aside>
      <main class="main-content">
        <h2 class="page-title">Edit {{ currentTab }}</h2>
        <div class="card">
          <!-- Projects Tab -->
          <div v-if="currentTab === 'Projects'">
            <ProjectsAdmin 
              :projectsData="projects" 
              @projectsUpdated="handleProjectsUpdated" 
            />
          </div>
          <div v-if="currentTab === 'Events'">
            <EventsAdmin 
              :eventsData="events" 
              @eventsUpdated="handleEventsUpdated" 
            />
          </div>
          <div v-if="currentTab === 'Gallery'">
            <GalleryAdmin 
              :galleryData="galleryItems" 
              @galleryUpdated="handleGalleryUpdated" 
            />
          </div>
          <div v-else class="placeholder">
            <p>Edit {{ currentTab }} content here.</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../../../stores/authStore'
import services from '../editorialServices'
import ProjectsAdmin from '../components/ProjectsAdmin.vue'
import GalleryAdmin from '../components/GalleryAdmin.vue'
import EventsAdmin from '../components/Events/EventsAdmin.vue'

const userStore = useUserStore()

const tabs = [
  { name: 'Projects', label: 'Projects', icon: '📁', color: '#fbbf24' },
  // Removed News tab
  { name: 'Events', label: 'Events', icon: '📅', color: '#38bdf8' },
  { name: 'Gallery', label: 'Gallery', icon: '🖼️', color: '#f472b6' }
]
const currentTab = ref('Projects')

// Dynamic projects data from database
const projects = ref([])
const galleryItems = ref([]);
const events = ref({
  upcoming: [],
  completed: []
});

// Load projects data
async function loadProjects() {
  try {
    const response = await services.getAllProjects(userStore.getToken)
    projects.value = response
  } catch (error) {
    console.error('Failed to load projects:', error)
  }
}

// Load events data
async function loadGallery() {
  try {
    const response = await services.getGalleryItems(userStore.getToken)
    galleryItems.value = response
  } catch (error) {
    console.error('Failed to load gallery:', error)
  }
}
async function loadEvents() {
  try {
    const upcoming = await services.getUpcomingEvents(userStore.getToken)
    const completed = await services.getCompletedEvents(userStore.getToken)
    events.value.upcoming = upcoming
    events.value.completed = completed
    console.log('Loaded events:', events.value)
  } catch (error) {
    console.error('Failed to load events:', error)
  }
}

function handleProjectsUpdated(updatedProjects) {
  projects.value = updatedProjects
}

function handleGalleryUpdated(updatedGallery) {
  galleryItems.value = updatedGallery
}

function handleEventsUpdated(updatedEvents) {
  events.value.upcoming = updatedEvents.upcoming
}

onMounted(() => {
  loadProjects();
  loadGallery();
  loadEvents();
})
</script>

<style scoped>
.editorial-dashboard-bg {
  background: #f7f8fa;
  min-height: calc(100vh - 70px); /* adjust if your header is taller */
  padding-top: 32px;
}
.editorial-dashboard {
  display: flex;
  align-items: flex-start;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 700px;
}
.sidebar {
  width: 180px;
  background: transparent;
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.sidebar nav {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.sidebar button {
  width: 90%;
  background: none;
  border: none;
  text-align: left;
  padding: 12px 18px;
  font-size: 1rem;
  color: #888;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.2s, color 0.2s;
}
.sidebar button.active {
  background: #fff;
  color: #222;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(60,60,90,0.04);
}
.icon {
  font-size: 1.3em;
}
.main-content {
  flex: 1;
  padding: 0 0 0 32px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.page-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 32px;
  margin-top: 0;
}
.card {
  /* Remove max-width and width! */
  background: none;
  border-radius: 0;
  box-shadow: none;
  padding: 0;
  max-width: none;
  width: auto;
}
.editor-projects-editor {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 0;
}
.editor-form {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(60,60,90,0.10);
  padding: 40px 36px;
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.editor-title {
  font-size: 2rem;
  font-weight: 700;
  border: none;
  border-bottom: 2px solid #e0e0e0;
  padding: 12px 0;
  outline: none;
  background: transparent;
}
.editor-description {
  font-size: 1.15rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 16px;
  resize: vertical;
  min-height: 140px;
  background: #f9f9f9;
}
.editor-image-label {
  font-weight: 500;
  color: #1976d2;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.editor-image-label input[type="file"] {
  margin-top: 8px;
}
.editor-image-preview img {
  width: 100%;
  max-width: 320px;
  border-radius: 8px;
  margin: 12px 0;
  box-shadow: 0 2px 8px rgba(60,60,90,0.10);
}
.editor-actions {
  display: flex;
  gap: 18px;
  margin-top: 10px;
}
.save-btn {
  background: #4fc3f7;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.save-btn:hover {
  background: #1976d2;
}
.cancel-btn {
  background: #eee;
  color: #333;
  border: none;
  border-radius: 6px;
  padding: 8px 24px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.cancel-btn:hover {
  background: #ccc;
}
.placeholder {
  color: #888;
  font-size: 1.1rem;
  text-align: center;
  padding: 40px 0;
}
.projects-tab-layout {
  display: flex;
  gap: 48px;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
}
.project-preview-card {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 24px rgba(60,60,90,0.10);
  padding: 48px 40px;
  min-width: 420px;
  max-width: 520px;
  margin-top: 0;
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.project-preview-simple {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(60,60,90,0.10);
  padding: 48px 40px;
  min-width: 420px;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
}
.preview-label {
  color: #bfa76a;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 10px;
}
.preview-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 12px;
}
.preview-image {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
  max-height: 260px;
  margin-bottom: 12px;
}
.preview-date {
  color: #888;
  font-size: 1.1rem;
  margin-bottom: 12px;
}
.preview-description {
  font-size: 1.15rem;
  color: #222;
  line-height: 1.6;
}
.form-image-preview img {
  width: 100%;
  max-width: 320px;
  border-radius: 8px;
  margin: 12px 0;
}
.projects-list-nav {
  min-width: 340px;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 24px rgba(60,60,90,0.10);
  padding: 32px 24px;
  margin-top: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.add-btn {
  background: #4fc3f7;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 18px 0;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 28px;
  width: 100%;
  transition: background 0.2s;
}
.add-btn:hover {
  background: #1976d2;
}
.projects-list-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.projects-list-nav li {
  padding: 22px 16px;
  border-radius: 14px;
  margin-bottom: 18px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: background 0.2s, border 0.2s;
  border: 2px solid transparent;
  background: #f7f8fa;
  font-size: 1.1rem;
}
.projects-list-nav li.selected {
  border: 2px solid #4fc3f7;
  background: #e3f2fd;
  font-weight: 700;
}
.project-actions button {
  margin-left: 6px;
  background: #eee;
  border: none;
  border-radius: 6px;
  padding: 8px 18px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.project-actions button:hover {
  background: #ccc;
}
.mini-date {
  color: #888;
  font-size: 1em;
  margin-top: 6px;
}
@media (max-width: 900px) {
  .editorial-dashboard {
    flex-direction: column;
    align-items: stretch;
  }
  .sidebar {
    width: 100%;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 0 0 16px 0;
  }
  .sidebar nav {
    flex-direction: row;
    gap: 0;
  }
  .sidebar button {
    width: auto;
    padding: 12px 18px;
    border-radius: 8px 8px 0 0;
  }
  .main-content {
    padding: 0;
    align-items: stretch;
  }
  .card {
    max-width: 100%;
    margin: 0 auto;
  }
}
</style>