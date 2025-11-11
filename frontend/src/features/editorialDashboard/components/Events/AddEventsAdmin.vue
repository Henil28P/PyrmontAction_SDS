<template>
    <div class="modal">
        <div class="modal-content">
            <h3>Add New Event</h3>
            
            <form @submit.prevent="addEvent('draft')">
                <div class="form-group">
                    <label>Event Title</label>
                    <input v-model="eventForm.title" class="text-input" placeholder="Enter event title" required />
                </div>
                
                <div class="form-group">
                    <label>Date</label>
                    <input v-model="eventForm.date" type="date" class="text-input" :min="today()" required />
                </div>
                
                <div class="form-group">
                    <label>Start Time</label>
                    <input v-model="eventForm.startTime" type="time" class="text-input" required />
                </div>
                
                <div class="form-group">
                    <label>End Time</label>
                    <input v-model="eventForm.endTime" type="time" class="text-input" :disabled="!eventForm.startTime" @change="validateEndTime" required />
                </div>
                
                <div class="form-group">
                    <label>Location</label>
                    <input v-model="eventForm.location" class="text-input" placeholder="Enter event location" required />
                </div>
                
                <div class="form-group">
                    <label>Description</label>
                    <textarea v-model="eventForm.description" class="text-input" rows="6" placeholder="Enter event description" required></textarea>
                </div>
                
                <div class="form-group">
                    <label>Attach Image</label>
                    <FileUploadNew
                        v-model:file-name="eventForm.imageName"
                        accept="image/*"
                        ref="fileUploadRef"
                        :required="true"
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
    import { validTimes, dateTimeStr, today } from '../../../../utils/dateUtils';
    import FileUploadNew from '../../../../components/FileUploadNew.vue';

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

    function validateEndTime() {
        if (eventForm.value.startTime && eventForm.value.endTime) {
            if (eventForm.value.endTime <= eventForm.value.startTime) {
                alert('End time must be after start time.');
                eventForm.value.endTime = '';
            }
        }
    }

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
}

.modal-content {
    background: #fff;
    padding: 30px;
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    max-height: 90vh;
    overflow-y: auto;
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

.form-group {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 12px;
    align-items: start;
}

.form-group label {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    padding-top: 10px;
    text-align: left;
}

.text-input {
    border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 10px 12px;
    width: 100%;
    background: #fff;
    font-size: 14px;
    font-family: inherit;
    transition: border-color 0.2s;
}

.text-input:hover {
    border-color: #9ca3af;
}

.text-input:focus {
    outline: none;
    border-color: #111;
}

.text-input:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
    opacity: 0.6;
}

textarea.text-input {
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

/* Responsive Design */
@media (max-width: 768px) {
    .modal-content {
        padding: 24px;
        max-width: 95%;
    }
    
    .form-group {
        grid-template-columns: 1fr;
        gap: 8px;
    }
    
    .form-group label {
        padding-top: 0;
    }
    
    .actions {
        flex-direction: column;
    }
    
    .btn {
        width: 100%;
    }
}
</style>