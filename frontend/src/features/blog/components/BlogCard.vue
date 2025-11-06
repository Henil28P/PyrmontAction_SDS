<template>
  <article class="blog-card" @click="$emit('select', blog)">
    <div class="blog-card__image-wrapper">
      <img 
        v-if="blog.imageUrl" 
        :src="`${SERVER_URL}${blog.imageUrl}`" 
        :alt="blog.title" 
        class="blog-card__image" 
      />
      <div v-else class="blog-card__image-placeholder">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M21 15L16 10L5 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
    
    <div class="blog-card__content">
      <div class="blog-card__meta">
        <span class="blog-card__author">{{ blog.author || 'Anonymous' }}</span>
        <span class="blog-card__separator">·</span>
        <span class="blog-card__date">{{ formattedDate }}</span>
      </div>
      
      <h2 class="blog-card__title">{{ blog.title }}</h2>
      
      <p class="blog-card__excerpt">{{ shortContent }}</p>
      
      <div class="blog-card__footer">
        <span class="blog-card__read-time">{{ readTime }} min read</span>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import SERVER_URL from '../../../config.js'

const props = defineProps({
  blog: {
    type: Object,
    required: true,
  },
  contentMax: {
    type: Number,
    default: 150,
  },
})

defineEmits(['select'])

const formattedDate = computed(() => {
  if (!props.blog?.createdAt) return ''
  const date = new Date(props.blog.createdAt)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
})

const shortContent = computed(() => {
  if (!props.blog?.content) return ''
  return props.blog.content.length > props.contentMax
    ? props.blog.content.slice(0, props.contentMax).trim() + '…'
    : props.blog.content
})

const readTime = computed(() => {
  if (!props.blog?.content) return 1
  const wordsPerMinute = 200
  const words = props.blog.content.split(/\s+/).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
})
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.blog-card {
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  height: 100%;
  opacity: 0;
  transform: translateY(20px) scale(0.98);
  animation: fadeInUp 0.6s ease-out forwards;
  animation-delay: calc(var(--animation-order) * 0.1s);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.blog-card:hover {
  border-color: #EBBD6D;
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
}

.blog-card__image-wrapper {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f5f5f5;
  position: relative;
  flex-shrink: 0;
}

.blog-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), filter 0.4s ease;
}

.blog-card:hover .blog-card__image {
  transform: scale(1.1);
  filter: brightness(0.95) saturate(1.1);
}

.blog-card__image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.9);
  background: linear-gradient(135deg, #EBBD6D 0%, #D08927 100%);
  transition: transform 0.4s ease;
}

.blog-card:hover .blog-card__image-placeholder {
  transform: scale(1.05);
}

.blog-card__content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-grow: 1;
}

.blog-card__meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6b6b6b;
}

.blog-card__author {
  font-weight: 500;
  color: #242424;
}

.blog-card__separator {
  color: #d0d0d0;
}

.blog-card__date {
  color: #6b6b6b;
}

.blog-card__title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #242424;
  line-height: 1.3;
  letter-spacing: -0.01em;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blog-card:hover .blog-card__title {
  color: #000000;
}

.blog-card__excerpt {
  margin: 0;
  color: #6b6b6b;
  font-size: 15px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blog-card__footer {
  margin-top: auto;
  padding-top: 12px;
}

.blog-card__read-time {
  font-size: 13px;
  color: #6b6b6b;
}

@media (max-width: 640px) {
  .blog-card__image-wrapper {
    height: 180px;
  }

  .blog-card__content {
    padding: 16px;
  }

  .blog-card__title {
    font-size: 18px;
  }

  .blog-card__excerpt {
    font-size: 14px;
  }
}
</style>
