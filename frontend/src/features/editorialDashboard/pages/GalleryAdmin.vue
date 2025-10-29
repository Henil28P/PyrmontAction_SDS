<template>
    <div>
        <h1>Gallery Admin</h1>
        <button @click="addItemModal = true">Add New Image</button>
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

</style>