<template>
  <div class="projects-wrapper">
    <div class="projects-header">
      <h2 class="main-title">Projects Management</h2>
      <p class="subtitle">Create and manage community projects</p>
    </div>

    <div class="projects-actions">
      <div class="filters-group">
        <div class="search-bar">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search projects..."
            class="search-input"
          />
        </div>
        <div class="filter-buttons">
          <button 
            @click="statusFilter = 'all'" 
            class="filter-btn"
            :class="{ active: statusFilter === 'all' }"
          >
            All ({{ projectList.length }})
          </button>
          <button 
            @click="statusFilter = 'open'" 
            class="filter-btn"
            :class="{ active: statusFilter === 'open' }"
          >
            Open ({{ openCount }})
          </button>
          <button 
            @click="statusFilter = 'closed'" 
            class="filter-btn"
            :class="{ active: statusFilter === 'closed' }"
          >
            Closed ({{ closedCount }})
          </button>
        </div>
      </div>
      <button @click="addProjectModal = true" class="btn-create">
        Add Project
      </button>
    </div>

    <!-- List -->
    <div class="projects-content">
      <div class="section-title">
        <h3>{{ statusFilter === 'all' ? 'All Projects' : statusFilter === 'open' ? 'Open Projects' : 'Closed Projects' }}</h3>
        <span class="count-badge">{{ filteredProjects.length }} projects</span>
      </div>
      
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th style="width:120px;">DATE</th>
              <th>PROJECT TITLE</th>
              <th style="width:120px;">STATUS</th>
              <th style="width:160px;">IMAGE</th>
              <th style="width:160px;">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="project in filteredProjects" :key="project._id">
              <td>{{ formatDate(project.project_date) }}</td>
              <td class="project-name">{{ project.project_name }}</td>
              <td>
                <span class="status-badge" :class="project.project_type === 'open' ? 'status-open' : 'status-closed'">
                  {{ project.project_type === 'open' ? 'Open' : 'Closed' }}
                </span>
              </td>
              <td>
                <template v-if="project.project_image">
                  <span class="file-badge">{{shortName(project.project_image)}}</span>
                </template>
                <span v-else class="text-muted">—</span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn-edit" @click="selectedProject = project">Edit</button>
                  <button class="btn-delete" @click="deleteItem(project._id)">Delete</button>
                </div>
              </td>
            </tr>
            <tr v-if="!filteredProjects.length">
              <td colspan="5" class="empty-row">{{ searchQuery ? 'No projects found' : 'No projects yet' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <AddProjectsAdmin 
      v-if="addProjectModal"
      @addProject="addNewProject"
      @close="addProjectModal = false"
    />
    <EditProjectsAdmin
      v-if="selectedProject"
      :project="selectedProject"
      @updateProject="updateProjectList"
      @close="selectedProject = null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '../../../stores/authStore'
import services from '../editorialServices';
import EditProjectsAdmin from '../components/Projects/EditProjectsAdmin.vue';
import AddProjectsAdmin from '../components/Projects/AddProjectsAdmin.vue';
import { formatDate } from '../../../utils/dateUtils';

const projectList = ref([])
const selectedProject = ref(null)
const addProjectModal = ref(false)
const searchQuery = ref('')
const statusFilter = ref('all')

const filteredProjects = computed(() => {
  let filtered = projectList.value;
  
  // Filter by status
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(p => p.project_type === statusFilter.value);
  }
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(p => 
      p.project_name?.toLowerCase().includes(query) ||
      p.project_details?.toLowerCase().includes(query)
    );
  }
  
  return filtered;
});

const openCount = computed(() => 
  projectList.value.filter(p => p.project_type === 'open').length
);

const closedCount = computed(() => 
  projectList.value.filter(p => p.project_type === 'closed').length
);

async function loadProjects() {
  try {
    const response = await services.getAllProjects(useUserStore().getToken);
    projectList.value = response;
  } catch (error) {
    console.error('Failed to load projects:', error);
  }
}

onMounted(() => {
  loadProjects();
});

function addNewProject(newProject) {
  projectList.value.unshift(newProject);
}

function updateProjectList(updatedProject) {
  const index = projectList.value.findIndex(p => p._id === updatedProject._id);
  if (index !== -1) {
    projectList.value[index] = { ...projectList.value[index], ...updatedProject };
  }
}

async function deleteItem(id) {
  try {
    if (confirm('Are you sure you want to delete this project?')) {
      await services.deleteProject(useUserStore().getToken, id);
      projectList.value = projectList.value.filter(p => p._id !== id);
    }
  } catch (error) {
    console.error('Failed to delete project:', error);
  }
}

function shortName(name) { return name.length > 18 ? name.slice(0, 16) + '…' : name }

</script>

<style scoped>
.projects-wrapper {
  background: white;
  border-radius: 0;
  border: none;
  box-shadow: none;
  padding: 0;
  margin: 0;
}

.projects-header {
  padding: 24px 24px 20px;
  border-bottom: 1px solid #f3f4f6;
}

.main-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.subtitle {
  margin: 6px 0 0 0;
  color: #6b7280;
  font-size: 14px;
}

.projects-actions {
  padding: 16px 24px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.filters-group {
  display: flex;
  gap: 16px;
  align-items: center;
  flex: 1;
}

.search-bar {
  flex: 1;
  max-width: 350px;
}

.search-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.filter-buttons {
  display: flex;
  gap: 8px;
  background: white;
  padding: 4px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.filter-btn {
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 14px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.filter-btn:hover {
  background: #f3f4f6;
  color: #111827;
}

.filter-btn.active {
  background: #10b981;
  color: white;
}

.btn-create {
  background: #10b981;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-create:hover {
  background: #059669;
}

.projects-content {
  padding: 24px;
}

.section-title {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title h3 {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.count-badge {
  background: #f3f4f6;
  color: #6b7280;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
}

.table-wrap {
  overflow-x: auto;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table thead {
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

.table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table td {
  padding: 16px;
  border-top: 1px solid #f3f4f6;
  text-align: left;
  vertical-align: middle;
  color: #374151;
}

.table tbody tr:hover {
  background: #f9fafb;
}

.project-name {
  font-weight: 600;
  color: #111827;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-open {
  background: #d1fae5;
  color: #065f46;
}

.status-closed {
  background: #fee2e2;
  color: #991b1b;
}

.file-badge {
  display: inline-block;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 12px;
  color: #6b7280;
}

.text-muted {
  color: #9ca3af;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-edit,
.btn-delete {
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-edit {
  background: #2563eb;
  color: white;
}

.btn-edit:hover {
  background: #1d4ed8;
}

.btn-delete {
  background: #ef4444;
  color: white;
}

.btn-delete:hover {
  background: #dc2626;
}

.empty-row {
  text-align: center;
  color: #9ca3af;
  padding: 40px !important;
}

@media (max-width: 768px) {
  .projects-header {
    padding: 20px 16px 16px;
  }

  .main-title {
    font-size: 20px;
  }

  .subtitle {
    font-size: 13px;
  }

  .projects-actions {
    padding: 12px 16px;
    flex-direction: column;
    align-items: stretch;
  }
  
  .filters-group {
    flex-direction: column;
    width: 100%;
  }
  
  .search-bar {
    max-width: 100%;
  }
  
  .filter-buttons {
    width: 100%;
    justify-content: space-between;
  }
  
  .filter-btn {
    flex: 1;
    padding: 8px 12px;
    font-size: 13px;
  }

  .projects-content {
    padding: 16px;
  }

  .table-wrap {
    border-radius: 6px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }
}
</style>