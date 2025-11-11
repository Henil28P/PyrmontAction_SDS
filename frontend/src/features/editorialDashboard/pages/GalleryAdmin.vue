<template>
    <div class="gallery-wrapper">
        <div class="gallery-header">
            <h2 class="main-title">Gallery Management</h2>
            <p class="subtitle">Upload and manage community photos</p>
        </div>

        <div class="gallery-actions">
            <button @click="addItemModal = true" class="btn-create">
                + Add New Image
            </button>
        </div>
        
        <div class="gallery-content">
            <div class="section-title">
                <h3>Gallery Images</h3>
            </div>

            <div class="table-wrap">
                <table class="table">
                    <thead>
                        <tr>
                            <th style="width:100px;">IMAGE</th>
                            <th>FILE NAME</th>
                            <th>CAPTION</th>
                            <th>ALT TEXT</th>
                            <th style="width:160px;">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in imageList" :key="item._id">
                            <td>
                                <img :src="`${SERVER_URL}${item.imageUrl}`" alt="" class="thumbnail"/>
                            </td>
                            <td class="file-name">{{ item.image_file_name }}</td>
                            <td>{{ item.caption }}</td>
                            <td>{{ item.alt }}</td>
                            <td>
                                <div class="action-buttons">
                                    <button @click="selectedItem = item" class="btn-edit">Edit</button>
                                    <button @click="deleteItem(item._id)" class="btn-delete">Delete</button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="!imageList.length">
                            <td colspan="5" class="empty-row">No images yet.</td>
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
.gallery-wrapper {
    background: white;
    border-radius: 0;
    border: none;
    box-shadow: none;
    padding: 0;
    margin: 0;
}

.gallery-header {
    padding: 24px 24px 20px;
    border-bottom: 1px solid #f3f4f6;
}

.main-title {
    font-size: 24px;
    font-weight: 700;
    color: #111827;
    margin: 0;
}

.subtitle {
    margin: 6px 0 0 0;
    color: #6b7280;
    font-size: 14px;
}

.gallery-actions {
    padding: 16px 24px;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
}

.btn-create {
    background: #10b981;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-create:hover {
    background: #059669;
}

.gallery-content {
    padding: 24px;
}

.section-title {
    margin-bottom: 16px;
}

.section-title h3 {
    font-size: 16px;
    font-weight: 700;
    color: #111827;
    margin: 0;
}

.table-wrap {
    overflow-x: auto;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
}

.table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
}

.table thead {
    background: #f9fafb;
    border-bottom: 2px solid #e5e7eb;
}

.table th {
    padding: 12px 16px;
    text-align: left;
    font-size: 11px;
    font-weight: 700;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.table td {
    padding: 16px;
    border-top: 1px solid #f3f4f6;
    text-align: left;
    vertical-align: middle;
    color: #374151;
}

.table tbody tr:hover {
    background: #f9fafb;
}

.thumbnail {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
}

.file-name {
    font-weight: 600;
    color: #111827;
}

.action-buttons {
    display: flex;
    gap: 8px;
}

.btn-edit,
.btn-delete {
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-edit {
  background: #2563eb;
  color: white;
}

.btn-edit:hover {
  background: #1d4ed8;
}

.btn-delete {
  background: #ef4444;
  color: white;
}

.btn-delete:hover {
  background: #dc2626;
}.empty-row {
    text-align: center;
    color: #9ca3af;
    padding: 40px !important;
}

@media (max-width: 768px) {
    .gallery-header {
        padding: 20px 16px 16px;
    }

    .main-title {
        font-size: 20px;
    }

    .subtitle {
        font-size: 13px;
    }

    .gallery-actions {
        padding: 12px 16px;
    }

    .gallery-content {
        padding: 16px;
    }

    .table-wrap {
        border-radius: 6px;
    }

    .action-buttons {
        flex-direction: column;
        gap: 4px;
    }

    .thumbnail {
        width: 50px;
        height: 50px;
    }
}
</style>