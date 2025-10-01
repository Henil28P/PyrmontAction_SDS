<template>
  <section class="showcase">
    <!-- Decorative Wavy Background -->
    <div class="showcase__bg-wave"></div>

    <!-- Content Wrapper -->
    <div class="showcase__content">
      <!-- Left Text Column -->
      <div class="showcase__text-block">
        <h2 class="showcase__title">OUR {{projectType}} PROJECTS</h2>
        <p class="showcase__desc">
          Explore our {{projectType}} projects, showcasing our commitment to transparency, learning, and real-world impact for the Pyrmont community.
        </p>
      </div>

      <!-- Right Media & Stats Column -->
      <div class="showcase__media-block">
        <!-- Images Row -->
        <div class="showcase__images">
          <div class="showcase__image-wrapper">
            <img :src="treeImage" alt="Example project image - tree" />
            <div class="showcase__arrow-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                    d="M8 5l8 7-8 7"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
          <div class="showcase__image-wrapper">
            <img :src="workersImage" alt="Another project image - workers" />
            <div class="showcase__arrow-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                    d="M8 5l8 7-8 7"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Stats Bar -->
        <div class="showcase__stats-bar">
          <div class="showcase__stat">
            <span class="showcase__stat-number">{{  count.open }}</span>
            <span class="showcase__stat-label">open</span>
          </div>
          <div class="showcase__stat">
            <span class="showcase__stat-number">{{ count.closed }}</span>
            <span class="showcase__stat-label">closed</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
    projectType: {
        type: String,
        required: true
    },
    count: {
        type: Object,
        required: true
    }
});

import treeImage from '@/assets/Projects/pyrmont_tree.png'
import workersImage from '@/assets/Projects/pyrmont_project_manager.png'
</script>

<style scoped>
/*
  ----------------------------------------------------------
  1. Base Setup & Animations
  ----------------------------------------------------------
*/
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=League+Spartan:wght@700&display=swap");

:root {
  --font-primary: 'Inter', sans-serif;
  --font-heading: 'League Spartan', sans-serif;

  /* Adjust these if you want different colors */
  --color-bg-light: #fdfcff;
  --color-bg-gradient-start: #9bdfff;
  --color-bg-gradient-end: #d3f3ff;

  --color-text-dark: #2a2a2a;
  --color-text-accent: #EBBD6D;

  --color-white-overlay: rgba(255, 255, 255, 0.3);
  --color-black-overlay: rgba(0, 0, 0, 0.3);
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

/*
  ----------------------------------------------------------
  2. Showcase Container & Wave
  ----------------------------------------------------------
*/
.showcase {
  position: relative;
  /* horizontal padding ensures text doesn't hug screen edges */
  padding: 3rem 2rem;
  overflow: hidden;
  background-color: var(--color-bg-light);
}

/* A large wave shape at the top as a decorative background */
.showcase__bg-wave {
  position: absolute;
  top: -100px;
  left: 50%;
  width: 120%;
  height: 300px; /* slightly smaller wave */
  background: linear-gradient(
      135deg,
      var(--color-bg-gradient-start),
      var(--color-bg-gradient-end)
  );
  transform: translateX(-50%);
  z-index: -1;
  clip-path: polygon(
      0 35%,
      15% 60%,
      35% 70%,
      60% 65%,
      80% 50%,
      100% 35%,
      100% 100%,
      0 100%
  );
}

/*
  ----------------------------------------------------------
  3. Content Wrapper: Two Columns (Text | Media)
  ----------------------------------------------------------
*/
.showcase__content {
  /* Center & limit width so it doesn't stretch too wide on huge screens */
  max-width: 1400px;
  margin: 0 auto;

  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  animation: floatIn 0.8s ease forwards;
}

/*
  ----------------------------------------------------------
  4. Left Text Column
  ----------------------------------------------------------
*/
.showcase__text-block {
  flex: 0 0 45%;
  padding-right: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.showcase__title {
  font-family: var(--font-heading);
  font-size: 2.2rem;
  letter-spacing: 1px;
  margin: 0 0 1rem;
  background: linear-gradient(to right, #EBBD6D, #ecc278);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  /* subtle text shadow for extra pop */
  text-shadow: 0 2px 2px rgba(0,0,0,0.1);
  text-transform: uppercase;
}

.showcase__desc {
  font-family: var(--font-primary);
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-text-dark);
  margin: 0;
  max-width: 500px;
  opacity: 0.9;
}

/*
  ----------------------------------------------------------
  5. Right Media & Stats Column
  ----------------------------------------------------------
*/
.showcase__media-block {
  flex: 0 0 50%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* 5.1 Images in a row */
.showcase__images {
  display: flex;
  gap: 1rem;
}

.showcase__image-wrapper {
  position: relative;
  flex: 1;
  aspect-ratio: 1 / 1;  /* squares */
  overflow: hidden;
  border-radius: 10px;
  background-color: #ccc;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.showcase__image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/*
  ----------------------------------------------------------
  6. Stats Bar (Glassy style)
  ----------------------------------------------------------
*/
.showcase__stats-bar {
  display: flex;
  justify-content: space-around;
  background: var(--color-white-overlay);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.showcase__stats-bar:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.showcase__stat {
  text-align: center;
  font-family: var(--font-primary);
}
.showcase__stat-number {
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-text-accent);
  margin-bottom: 0.2rem;
}
.showcase__stat-label {
  font-size: 0.9rem;
  color: var(--color-text-dark);
  opacity: 0.8;
}

/*
  ----------------------------------------------------------
  7. Responsiveness
  ----------------------------------------------------------
*/
@media (max-width: 900px) {
  .showcase__content {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
  .showcase__text-block {
    flex: none;
    max-width: 100%;
    padding-right: 0;
    text-align: center;
  }
  .showcase__media-block {
    flex: none;
    width: 100%;
  }
  .showcase__images {
    flex-direction: row;
  }
}

@media (max-width: 480px) {
  .showcase__title {
    font-size: 1.8rem;
  }
  .showcase__desc {
    font-size: 0.95rem;
  }
  .showcase__stat-number {
    font-size: 1.5rem;
  }
}
</style>
