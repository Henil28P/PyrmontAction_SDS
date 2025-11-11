<template>
  <div class="blog-details">
    <!-- Back Button -->
    <button @click="$emit('close')" class="back-button">
      ← Back to Blogs
    </button>

    <!-- Article Container -->
    <article class="article">
      <!-- Blog Title -->
      <h1 class="article__title">{{ blog.title }}</h1>

      <!-- Author & Date Meta -->
      <div class="article__meta">
        <span class="meta-author">{{ blog.author || 'Anonymous' }}</span>
        <span class="meta-separator">·</span>
        <span class="meta-date">{{ formattedDate }}</span>
        <span class="meta-separator">·</span>
        <span class="meta-read-time">{{ readTime }} min read</span>
      </div>

      <!-- Featured Image -->
      <div v-if="blog.imageUrl" class="article__image-wrapper">
        <img 
          :src="`${SERVER_URL}${blog.imageUrl}`" 
          :alt="blog.title"
          class="article__image" 
        />
      </div>

      <!-- Blog Content -->
      <div class="article__content">
        <p class="content-text">{{ blog.content }}</p>
      </div>
    </article>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SERVER_URL from '../../../config.js'

const props = defineProps({
  blog: {
    type: Object,
    required: true,
  },
})

defineEmits(['close'])

const formattedDate = computed(() => {
  if (!props.blog?.createdAt) return ''
  const date = new Date(props.blog.createdAt)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const readTime = computed(() => {
  if (!props.blog?.content) return 1
  const wordsPerMinute = 200
  const words = props.blog.content.split(/\s+/).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
})
</script>

<style scoped>
.blog-details {
  max-width: 680px;
  margin: 0 auto;
  padding: 40px 20px;
  background: #ffffff;
}

.back-button {
  background: transparent;
  border: none;
  padding: 8px 0;
  cursor: pointer;
  font-size: 14px;
  color: #6b6b6b;
  transition: color 0.2s ease;
  margin-bottom: 48px;
  font-weight: 400;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.back-button:hover {
  color: #242424;
}

.article {
  background: #ffffff;
}

.article__title {
  font-size: 40px;
  font-weight: 700;
  color: #242424;
  margin: 0 0 16px 0;
  line-height: 1.2;
  letter-spacing: -0.02em;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.article__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e8e8e8;
  font-size: 14px;
  color: #6b6b6b;
}

.meta-author {
  color: #242424;
  font-weight: 500;
}

.meta-separator {
  color: #d0d0d0;
}

.meta-date,
.meta-read-time {
  color: #6b6b6b;
}

.article__image-wrapper {
  width: 100%;
  margin-bottom: 40px;
  overflow: hidden;
}

.article__image {
  width: 100%;
  height: auto;
  display: block;
}

.article__content {
  margin-bottom: 60px;
}

.content-text {
  font-size: 18px;
  line-height: 1.75;
  color: #242424;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-weight: 400;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .blog-details {
    padding: 24px 16px;
  }

  .back-button {
    margin-bottom: 32px;
  }

  .article__title {
    font-size: 32px;
  }

  .article__meta {
    flex-wrap: wrap;
    font-size: 13px;
  }

  .content-text {
    font-size: 17px;
    line-height: 1.7;
  }
}
</style>
