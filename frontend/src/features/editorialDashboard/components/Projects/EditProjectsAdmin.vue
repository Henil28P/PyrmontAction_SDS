<template>
  <div class="modal">
    <div class="modal-content">
      <h3>Edit Project</h3>

      <form @submit.prevent="saveEdit">
        <div class="row">
          <label class="lbl">Project Name</label>
          <input v-model="editForm.project_name" class="input" placeholder="Enter project name" required />
        </div>

        <div class="row">
          <label class="lbl">Description</label>
          <textarea v-model="editForm.project_description" class="input" rows="6" placeholder="Type the project description…" required></textarea>
        </div>

        <div class="row">
          <label class="lbl">Type</label>
          <select v-model="editForm.project_type" class="input" required>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div class="row">
          <label class="lbl">Project Date</label>
          <input v-model="editForm.project_date" type="date" class="input" required />
        </div>

        <div class="row">
          <label class="lbl">Attach Image</label>
          <FileUploadEdit
            :current-file-name="project?.project_image"
            v-model:file-name="editForm.new_project_image"
            accept="image/*"
            ref="fileUploadRef"
          />
        </div>

        <div class="actions">
          <button type="submit" class="btn primary">Save</button>
          <button type="button" class="btn" @click="$emit('close')">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '../../../../stores/authStore';
import services from '../../editorialServices';
import FileUploadEdit from '../../../../components/FileUploadEdit.vue';
import { getLocalDate } from '../../../../utils/dateUtils';

const props = defineProps({
  project: {
    type: Object,
    required: true,
  }
});

const fileUploadRef = ref(null);

const editForm = ref({
  ...props.project,
  new_project_image: '',
  project_date: getLocalDate(props.project.project_date)
});

const emits = defineEmits(['updateProject', 'close']);

async function saveEdit() {
  try {
    const formData = new FormData();
    formData.append('project_name', editForm.value.project_name);
    formData.append('project_description', editForm.value.project_description);
    formData.append('project_type', editForm.value.project_type);
    formData.append('project_date', editForm.value.project_date);
    
    if (fileUploadRef.value?.fileInput?.files[0]) {
        formData.append('file', fileUploadRef.value.fileInput.files[0]);
    }

    const response = await services.updateProjectWithFile(useUserStore().getToken, editForm.value._id, formData);
    emits('updateProject', response);
    emits('close');
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
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-content h3 {
  margin: 0 0 24px 0;
  font-size: 22px;
  font-weight: 700;
  color: #111827;
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.row {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px;
  align-items: start;
}

.lbl {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  padding-top: 10px;
  text-align: left;
}

.input {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 10px 12px;
  width: 100%;
  background: #fff;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s;
}

.input:focus {
  outline: none;
  border-color: #111;
}

textarea.input {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 8px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.btn {
  border: 1px solid #d1d5db;
  background: #fff;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn:hover {
  background: #f9fafb;
}

.btn.primary {
  background: #111;
  color: #fff;
  border-color: #111;
}

.btn.primary:hover {
  background: #000;
}
</style>