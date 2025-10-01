<template>
  <section class="contact-hero fade-in">
    <div class="hero-overlay"></div>

    <!-- Contact cards in the center -->
    <div class="contact-cards">
      <!-- Card 1: Phone -->
      <div class="contact-card">
        <div class="contact-icon" v-html="phoneSvg"></div>
        <h3>Call Us</h3>
        <p>(+61) 414 997 089</p>
      </div>

      <!-- Card 2: Email -->
      <div class="contact-card">
        <div class="contact-icon" v-html="emailSvg"></div>
        <h3>Email Us</h3>
        <p>convenor@pyrmontaction.org.au</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import phoneSvg from '@/assets/svg_icons/phone_call_icon.svg?raw'
import emailSvg from '@/assets/svg_icons/email_icon.svg?raw'
</script>

<style>

html, body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
}

/* HERO SECTION */
.contact-hero {
  position: relative;
  width: 100%;
  height: 460px;
  margin: 0;
  padding: 0;

  background: url('@/assets/Contact/pyrmont_harbour.jpg') center / cover no-repeat;

  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: #fff;
}

/* CONTACT CARDS WRAPPER */
.contact-cards {
  position: relative;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}

/* CONTACT CARD (Glassmorphic style) */
.contact-card {
  width: 250px;
  min-height: 140px;
  padding: 1.5rem;
  border-radius: 1rem;
  text-align: center;

  /* Glass effect */
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);

  color: #333;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.contact-card h3 {
  font-family: 'League Spartan', sans-serif;
  margin-bottom: 0.5rem;
}

.contact-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.2);
}

/* ICONS */
.contact-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 0.75rem;
}

.contact-icon svg {
  width: 100%;
  height: 100%;
}

.contact-icon svg path {
  fill: #EBBD6D;
}

.contact-card:hover .contact-icon svg {
  transform: scale(1.2) rotate(-5deg);
  transition: transform 0.3s ease;
}


/* FADE-IN ANIMATION */
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

/* RESPONSIVE TWEAKS */
@media (max-width: 768px) {
  .contact-hero:hover .hero-overlay {
    opacity: 1;
  }
}
</style>
