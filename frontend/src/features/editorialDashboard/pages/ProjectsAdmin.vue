<template>
  <div class="card">
    <h2 class="title">Projects</h2>
    <button @click="addProjectModal = true">Add New Project</button>
    <hr class="divider" />

    <!-- List -->
    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th style="width:120px;">Date</th>
            <th>Project Name</th>
            <th style="width:120px;">Type</th>
            <th style="width:160px;">Image</th>
            <th style="width:160px;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in projectList" :key="project._id">
            <td>{{ formatDate(project.project_date) }}</td>
            <td>{{ project.project_name }}</td>
            <td>
              <span class="badge" :class="project.project_type === 'open' ? 'badge-open' : 'badge-closed'">
                {{ project.project_type === 'open' ? 'Open' : 'Closed' }}
              </span>
            </td>
            <td>
              <template v-if="project.project_image">
                <span class="fileBadge">{{shortName(project.project_image)}}</span>
              </template>
              <span v-else class="muted">—</span>
            </td>
            <td class="actionsCell">
              <button class="btn sm" @click="selectedProject = project">Edit</button>
              <button class="btn sm danger" @click="deleteItem(project._id)">Delete</button>
            </td>
          </tr>
          <tr v-if="!projectList.length">
            <td colspan="6" class="muted">No projects yet.</td>
          </tr>
        </tbody>
      </table>
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
import { ref, onMounted } from 'vue'
import { useUserStore } from '../../../stores/authStore'
import services from '../editorialServices';
import EditProjectsAdmin from '../components/Projects/EditProjectsAdmin.vue';
import AddProjectsAdmin from '../components/Projects/AddProjectsAdmin.vue';
import { formatDate } from '../../../utils/dateUtils';

const projectList = ref([]);
const selectedProject = ref(null);
const addProjectModal = ref(false);

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
.card{padding:16px;border:1px solid #e5e7eb;border-radius:12px;background:#fff}
.title{margin:0 0 12px 0;font-size:20px;font-weight:600}
.btn{border:1px solid #e5e7eb;background:#fff;padding:8px 12px;border-radius:10px;cursor:pointer}
.btn.sm{padding:6px 10px}
.btn.primary{background:#111;color:#fff;border-color:#111}
.btn.danger{border-color:#ef4444;color:#ef4444}
.muted{color:#6b7280}
.divider{border:0;border-top:1px solid #f0f0f0;margin:12px 0}
.table-wrap{overflow-x:auto}
.table{width:100%;border-collapse:collapse;font-size:14px}
.table th,.table td{padding:10px 12px;border-top:1px solid #f3f4f6;text-align:left;vertical-align:top}
.fileBadge{display:inline-block;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:999px;padding:2px 8px;margin-right:6px;font-size:12px}
.badge{display:inline-block;border-radius:999px;padding:2px 8px;font-size:12px;border:1px solid #e5e7eb}
.badge-open{background:#ecfeff;color:#155e75;border-color:#a5f3fc}
.badge-closed{background:#fff7ed;color:#9a3412;border-color:#fed7aa}
.actionsCell{display:flex;gap:6px}
.hint{color:#6b7280}
</style>