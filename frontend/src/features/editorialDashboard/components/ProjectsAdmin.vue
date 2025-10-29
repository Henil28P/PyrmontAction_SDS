<template>
  <div class="card">
    <h2 class="title">Projects</h2>

    <!-- Form -->
    <div class="form">
      <div class="row">
        <label class="lbl">Project Name</label>
        <input v-model="projectForm.project_name" class="input" placeholder="Enter project name" />
      </div>

      <div class="row">
        <label class="lbl">Description</label>
        <textarea v-model="projectForm.project_description" class="input" rows="6" placeholder="Type the project description…"></textarea>
      </div>

      <div class="row">
        <label class="lbl">Type</label>
        <select v-model="projectForm.project_type" class="input">
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div class="row">
        <label class="lbl">Project Date</label>
        <input v-model="projectForm.project_date" type="date" class="input" />
      </div>

      <div class="row">
        <label class="lbl">Attach Image</label>
        <div class="fileZone">
          <input ref="fileInput" type="file" accept="image/*" @change="chooseFile" />
          <div v-if="projectForm.project_image" class="fileList">
            <span class="chip-name">🖼️ {{ projectForm.project_image }}</span>
            <button class="chip-x" title="Remove" @click="removeFile">×</button>
          </div>
          <div v-else class="hint">Select an image file…</div>
        </div>
      </div>

      <div class="actions">
        <button class="btn primary" :disabled="!canSave" @click="create">Create Project</button>
        <button class="btn" @click="clearDraft">Clear</button>
      </div>
    </div>

    <hr class="divider" />

    <!-- List -->
    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th style="width:120px;">Date</th>
            <th>Project Name</th>
            <th style="width:120px;">Type</th>
            <th style="width:140px;">Description</th>
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
            <td>{{ project.project_description }}</td>
            <td>
              <template v-if="project.project_image">
                <span class="fileBadge">{{shortName(project.project_image)}}</span>
              </template>
              <span v-else class="muted">—</span>
            </td>
            <td class="actionsCell">
              <button class="btn sm" @click="startEdit(project)">Edit</button>
              <button class="btn sm danger" @click="deleteItem(project._id)">Delete</button>
            </td>
          </tr>
          <tr v-if="!projectList.length">
            <td colspan="6" class="muted">No projects yet.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit Modal -->
    <EditProjectsAdmin 
      :project="selectedProject" 
      @projectUpdated="updateProject" 
      @closeModal="closeEditModal" 
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { useUserStore } from '../../../stores/authStore'
import services from '../editorialServices';
import EditProjectsAdmin from './EditProjectsAdmin.vue';
import { formatDate } from '../../../utils/dateUtils';

const userStore = useUserStore();

const props = defineProps({
  projectsData: {
    type: Array,
    required: true
  }
});

const emits = defineEmits(['projectsUpdated']);

const projectList = ref([]);
const selectedProject = ref(null);
const fileInput = ref(null)

const projectForm = ref({
  _id: null,
  project_name: '',
  project_description: '',
  project_type: 'open',
  file: null,
  project_image: "",
  project_date: new Date().toISOString().split('T')[0], // Initialize with current date
})

watch(() => props.projectsData, (newData) => {
  projectList.value = newData;
}, { immediate: true });

onUnmounted(() => {
  projectList.value = [];
});


const canSave = computed(() => projectForm.value.project_name.trim().length > 0)

function chooseFile() {
  const file = fileInput.value.files[0];
  projectForm.value.project_image = file.name;
  console.log('File selected:', file);
}

function removeFile() { 
    fileInput.value.value = '';
    projectForm.value.project_image = '';
}

function clearDraft() {
  projectForm.value._id = null;
  projectForm.value.project_name = '';
  projectForm.value.project_description = '';
  projectForm.value.project_type = 'open';
  projectForm.value.project_image = "";
  projectForm.value.project_date = new Date().toISOString().split('T')[0]; // Reset to current date
  fileInput.value.value = '';
}

async function create() {
  try {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('project_name', projectForm.value.project_name);
    formData.append('project_description', projectForm.value.project_description);
    formData.append('project_type', projectForm.value.project_type);
    formData.append('project_date', projectForm.value.project_date);
    
    // Append image file if selected
    if (fileInput.value.files[0]) {
      formData.append('file', fileInput.value.files[0]);
      console.log('File appended to FormData:', fileInput.value.files[0].name);
    } else {
      console.log('No file selected for create');
    }

    console.log('FormData entries for create:', [...formData.entries()]);

    const response = await services.createProject(userStore.getToken, formData);

    const newProject = {
      ...projectForm.value,
      _id: response._id,
      project_image: response.project_image
    };

    projectList.value.unshift(newProject);

    console.log('Created new project:', response);
    emits('projectsUpdated', projectList.value);

    clearDraft();
  } catch (error) {
    console.error('Failed to create project:', error);
  }
}

function startEdit(project) {
  selectedProject.value = project;
}

function closeEditModal() {
  selectedProject.value = null;
}

function updateProject(updatedProject) {
  const index = projectList.value.findIndex(p => p._id === updatedProject._id);
  if (index !== -1) {
    projectList.value[index] = { ...projectList.value[index], ...updatedProject };
  }
  emits('projectsUpdated', projectList.value);
  closeEditModal();
}

async function deleteItem(id) {
  try {
    if (confirm('Are you sure you want to delete this project?')) {
      await services.deleteProject(userStore.getToken, id);
      projectList.value = projectList.value.filter(p => p._id !== id);
      emits('projectsUpdated', projectList.value);
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
.form{border:1px solid #f0f0f0;border-radius:10px;padding:12px;margin-top:8px;margin-bottom:12px;background:#fafafa}
.row{display:grid;grid-template-columns:140px 1fr;gap:10px 12px;align-items:start;margin-bottom:10px}
.lbl{font-size:14px;color:#374151;padding-top:8px}
.input{border:1px solid #e5e7eb;border-radius:10px;padding:10px 12px;width:100%;background:#fff;font:inherit}
.actions{display:flex;gap:8px;justify-content:flex-start;margin-top:4px}
.btn{border:1px solid #e5e7eb;background:#fff;padding:8px 12px;border-radius:10px;cursor:pointer}
.btn.sm{padding:6px 10px}
.btn.primary{background:#111;color:#fff;border-color:#111}
.btn.danger{border-color:#ef4444;color:#ef4444}
.muted{color:#6b7280}
.divider{border:0;border-top:1px solid #f0f0f0;margin:12px 0}
.fileZone{border:1px dashed #d1d5db;border-radius:10px;padding:10px;background:#fff}
.fileList{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.chip-name{display:inline-block;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:999px;padding:2px 8px;margin-right:6px;font-size:12px}
.chip-x{border:none;background:transparent;cursor:pointer;font-size:14px;line-height:1}
.table-wrap{overflow-x:auto}
.table{width:100%;border-collapse:collapse;font-size:14px}
.table th,.table td{padding:10px 12px;border-top:1px solid #f3f4f6;text-align:left;vertical-align:top}
.fileBadge{display:inline-block;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:999px;padding:2px 8px;margin-right:6px;font-size:12px}
.badge{display:inline-block;border-radius:999px;padding:2px 8px;font-size:12px;border:1px solid #e5e7eb}
.badge-open{background:#ecfeff;color:#155e75;border-color:#a5f3fc}
.badge-closed{background:#fff7ed;color:#9a3412;border-color:#fed7aa}
.actionsCell{display:flex;gap:6px}
.hint{color:#6b7280}
@media (max-width: 640px){.row{grid-template-columns:1fr}}
</style>