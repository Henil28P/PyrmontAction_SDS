<template>
  <section class="history-section">
    <div class="history-overlay">
      <div class="history-content">
        <h2 class="history-title stagger-fade-title">Our History</h2>
        <hr class="blue-underline hover-pulse" />
        <h3 class="history-subtitle stagger-fade-subtitle">A Legacy of Community</h3>

        <!-- Notice the hover-text-fx class on these paragraphs: -->
        <p class="stagger-fade-paragraph hover-text-fx">
          Founded over a century ago, Pyrmont has evolved from a modest harbor-side
          neighborhood into a vibrant community hub. Our group was established to
          preserve local heritage while embracing modern growth and innovation.
        </p>
        <p class="stagger-fade-paragraph hover-text-fx">
          From hosting cultural events to advocating for sustainable development,
          we continue to play a pivotal role in shaping Pyrmontâ€™s future. Our
          history is a testament to the power of collective effort and
          community-driven progress.
        </p>
      </div>

      <div class="history-floating-image stagger-fade-image">
        <img
            src="../../../assets/AboutUs/train.png"
            alt="Historic Train"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
// No additional script logic needed
</script>

<!--
  If your Vue setup doesn't require truly scoped styles for these hover effects,
  you can remove "scoped" below. Otherwise, see the note below about using deep selectors.
-->
<style scoped>
:root {
  --heading-font: 'League Spartan', sans-serif;
  --body-font: 'Roboto', sans-serif;
  --primary-color: #3498DB; /* Adjust to your preferred accent color */
}

/* ===================================
   1. Base & Layout
=================================== */
.history-section {
  position: relative;
  width: 100%;
  min-height: 700px;
  margin: 0 auto;
  overflow: hidden;
  font-family: var(--body-font);
  background: url("@/assets/AboutUs/history-bg.png") center center / cover no-repeat;
  background-attachment: scroll;
}

@media (min-width: 768px) {
  .history-section {
    background-attachment: fixed;
  }
}

/* Gradient overlay for a smoother effect */
.history-section::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.7),
      rgba(0, 0, 0, 0.5) 30%,
      rgba(0, 0, 0, 0.8)
  );
  z-index: 1;
}

/* ===================================
   2. Overlay & Content Container
=================================== */
.history-overlay {
  position: relative;
  z-index: 2;
  padding: 3rem 7%;
  min-height: 700px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

@media (max-width: 992px) {
  .history-overlay {
    flex-direction: column;
    align-items: flex-start;
  }
}

/* ===================================
   3. Left-Side Text Content
=================================== */
.history-content {
  flex: 1;
  max-width: 600px;
  color: #fff;
  margin-right: 2rem;
}

@media (max-width: 992px) {
  .history-content {
    margin-right: 0;
    margin-bottom: 2rem;
  }
}

.history-title {
  font-family: var(--heading-font);
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  text-shadow: 1px 1px 8px rgba(0, 0, 0, 0.5);
  letter-spacing: 1px;
  transition: text-shadow 0.3s ease; /* For hover effect */
}

/* Glow on hover for the main heading */
.history-title:hover {
  text-shadow: 0 0 10px #EBBD6D, 0 0 20px #EBBD6D;
}

.blue-underline {
  width: 100px;
  height: 5px;
  background-color: #F6C88F;
  border: none;
  margin: 0 0 1rem 0;
}

.history-subtitle {
  font-family: var(--heading-font);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
}

.history-content p {
  font-size: 1.125rem;
  line-height: 1.7;
  margin-bottom: 1.5rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
}

@media (max-width: 600px) {
  .history-title {
    font-size: 2.2rem;
  }
  .history-subtitle {
    font-size: 1.3rem;
  }
  .history-content p {
    font-size: 1rem;
  }
}


/* ===================================
   4. Right-Side Floating Image
=================================== */
.history-floating-image {
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 500px;
}

@media (max-width: 992px) {
  .history-floating-image {
    max-width: 100%;
  }
}

.history-floating-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
  border: 3px solid rgba(255,255,255,0.4);
  border-radius: 10px;
  box-shadow: 0 20px 30px rgba(0,0,0,0.5);
  transition: transform 0.5s ease, box-shadow 0.5s ease, filter 0.3s ease;
}

/* Make the hover effect more subtle (less scale, optional reduced rotation) */
.history-floating-image img:hover {
  transform: scale(1.02) rotate(0.5deg);
  box-shadow: 0 25px 40px rgba(0,0,0,0.4);
  filter: brightness(1.05);
}

/* Slight, slower float animation */
.history-floating-image img {
  animation: floatImage 5s ease-in-out infinite;
}

@keyframes floatImage {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}


/* ===================================
   5. Staggered Fade-in Animations
=================================== */
.stagger-fade-title,
.stagger-fade-subtitle,
.stagger-fade-paragraph,
.stagger-fade-image {
  opacity: 0;
  transform: translateY(20px);
  animation-fill-mode: forwards;
}

/* Animate each with a slight delay */
.stagger-fade-title {
  animation: fadeUp 1s ease-in-out 0.2s forwards;
}
.stagger-fade-subtitle {
  animation: fadeUp 1s ease-in-out 0.4s forwards;
}
.stagger-fade-paragraph {
  animation: fadeUp 1s ease-in-out 0.6s forwards;
}
.stagger-fade-image {
  animation: fadeUp 1s ease-in-out 0.8s forwards;
}

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===================================
   6. Hover Pulse on Underline
=================================== */
.hover-pulse {
  position: relative;
  transition: transform 0.3s ease;
}

.hover-pulse:hover {
  transform: scale(1.1);
}

</style>
