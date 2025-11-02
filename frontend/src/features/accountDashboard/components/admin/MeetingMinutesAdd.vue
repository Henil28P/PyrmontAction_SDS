<template>
    <div class="modal">
        <div class="modal-content">
            <h3>Add Meeting Minutes</h3>
            <div class="form">
            <div class="row">
                <label class="lbl">Title</label>
                <input v-model="meetingForm.title" class="input" placeholder="Enter title" />
            </div>

            <div class="row">
                <label class="lbl">Notes</label>
                <textarea v-model="meetingForm.note" class="input" rows="6" placeholder="Type the meeting notes…"></textarea>
            </div>

            <div class="row">
                <label class="lbl">Attach PDF</label>
                <FileUploadNew
                    v-model:file-name="meetingForm.filename"
                    accept="application/pdf"
                    ref="fileUploadRef"
                />
            </div>

            <div class="actions">
                <button class="btn" @click="create('draft')">Save Draft</button>
                <button class="btn primary" @click="create('published')">Publish</button>
                <button class="btn" @click="$emit('close')">Cancel</button>
            </div>
        </div>
    </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { useUserStore } from '../../../../stores/authStore';
    import services from '../../dashboardServices';
    import FileUploadNew from '../../../../components/FileUploadNew.vue';

    const emits = defineEmits(['addMeeting', 'close']);
    const fileUploadRef = ref(null);
    const meetingForm = ref({
        _id: null, 
        title: '', 
        note: '', 
        status: 'draft', 
        filename: '', 
        createdAt: null
    })

    async function create(status) {
        try {
            meetingForm.value.status = status;
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('title', meetingForm.value.title);
            formData.append('note', meetingForm.value.note);
            formData.append('status', meetingForm.value.status);
            
            // Append PDF file if selected
            if (fileUploadRef.value?.fileInput?.files[0]) {
                formData.append('file', fileUploadRef.value.fileInput.files[0]);
            } else {
                console.log('No file selected for create'); // Debug log
            }

            // Create new meeting with files
            const response = await services.createMeetingMinute(useUserStore().getToken, formData);
            emits('addMeeting', response);
            emits('close');
        } catch (error) {
            console.error('Failed to save draft:', error);
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
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    min-width: 400px;
    max-width: 90vw;
    max-height: 90vh;
    overflow-y: auto;
}

.row{display:grid;grid-template-columns:140px 1fr;gap:10px 12px;align-items:start;margin-bottom:10px}
.lbl{font-size:14px;color:#374151;padding-top:8px}
.input{border:1px solid #e5e7eb;border-radius:10px;padding:10px 12px;width:100%;background:#fff;font:inherit}
.actions{display:flex;gap:8px;justify-content:flex-end;margin-top:4px}
.btn{border:1px solid #e5e7eb;background:#fff;padding:8px 12px;border-radius:10px;cursor:pointer}
.btn.primary{background:#111;color:#fff;border-color:#111}
</style>