<!-- Add this inside your main HTML file or a global style file to load fonts -->
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@700&family=Roboto&display=swap" />

<template>
  <section class="hero-section fade-in">
    <!-- Animated angled background -->
    <div class="hero-background"></div>

    <!-- Left-side image -->
    <div class="hero-left-image-wrapper">
      <img :src="pyrmontView" alt="Pyrmont view" class="hero-left-image" />
    </div>

    <!-- Right-side image -->
    <div class="hero-image-wrapper">
      <img :src="buildingImage" alt="Pyrmont building" class="hero-image" />
    </div>

    <!-- Glassmorphic content container -->
    <div class="hero-content">
      <div class="hero-text-box">
        <h3 class="hero-subtitle">Connect with Us</h3>
        <h1 class="hero-title">About Pyrmont</h1>
        <p class="hero-description">
          Discover who we are, what we stand for, and how we work together
          to shape a thriving community in the heart of Pyrmont.
        </p>
      </div>
    </div>

    <!-- Shape divider at the bottom of the section -->
    <div class="hero-shape-divider"></div>
  </section>
</template>

<script setup>
import buildingImage from '@/assets/AboutUs/pyrmont-building.jpg'
import pyrmontView from '@/assets/AboutUs/pyrmont-view.jpg'
</script>

<style scoped>
/*
   ------------------------------------------------
   FONTS (if not imported elsewhere)
   @import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@700&family=Roboto&display=swap');
   ------------------------------------------------
*/

.hero-section {
  position: relative;
  width: 100%;
  min-height: 650px;
  /* Slightly taller for emphasis */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 3rem 0;
}

/* Fade-in animation */
.fade-in {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 1.2s forwards ease-in-out;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: none;
  }
}

/*
   ------------------------------------------------
   ANIMATED BACKGROUND (Angled + Changing Gradient)
   ------------------------------------------------
*/
.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* Subtle shifting gradient */
  background: linear-gradient(to bottom right,
      #f8fcff 0%,
      #eef7fc 100%);
  background-size: 200% 200%;
  animation: gradientShift 10s ease-in-out infinite;

  /* Angled skew */
  transform: skewY(-5deg);
  transform-origin: top left;
  z-index: 1;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

/*
   ------------------------------------------------
   LEFT IMAGE WRAPPER
   ------------------------------------------------
*/
.hero-left-image-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  overflow: hidden;
  z-index: 2;
}

/* The actual image */
.hero-left-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 5s ease;
}


/*
   ------------------------------------------------
   RIGHT IMAGE WRAPPER
   ------------------------------------------------
*/
.hero-image-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  overflow: hidden;
  z-index: 3;
}

/* Right-side image itself */
.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 5s ease;
}

@media (max-width: 992px) {

  /* Hide both images on smaller screens or adjust how they stack */
  .hero-left-image-wrapper,
  .hero-image-wrapper {
    display: none;
  }
}

/*
   ------------------------------------------------
   CONTENT (GLASSMORPHIC BOX)
   ------------------------------------------------
*/
.hero-content {
  position: relative;
  z-index: 4;
  /* Above both images */
  max-width: 1200px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.hero-text-box {
  /* Glass effect */
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);

  border-radius: 1rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);

  /* Spacing & layout */
  margin: 0 auto;
  padding: 2.5rem;
  max-width: 600px;

  /* Fonts */
  font-family: 'Roboto', sans-serif;
  text-align: left;
}

.hero-subtitle {
  font-family: 'League Spartan', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #c99132;
  margin-bottom: 0.5rem;
}

.hero-title {
  font-family: 'League Spartan', sans-serif;
  font-size: 48px;
  line-height: 1.2;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1.2rem;
}

.hero-description {
  font-size: 18px;
  line-height: 1.6;
  color: #4f4f4f;
  margin-bottom: 2rem;
}

/*
   ------------------------------------------------
   SHAPE DIVIDER (Gradient-filled Wave)
   ------------------------------------------------
   Use a mask to show the wave shape with a gradient fill.
*/
.hero-shape-divider {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 150px;
  z-index: 5;
  /* We'll insert the wave mask via pseudo-element */
  background: none;
  /* Clear out any old background */
}

/* Mask-based wave gradient fill */
.hero-shape-divider::before {
  content: "";
  position: absolute;
  inset: 0;
  /* Just a solid color fill instead of a gradient: */
  background: #f8fcff;

  /* Mask the shape of the wave path */
  mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 1440 320' xmlns='http://www.w3.org/2000/svg'><path fill='%23ffffff' d='M0,96L60,101.3C120,107,240,117,360,133.3C480,149,600,171,720,154.7C840,139,960,85,1080,90.7C1200,96,1320,160,1380,192L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z' /></svg>");
  mask-repeat: no-repeat;
  mask-size: cover;

  /* For WebKit (Safari) support: */
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 1440 320' xmlns='http://www.w3.org/2000/svg'><path fill='%23ffffff' d='M0,96L60,101.3C120,107,240,117,360,133.3C480,149,600,171,720,154.7C840,139,960,85,1080,90.7C1200,96,1320,160,1380,192L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z' /></svg>");
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: cover;
}


/*
   ------------------------------------------------
   RESPONSIVE TWEAKS
   ------------------------------------------------
*/
@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }

  .hero-subtitle {
    font-size: 20px;
  }

  .hero-description {
    font-size: 16px;
  }

  .hero-text-box {
    margin: 0 1rem;
  }
}
</style>
