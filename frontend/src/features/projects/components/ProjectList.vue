<template>
    <div class="project-list">
        <h2 class="project-list-header">More {{projectType}} Projects</h2>
        <div v-for="projectItem in projects" :key="projectItem._id" class="project-list-item">
            <router-link class="link-projects" :to="{
                name: 'Individual Projects', params: {
                    projectType: projectItem.project_type,
                    projectId: projectItem._id
                }
            }">
                <div class="project-list-image">
                    <img :src="`/src/assets/Projects/${projectItem.project_image}`" alt="project Image" />
                </div>
                <div class="project-list-text">
                    <h2 class="project-title">{{ projectItem.project_name.split(' ')
                        .slice(0, 5)
                        .join(' ') + (projectItem.project_name.split(' ').length > 5 ? '...' : '') }}</h2>
                    <p class="project-body">{{ projectItem.project_description.split(' ')
                        .slice(0, 5)
                        .join(' ') + (projectItem.project_description.split(' ').length > 5 ? '...' : '') }}</p>
                    <p><i class="fa-solid fa-calendar-days"></i> {{ projectItem.project_date }}</p>
                </div>
            </router-link>
        </div>
    </div>
</template>

<script setup>
defineProps({
    projects: {
        type: Array,
        required: true
    },
    projectType: {
        type: String,
        required: true
    }
});
</script>

<style lang="css">
.project-list {
    margin: 2% 0;
    padding: 1.5rem;
    background-color: #FFF4E0;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.project-list h2 {
    font-family: 'Inter', sans-serif;
    font-weight: 800;
    font-size: 25px;
    text-transform: uppercase;
}

.project-list-item {
    padding: 2.5% 0;
    border-bottom: 1px solid #000;
}

.project-list-item .link-projects {
    display: flex;
    overflow: hidden;
    text-decoration: none;
    align-items: center;
}

.project-list-image {
    width: 175px;
    height: 125px;
    overflow: hidden;
}

.project-list-image img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
}

.project-list-text {
    flex: 1;
    padding-left: 7px;
    color: #000;
}

.project-list-text .project-title {
    font-size: 16px;
    font-weight: 700;
}

.project-list-text .project-body {
    font-size: 12px;
    text-transform: none;
}

.project-list-text p {
    font-size: 12px;
    text-transform: none;
    margin: 5px 0;
}

.project-list-text:hover {
    color: #EBAE45;
}
</style>
