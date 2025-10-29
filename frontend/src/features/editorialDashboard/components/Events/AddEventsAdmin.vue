<template>
    <div class="modal">
        <div class="modal-content">
            <h3>Add New Event</h3>
            <div class="row">
                <label class="lbl">Event Title</label>
                <input v-model="eventForm.title" class="input" placeholder="Enter event title" />
            </div>
            <div class="row">
                <label class="lbl">Date</label>
                <input v-model="eventForm.date" type="date" class="input" :min="today()" />
            </div>
            <div class="row">
                <label class="lbl">Start Time</label>
                <input v-model="eventForm.startTime" type="time" class="input" />
            </div>
            <div class="row">
                <label class="lbl">End Time</label>
                <input v-model="eventForm.endTime" type="time" class="input" :disabled="!eventForm.startTime" />
            </div>
            <div class="row">
                <label class="lbl">Location</label>
                <input v-model="eventForm.location" class="input" placeholder="Enter event location" />
            </div>
            <div class="row">
                <label class="lbl">Description</label>
                <textarea v-model="eventForm.description" class="input" rows="6" placeholder="Enter event description"></textarea>
            </div>
            <div class="row">
                <label class="lbl">Attach Image</label>
                <FileUploadNew
                    v-model:file-name="eventForm.imageName"
                    accept="image/*"
                    ref="fileUploadRef"
                />
            </div>
            <div class="actions">
                <button class="btn" @click="addEvent('draft')">Save as Draft</button>
                <button class="btn primary" @click="addEvent('publish')">Publish</button>
                <button class="btn" @click="$emit('close')">Cancel</button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { useUserStore } from '../../../../stores/authStore';
    import services from '../../editorialServices';
    import { validTimes, dateTimeStr, today } from '../../../../utils/dateUtils';
    import FileUploadNew from '../FileUploadNew.vue';

    const emits = defineEmits(['addEvent', 'close']);
    const fileUploadRef = ref(null);
    const eventForm = ref({
        _id: null,
        title: '',
        description: '',
        location: '',
        date: today(),
        startTime: '',
        endTime: '',
        imageName: '',
    });

    async function addEvent(status) {
        try {
            if (!validTimes(eventForm.value.startTime, eventForm.value.endTime)) {
                alert('End time must be after start time.');
                return;
            }
            const startDate = dateTimeStr(eventForm.value.date, eventForm.value.startTime);
            const endDate = dateTimeStr(eventForm.value.date, eventForm.value.endTime);
            const formData = new FormData();
            formData.append('title', eventForm.value.title);
            formData.append('description', eventForm.value.description);
            formData.append('location', eventForm.value.location);
            formData.append('startDate', startDate);
            formData.append('endDate', endDate);
            formData.append('status', status);

            if (fileUploadRef.value?.fileInput?.files[0]) {
                formData.append('file', fileUploadRef.value.fileInput.files[0]);
            } else {
                alert('Please select an image file.');
                return;
            }

            const response = await services.createEvent(useUserStore().token, formData);
            emits('addEvent', response);
            emits('close');
        } catch (error) {
            console.error('Failed to add event:', error);
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
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  padding: 28px;
  border-radius: 8px;
  width: 560px;
  max-width: 92vw;
  max-height: 92vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.2s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

h3 {
  margin: 0 0 24px 0;
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.row {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 10px 14px;
  align-items: start;
  margin-bottom: 18px;
}

.lbl {
  font-size: 14px;
  color: #374151;
  padding-top: 10px;
  font-weight: 600;
}

.input {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 10px 14px;
  width: 100%;
  background: white;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

textarea.input {
  resize: vertical;
  min-height: 120px;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.btn {
  border: 1px solid #d1d5db;
  background: white;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn:hover {
  background: #f9fafb;
}

.btn.primary {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.btn.primary:hover {
  background: #059669;
  border-color: #059669;
}


</style>