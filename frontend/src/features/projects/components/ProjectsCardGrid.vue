<template>
  <input class="textbox" type="text" v-model="input" placeholder="Search projects..." />
  <section class="projects-grid-section">
    <!-- Section Heading -->
    <!-- <h2 class="projects-grid-heading">{{ heading }}</h2> -->

    <!-- Projects Grid -->
    <div class="projects-grid">
      <article
          v-for="(project, index) in filteredProjects()"
          :key="index"
          class="project-card"
      >
        <!-- Card Image -->
        <div class="project-card__image-container">
          <img
              class="project-card__image"
              :src="`/src/assets/Projects/${project.project_image}`"
              :alt="project.title"
          />
          <!-- Optional overlay that appears on hover
          <div class="project-card__image-overlay"></div>
          -->
        </div>

        <!-- Card Content -->
        <div class="project-card__info">
          <h3 class="project-card__title">{{ project.project_name }}</h3>
          <p class="project-card__body">{{ project.project_description }}</p>
          <!-- <p class="project-card__body">{{ project.extraText }}</p> -->

          <!-- Learn More Link -->

          <a :href="`/projects/${project.project_type}/${project._id}`" class="project-card__link">
            LEARN MORE
            <span class="arrow">â†’</span>
          </a>
        </div>
      </article>
    </div>

    <div class="not-found-message" v-if="input&&!filteredProjects().length">
      <p>No projects found!</p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  projects: {
    type: Array,
    default: () => []
  }
})

const input = ref('')

function filteredProjects() {
  return props.projects.filter((project) =>
    project.project_name.toLowerCase().includes(input.value.toLowerCase()) || project.project_description.toLowerCase().includes(input.value.toLowerCase())
  );
}
</script>

<style scoped>
/* -----------------------------------------------------------
   1. SECTION WRAPPER
   ----------------------------------------------------------- */
.projects-grid-section {
  width: 100%;
  padding: 3rem 1.5rem;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(to right, #f0f4f8, #fcfcfc);
  /* Subtle pattern, remove if you prefer solid color/gradient:
     background-image: url('data:image/svg+xml,...');
     background-repeat: repeat;
  */
  margin: 0 auto;
  max-width: 1400px; /* keeps content centered on wide screens */
}

/* -----------------------------------------------------------
   2. SECTION HEADING
   ----------------------------------------------------------- */
.projects-grid-heading {
  text-align: left;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  background: linear-gradient(to right, #0077b6, #00b4d8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;
}

/* -----------------------------------------------------------
   3. GRID LAYOUT
   ----------------------------------------------------------- */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 350px));
  gap: 2rem;
}

/* -----------------------------------------------------------
   4. CARD STYLING
   ----------------------------------------------------------- */
.project-card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 450px;
}

.project-card:hover {
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* -----------------------------------------------------------
   5. IMAGE CONTAINER & IMAGE
   ----------------------------------------------------------- */
.project-card__image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
  background-color: #f2f2f2; /* fallback if image doesnâ€™t load */
  flex-shrink: 0;
}

/* Card Image */
.project-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

/* Optional overlay if you want to dim the image on hover
.project-card__image-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.2);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.project-card:hover .project-card__image-overlay {
  opacity: 1;
}
*/

/* -----------------------------------------------------------
   6. CARD CONTENT / TEXT
   ----------------------------------------------------------- */
.project-card__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem 1.2rem;
}

.project-card__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
  line-height: 1.3;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.project-card__body {
  margin: 0;
  color: #555;
  font-size: 1rem;
  line-height: 1.6;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

/* -----------------------------------------------------------
   7. CALL-TO-ACTION LINK
   ----------------------------------------------------------- */
.project-card__link {
  margin-top: auto; /* pushes link to the bottom */
  align-self: flex-start;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  color: #EBBD6D;
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s ease, color 0.3s ease;
}

.project-card__link:hover {
  color: #ebae45; /* slightly darker color on hover */
  border-color: #ebae45;
}

.arrow {
  margin-left: 4px;
}

.textbox {
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.textbox:focus {
  outline: none;
  border-color: #EBBD6D;
  box-shadow: 0 0 0 3px rgba(235, 189, 109, 0.5);
}

.not-found-message {
  text-align: center;
}
</style>
