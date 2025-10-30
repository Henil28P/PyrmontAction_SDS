<template>
  <article class="event-card" @click="$emit('select', event)">
    <div class="event-card__body">
      <div class="event-card__header">
        <h3 class="event-card__title">{{ event.title }}</h3>
        <span class="event-card__date">{{ formattedDate }}</span>
      </div>
      
      <div class="event-card__meta">
        <span class="meta-item">
          <span class="meta-icon">🕒</span>
          {{ formattedTime }}
        </span>
        <span v-if="event.location" class="meta-item">
          <span class="meta-icon">📍</span>
          {{ event.location }}
        </span>
      </div>

      <p v-if="event.description" class="event-card__desc">
        {{ shortDesc }}
      </p>
    </div>

    <div class="event-card__image-wrapper">
      <img 
        v-if="event.imageUrl" 
        :src="`${SERVER_URL}${event.imageUrl}`" 
        :alt="event.title" 
        class="event-card__image" 
      />
      <div v-else class="event-card__image-placeholder">
        <span>📅</span>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { formatDate, timeRange } from '../../../utils/dateUtils'
import SERVER_URL from '../../../config.js'

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
  descMax: {
    type: Number,
    default: 120,
  },
})

defineEmits(['select'])

const formattedDate = computed(() => {
  return formatDate(props.event?.startDate)
})

const formattedTime = computed(() => {
  if (!props.event?.startDate || !props.event?.endDate) return ''
  return timeRange(props.event.startDate, props.event.endDate)
})

const shortDesc = computed(() => {
  if (!props.event?.description) return ''
  return props.event.description.length > props.descMax
    ? props.event.description.slice(0, props.descMax).trim() + '…'
    : props.event.description
})
</script>

<style scoped>
.event-card {
  display: flex;
  gap: 20px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.event-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
  border-color: #EBBD6D;
}

.event-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.event-card__header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.event-card__title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.3;
}

.event-card__date {
  font-size: 13px;
  font-weight: 600;
  color: #EBBD6D;
}

.event-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 14px;
  color: #64748b;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-icon {
  font-size: 16px;
}

.event-card__desc {
  margin: 0;
  color: #475569;
  font-size: 14px;
  line-height: 1.6;
}

.event-card__image-wrapper {
  flex-shrink: 0;
  width: 200px;
  height: 150px;
  overflow: hidden;
  border-radius: 8px;
}

.event-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.event-card__image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #EBBD6D 0%, #d4a962 100%);
  font-size: 48px;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .event-card {
    flex-direction: column;
  }

  .event-card__image-wrapper {
    width: 100%;
    height: 200px;
    order: -1;
  }
}
</style>
