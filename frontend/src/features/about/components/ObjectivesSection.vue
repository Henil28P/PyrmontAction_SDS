<template>
  <section class="objectives-section fade-in">
    <!-- Section Header / Text -->
    <div class="objectives-text">
      <h2 class="objectives-title">Our Objectives</h2>
      <h3 class="objectives-subtitle">Fostering Community & Progress</h3>
      <p class="objectives-description">
        We are dedicated to creating a supportive, forward-thinking environment where
        members can collaborate, share ideas, and achieve common goals. Our core
        values guide us in maintaining inclusivity, innovation, and transparency.
      </p>
    </div>

    <!-- Objectives Grid -->
    <div class="objectives-grid">
      <div class="objective-item">
        <img
            src="../../../assets/AboutUs/democratic.png"
            alt="Democratic"
            class="objective-icon"
        />
        <h4>Democratic</h4>
        <p>
          Every voice matters. We encourage participation and ensure decisions
          represent the communityâ€™s collective interest.
        </p>
      </div>

      <div class="objective-item">
        <img
            src="../../../assets/AboutUs/future-thinking.png"
            alt="Future Thinking"
            class="objective-icon"
        />
        <h4>Innovative</h4>
        <p>
          We embrace creativity and technology to stay ahead and continuously
          improve our community.
        </p>
      </div>

      <div class="objective-item">
        <img
            src="../../../assets/AboutUs/determined.png"
            alt="Determined"
            class="objective-icon"
        />
        <h4>Determined</h4>
        <p>
          We persevere through challenges, staying committed to our mission
          and working tirelessly for success.
        </p>
      </div>

      <div class="objective-item">
        <img
            src="../../../assets/AboutUs/welcoming.png"
            alt="Welcoming"
            class="objective-icon"
        />
        <h4>Welcoming</h4>
        <p>
          Our doors are open to everyone, fostering an environment of respect,
          warmth, and empathy.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
// This is a purely presentational component; no script logic is required.
</script>

<style scoped>
/* Import League Spartan and Roboto */
@import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;700&family=Roboto:wght@300;400;500;700&display=swap');

/* Container Styling */
.objectives-section {
  width: 100%;
  padding: 3rem 7%;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;

  /* Soft gradient background */
  background: linear-gradient(to bottom right, #f8fcff 0%, #eef7fc 100%);
  position: relative;
  overflow: hidden;
}

/* Header / Main Text */
.objectives-text {
  margin-bottom: 3rem;
  max-width: 800px;
  text-align: left;
  color: #333;
  margin-left: auto;
  margin-right: auto;
}

/* Use League Spartan for Titles & Subtitles */
.objectives-title,
.objectives-subtitle,
.objective-item h4 {
  font-family: 'League Spartan', sans-serif;
}

.objectives-title {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  letter-spacing: 1px; /* Slight spacing for a modern touch */
}

.blue-underline {
  width: 80px;
  height: 4px;
  background-color: #3498db;
  border: none;
  margin: 0 0 1.5rem 0;
  border-radius: 2px;
}

.objectives-subtitle {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #444;
  letter-spacing: 0.5px;
}

.objectives-description {
  font-size: 18px;
  line-height: 1.6;
  font-weight: 400;
  color: #555;
  margin-bottom: 2rem;
}

/* Grid of Objective Items */
.objectives-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 2rem;
  margin-left: auto;
  margin-right: auto;
  max-width: 1200px;
}

/* Each Objective Card */
.objective-item {
  background: rgba(255, 255, 255, 0.75); /* Slightly transparent for a glassmorphic effect */
  backdrop-filter: blur(6px);
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  text-align: center;
  padding: 2rem 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;

  /* Fade-in with initial transform */
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s forwards ease-in-out;
}

/* Stagger the fade-in for each card */
.objective-item:nth-of-type(1) {
  animation-delay: 0.2s;
}
.objective-item:nth-of-type(2) {
  animation-delay: 0.4s;
}
.objective-item:nth-of-type(3) {
  animation-delay: 0.6s;
}
.objective-item:nth-of-type(4) {
  animation-delay: 0.8s;
}

/* Hover / Active effects: glow & "pop up" */
.objective-item:hover,
.objective-item:focus-within,
.objective-item:active {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 0 15px rgba(235, 189, 109, 0.3),
              0 0 30px rgba(235, 189, 109, 0.15);
}

/* Optional glowing outline on hover */
.objective-item::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 1rem;
  box-shadow: 0 0 20px rgba(235, 189, 109, 0.2);
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  pointer-events: none;
}
.objective-item:hover::before,
.objective-item:focus-within::before,
.objective-item:active::before {
  opacity: 1;
}

/* Objective Icon & Text */
.objective-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 1rem;
  object-fit: contain;

  /* Slight pop on hover (icon only) */
  transition: transform 0.3s;
}
.objective-item:hover .objective-icon,
.objective-item:focus-within .objective-icon,
.objective-item:active .objective-icon {
  transform: scale(1.08);
}

.objective-item h4 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #2c3e50;
}

.objective-item p {
  font-size: 16px;
  line-height: 1.5;
  color: #555;
}

/* Fade-in Animation */
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* This class for the entire section fade-in at load */
.fade-in {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 1s forwards ease-in-out;
}

/* Responsive Tweaks */
@media (max-width: 768px) {
  .objectives-title {
    font-size: 36px;
  }
  .objectives-subtitle {
    font-size: 20px;
  }
  .objectives-description {
    font-size: 16px;
  }
  .objective-item {
    padding: 1.5rem;
  }
}
</style>
