<template>
    <div v-if="showEditModal" class="modal">
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
                <input ref="fileInput" type="file" accept="image/*" @change="chooseFile"/>
                <button v-if="editForm.filename" @click="closeFile">Close</button>
            </div>
            <div v-if="fileError" class="error-message">{{ fileError }}</div>
            <div>
                <button class="btn primary" @click="handleSave">Save</button>
                <button class="btn" @click="handleClose">Cancel</button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed, watch } from 'vue';
    import { useUserStore } from '../../../stores/authStore';
    import services from '../editorialServices';
    const props = defineProps({
        item: {
            type: Object,
            required: false,
        }
    });

    const fileInput = ref(null);
    const fileError = ref('');
    const emits = defineEmits(['itemUpdated', 'close']);
    const editForm = ref({ _id: null, caption: '', alt: '', filename: '' });

    watch(() => props.item, (newItem) => {
        if (newItem) {
            editForm.value._id = newItem._id;
            editForm.value.caption = newItem.caption;
            editForm.value.alt = newItem.alt;
        }
    }, { immediate: true });
    
    const showEditModal = computed(() => {
        console.log('props.item:', props.item); // Logs the value of props.item
        return !!props.item
    });

    function chooseFile() {
        fileError.value = '';
        const file = fileInput.value.files[0];
        if (!file) {
            editForm.value.filename = '';
            return;
        }
        if (file.name === props.item.image_file_name) {
            fileError.value = 'The selected file is the same as the existing uploaded file.';
            fileInput.value.value = '';
            return;
        }
        editForm.value.filename = file.name;
    }
    
    function closeFile() {
        console.log('closeFile:', fileInput.value.value);
        fileInput.value.value = '';
        editForm.value.filename = '';
    }

    async function handleSave() {
        try {
            const formData = new FormData();
            formData.append('caption', editForm.value.caption);
            formData.append('alt', editForm.value.alt);

            if (editForm.value.filename != props.item.image_file_name && fileInput.value.files[0]) {
                formData.append('file', fileInput.value.files[0]);
            }
            
            const response = await services.updateGalleryImage(
                useUserStore().token, editForm.value._id, formData
            );
            emits('itemUpdated', { ...response });
            handleClose();
        } catch (error) {
            console.error('Error saving gallery item:', error);
        }
    }

    function handleClose() {
        editForm.value = { _id: null, caption: '', alt: '', filename: '' };
        fileInput.value.value = '';
        fileError.value = '';
        emits('close');
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