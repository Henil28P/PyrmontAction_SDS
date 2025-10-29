<!-- src/views/GalleryView.vue -->
<template>
  <div class="gallery-container">
    <GalleryHeader />
    <GalleryGrid
        :images="galleryImages"
        @select-image="openLightbox"
    />
    <GalleryLightbox
        v-if="selectedImage"
        :image="selectedImage"
        @close="closeLightbox"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GalleryHeader from '@/features/gallery/components/GalleryHeader.vue'
import GalleryGrid from '@/features/gallery/components/GalleryCollage.vue'
import GalleryLightbox from '@/features/gallery/components/GalleryLightbox.vue'
import galleryService from '../services/galleryServices'



const galleryImages = ref([])

try{

  async function fetchData(){
      const response = await galleryService.getAllImages();
      console.log("fetched response:", response)
      galleryImages.value = response;
      console.log("fetched galleryImages.value:", galleryImages.value)
  }
  fetchData();

    

}
catch(error){
    console.log(error)
}


const selectedImage = ref(null)

function openLightbox(image) {
  selectedImage.value = image
}

function closeLightbox() {
  selectedImage.value = null
}
</script>

<style scoped>
.gallery-container {
  padding: 3rem 0;
  width: 100%;
  box-sizing: border-box;
}
</style>
