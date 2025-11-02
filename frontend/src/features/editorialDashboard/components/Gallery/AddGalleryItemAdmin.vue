<template>
    <div class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Add New Gallery Image</h3>
                <button @click="$emit('close')" class="close-btn">×</button>
            </div>
            
            <div class="form-section">
                <div class="form-group">
                    <label>Image File</label>
                    <FileUploadNew
                        v-model:file-name="newItem.image_file_name"
                        accept="image/*"
                        ref="fileUploadRef"
                        class="file-input"
                    />
                </div>
                
                <div class="form-group">
                    <label>Caption</label>
                    <input v-model="newItem.caption" type="text" placeholder="Enter caption" required class="text-input"/>
                </div>
                
                <div class="form-group">
                    <label>Alt Text</label>
                    <input v-model="newItem.alt" type="text" placeholder="Enter alt text" required class="text-input"/>
                </div>
            </div>
            
            <div class="actions">
                <button @click="addNewItem" class="add-btn">Add Image</button>
                <button @click="$emit('close')" class="cancel-btn">Cancel</button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { useUserStore } from '../../../../stores/authStore';
    import services from '../../editorialServices';
    import FileUploadNew from '../../../../components/FileUploadNew.vue';

    const emits = defineEmits(['addItem', 'close']);
    const fileUploadRef = ref(null);
    const newItem = ref({
        caption: '',
        alt: '',
        image_file_name: ''
    });

    async function addNewItem() {
        try {
            const formData = new FormData();
            formData.append('caption', newItem.value.caption);
            formData.append('alt', newItem.value.alt);
            
            if (fileUploadRef.value?.fileInput?.files[0]) {
                formData.append('file', fileUploadRef.value.fileInput.files[0]);
            } else {
                alert('Please select an image file.');
                return;
            }

            const response = await services.uploadGalleryImage(useUserStore().token, formData);
            emits('addItem', response);
            emits('close');
        } catch (error) {
            console.error('Failed to add new gallery item:', error);
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
    backdrop-filter: blur(8px);
}

.modal-content {
    background: white;
    border-radius: 12px;
    padding: 0;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    min-width: 550px;
    max-width: 90vw;
    max-height: 90vh;
    overflow: hidden;
    position: relative;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 32px;
    background: white;
    border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #111827;
}

.close-btn {
    background: #f3f4f6;
    border: none;
    font-size: 24px;
    color: #6b7280;
    cursor: pointer;
    padding: 0;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: all 0.2s;
}

.close-btn:hover {
    background: #e5e7eb;
    color: #374151;
    transform: scale(1.05);
}

.form-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 32px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
}

.text-input {
    padding: 12px 14px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    background: #fafafa;
    transition: all 0.2s;
    font-family: inherit;
}

.text-input:hover {
    border-color: #d1d5db;
    background: white;
}

.text-input:focus {
    outline: none;
    border-color: #06b6d4;
    background: white;
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
}

.actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    padding: 24px 32px;
    background: #f9fafb;
    border-top: 1px solid #e5e7eb;
}

.add-btn {
    background: #06b6d4;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 11px 28px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.add-btn:hover {
    background: #0891b2;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
}

.add-btn:active {
    transform: translateY(0);
}

.cancel-btn {
    background: white;
    color: #6b7280;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    padding: 11px 28px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.cancel-btn:hover {
    background: #f9fafb;
    border-color: #9ca3af;
    color: #374151;
}

.cancel-btn:active {
    background: #f3f4f6;
}

/* Responsive Design */
@media (max-width: 768px) {
    .modal-content {
        min-width: auto;
        margin: 20px;
    }
    
    .modal-header {
        padding: 20px 24px;
    }
    
    .form-section {
        padding: 24px;
    }
    
    .actions {
        padding: 20px 24px;
        flex-direction: column;
    }
    
    .add-btn,
    .cancel-btn {
        width: 100%;
    }
}
</style>