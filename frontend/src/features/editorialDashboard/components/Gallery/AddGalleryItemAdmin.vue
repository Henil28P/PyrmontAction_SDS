<template>
    <div class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Add New Gallery Image</h3>
                <button @click="$emit('close')" class="close-btn" type="button">×</button>
            </div>
            
            <form @submit.prevent="addNewItem" class="form-section">
                <div class="form-row">
                    <label>Image File</label>
                    <div>
                        <FileUploadNew
                            v-model:file-name="newItem.image_file_name"
                            accept="image/*"
                            ref="fileUploadRef"
                        />
                        <div v-if="errors.image" class="error">{{ errors.image }}</div>
                    </div>
                </div>
                
                <div class="form-row">
                    <label>Caption</label>
                    <div>
                        <input v-model="newItem.caption" type="text" placeholder="Enter caption" required class="text-input" aria-required="true" />
                        <div v-if="errors.caption" class="error">{{ errors.caption }}</div>
                    </div>
                </div>
                
                <div class="form-row">
                    <label>Alt Text</label>
                    <div>
                        <input v-model="newItem.alt" type="text" placeholder="Enter alt text" required class="text-input" aria-required="true" />
                        <div v-if="errors.alt" class="error">{{ errors.alt }}</div>
                    </div>
                </div>
            
            <div class="actions">
                <button type="submit" class="add-btn" :disabled="!isFormValid" :aria-disabled="!isFormValid">Save</button>
                <button type="button" @click="$emit('close')" class="cancel-btn">Cancel</button>
            </div>
            </form>
        </div>
    </div>
</template>

<script setup>
    import { ref, reactive, computed } from 'vue';
    import { useUserStore } from '../../../../stores/authStore';
    import services from '../../editorialServices';
    import FileUploadNew from '../../../../components/FileUploadNew.vue';

    const emits = defineEmits(['addItem', 'close']);
    const fileUploadRef = ref(null);
    const errors = reactive({
        caption: '',
        alt: '',
        image: ''
    });

    const newItem = ref({
        caption: '',
        alt: '',
        image_file_name: ''
    });

    function clearErrors(){
        Object.keys(errors).forEach(k => errors[k] = '');
    }

    function validateForm(){
        clearErrors();
        let valid = true;
        if (!newItem.value.caption || !newItem.value.caption.trim()){
            errors.caption = 'Caption is required.'; valid = false;
        }
        if (!newItem.value.alt || !newItem.value.alt.trim()){
            errors.alt = 'Alt text is required.'; valid = false;
        }
        const hasFile = !!(fileUploadRef.value?.fileInput?.files && fileUploadRef.value.fileInput.files.length > 0);
        if (!hasFile){
            errors.image = 'Please select an image file.'; valid = false;
        }
        return valid;
    }

    const isFormValid = computed(() => {
        if (!newItem.value.caption || !newItem.value.caption.trim()) return false;
        if (!newItem.value.alt || !newItem.value.alt.trim()) return false;
        const hasFile = !!(fileUploadRef.value?.fileInput?.files && fileUploadRef.value.fileInput.files.length > 0);
        if (!hasFile) return false;
        return true;
    });

    async function addNewItem() {
        try {
            if (!validateForm()) return;

            const formData = new FormData();
            formData.append('caption', newItem.value.caption);
            formData.append('alt', newItem.value.alt);
            
            if (fileUploadRef.value?.fileInput?.files[0]) {
                formData.append('file', fileUploadRef.value.fileInput.files[0]);
            }

            const response = await services.uploadGalleryImage(useUserStore().token, formData);
            emits('addItem', response);
            emits('close');
        } catch (error) {
            console.error('Failed to add new gallery item:', error);
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
    padding: 28px;
    border-radius: 8px;
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
    margin-bottom: 24px;
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

.actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 24px;
    padding-top: 20px;
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
    transition: all 0.2s ease;
}

.add-btn:hover {
    background: #059669;
}

.add-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
    transition: all 0.2s ease;
}

.cancel-btn:hover {
    background: #f9fafb;
}

.error {
    color: #dc2626;
    font-size: 13px;
    margin-top: 6px;
}

/* Responsive Design */
@media (max-width: 768px) {
    .modal-content {
        padding: 20px;
    }
    
    .form-row {
        grid-template-columns: 1fr;
        gap: 8px;
    }
    
    .form-row label {
        padding-top: 0;
    }
    
    .actions {
        flex-direction: column;
    }
    
    .add-btn,
    .cancel-btn {
        width: 100%;
    }
}
</style>