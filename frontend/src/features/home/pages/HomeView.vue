<template>
    <div class="home float-in">
        <div v-if="!isLoaded" class="loading">Loading projects...</div>
        <Carousel v-else-if="project.length > 0" class="carousel" v-slot="{ currentSlide }">
            <Slide v-for="(projectItem, index) in project" :key="projectItem._id">
                <div v-show="currentSlide === index + 1" class="slide-info">
                    <img :src="`${SERVER_URL}${projectItem.project_imageUrl}`" alt="image" />
                    <div class="overlay">
                        <h1 class="overlay-header">{{ projectItem.project_name }}</h1>
                        <ul class="button">
                            <li><router-link class="link" :to="{
                                name: 'Individual Projects', params: {
                                    projectType: projectItem.project_type,
                                    projectId: projectItem._id
                                }
                            }">LEARN MORE</router-link></li>
                        </ul>
                    </div>
                </div>
        </Slide>
        </Carousel>
    <CoreValues />
    <BecomeMember v-if="!userStore.isAuthenticated"/>
    </div>
</template>

<script setup>
import SERVER_URL from '@/config';
import Carousel from "../components/Carousel.vue";
import Slide from "../components/Slide.vue";
import CoreValues from "../components/CoreValues.vue"
import BecomeMember from "../components/BecomeMemberSection.vue"
import { ref, onMounted } from 'vue';
import projects from "../../projects/services/projectServices"
import { useUserStore } from '../../../stores/authStore';

const project = ref([]);
let response;
const isLoaded = ref(false);
const userStore = useUserStore();

onMounted(async () => {
  try {
    console.log('Fetching open projects...');
    response = await projects.viewOpenProjects();
    console.log('API Response:', response);
    if (response && response.projects) {
      project.value = response.projects.slice(-4);
      console.log('Processed projects:', project.value);
      isLoaded.value = true;
    } else {
      console.error('No projects data in response:', response);
    }
  } catch (error) {
    console.error("Error loading projects:", error);
    isLoaded.value = false;
  }
});
</script>


<style lang="css" scoped>
.float-in {
  animation: floatIn 0.6s ease-out;
}

.carousel {
    position: relative;
    max-height: 100vh;
    height: 80vh;
}

.carousel .slide-info {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    max-height: 100%;
    height: 100%;
}

.carousel img {
    min-width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(60%);
}

.carousel .overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-65%, -50%);
    width: 60%;
    z-index: 90;
}

.carousel .overlay-header {
    color: #fff;
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 40px;
}

.carousel .overlay-desc {
    color: #fff;
}

.carousel .button {
    list-style: none;
    padding: 0;
}

.carousel .button li {
    margin-top: 20px;
}

.carousel .link {
    display: inline-block;
    padding: 12px 20px;
    background-color: #EBBD6D;
    color: #fff;
    text-decoration: none;
    border-radius: 30px;
    font-size: 13px;
    font-weight: bold;
    text-align: center;
    transition: background-color 0.3s;
}

.carousel .link:hover {
    background-color: #ebae45;
}

@keyframes floatIn {
  0% {
    opacity: 0;
    transform: translateY(8%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #666;
}
</style>