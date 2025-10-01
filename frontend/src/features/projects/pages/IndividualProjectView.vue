<template>
    <div class="project-individual float-in">
        <div class="back-button">
            <RouterLink class="link" :to="{ name: 'projects' }"><< {{route.params.projectType}} projects</RouterLink>
        </div>
        <div class="project-individual-title">
            <div class="project-individual-title-text">
                <h2 class="project-individual-header"> {{ individualProject.project_name }}</h2>
                <p class="project-individual-date"> <i class="fa-solid fa-calendar-days"></i>  {{ individualProject.project_date }}</p>
            </div>
            <img :src="`/src/assets/Projects/${individualProject.project_image}`" alt="project Image" />
        </div>
        <div class="project-individual-body">
            <div class="project-individual-details"><ProjectIndividualDetails :individualProject="individualProject"/></div>
            <div class="project-list"><ProjectList :projects="relatedProjects" :projectType="individualProject.project_type"/></div>
        </div>
    </div>
</template>


<script setup>
    import { ref, watch } from 'vue';
    import { useRoute } from 'vue-router'
    import ProjectIndividualDetails from '@/features/projects/components/ProjectIndividualDetails.vue';
    import ProjectList from '@/features/projects/components/ProjectList.vue';

    import projects from "../services/projectServices"
    const individualProject = ref({});
    const relatedProjects = ref([]);
    const route = useRoute();
    watch(() => route.params.projectId, fetchData, {immediate: true})

    async function fetchData(id){

        try{
            const { project } = await projects.getIndividualProjects(id);
            individualProject.value = project;

            let listData;
            if (individualProject.value.project_type === 'open') {
                listData = await projects.viewOpenProjects();
            } else if (individualProject.value.project_type === 'closed') {
                listData = await projects.viewClosedProjects();
            }

            relatedProjects.value = listData.projects.filter(
                p => p.project_name !== individualProject.value.project_name
            ).slice(-3);
        }

        catch(error){
            console.log("Error with inserting images onto the webpage")
        }
    }



</script>

<style lang="css">
.float-in {
  animation: floatIn 0.6s ease-out;
}

.project-individual {
    padding: 2% 6%
}

.project-individual-title {
    display: flex;
    align-items: center;
    gap: 2%
}

.project-individual-title img{
    width: 50vw;
    margin-left: auto;
}

.project-individual-title-text{
    width: 50vw;
}

.project-individual-header {
    font-family: 'Inter', sans-serif;
    font-weight: 200;
    text-transform: uppercase;
    white-space: pre-line;
}

.project-individual-date {
    opacity: 50%;
}

.back-button .link {
    text-decoration: none;
    font-family: 'Inter', sans-serif;
    text-transform: uppercase;
    font-weight: 800;
    color: #EBBD6D;
    border-bottom: 2px solid transparent;
}

.project-individual .link:hover {
    color: #EBAE45;
    border-color: #EBAE45;
}

.project-individual-body {
    display: flex;
    gap: 5%
}

.project-individual-details {
    flex: 65%;
}

.project-list {
    flex: 30%;
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
</style>
