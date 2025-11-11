<template>
    <div class="modal">
        <div class="modal-content">
            <h3>Add New Project</h3>
            <form @submit.prevent="create" class="form">
                <div class="row">
                    <label class="lbl">Project Name</label>
                    <div>
                        <input v-model="projectForm.project_name" class="input" placeholder="Enter project name" aria-required="true" />
                        <div v-if="errors.project_name" class="error">{{ errors.project_name }}</div>
                    </div>
                </div>

                <div class="row">
                    <label class="lbl">Description</label>
                    <div>
                        <textarea v-model="projectForm.project_description" class="input" rows="6" placeholder="Type the project description…" aria-required="true"></textarea>
                        <div v-if="errors.project_description" class="error">{{ errors.project_description }}</div>
                    </div>
                </div>

                <div class="row">
                    <label class="lbl">Type</label>
                    <select v-model="projectForm.project_type" class="input">
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    </select>
                </div>

                <div class="row">
                    <label class="lbl">Project Date</label>
                    <div>
                        <input v-model="projectForm.project_date" type="date" class="input" aria-required="true" />
                        <div v-if="errors.project_date" class="error">{{ errors.project_date }}</div>
                    </div>
                </div>

                <div class="row">
                    <label class="lbl">Attach Image</label>
                    <div>
                        <FileUploadNew
                            v-model:file-name="projectForm.project_image"
                            accept="image/*"
                            ref="fileUploadRef"
                        />
                        <div v-if="errors.project_image" class="error">{{ errors.project_image }}</div>
                    </div>
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
    import { useUserStore } from '../../../../stores/authStore';
    import { today } from '../../../../utils/dateUtils';
    import services from '../../editorialServices';
    import FileUploadNew from '../../../../components/FileUploadNew.vue';

    const emits = defineEmits(['addProject', 'close']);
    const fileUploadRef = ref(null);
    const errors = reactive({
        project_name: '',
        project_description: '',
        project_date: '',
        project_image: ''
    });

    const projectForm = ref({
        _id: null,
        project_name: '',
        project_description: '',
        project_type: 'open',
        project_image: '',
        project_date: today()
    });

    function clearErrors(){
        Object.keys(errors).forEach(k => errors[k] = '');
    }

    function validateForm(){
        clearErrors();
        let valid = true;
        if (!projectForm.value.project_name || !projectForm.value.project_name.trim()){
            errors.project_name = 'Project name is required.'; valid = false;
        }
        if (!projectForm.value.project_description || !projectForm.value.project_description.trim()){
            errors.project_description = 'Description is required.'; valid = false;
        }
        if (!projectForm.value.project_date){
            errors.project_date = 'Project date is required.'; valid = false;
        }
        const hasFile = !!(fileUploadRef.value?.fileInput?.files && fileUploadRef.value.fileInput.files.length > 0);
        if (!hasFile){
            errors.project_image = 'Please select an image file.'; valid = false;
        }
        return valid;
    }

    const isFormValid = computed(() => {
        if (!projectForm.value.project_name || !projectForm.value.project_name.trim()) return false;
        if (!projectForm.value.project_description || !projectForm.value.project_description.trim()) return false;
        if (!projectForm.value.project_date) return false;
        const hasFile = !!(fileUploadRef.value?.fileInput?.files && fileUploadRef.value.fileInput.files.length > 0);
        if (!hasFile) return false;
        return true;
    });

    async function create() {
        try {
            if (!validateForm()) return;

            // Create FormData for file upload
            const formData = new FormData();
            formData.append('project_name', projectForm.value.project_name);
            formData.append('project_description', projectForm.value.project_description);
            formData.append('project_type', projectForm.value.project_type);
            formData.append('project_date', projectForm.value.project_date);
            
            // Append image file if selected
            if (fileUploadRef.value?.fileInput?.files[0]) {
                formData.append('file', fileUploadRef.value.fileInput.files[0]);
            }

            const response = await services.createProject(useUserStore().getToken, formData);
            emits('addProject', response);
            emits('close');
        } catch (error) {
            console.error('Failed to create project:', error);
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
.error{color:#dc2626;font-size:13px;margin-top:6px}
</style>