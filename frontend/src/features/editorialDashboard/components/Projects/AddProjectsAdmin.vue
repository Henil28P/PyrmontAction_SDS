<template>
    <div class="modal">
        <div class="modal-content">
            <h3>Add New Project</h3>
            <form @submit.prevent="create" class="form">
                <div class="row">
                    <label class="lbl">Project Name</label>
                    <input v-model="projectForm.project_name" class="input" placeholder="Enter project name" required />
                </div>

                <div class="row">
                    <label class="lbl">Description</label>
                    <textarea v-model="projectForm.project_description" class="input" rows="6" placeholder="Type the project description…" required></textarea>
                </div>

                <div class="row">
                    <label class="lbl">Type</label>
                    <select v-model="projectForm.project_type" class="input" required>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    </select>
                </div>

                <div class="row">
                    <label class="lbl">Project Date</label>
                    <input v-model="projectForm.project_date" type="date" class="input" required />
                </div>

                <div class="row">
                    <label class="lbl">Attach Image</label>
                    <FileUploadNew
                        v-model:file-name="projectForm.project_image"
                        accept="image/*"
                        ref="fileUploadRef"
                        :required="true"
                    />
                </div>

                <div class="actions">
                    <button type="submit" class="btn primary">Add Project</button>
                    <button type="button" class="btn" @click="$emit('close')">Cancel</button>
                </div>
            </form>
        </div>
    </div>
</template>
<script setup>
    import { ref } from 'vue';
    import { useUserStore } from '../../../../stores/authStore';
    import { today } from '../../../../utils/dateUtils';
    import services from '../../editorialServices';
    import FileUploadNew from '../../../../components/FileUploadNew.vue';

    const emits = defineEmits(['addProject', 'close']);
    const fileUploadRef = ref(null);
    const projectForm = ref({
        _id: null,
        project_name: '',
        project_description: '',
        project_type: 'open',
        project_image: '',
        project_date: today()
    })

    async function create() {
        try {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('project_name', projectForm.value.project_name);
            formData.append('project_description', projectForm.value.project_description);
            formData.append('project_type', projectForm.value.project_type);
            formData.append('project_date', projectForm.value.project_date);
            
            // Append image file if selected
            if (fileUploadRef.value?.fileInput?.files[0]) {
                formData.append('file', fileUploadRef.value.fileInput.files[0]);
            } else {
            console.log('No file selected for create');
            }

            const response = await services.createProject(useUserStore().getToken, formData);

            emits('addProject', response);
            emits('close');
        } catch (error) {
            console.error('Failed to create project:', error);
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