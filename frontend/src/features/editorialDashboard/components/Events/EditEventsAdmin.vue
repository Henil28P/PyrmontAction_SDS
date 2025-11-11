<template>
    <div class="modal">
        <div class="modal-content">
            <h3>Edit Event</h3>

            <form @submit.prevent="editEvent">
            <div class="row">
                <label class="lbl">Event Title</label>
                <div>
                    <input v-model="editForm.title" class="input" placeholder="Enter event title" aria-required="true" />
                    <div v-if="errors.title" class="error">{{ errors.title }}</div>
                </div>
            </div>

            <div class="row">
                <label class="lbl">Date</label>
                <div>
                    <input v-model="editForm.date" type="date" class="input" :min="today()" aria-required="true" />
                    <div v-if="errors.date" class="error">{{ errors.date }}</div>
                </div>
            </div>

            <div class="row">
                <label class="lbl">Start Time</label>
                <div>
                    <input v-model="editForm.startTime" type="time" class="input" aria-required="true" />
                    <div v-if="errors.startTime" class="error">{{ errors.startTime }}</div>
                </div>
            </div>

            <div class="row">
                <label class="lbl">End Time</label>
                <div>
                    <input v-model="editForm.endTime" type="time" class="input" :disabled="!editForm.startTime" aria-required="true" />
                    <div v-if="errors.endTime" class="error">{{ errors.endTime }}</div>
                </div>
            </div>

            <div class="row">
                <label class="lbl">Location</label>
                <div>
                    <input v-model="editForm.location" class="input" placeholder="Enter event location" aria-required="true" />
                    <div v-if="errors.location" class="error">{{ errors.location }}</div>
                </div>
            </div>

            <div class="row">
                <label class="lbl">Description</label>
                <div>
                    <textarea v-model="editForm.description" class="input" rows="6" placeholder="Enter event description" aria-required="true"></textarea>
                    <div v-if="errors.description" class="error">{{ errors.description }}</div>
                </div>
            </div>

            <div class="row">
                <label class="lbl">Attach Image</label>
                <FileUploadEdit
                    :current-file-name="editForm.imageName"
                    v-model:file-name="editForm.newImage"
                    accept="image/*"
                    ref="fileUploadRef"
                />
            </div>

            <div class="actions">
                <button class="btn primary" type="submit" :disabled="!isFormValid" :aria-disabled="!isFormValid">Save</button>
                <button class="btn" type="button" @click="$emit('close')">Cancel</button>
            </div>
            </form>
        </div>
    </div>  
</template>

<script setup>
    import { ref, reactive, computed } from 'vue';
    import { today, getLocalDate, getLocalTime, validTimes, dateTimeStr } from '../../../../utils/dateUtils';
    import { useUserStore } from '../../../../stores/authStore';
    import services from '../../editorialServices';
    import FileUploadEdit from '../../../../components/FileUploadEdit.vue';
    // Props
    const props = defineProps({
    eventData: {
        type: Object,
        required: true
    }
    });

    const emits = defineEmits(['editEvent', 'close']);
    const fileUploadRef = ref(null);
    const errors = reactive({
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        description: ''
    });

    const editForm = ref({ 
        ...props.eventData,
        date: getLocalDate(props.eventData.startDate),
        startTime: getLocalTime(props.eventData.startDate),
        endTime: getLocalTime(props.eventData.endDate),
        newImage: '',
    });

    function clearErrors(){
        Object.keys(errors).forEach(k => errors[k] = '');
    }

    function validateForm(){
        clearErrors();
        let valid = true;
        if (!editForm.value.title || !editForm.value.title.trim()){
            errors.title = 'Title is required.'; valid = false;
        }
        if (!editForm.value.date){
            errors.date = 'Date is required.'; valid = false;
        }
        if (!editForm.value.startTime){
            errors.startTime = 'Start time is required.'; valid = false;
        }
        if (!editForm.value.endTime){
            errors.endTime = 'End time is required.'; valid = false;
        }
        if (editForm.value.startTime && editForm.value.endTime && !validTimes(editForm.value.startTime, editForm.value.endTime)){
            errors.endTime = 'End time must be after start time.'; valid = false;
        }
        if (!editForm.value.location || !editForm.value.location.trim()){
            errors.location = 'Location is required.'; valid = false;
        }
        if (!editForm.value.description || !editForm.value.description.trim()){
            errors.description = 'Description is required.'; valid = false;
        }
        return valid;
    }

    const isFormValid = computed(() => {
        if (!editForm.value.title || !editForm.value.title.trim()) return false;
        if (!editForm.value.date) return false;
        if (!editForm.value.startTime) return false;
        if (!editForm.value.endTime) return false;
        if (editForm.value.startTime && editForm.value.endTime && !validTimes(editForm.value.startTime, editForm.value.endTime)) return false;
        if (!editForm.value.location || !editForm.value.location.trim()) return false;
        if (!editForm.value.description || !editForm.value.description.trim()) return false;
        return true;
    });

    function getImagePath(imageName) {
        // Adjust this path based on your backend image serving endpoint
        return `/uploads/events/${imageName}`;
    }

    async function editEvent() {
        try {
            if (!validateForm()) return;

            const startDate = dateTimeStr(editForm.value.date, editForm.value.startTime);
            const endDate = dateTimeStr(editForm.value.date, editForm.value.endTime);
            const formData = new FormData();
            formData.append('title', editForm.value.title);
            formData.append('description', editForm.value.description);
            formData.append('location', editForm.value.location);
            formData.append('startDate', startDate);
            formData.append('endDate', endDate);

            if (fileUploadRef.value?.fileInput?.files[0]) {
                formData.append('file', fileUploadRef.value.fileInput.files[0]);
            }

            const response = await services.updateEvent(useUserStore().token, props.eventData._id, formData);
            emits('editEvent', response);
            emits('close');
        } catch (error) {
            console.error('Failed to edit event:', error);
            if (error?.response?.data?.errors) {
                const srv = error.response.data.errors;
                Object.keys(srv).forEach(k => { if (errors[k] !== undefined) errors[k] = srv[k]; });
            }
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

.error {
    color: #dc2626;
    font-size: 13px;
    margin-top: 6px;
}


</style>