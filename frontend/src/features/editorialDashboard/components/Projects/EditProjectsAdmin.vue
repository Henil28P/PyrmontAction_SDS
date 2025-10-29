<template>
  <div v-if="showEditModal" class="modal">
    <div class="modal-content">
      <h3>Edit Project</h3>

      <div class="row">
        <label class="lbl">Project Name</label>
        <input v-model="editForm.project_name" class="input" placeholder="Enter project name" />
      </div>

      <div class="row">
        <label class="lbl">Description</label>
        <textarea v-model="editForm.project_description" class="input" rows="6" placeholder="Type the project description…"></textarea>
      </div>

      <div class="row">
        <label class="lbl">Type</label>
        <select v-model="editForm.project_type" class="input">
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div class="row">
        <label class="lbl">Project Date</label>
        <input v-model="editForm.project_date" type="date" class="input" />
      </div>

      <div class="row">
        <label class="lbl">Attach Image</label>
        <div class="fileZone">
          <input ref="fileInput" type="file" accept="image/*" @change="chooseFile" />
          <div v-if="editForm.project_image" class="fileList">
            <span class="chip-name">🖼️ {{ editForm.project_image }}</span>
            <button class="chip-x" title="Remove" @click="removeFile">×</button>
          </div>
          <div v-else class="hint">No image chosen</div>
        </div>
        <div v-if="fileError" class="error-message">{{ fileError }}</div>
      </div>

      <div class="actions">
        <button class="btn primary" @click="saveEdit">Save</button>
        <button class="btn" @click="closeEditModal">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useUserStore } from '../../../../stores/authStore';
import services from '../../editorialServices';

const props = defineProps({
  project: {
    type: Object,
    required: true,
  }
});

const userStore = useUserStore();
const fileError = ref('');
const fileInput = ref(null);

const editForm = ref({
  _id: null, project_name: '', project_description: '',
  project_type: 'open', project_image: '', project_date: ''
});

const emits = defineEmits(['projectUpdated', 'closeModal']);

const showEditModal = computed(() => !!props.project);

// Watch for project prop changes
watch(() => props.project, (newProject) => {
  if (newProject) {
    editForm.value._id = newProject._id;
    editForm.value.project_name = newProject.project_name;
    editForm.value.project_description = newProject.project_description;
    editForm.value.project_type = newProject.project_type;
    editForm.value.project_image = newProject.project_image;
    editForm.value.project_date = new Date(newProject.project_date).toISOString().split('T')[0];
  }
}, { immediate: true });

function closeEditModal() {
  editForm.value = { 
    _id: null, project_name: '', project_description: '', 
    project_type: 'open', project_image: '', project_date: '' };
  fileInput.value.value = '';
  fileError.value = '';
  emits('closeModal');
}

function chooseFile() {
  fileError.value = '';
  const file = fileInput.value.files[0];
  if (file.name === props.project.project_image) {
    fileError.value = 'The selected file is the same as the existing uploaded file.';
    fileInput.value.value = '';
    return; // No change in file
  }
  editForm.value.project_image = file.name
  console.log('File selected:', file);
}

function removeFile() {
  fileInput.value.value = '';
  editForm.value.project_image = '';
}

async function saveEdit() {
  try {
    const formData = new FormData();
    formData.append('project_name', editForm.value.project_name);
    formData.append('project_description', editForm.value.project_description);
    formData.append('project_type', editForm.value.project_type);
    formData.append('project_date', editForm.value.project_date);
    
    if (editForm.value.project_image != props.project.project_image && fileInput.value.files[0]) {
      formData.append('file', fileInput.value.files[0]);
    }

    const response = await services.updateProjectWithFile(userStore.getToken, editForm.value._id, formData);
    emits('projectUpdated', { ...response });
    closeEditModal();
  } catch (error) {
    console.error('Failed to save edit:', error);
  }
}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.row{display:grid;grid-template-columns:140px 1fr;gap:10px 12px;align-items:start;margin-bottom:10px}
.lbl{font-size:14px;color:#374151;padding-top:8px}
.input{border:1px solid #e5e7eb;border-radius:10px;padding:10px 12px;width:100%;background:#fff;font:inherit}
.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
.btn{border:1px solid #e5e7eb;background:#fff;padding:8px 12px;border-radius:10px;cursor:pointer}
.btn.primary{background:#111;color:#fff;border-color:#111}
.fileZone {
  border: 1px dashed #d1d5db;
  border-radius: 10px;
  padding: 10px;
  background: #fff;
}
.fileList {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}
.chip-name {
  display: inline-block;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 2px 8px;
  margin-right: 6px;
  font-size: 12px;
}
.chip-x {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
}
.hint {
  color: #6b7280;
}
</style>