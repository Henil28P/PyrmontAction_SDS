<template>
    <div class="gallery-admin">
        <!-- Add New Image Form -->
        <div class="add-form-section">
            <h2>Add New Image</h2>
            <div class="form-grid">
                <div class="form-group">
                    <label>Image File</label>
                    <input type="file" ref="fileInput" accept="image/*" @change="chooseFile" required class="file-input"/>
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
            <button @click="addNewItem" class="add-btn">Add Image</button>
        </div>

        <!-- Gallery List -->
        <div class="gallery-list-section">
            <h2>Gallery Images</h2>
            <div class="table-container">
                <table class="gallery-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>File Name</th>
                            <th>Caption</th>
                            <th>Alt Text</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in imageList" :key="item._id">
                            <td>
                                <img :src="item.url" alt="" class="thumbnail"/>
                            </td>
                            <td>{{ item.image_file_name }}</td>
                            <td>{{ item.caption }}</td>
                            <td>{{ item.alt }}</td>
                            <td class="actions">
                                <button @click="editItem(item)" class="edit-btn">Edit</button>
                                <button @click="deleteItem(item._id)" class="delete-btn">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

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
.gallery-admin {
    padding: 32px;
    max-width: 1400px;
    margin: 0 auto;
}

/* Add Form Section */
.add-form-section {
    background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
    border: 2px solid #d1fae5;
    border-radius: 12px;
    padding: 32px;
    margin-bottom: 40px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.add-form-section h2 {
    margin: 0 0 24px 0;
    font-size: 20px;
    font-weight: 700;
    color: #065f46;
    display: flex;
    align-items: center;
    gap: 8px;
}

.add-form-section h2::before {
    content: "➕";
    font-size: 18px;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.form-group label {
    font-size: 14px;
    font-weight: 600;
    color: #047857;
    letter-spacing: 0.3px;
}

.file-input,
.text-input {
    padding: 12px 16px;
    border: 2px solid #a7f3d0;
    border-radius: 8px;
    font-size: 14px;
    background: white;
    transition: all 0.3s;
    font-family: inherit;
}

.file-input:hover,
.text-input:hover {
    border-color: #6ee7b7;
}

.text-input:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15);
    transform: translateY(-1px);
}

.add-btn {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 14px 32px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);
    letter-spacing: 0.3px;
}

.add-btn:hover {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    box-shadow: 0 6px 12px rgba(16, 185, 129, 0.3);
    transform: translateY(-2px);
}

.add-btn:active {
    transform: translateY(0);
}

/* Gallery List Section */
.gallery-list-section {
    background: white;
}

.gallery-list-section h2 {
    margin: 0 0 24px 0;
    font-size: 20px;
    font-weight: 700;
    color: #111827;
    display: flex;
    align-items: center;
    gap: 8px;
}

.gallery-list-section h2::before {
    content: "🖼️";
    font-size: 20px;
}

.table-container {
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.gallery-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
}

.gallery-table thead {
    background: linear-gradient(180deg, #f9fafb 0%, #f3f4f6 100%);
}

.gallery-table th {
    text-align: left;
    padding: 16px 20px;
    font-size: 13px;
    font-weight: 700;
    color: #374151;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    border-bottom: 2px solid #e5e7eb;
}

.gallery-table th:first-child {
    padding-left: 24px;
}

.gallery-table tbody tr {
    border-bottom: 1px solid #f3f4f6;
    transition: all 0.2s;
}

.gallery-table tbody tr:hover {
    background: #f9fafb;
    box-shadow: inset 0 0 0 1px #e5e7eb;
}

.gallery-table tbody tr:last-child {
    border-bottom: none;
}

.gallery-table td {
    padding: 16px 20px;
    font-size: 14px;
    color: #1f2937;
    vertical-align: middle;
}

.gallery-table td:first-child {
    padding-left: 24px;
}

.thumbnail {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    border: 2px solid #e5e7eb;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
}

.thumbnail:hover {
    transform: scale(1.8);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    z-index: 10;
}

.actions {
    display: flex;
    gap: 10px;
}

.edit-btn,
.delete-btn {
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    border: 2px solid;
    letter-spacing: 0.3px;
}

.edit-btn {
    background: white;
    color: #10b981;
    border-color: #10b981;
}

.edit-btn:hover {
    background: #10b981;
    color: white;
    box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
    transform: translateY(-2px);
}

.delete-btn {
    background: white;
    color: #ef4444;
    border-color: #ef4444;
}

.delete-btn:hover {
    background: #ef4444;
    color: white;
    box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
    transform: translateY(-2px);
}

.edit-btn:active,
.delete-btn:active {
    transform: translateY(0);
}

/* Responsive Design */
@media (max-width: 768px) {
    .gallery-admin {
        padding: 20px;
    }
    
    .add-form-section {
        padding: 24px;
    }
    
    .form-grid {
        grid-template-columns: 1fr;
    }
    
    .table-container {
        overflow-x: auto;
    }
    
    .gallery-table th,
    .gallery-table td {
        padding: 12px;
        font-size: 13px;
    }
    
    .thumbnail {
        width: 60px;
        height: 60px;
    }
}
</style>