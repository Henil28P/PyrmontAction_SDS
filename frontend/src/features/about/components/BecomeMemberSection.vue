<template>
  <section class="become-member-section fade-in">
    <div class="member-info">
      <h2 class="member-title">Become a Member</h2>
      <p class="meeting-times">
        We meet every second Thursday at the Community Hall, 7 PM.
        Join us to shape the future of Pyrmont!
      </p>
    </div>
    <div class="join-button-container">
      <RouterLink class="join-button" :to="{ name: 'Join Us'  }">Join Us</RouterLink>
    </div>
  </section>
</template>

<script setup>
// No script logic needed for this static section.
// Attach any desired event handlers or navigation logic to the button if needed.
</script>

<style scoped>
/*
  0) FONT IMPORT
  --------------------------------------------------
  Place these @import statements at the top of a
  global stylesheet or in your main <style> block
  (outside of `scoped`) so they apply project-wide.

  @import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;700&family=Roboto:wght@400;500;700&display=swap');
*/

/*
  1) Section Layout & Container
------------------------------------------------------ */
.become-member-section {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3rem 7%;
  overflow: hidden;
  box-sizing: border-box;
  min-height: 300px;

  /* Use Roboto as the default body font */
  font-family: 'Roboto', sans-serif;

  /* Lighter text color for contrast on dark background */
  color: #f1f1f1;
}

/*
  2) Black Gradient Wave Background via ::before
------------------------------------------------------ */
.become-member-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  /* Dark gradient from pure black to dark gray */
  background: linear-gradient(135deg, #222222 0%, #2c2c2c 100%);

  /* Wave-like clip path */
  clip-path: polygon(0 0, 100% 0, 100% 85%, 50% 95%, 0 85%);
  z-index: -1; /* behind content */
}

/*
  3) Text & Heading Styles
------------------------------------------------------ */
.member-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 600px;
  line-height: 1.4;
}

.member-title {
  /* Use League Spartan for headings */
  font-family: 'League Spartan', sans-serif;
  font-size: 2.8rem;
  margin: 0;
  line-height: 1.2;

  /* Subtle gradient text effect (unchanged) */
  background: linear-gradient(90deg, #EBBD6D 0%, #FF8008  100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.meeting-times {
  font-size: 1rem;
  margin: 0;
  /* Slightly lighter gray for body text if needed */
  color: #eaeaea;
  font-weight: 400;
}

/*
  4) Call-to-Action Button
------------------------------------------------------ */
.join-button-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.join-button {
  text-decoration: none;
  position: relative;
  background: linear-gradient(90deg, #EBBD6D 0%, #ecc278 100%);
  color: #fff;
  border: none;
  border-radius: 999px; /* pill shape */
  padding: 1.2rem 3rem; /* Larger padding for prominence */
  font-size: 1.3rem; /* Slightly bigger text */
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;

  /* Soft glow & transitions */
  box-shadow: 0 4px 10px rgba(235, 189, 109, 0.4);
  transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
}

.join-button:hover {
  box-shadow:  0 8px 20px rgba(235, 174, 69, 0.6);
  transform: translateY(-2px);
  animation: pulse 1.5s infinite; /* Optional pulse animation on hover */
}

.join-button:active {
  transform: translateY(0px) scale(0.98);
}

/*
  Optional: pulse animation that expands the glow
  repeatedly while hovering.
*/
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(235, 174, 69, 0.5);
  }
  70% {
    box-shadow: 0 0 0 16px rgba(235, 174, 69, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(235, 174, 69, 0);
  }
}

/*
  5) Responsive Layout
------------------------------------------------------ */
@media (max-width: 600px) {
  .become-member-section {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
  .join-button-container {
    justify-content: center;
    width: 100%;
  }
}

/*
  6) Fade-in Animation
------------------------------------------------------ */
.fade-in {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 1s forwards ease-in-out;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
