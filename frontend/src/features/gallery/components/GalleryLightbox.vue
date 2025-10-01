<template>
  <transition name="lightbox">
    <div v-if="image" class="lightbox-overlay" @click.self="close">
      <button
          class="lightbox-close"
          type="button"
          aria-label="Close Lightbox"
          @click.prevent="close"
      >
        &times;
      </button>
      <div class="lightbox-content">
        <img
            :src="image.src"
            :alt="image.alt"
            class="lightbox-image"
            @error="handleImageError"
        />
        <p v-if="image.caption" class="lightbox-caption">{{ image.caption }}</p>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  image: {
    type: Object,
    required: false,
    default: null
  }
})

const emit = defineEmits(['close'])

function close() {
  emit('close')
}

function handleImageError(event) {
  console.warn('Lightbox image failed to load:', event.target.src)
  event.target.src = '/path/to/fallback.png'
}
</script>

<style scoped>
.lightbox-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  box-sizing: border-box;
}

.lightbox-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeInDown 0.5s ease forwards;
  max-width: 90%;
  max-height: 90%;
}

.lightbox-image {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 80vh;
  border-radius: 4px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
}

.lightbox-caption {
  color: #fff;
  margin-top: 1rem;
  text-align: center;
  font-size: 1.1rem;
}

.lightbox-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
  transition: transform 0.3s ease;
}
.lightbox-close:hover {
  transform: scale(1.2);
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.4s ease;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
