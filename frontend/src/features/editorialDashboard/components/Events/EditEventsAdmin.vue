<template>
    <div class="modal">
        <div class="modal-content">
            <h3>Edit Event</h3>

            <div class="row">
                <label class="lbl">Event Title</label>
                <input v-model="editForm.title" class="input" placeholder="Enter event title" />
            </div>

            <div class="row">
                <label class="lbl">Date</label>
                <input v-model="editForm.date" type="date" class="input" :min="today()" />
            </div>

            <div class="row">
                <label class="lbl">Start Time</label>
                <input v-model="editForm.startTime" type="time" class="input" />
            </div>

            <div class="row">
                <label class="lbl">End Time</label>
                <input v-model="editForm.endTime" type="time" class="input" :disabled="!editForm.startTime" />
            </div>

            <div class="row">
                <label class="lbl">Location</label>
                <input v-model="editForm.location" class="input" placeholder="Enter event location" />
            </div>

            <div class="row">
                <label class="lbl">Description</label>
                <textarea v-model="editForm.description" class="input" rows="6" placeholder="Enter event description"></textarea>
            </div>

            <div class="row">
                <label class="lbl">Attach Image</label>
                <div class="fileZone">
                    <input ref="fileInput" type="file" accept="image/*" @change="chooseFile" />
                    <div v-if="editForm.newImage" class="fileList">
                        <span class="chip-name">{{ editForm.newImage }}</span>
                        <button class="chip-x" title="Remove" @click="closeFile">×</button>
                    </div>
                    <div v-else class="hint">Current: {{ editForm.imageName }}</div>
                </div>
                <div v-if="fileError" class="error-message">{{ fileError }}</div>
            </div>

            <div class="actions">
                <button class="btn primary" @click="editEvent">Save</button>
                <button class="btn" @click="$emit('close')">Cancel</button>
            </div>
        </div>
    </div>  
</template>

<script setup>
    import { ref } from 'vue';
    import { today, getLocalDate, getLocalTime, validTimes, dateTimeStr } from '../../../../utils/dateUtils';
    import { useUserStore } from '../../../../stores/authStore';
    import services from '../../editorialServices';
    // Props
    const props = defineProps({
    eventData: {
        type: Object,
        required: true
    }
    });

    const emits = defineEmits(['editEvent', 'close']);
    const fileInput = ref(null);
    const editForm = ref({ 
        ...props.eventData,
        date: getLocalDate(props.eventData.startDate),
        startTime: getLocalTime(props.eventData.startDate),
        endTime: getLocalTime(props.eventData.endDate),
        newImage: '',
    });
    const fileError = ref('');

    function chooseFile() {
        fileError.value = '';
        const file = fileInput.value.files[0];
        if(!file) {
            editForm.value.newImage = '';
            return;
        }
        if (file.name === props.eventData.imageName) {
            fileError.value = 'The selected file is the same as the existing uploaded file.';
            fileInput.value.value = '';
            return;
        }
        editForm.value.newImage = file.name;
    }

    function closeFile() {
        console.log('closeFile:', fileInput.value.value);
        fileInput.value.value = '';
        editForm.value.newImage = '';
    }

    function getImagePath(imageName) {
        // Adjust this path based on your backend image serving endpoint
        return `/uploads/events/${imageName}`;
    }

    async function editEvent() {
        try {
            if (!validTimes(editForm.value.startTime, editForm.value.endTime)) {
                alert('End time must be after start time.');
                return;
            }
            const startDate = dateTimeStr(editForm.value.date, editForm.value.startTime);
            const endDate = dateTimeStr(editForm.value.date, editForm.value.endTime);
            const formData = new FormData();
            formData.append('title', editForm.value.title);
            formData.append('description', editForm.value.description);
            formData.append('location', editForm.value.location);
            formData.append('startDate', startDate);
            formData.append('endDate', endDate);

            if (fileInput.value.files[0]) {
                formData.append('file', fileInput.value.files[0]);
            }

            const response = await services.updateEvent(useUserStore().token, props.eventData._id, formData);
            emits('editEvent', response);
            emits('close');
        } catch (error) {
            console.error('Failed to edit event:', error);
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

.fileZone {
  border: 2px dashed #d1d5db;
  border-radius: 6px;
  padding: 14px;
  background: #f9fafb;
  transition: all 0.2s ease;
}

.fileZone:hover {
  border-color: #10b981;
  background: #f0fdf4;
}

.fileList {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.chip-name {
  display: inline-block;
  background: #10b981;
  color: white;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 600;
}

.chip-x {
  border: none;
  background: #ef4444;
  color: white;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
}

.chip-x:hover {
  background: #dc2626;
}

.hint {
  color: #9ca3af;
  font-size: 13px;
}

.error-message {
  color: #ef4444;
  font-size: 13px;
  margin-top: 6px;
  grid-column: 2;
}
</style>