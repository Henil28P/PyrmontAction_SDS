<template>
    <div class="modal">
        <div class="modal-content">
            <h3>Add New Gallery Image</h3>
            <input v-model="newItem.caption" type="text" placeholder="Caption" required/>
            <input v-model="newItem.alt" type="text" placeholder="Alt. Text" required/>
            <FileUploadNew
                v-model:file-name="newItem.image_file_name"
                accept="image/*"
                ref="fileUploadRef"
            />
            <div class="actions">
                <button @click="addNewItem">Add New Image</button>
                <button @click="$emit('close')">Cancel</button>
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
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    min-width: 300px;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
}
</style>