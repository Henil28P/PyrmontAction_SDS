<template>
    <div class="modal">
        <div class="modal-content">
            <p>Edit Gallery Item</p>
            <div>
                <label>Current Image:</label>
                <input v-model="item.image_file_name" type="text" disabled />
            </div>
            <div>
                <label>Caption:</label>
                <input v-model="editForm.caption" type="text"/>
            </div>
            <div>
                <label>Alternative Text:</label>
                <input v-model="editForm.alt" type="text" />
            </div>
            <div>
                <label>Change Image:</label>
                <FileUploadEdit
                    :current-file-name="item?.image_file_name"
                    v-model:file-name="editForm.newImage"
                    accept="image/*"
                    ref="fileUploadRef"
                />
            </div>
            <div v-if="fileError" class="error-message">{{ fileError }}</div>
            <div>
                <button class="btn primary" @click="handleSave">Save</button>
                <button class="btn" @click="$emit('close')">Cancel</button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { useUserStore } from '../../../../stores/authStore';
    import services from '../../editorialServices';
    import FileUploadEdit from '../FileUploadEdit.vue';
    const props = defineProps({
        item: {
            type: Object,
            required: false,
        }
    });

    const fileUploadRef = ref(null);
    const fileError = ref('');
    const emits = defineEmits(['updateItem', 'close']);
    const editForm = ref({
        ...props.item,
        newImage: ''
    });

    async function handleSave() {
        try {
            const formData = new FormData();
            formData.append('caption', editForm.value.caption);
            formData.append('alt', editForm.value.alt);

            if (fileUploadRef.value?.fileInput?.files[0]) {
                formData.append('file', fileUploadRef.value.fileInput.files[0]);
            }
            
            const response = await services.updateGalleryImage(
                useUserStore().token, editForm.value._id, formData
            );
            emits('updateItem', response);
            emits('close');
        } catch (error) {
            console.error('Error saving gallery item:', error);
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
}
</style>