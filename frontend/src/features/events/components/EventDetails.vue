<template>
  <div v-if="show" class="modal" @click.self="$emit('close')">
    <div class="modal-card">
      <button class="close-btn" @click="$emit('close')" aria-label="Close">×</button>
      
      <div class="event-details">
        <div class="event-image" v-if="event.imageUrl">
          <img :src="`${SERVER_URL}${event.imageUrl}`" :alt="event.title" />
        </div>

        <div class="event-content">
          <h2 class="event-title">{{ event.title }}</h2>
          
          <div class="event-info">
            <div class="info-item">
              <span class="info-icon">📅</span>
              <div>
                <strong>Date</strong>
                <p>{{ formattedDate }}</p>
              </div>
            </div>

            <div class="info-item">
              <span class="info-icon">🕒</span>
              <div>
                <strong>Time</strong>
                <p>{{ formattedTime }}</p>
              </div>
            </div>

            <div v-if="event.location" class="info-item">
              <span class="info-icon">📍</span>
              <div>
                <strong>Location</strong>
                <p>{{ event.location }}</p>
              </div>
            </div>

            <div class="info-item description">
              <span class="info-icon">📝</span>
              <div>
                <strong>Description</strong>
                <p>{{ event.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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
  show: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['close'])

const formattedDate = computed(() => {
  return formatDate(props.event?.startDate)
})

const formattedTime = computed(() => {
  if (!props.event?.startDate || !props.event?.endDate) return ''
  return timeRange(props.event.startDate, props.event.endDate)
})
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-card {
  background: #fff;
  border-radius: 16px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.2s;
  color: #64748b;
  z-index: 10;
}

.close-btn:hover {
  background: #fff;
  color: #1e293b;
  transform: scale(1.1);
}

.event-details {
  display: flex;
  flex-direction: column;
}

.event-image {
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.event-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.event-content {
  padding: 32px;
}

.event-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 24px 0;
  line-height: 1.2;
}

.event-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.info-item.description {
  margin-top: 8px;
}

.info-icon {
  font-size: 22px;
  flex-shrink: 0;
  margin-top: 2px;
}

.info-item strong {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.info-item p {
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
  color: #1e293b;
}

@media (max-width: 768px) {
  .event-content {
    padding: 24px;
  }

  .event-title {
    font-size: 22px;
  }

  .event-image {
    height: 200px;
  }

  .close-btn {
    top: 12px;
    right: 12px;
  }
}
</style>
