<template>
  <div class="projects-page">
    <ProjectsShowcase :projectType="route.params.projectType" :count=count />
    <ProjectsCardGrid
        heading="Open Projects"
        :projects=project 
    />

  </div>
</template>

<script setup>
    import ProjectsShowcase from '@/features/projects/components/ProjectsShowcase.vue'
    import ProjectsCardGrid from '@/features/projects/components/ProjectsCardGrid.vue'
    import { ref, watch } from 'vue';
    import { useRoute } from 'vue-router'
    import projects from "../services/projectServices"
    const route = useRoute();
    const project = ref([]);
    const count = ref({open: 0, closed: 0})
    let response;

    watch(() => route.params.projectType, fetchData, {immediate: true})

    async function fetchData(id){
        try{
            const openData = await projects.viewOpenProjects();
            const closedData = await projects.viewClosedProjects();

            if (id === "open") {
              project.value = openData.projects;
            } else if (id === "closed") {
              project.value = closedData.projects;
            }

            count.value = {
              open: openData.projects.length,
              closed: closedData.projects.length,
            };
        }

        catch(error){
            console.log("Error with inserting images onto the webpage")
        }
    }

</script>
