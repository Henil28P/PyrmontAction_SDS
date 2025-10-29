<template>
  <div v-if="show" class="modal" @click.self="$emit('close')">
    <div class="modal-card">
      <button class="close-btn" @click="$emit('close')" aria-label="Close">×</button>
      
      <div class="event-details">
        <div class="event-header">
          <h2 class="event-title">{{ event.title }}</h2>
          <div class="event-datetime">
            <span class="date">{{ formattedDate }}</span>
            <span class="time">{{ formattedTime }}</span>
          </div>
        </div>

        <div class="event-content">
          <div class="event-info">
            <div v-if="event.location" class="info-item">
              <span class="info-icon">📍</span>
              <div>
                <strong>Location</strong>
                <p>{{ event.location }}</p>
              </div>
            </div>

            <div class="info-item">
              <span class="info-icon">📝</span>
              <div>
                <strong>Description</strong>
                <p>{{ event.description }}</p>
              </div>
            </div>
          </div>

          <div v-if="event.imageName" class="event-image">
            <img :src="getImagePath(event.imageName)" :alt="event.title" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

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

function getImagePath(imageName) {
  return `http://localhost:5000/uploads/events/${imageName}`;
}

const formattedDate = computed(() => {
  if (!props.event?.startDate) return ''
  const d = new Date(props.event.startDate)
  return d.toLocaleDateString(undefined, { 
    weekday: 'long',
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  })
})

const formattedTime = computed(() => {
  if (!props.event?.startDate || !props.event?.endDate) return ''
  const start = new Date(props.event.startDate)
  const end = new Date(props.event.endDate)
  const startTime = start.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  const endTime = end.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  return `${startTime} - ${endTime}`
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
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #fff;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  color: #64748b;
}

.close-btn:hover {
  background: #f1f5f9;
  color: #1e293b;
  transform: scale(1.1);
}

.event-details {
  padding: 40px;
}

.event-header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid #f1f5f9;
}

.event-title {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
  line-height: 1.2;
}

.event-datetime {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.date,
.time {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 8px;
  background: #fef9f0;
  color: #EBBD6D;
}

.event-content {
  display: grid;
  gap: 32px;
}

.event-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-item {
  display: flex;
  gap: 16px;
}

.info-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.info-item strong {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.info-item p {
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
  color: #1e293b;
}

.event-image {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
}

.event-image img {
  width: 100%;
  height: auto;
  display: block;
}

@media (max-width: 768px) {
  .event-details {
    padding: 24px;
  }

  .event-title {
    font-size: 24px;
  }

  .close-btn {
    top: 12px;
    right: 12px;
  }
}
</style>
