<template>
  <div class="gallery-banner">
    <div class="banner-text-block">
      <h1 class="banner-title">Gallery</h1>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
@keyframes subtleBackgroundZoom {
  0% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes slideFadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.gallery-banner {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  margin-bottom: 3rem;
  background-color: #EBBD6D; /* main tone */
}

.gallery-banner::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/Gallery/header_image.png');
  background-size: cover;
  background-position: center;
  z-index: 1;
  animation: subtleBackgroundZoom 25s ease-in-out infinite alternate;
  transition: transform 0.5s ease-out, filter 0.5s ease-out;
}

.gallery-banner::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(235, 189, 109, 0.3), rgba(235, 189, 109, 0.2)),
              radial-gradient(circle at center, rgba(255, 255, 255, 0.08), transparent 80%);
  pointer-events: none;
  z-index: 2;
  transition: background 0.5s ease-out;
}

.banner-text-block {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 40%;
  background: linear-gradient(135deg, rgba(235, 189, 109, 0.9), rgba(208, 137, 39, 0.9));
  clip-path: polygon(0 0, 100% 0, 85% 100%, 0 100%);
  display: flex;
  align-items: center;
  padding: 0 2rem 0 3rem;
  box-sizing: border-box;
  z-index: 3;
  backdrop-filter: blur(3px);
  box-shadow: inset 3px 0 8px rgba(255, 255, 255, 0.1), 0 5px 15px rgba(0, 0, 0, 0.15);
  animation: slideFadeInLeft 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s backwards;
  transition: background 0.4s ease-out, transform 0.4s ease-out;
}

.banner-title {
  font-family: 'League Spartan', sans-serif;
  font-size: 3.5rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.1;
  letter-spacing: 1.5px;
  color: #fff;
  text-shadow: 3px 3px 8px rgba(140, 75, 0, 0.4);
  animation: fadeIn 1.2s ease-out 0.6s backwards;
  transition: transform 0.4s ease-out;
}

.gallery-banner:hover::before {
  transform: scale(1.03);
}

.gallery-banner:hover::after {
  background: linear-gradient(rgba(235, 189, 109, 0.2), rgba(235, 189, 109, 0.1)),
              radial-gradient(circle at center, rgba(255, 255, 255, 0.1), transparent 85%);
}

@media (max-width: 992px) {
  .banner-text-block {
    width: 45%;
    padding: 0 1.5rem 0 2.5rem;
  }
  .banner-title {
    font-size: 3rem;
  }
}

@media (max-width: 768px) {
  .gallery-banner {
    height: 250px;
  }
  .banner-text-block {
    width: 55%;
    clip-path: polygon(0 0, 100% 0, 80% 100%, 0 100%);
    padding: 0 1.5rem 0 2rem;
  }
  .banner-title {
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  .gallery-banner {
    height: 200px;
  }
  .banner-text-block {
    width: 70%;
    clip-path: polygon(0 0, 100% 0, 75% 100%, 0 100%);
    padding: 0 1rem 0 1.5rem;
    backdrop-filter: blur(2px);
  }
  .banner-title {
    font-size: 2rem;
    letter-spacing: 1px;
  }
}
</style>
