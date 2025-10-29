<template>
    <div>
        <h1>Gallery Admin</h1>
        <div style="display: flex; flex-direction: column;">
            <input type="file" ref="fileInput" accept="image/*" @change="chooseFile" required/>
            <input v-model="newItem.caption" type="text" placeholder="Caption" required/>
            <input v-model="newItem.alt" type="text" placeholder="Alt. Text" required/>
            <button @click="addNewItem">Add New Image</button>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Image Name</th>
                    <th>Caption</th>
                    <th>Alt. Text</th>
                </tr>
            </thead>
            <tbody class="">
                <tr v-for="item in imageList" :key="item._id">
                    <td>{{ item.image_file_name }}</td>
                    <td><img :src="item.url" alt="" /></td>
                    <td>{{ item.caption }}</td>
                    <td>{{ item.alt }}</td>
                    <td>
                        <button @click="editItem(item)">Edit</button>
                        <button @click="deleteItem(item._id)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <EditGalleryItemAdmin 
            :item="selectedGalleryItem" 
            @itemUpdated="updateGalleryItem" 
            @close="closeEditModalItem"
        />
    </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';
import { useUserStore } from '../../../stores/authStore';
import services from '../editorialServices';
import EditGalleryItemAdmin from './EditGalleryItemAdmin.vue';

const props = defineProps({
  galleryData: {
    type: Array,
    required: true,
  }
});

const emits = defineEmits(['galleryUpdated']);
const imageList = ref([]);
const newItem = ref({ _id: null, caption: '', alt: '', image_file_name: '' });
const selectedGalleryItem = ref(null);
const fileInput = ref(null);

watch(() => props.galleryData, (newData) => {
    imageList.value = newData;
}, { immediate: true });

onUnmounted(() => {
  imageList.value = [];
});

async function addNewItem() {
    try {
        const formData = new FormData();
        formData.append('caption', newItem.value.caption);
        formData.append('alt', newItem.value.alt);
        
        if (fileInput.value.files[0]) {
            formData.append('file', fileInput.value.files[0]);
        } else {
            alert('Please select an image file.');
            return;
        }

        const response = await services.uploadGalleryImage(useUserStore().getToken, formData);

        const newGalleryItem = {
            ... newItem.value,
            _id: response._id,
            image_file_name: response.image_file_name,
        };

        imageList.value.unshift(newGalleryItem);
        emits('galleryUpdated', imageList.value);
        clearItem();
    } catch (error) {
        console.error('Failed to add new gallery item:', error);
    }
        
}


async function deleteItem(id) {
    try {
        if (confirm('Are you sure you want to delete this project?')) {
            await services.deleteGalleryImage(useUserStore().getToken, id);
      imageList.value = imageList.value.filter(p => p._id !== id);
      emits('galleryUpdated', imageList.value);
    }
  } catch (error) {
    console.error('Failed to delete gallery item:', error);
  };
}

function clearItem() {
    newItem.value = { _id: null, caption: '', alt: '', image_file_name: '' };
    fileInput.value.value = '';
    console.log('Cleared new item form.');
}

// File Selection Handlers
function chooseFile() {
    const file = fileInput.value.files[0];
    newItem.value.image_file_name = file.name;
}

// Edit Modal Functions

function editItem(item) {
    selectedGalleryItem.value = item;
    console.log('Editing item:', selectedGalleryItem.value);
}
function closeEditModalItem(item) {
    selectedGalleryItem.value = null;
}
// Used by the emit in the editing component to update the item in the list
function updateGalleryItem(updatedItem) {
    const index = imageList.value.findIndex(i => i._id === updatedItem._id);
    if (index !== -1) {
        imageList.value[index] = { ...imageList.value[index], ...updatedItem };
    }
    emits('galleryUpdated', imageList.value);
}

</script>


<style scoped>
/* Add your styles here */
</style>