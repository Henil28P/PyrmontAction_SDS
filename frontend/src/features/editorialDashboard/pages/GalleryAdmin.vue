<template>
    <div class="gallery-admin">
        <div class="header-section">
            <h1>Gallery Admin</h1>
            <button @click="addItemModal = true" class="add-btn">Add New Image</button>
        </div>
        
        <div class="gallery-list-section">
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
                                <img :src="`${SERVER_URL}${item.imageUrl}`" alt="" class="thumbnail"/>
                            </td>
                            <td>{{ item.image_file_name }}</td>
                            <td>{{ item.caption }}</td>
                            <td>{{ item.alt }}</td>
                            <td class="actions">
                                <button @click="selectedItem = item" class="edit-btn">Edit</button>
                                <button @click="deleteItem(item._id)" class="delete-btn">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <AddGalleryItemAdmin
            v-if="addItemModal"
            @addItem="addNewItem"
            @close="addItemModal = false"
        />

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
    import AddGalleryItemAdmin from '../components/Gallery/AddGalleryItemAdmin.vue';
    import SERVER_URL from '../../../config.js';

    const imageList = ref([]);
    const selectedItem = ref(null);
    const addItemModal = ref(false);


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

    function addNewItem(item) {
        console.log('Adding new gallery item:', item);
        imageList.value.unshift(item);
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
.gallery-admin {
    padding: 32px;
    max-width: 1400px;
    margin: 0 auto;
}

/* Header Section */
.header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    padding-bottom: 20px;
    border-bottom: 2px solid #e5e7eb;
}

.header-section h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    color: #111827;
    display: flex;
    align-items: center;
    gap: 12px;
}

.header-section h1::before {
    content: "🖼️";
    font-size: 24px;
}

.add-btn {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);
    letter-spacing: 0.3px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.add-btn::before {
    content: "➕";
    font-size: 14px;
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
    cursor: pointer;
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
    
    .header-section {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
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
    
    .actions {
        flex-direction: column;
        gap: 6px;
    }
    
    .edit-btn,
    .delete-btn {
        padding: 6px 12px;
        font-size: 12px;
    }
}
</style>