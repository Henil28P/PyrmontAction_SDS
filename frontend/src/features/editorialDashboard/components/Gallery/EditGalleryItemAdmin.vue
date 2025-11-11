<template>
    <div class="modal">
        <div class="modal-content">
            <p>Edit Gallery Item</p>
            <form @submit.prevent="handleSave">
            <div>
                <label>Change Image:</label>
                <FileUploadEdit
                    :current-file-name="item?.image_file_name"
                    v-model:file-name="editForm.newImage"
                    accept="image/*"
                    ref="fileUploadRef"
                />
            </div>
            <div>
                <label>Caption:</label>
                <div>
                    <input v-model="editForm.caption" type="text" aria-required="true" />
                    <div v-if="errors.caption" class="error">{{ errors.caption }}</div>
                </div>
            </div>
            <div>
                <label>Alternative Text:</label>
                <div>
                    <input v-model="editForm.alt" type="text" aria-required="true" />
                    <div v-if="errors.alt" class="error">{{ errors.alt }}</div>
                </div>
            </div>
            <div>
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
    import services from '../../editorialServices';
    import FileUploadEdit from '../../../../components/FileUploadEdit.vue';
    const props = defineProps({
        item: {
            type: Object,
            required: false,
        }
    });

    const fileUploadRef = ref(null);
    const emits = defineEmits(['updateItem', 'close']);
    const errors = reactive({
        caption: '',
        alt: ''
    });

    const editForm = ref({
        ...props.item,
        newImage: ''
    });

    function clearErrors(){
        Object.keys(errors).forEach(k => errors[k] = '');
    }

    function validateForm(){
        clearErrors();
        let valid = true;
        if (!editForm.value.caption || !editForm.value.caption.trim()){
            errors.caption = 'Caption is required.'; valid = false;
        }
        if (!editForm.value.alt || !editForm.value.alt.trim()){
            errors.alt = 'Alt text is required.'; valid = false;
        }
        return valid;
    }

    const isFormValid = computed(() => {
        if (!editForm.value.caption || !editForm.value.caption.trim()) return false;
        if (!editForm.value.alt || !editForm.value.alt.trim()) return false;
        return true;
    });

    async function handleSave() {
        try {
            if (!validateForm()) return;

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
    min-width: 300px;
}

.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.btn.primary {
    background-color: #2563eb;
    color: white;
}

.btn.primary:hover {
    background-color: #1d4ed8;
}

.btn.primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.error {
    color: #dc2626;
    font-size: 13px;
    margin-top: 6px;
}
</style>