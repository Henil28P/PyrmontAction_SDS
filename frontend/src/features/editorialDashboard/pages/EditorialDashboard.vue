<template>
  <div class="editorial-dashboard-bg">
	<div class="editorial-dashboard">
	  <aside class="sidebar">
		<div class="back-button-container">
		  <button @click="goBack" class="back-btn">
			<span class="back-icon">←</span> Back to Dashboard
		  </button>
		</div>
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
		  <div v-if="currentTab === 'Projects'">
			<ProjectsAdmin/>
		  </div>
		  <div v-else-if="currentTab === 'Events'">
			<EventsAdmin/>
		  </div>
		  <div v-else-if="currentTab === 'Gallery'">
			<GalleryAdmin />
		  </div>
		  <div v-else-if="currentTab === 'Blogs'">
			<BlogsAdmin />
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ProjectsAdmin from './ProjectsAdmin.vue'
import GalleryAdmin from './GalleryAdmin.vue'
import EventsAdmin from './EventsAdmin.vue'
import BlogsAdmin from './BlogsAdmin.vue'

const router = useRouter()

const tabs = [
  { name: 'Projects', label: 'Projects', icon: '📁', color: '#fbbf24' },
  { name: 'Events', label: 'Events', icon: '📅', color: '#38bdf8' },
  { name: 'Gallery', label: 'Gallery', icon: '🖼️', color: '#f472b6' },
  { name: 'Blogs', label: 'Blogs', icon: '📝', color: '#8b5cf6' }
]
const currentTab = ref('Projects')

function goBack() {
  router.go(-1)
}

</script>

<style scoped>
.editorial-dashboard-bg {
  background: white;
  min-height: calc(100vh - 70px);
  padding: 0;
  margin: 0;
}
.editorial-dashboard {
  display: flex;
  align-items: flex-start;
  max-width: 100%;
  margin: 0;
  padding: 0;
  min-height: 700px;
}
.sidebar {
  width: 200px;
  background: #fafafa;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border-right: 1px solid #e5e7eb;
}
.back-button-container {
  padding: 0 12px 16px 12px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 8px;
}
.back-btn {
  width: 100%;
  background: #111;
  color: white;
  border: none;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  justify-content: center;
}
.back-btn:hover {
  background: white;
  color: #111;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.back-icon {
  font-size: 1.2em;
}
.sidebar nav {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 12px;
}
.sidebar button {
  width: 100%;
  background: none;
  border: none;
  text-align: left;
  padding: 12px 16px;
  font-size: 14px;
  color: #6b7280;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s;
}
.sidebar button.active {
  background: white;
  color: #111827;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.icon {
  font-size: 1.2em;
}
.main-content {
  flex: 1;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}
.page-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  padding: 20px 24px;
  border-bottom: 1px solid #f3f4f6;
  width: 100%;
  background: white;
}
.card {
  background: none;
  border-radius: 0;
  box-shadow: none;
  padding: 0;
  margin: 0;
  max-width: none;
  width: 100%;
}

.placeholder {
  color: #888;
  font-size: 1.1rem;
  text-align: center;
  padding: 40px 0;
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