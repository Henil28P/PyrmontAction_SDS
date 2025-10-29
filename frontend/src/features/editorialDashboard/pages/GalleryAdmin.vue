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
                        <button @click="selectedItem = item">Edit</button>
                        <button @click="deleteItem(item._id)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <EditGalleryItemAdmin
            v-if="selectedItem"
            :item="selectedItem"
            @updateItem="updateGalleryItem" 
            @close="selectedItem = null"
        />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '../../../stores/authStore';
import services from '../editorialServices';
import EditGalleryItemAdmin from '../components/Gallery/EditGalleryItemAdmin.vue';

const imageList = ref([]);
const selectedItem = ref(null);
const fileInput = ref(null);
const newItem = ref({ caption: '', alt: '', image_file_name: '' });

async function loadGallery() {
    try {
        const response = await services.getGalleryItems(useUserStore().token);
        imageList.value = response;
    } catch (error) {
        console.error('Failed to load gallery:', error);
    }
}

onMounted(() => {
    loadGallery();
});

// MOVE ===============================
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

        const response = await services.uploadGalleryImage(useUserStore().token, formData);
        imageList.value.unshift(response);
        clearItem();
    } catch (error) {
        console.error('Failed to add new gallery item:', error);
    }
        
}
// MOVE ===============================
async function deleteItem(id) {
    try {
        if (!confirm('Are you sure you want to delete this image?')) {
            return;
        }
        await services.deleteGalleryImage(useUserStore().token, id);
        imageList.value = imageList.value.filter(item => item._id !== id);
    } catch (error) {
        console.error('Failed to delete gallery item:', error);
    }
}

function clearItem() {
    newItem.value = { caption: '', alt: '', image_file_name: '' };
    if (fileInput.value) {
        fileInput.value.value = '';
    }
}

function chooseFile() {
    const file = fileInput.value?.files[0];
    if (file) {
        newItem.value.image_file_name = file.name;
    }
}


// Used by the emit in the editing component to update the item in the list
function updateGalleryItem(updatedItem) {
    const index = imageList.value.findIndex(i => i._id === updatedItem._id);
    if (index !== -1) {
        imageList.value[index] = { ...imageList.value[index], ...updatedItem };
    }
}
</script>


<style scoped>
/* Add your styles here */
</style>