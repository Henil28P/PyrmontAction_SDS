<template>
  <div class="modal">
    <div class="modal-content">
      <h3>Edit Meeting Minute</h3>

      <div class="row">
        <label class="lbl">Title</label>
        <input v-model="editForm.title" class="input" placeholder="Enter title" />
      </div>

      <div class="row">
        <label class="lbl">Notes</label>
        <textarea v-model="editForm.note" class="input" rows="6" placeholder="Type the meeting notes…"></textarea>
      </div>

      <div class="row">
        <label class="lbl">Attach File</label>
        <FileUploadEdit 
          :current-file-name="meeting?.filename"
          v-model:file-name="editForm.newPDF"
          accept="application/pdf"
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
import { ref, computed, watch } from 'vue';
import { useUserStore } from '../../../../stores/authStore';
import services from '../../dashboardServices';
import FileUploadEdit from '../../../../components/FileUploadEdit.vue';

const props = defineProps({
  meeting: {
    type: Object,
    required: true,
  }
});

const fileUploadRef = ref(null);
const emits = defineEmits(['updateMeetingMinute', 'close']);
const editForm = ref({
  ...props.meeting,
  newPDF: '' 
});

async function saveEdit() {
  try {
    const formData = new FormData();
    formData.append('_id', editForm.value._id);
    formData.append('title', editForm.value.title);
    formData.append('note', editForm.value.note);

    if (fileUploadRef.value?.fileInput?.files[0]) {
      formData.append('file', fileUploadRef.value.fileInput.files[0]);
    }

    const response = await services.updateMeetingWithFile(useUserStore().getToken, editForm.value._id, formData);
    emits('updateMeetingMinute', response );
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
</style>