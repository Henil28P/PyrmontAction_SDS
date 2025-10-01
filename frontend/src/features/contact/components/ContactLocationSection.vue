<!-- src/components/Contact/ContactLocationSection.vue -->
<script setup>
</script>

<template>
  <section class="location-section fade-in">
    <div class="location-content">
      <div class="map-container">
        <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6625.686069732537!2d151.18723329427118!3d-33.86793590419473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12ae3422c32ec1%3A0xe7e946b755d8082!2sPyrmont%20Community%20Centre!5e0!3m2!1sen!2sau!4v1743662769228!5m2!1sen!2sau"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <div class="location-info">
        <h3>Our Location</h3>
        <h2>Connecting Near & Far</h2>
        <h4>Community Centre</h4>
        <p>
          79A John St<br />
          Pyrmont NSW 2009<br />
          Australia
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@700&family=Inter:wght@400&display=swap');

.location-section {
  position: relative;
  width: 100%;
  padding: 2rem 1rem;
  background: linear-gradient(
      135deg,
      rgba(52, 152, 219, 0.15) 0%,
      rgba(255, 255, 255, 0.4) 100%
  );
  background-blend-mode: multiply;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.location-section::before {
  content: '';
  position: absolute;
  width: 800px;
  height: 800px;
  background: radial-gradient(circle at 50% 50%, rgba(52, 152, 219, 0.3), transparent 70%);
  top: -40%;
  left: -40%;
  z-index: 1;
  animation: swirl 10s linear infinite alternate;
  pointer-events: none;
}

@keyframes swirl {
  0% {
    transform: rotate(0deg) scale(1);
  }
  100% {
    transform: rotate(20deg) scale(1.1);
  }
}

.location-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: center;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  max-width: 1200px;
  width: 100%;
  overflow: hidden;
}

.map-container {
  flex: 1 1 400px;
  min-width: 300px;
  max-width: 600px;
  border-radius: 8px;
  overflow: hidden;
  margin: 0;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}

.map-container iframe {
  width: 100%;
  height: 100%;
  min-height: 350px;
  border: none;
  display: block;
}

.location-info {
  flex: 1 1 300px;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.location-info h3,
.location-info h2,
.location-info h4 {
  font-family: 'League Spartan', sans-serif;
  font-weight: 700;
  margin: 0;
}

.location-info h3 {
  font-size: 1.25rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #555;
  margin-bottom: 0.5rem;
  position: relative;
}

.location-info h2 {
  font-size: 2rem;
  color: #EBBD6D;
  margin: 0.25rem 0 1.5rem;
  position: relative;
}

.location-info h2::after {
  content: '';
  display: block;
  width: 50px;
  height: 4px;
  background-color: #EBBD6D;
  margin-top: 0.5rem;
  border-radius: 2px;
}

.location-info h4 {
  font-size: 1.1rem;
  color: #333;
  margin: 1rem 0 0.5rem;
}

.location-info p {
  margin: 0;
  line-height: 1.6;
  color: #444;
}

.fade-in {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 1s forwards ease-out;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
