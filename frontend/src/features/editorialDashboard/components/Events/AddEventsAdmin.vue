<template>
    <div class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Add New Event</h3>
                <button @click="$emit('close')" class="close-btn" type="button">×</button>
            </div>
            
            <form @submit.prevent="addEvent('publish')" class="form-section">
                    <div class="form-row">
                        <label>Event Title</label>
                        <div>
                            <input v-model="eventForm.title" class="text-input" placeholder="Enter event title" aria-required="true" />
                            <div v-if="errors.title" class="error">{{ errors.title }}</div>
                        </div>
                    </div>

                <div class="form-row">
                    <label>Date</label>
                    <div>
                        <input v-model="eventForm.date" type="date" class="text-input" :min="today()" aria-required="true" />
                        <div v-if="errors.date" class="error">{{ errors.date }}</div>
                    </div>
                </div>

                <div class="form-row">
                    <label>Start Time</label>
                    <div>
                        <input v-model="eventForm.startTime" type="time" class="text-input" aria-required="true" />
                        <div v-if="errors.startTime" class="error">{{ errors.startTime }}</div>
                    </div>
                </div>

                <div class="form-row">
                    <label>End Time</label>
                    <div>
                        <input v-model="eventForm.endTime" type="time" class="text-input" :disabled="!eventForm.startTime" aria-required="true" />
                        <div v-if="errors.endTime" class="error">{{ errors.endTime }}</div>
                    </div>
                </div>

                <div class="form-row">
                    <label>Location</label>
                    <div>
                        <input v-model="eventForm.location" class="text-input" placeholder="Enter event location" aria-required="true" />
                        <div v-if="errors.location" class="error">{{ errors.location }}</div>
                    </div>
                </div>

                <div class="form-row">
                    <label>Description</label>
                    <div>
                        <textarea v-model="eventForm.description" class="text-input" rows="6" placeholder="Enter event description" aria-required="true"></textarea>
                        <div v-if="errors.description" class="error">{{ errors.description }}</div>
                    </div>
                </div>

                <div class="form-row">
                    <label>Attach Image</label>
                    <div>
                        <FileUploadNew
                            v-model:file-name="eventForm.imageName"
                            accept="image/*"
                            ref="fileUploadRef"
                        />
                        <div v-if="errors.image" class="error">{{ errors.image }}</div>
                    </div>
                </div>

                <div class="actions">
                    <button class="add-btn" type="submit" :disabled="!isFormValid" :aria-disabled="!isFormValid">Save</button>
                    <button class="cancel-btn" type="button" @click="$emit('close')">Cancel</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
    import { ref, reactive, computed } from 'vue';
    import { useUserStore } from '../../../../stores/authStore';
    import services from '../../editorialServices';
    import { validTimes, dateTimeStr, today } from '../../../../utils/dateUtils';
    import FileUploadNew from '../../../../components/FileUploadNew.vue';

    const emits = defineEmits(['addEvent', 'close']);
    const fileUploadRef = ref(null);
    const errors = reactive({
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        description: '',
        image: ''
    });

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

    function clearErrors(){
        Object.keys(errors).forEach(k => errors[k] = '');
    }

    function validateForm(){
        clearErrors();
        let valid = true;
        if (!eventForm.value.title || !eventForm.value.title.trim()){
            errors.title = 'Title is required.'; valid = false;
        }
        if (!eventForm.value.date){
            errors.date = 'Date is required.'; valid = false;
        }
        if (!eventForm.value.startTime){
            errors.startTime = 'Start time is required.'; valid = false;
        }
        if (!eventForm.value.endTime){
            errors.endTime = 'End time is required.'; valid = false;
        }
        if (eventForm.value.startTime && eventForm.value.endTime && !validTimes(eventForm.value.startTime, eventForm.value.endTime)){
            errors.endTime = 'End time must be after start time.'; valid = false;
        }
        if (!eventForm.value.location || !eventForm.value.location.trim()){
            errors.location = 'Location is required.'; valid = false;
        }
        if (!eventForm.value.description || !eventForm.value.description.trim()){
            errors.description = 'Description is required.'; valid = false;
        }

        const hasFile = !!(fileUploadRef.value?.fileInput?.files && fileUploadRef.value.fileInput.files.length > 0);
        // if creating a new event, require an image; if editing, allow skipping if existing imageName exists
        if (!eventForm.value._id && !hasFile){
            errors.image = 'Please select an image file.'; valid = false;
        }

        return valid;
    }

    const isFormValid = computed(() => {
        // quick non-mutating checks for enabling/disabling the submit button
        if (!eventForm.value.title || !eventForm.value.title.trim()) return false;
        if (!eventForm.value.date) return false;
        if (!eventForm.value.startTime) return false;
        if (!eventForm.value.endTime) return false;
        if (eventForm.value.startTime && eventForm.value.endTime && !validTimes(eventForm.value.startTime, eventForm.value.endTime)) return false;
        if (!eventForm.value.location || !eventForm.value.location.trim()) return false;
        if (!eventForm.value.description || !eventForm.value.description.trim()) return false;
        const hasFile = !!(fileUploadRef.value?.fileInput?.files && fileUploadRef.value.fileInput.files.length > 0);
        if (!eventForm.value._id && !hasFile) return false; // require image for new events
        return true;
    });

    async function addEvent(status) {
        try {
            // client-side validation
            if (!validateForm()) return;

            const startDate = dateTimeStr(eventForm.value.date, eventForm.value.startTime);
            const endDate = dateTimeStr(eventForm.value.date, eventForm.value.endTime);
            const formData = new FormData();
            formData.append('title', eventForm.value.title);
            formData.append('description', eventForm.value.description);
            formData.append('location', eventForm.value.location);
            formData.append('startDate', startDate);
            formData.append('endDate', endDate);
            formData.append('status', status);

            const file = fileUploadRef.value?.fileInput?.files[0];
            if (file) {
                formData.append('file', file);
            }

            let response;
            const token = useUserStore().token;
            if (eventForm.value._id) {
                // editing existing event
                response = await services.updateEvent(token, eventForm.value._id, formData);
            } else {
                // creating new event
                response = await services.createEvent(token, formData);
            }

            emits('addEvent', response);
            emits('close');
        } catch (error) {
            console.error('Failed to add/update event:', error);
            // surface server validation errors if returned
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
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
}

.modal-content {
    background: white;
    border-radius: 8px;
    padding: 28px;
    width: 560px;
    max-width: 92vw;
    max-height: 92vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.modal-header h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #111827;
}

.close-btn {
    background: none;
    border: none;
    font-size: 28px;
    color: #6b7280;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s;
}

.close-btn:hover {
    background: #f3f4f6;
    color: #111827;
}

.form-section {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.form-row {
    display: grid;
    grid-template-columns: 140px 1fr;
    gap: 10px 14px;
    align-items: start;
}

.form-row label {
    font-size: 14px;
    color: #374151;
    padding-top: 10px;
    font-weight: 600;
}

.text-input {
    border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 10px 14px;
    width: 100%;
    background: white;
    font-size: 14px;
    font-family: inherit;
    transition: all 0.2s ease;
}

.text-input:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

textarea.text-input {
    resize: vertical;
    min-height: 120px;
}

.actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #e5e7eb;
}

.add-btn {
    background: #10b981;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.add-btn:hover { background: #059669 }

.add-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    filter: grayscale(0.05);
}

.cancel-btn {
    background: white;
    color: #374151;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
}

.error {
    color: #dc2626;
    font-size: 13px;
    margin-top: 6px;
}

/* Responsive Design */
@media (max-width: 768px) {
    .modal-content {
        min-width: auto;
        margin: 20px;
        padding: 20px;
    }
    
    .actions {
        flex-direction: column;
        align-items: stretch;
    }
    
    .add-btn,
    .cancel-btn {
        width: 100%;
    }
}
</style>