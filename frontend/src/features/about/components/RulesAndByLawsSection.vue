<template>
  <section class="rules-section fade-in">
    <div class="rules-section__swirl-overlay" aria-hidden="true"></div>
    <div class="rules-section__container">
      <!-- Left Text Content -->
      <article class="rules-section__content">
        <h2 class="rules-section__title">Rules &amp; By-Laws</h2>
        <hr class="blue-underline" />

        <!-- Apply hover-text-fx class to paragraphs -->
        <p class="hover-text-fx">
          Our organization follows a clear set of guidelines to ensure a
          transparent, fair, and collaborative environment. Members are
          expected to uphold these principles, which outline responsibilities,
          processes, and best practices.
        </p>
        <p class="hover-text-fx">
          By adhering to these rules, we foster trust within the community and
          maintain a safe, welcoming space for all. These by-laws guide
          decision-making, dispute resolution, and uphold the groupâ€™s core
          values and mission.
        </p>
        <p class="hover-text-fx">
          Detailed documentation is provided to each member, ensuring everyone
          understands their roles and can actively participate in shaping our
          community.
        </p>
      </article>

      <!-- Floating Image (Right) -->
      <div class="rules-section__image-wrapper">
        <div class="rules-section__image-background">
          <img
              src="../../../assets/AboutUs/pyrmont-house.png"
              alt="By-laws building"
              role="img"
              class="rules-section__image"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// No additional script logic needed
</script>

<!-- If you need to keep styles truly scoped, use ::v-deep for .hover-text-fx. -->
<style>
/* ============================
   0. Font Assignments
============================ */
/*
  Import fonts in index.html or globally:
  <link
    href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;700&family=Roboto:wght@400;700&display=swap"
    rel="stylesheet"
  />
*/
:root {
  --heading-font: 'League Spartan', sans-serif;
  --body-font: 'Roboto', sans-serif;

  /* You can keep --primary-color if itâ€™s used elsewhere; itâ€™s unused in this hover style. */
  --primary-color: #3498db;
}

/* ============================
   1. Section Base & Layout
============================ */
.rules-section {
  position: relative;
  width: 100%;
  min-height: 700px;
  margin: 0 auto;
  overflow: hidden;

  /* Background gradient */
  background: linear-gradient(120deg, #ecf8ff 0%, #f8fdff 100%);
}

.rules-section__container {
  position: relative;
  z-index: 2; /* Above swirl overlay */
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 700px;
  padding: 3rem 7%;
  box-sizing: border-box;
  font-family: var(--body-font);
}

/* ============================
   2. Swirl Overlay (Subtle)
============================ */
.rules-section__swirl-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;

  /*
    Light swirl, slow movement, no color shift for subtlety.
    Using radial + linear for a gentle layered effect.
  */
  background:
      radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.4), transparent 60%),
      linear-gradient(to bottom, rgba(52, 152, 219, 0.1), rgba(0, 0, 0, 0.03));
  mix-blend-mode: screen;
  animation: swirl 40s infinite alternate ease-in-out; /* Very slow */
}

@keyframes swirl {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  100% {
    transform: translate(3%, 3%) rotate(1deg);
  }
}

/* ============================
   3. Text Content
============================ */
.rules-section__content {
  flex: 1;
  max-width: 600px;
  margin-right: 2rem;
  color: #333;
}

.rules-section__title {
  font-family: var(--heading-font);
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  line-height: 1.2;

  /* Subtle gradient text */
  background: linear-gradient(90deg, #D87E33 0%, #EBBD6D 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.blue-underline {
  width: 80px;
  height: 5px;
  background-color: #F6C88F;
  border: none;
  margin: 0 0 1.5rem;
  transition: width 0.4s ease;
}

/*
   Underline gently widens on hover of the heading.
   It's subtleâ€”just enough to emphasize the interaction.
*/
.rules-section__title:hover + .blue-underline {
  width: 100px;
}

.rules-section__content p {
  font-size: 1rem;
  line-height: 1.6;
  color: #444;
  margin-bottom: 1rem;
}

/* ============================
   4. Floating Image (Right)
============================ */
.rules-section__image-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 550px;
  position: relative;
  perspective: 800px; /* For gentle 3D tilt */
}

.rules-section__image-background {
  position: relative;
  display: inline-block;
  background: linear-gradient(135deg, #ffe9d0 0%, #fff4e0 100%);
  padding: 1.5rem 2rem 2rem 1.5rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  border-radius: 1rem;
  overflow: hidden;
  transition: transform 0.6s ease, box-shadow 0.6s ease;
  transform-style: preserve-3d;

  /* Gentle glow behind the card; subtle, so it doesn't annoy */
  backdrop-filter: blur(8px);
}

.rules-section__image-background:hover {
  transform: rotateY(-3deg) translateY(-5px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.2);
}

.rules-section__image-background::before {
  /* Decorative top edge wave shape */
  content: "";
  position: absolute;
  top: -30px;
  left: 0;
  width: 100%;
  height: 80px;
  background: inherit;
  clip-path: polygon(0 100%, 25% 85%, 50% 100%, 75% 85%, 100% 100%, 100% 0, 0 0);
  z-index: -1;
}

.rules-section__image {
  max-width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
  position: relative;
  z-index: 1;
  border-radius: 0.5rem;
}

/* ============================
   5. Media Queries
============================ */
@media (max-width: 992px) {
  .rules-section__container {
    flex-direction: column;
    align-items: flex-start;
    padding: 2rem;
  }

  .rules-section__content {
    margin-right: 0;
    margin-bottom: 2rem;
  }

  .rules-section__image-wrapper {
    max-width: 100%;
  }
}

@media (max-width: 767px) {
  .rules-section__title {
    font-size: 2rem;
  }

  .rules-section__content p {
    font-size: 0.95rem;
  }
}

/* ============================
   6. Fade-in (with scale) Animation
============================ */
.fade-in {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
  animation: fadeInUp 1.2s forwards ease-in-out;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
