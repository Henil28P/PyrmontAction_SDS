<template>
  <div class="modal">
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
        <button class="btn primary" @click="saveEdit">Save</button>
        <button class="btn" @click="$emit('close')">Cancel</button>
      </div>
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