<template>
    <div class="project-individual-details">
        <p class="project-individual-description"> {{ individualProject.project_description }}</p>
    </div>
</template>

<script setup>
defineProps({
    individualProject: Object
})
</script>

<style lang="css">
.project-individual-details {
    padding-top: 2%;
}

.project-individual-description {
  white-space: pre-line;
}
</style>
