<template>
    <div class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Add New Event</h3>
                <button @click="$emit('close')" class="close-btn">×</button>
            </div>
            
            <div class="form-section">
                <div class="form-group">
                    <label>Event Title</label>
                    <input v-model="eventForm.title" class="text-input" placeholder="Enter event title" />
                </div>
                
                <div class="form-group">
                    <label>Date</label>
                    <input v-model="eventForm.date" type="date" class="text-input" :min="today()" />
                </div>
                
                <div class="form-group">
                    <label>Start Time</label>
                    <input v-model="eventForm.startTime" type="time" class="text-input" />
                </div>
                
                <div class="form-group">
                    <label>End Time</label>
                    <input v-model="eventForm.endTime" type="time" class="text-input" :disabled="!eventForm.startTime" />
                </div>
                
                <div class="form-group">
                    <label>Location</label>
                    <input v-model="eventForm.location" class="text-input" placeholder="Enter event location" />
                </div>
                
                <div class="form-group">
                    <label>Description</label>
                    <textarea v-model="eventForm.description" class="text-input" rows="6" placeholder="Enter event description"></textarea>
                </div>
                
                <div class="form-group">
                    <label>Attach Image</label>
                    <FileUploadNew
                        v-model:file-name="eventForm.imageName"
                        accept="image/*"
                        ref="fileUploadRef"
                        class="file-input"
                    />
                </div>
            </div>
            
            <div class="actions">
                <button class="publish-btn" @click="addEvent('publish')">Publish</button>
                <button class="draft-btn" @click="addEvent('draft')">Save as Draft</button>
                <button class="cancel-btn" @click="$emit('close')">Cancel</button>
            </div>
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
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
}

.modal-content {
    background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
    border: 2px solid #d1fae5;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    min-width: 500px;
    max-width: 90vw;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 2px solid #d1fae5;
}

.modal-header h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #065f46;
    display: flex;
    align-items: center;
    gap: 8px;
}

.modal-header h3::before {
    content: "➕";
    font-size: 18px;
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
    transition: all 0.3s;
}

.close-btn:hover {
    background: #fee2e2;
    color: #dc2626;
    transform: scale(1.1);
}

.form-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 24px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.form-group label {
    font-size: 14px;
    font-weight: 600;
    color: #047857;
    letter-spacing: 0.3px;
}

.text-input {
    padding: 12px 16px;
    border: 2px solid #a7f3d0;
    border-radius: 8px;
    font-size: 14px;
    background: white;
    transition: all 0.3s;
    font-family: inherit;
}

.text-input:hover {
    border-color: #6ee7b7;
}

.text-input:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15);
    transform: translateY(-1px);
}

.text-input:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
    opacity: 0.6;
}

textarea.text-input {
    resize: vertical;
    min-height: 120px;
}

.actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 8px;
}

.publish-btn {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);
    letter-spacing: 0.3px;
}

.publish-btn:hover {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    box-shadow: 0 6px 12px rgba(16, 185, 129, 0.3);
    transform: translateY(-2px);
}

.publish-btn:active {
    transform: translateY(0);
}

.draft-btn {
    background: white;
    color: #047857;
    border: 2px solid #10b981;
    border-radius: 8px;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    letter-spacing: 0.3px;
}

.draft-btn:hover {
    background: #ecfdf5;
    border-color: #059669;
    transform: translateY(-1px);
}

.draft-btn:active {
    transform: translateY(0);
}

.cancel-btn {
    background: white;
    color: #6b7280;
    border: 2px solid #d1d5db;
    border-radius: 8px;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    letter-spacing: 0.3px;
}

.cancel-btn:hover {
    background: #f3f4f6;
    border-color: #9ca3af;
    color: #374151;
    transform: translateY(-1px);
}

.cancel-btn:active {
    transform: translateY(0);
}

/* Responsive Design */
@media (max-width: 768px) {
    .modal-content {
        min-width: auto;
        margin: 20px;
        padding: 24px;
    }
    
    .actions {
        flex-direction: column;
    }
    
    .publish-btn,
    .draft-btn,
    .cancel-btn {
        width: 100%;
    }
}
</style>