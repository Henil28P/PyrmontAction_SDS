<template>
  <article class="event-card" @click="$emit('select', event)">
    <div class="event-card__image-wrapper">
      <img 
        v-if="event.image" 
        :src="event.image" 
        :alt="event.title" 
        class="event-card__image" 
      />
      <div v-else class="event-card__image-placeholder">
        <span>📅</span>
      </div>
    </div>
    
    <div class="event-card__body">
      <div class="event-card__header">
        <h3 class="event-card__title">{{ event.title }}</h3>
        <time class="event-card__time" :datetime="event.date">
          {{ formattedTime }}
        </time>
      </div>
      
      <div class="event-card__meta">
        <span v-if="event.location" class="meta-item">
          <span class="meta-icon">📍</span>
          {{ event.location }}
        </span>
        <span v-if="event.organizer" class="meta-item">
          <span class="meta-icon">👤</span>
          {{ event.organizer }}
        </span>
      </div>

      <p v-if="event.description" class="event-card__desc">
        {{ shortDesc }}
      </p>

      <div class="event-card__footer">
        <span class="event-card__date">{{ formattedDate }}</span>
        <div class="event-card__actions">
          <button 
            class="btn btn--edit" 
            @click.stop="$emit('edit', event)"
            aria-label="Edit event"
          >
            ✏️ Edit
          </button>
          <button 
            class="btn btn--delete" 
            @click.stop="$emit('delete', event.id)"
            aria-label="Delete event"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

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

defineEmits(['select', 'edit', 'delete'])

const formattedDate = computed(() => {
  if (!props.event?.date) return ''
  const d = new Date(props.event.date)
  return d.toLocaleDateString(undefined, { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
})

const formattedTime = computed(() => {
  if (!props.event?.date) return ''
  const d = new Date(props.event.date)
  return d.toLocaleTimeString(undefined, { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
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
  gap: 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.event-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
  border-color: #3b82f6;
}

.event-card__image-wrapper {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
}

.event-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.event-card__image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  font-size: 48px;
}

.event-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.event-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.event-card__title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.4;
  flex: 1;
}

.event-card__time {
  font-size: 13px;
  font-weight: 600;
  color: #3b82f6;
  white-space: nowrap;
  padding: 4px 10px;
  background: #eff6ff;
  border-radius: 6px;
}

.event-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 13px;
  color: #64748b;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-icon {
  font-size: 14px;
}

.event-card__desc {
  margin: 0;
  color: #475569;
  font-size: 14px;
  line-height: 1.6;
}

.event-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 8px;
  border-top: 1px solid #f1f5f9;
}

.event-card__date {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
}

.event-card__actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
}

.btn--edit {
  background: #3b82f6;
  color: #ffffff;
}

.btn--edit:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn--delete {
  background: transparent;
  border: 1px solid #e5e7eb;
  color: #64748b;
}

.btn--delete:hover {
  background: #fee2e2;
  border-color: #fca5a5;
  color: #dc2626;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .event-card {
    flex-direction: column;
  }

  .event-card__image-wrapper {
    width: 100%;
    height: 160px;
  }

  .event-card__header {
    flex-direction: column;
    gap: 8px;
  }

  .event-card__time {
    align-self: flex-start;
  }

  .event-card__footer {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .event-card__actions {
    justify-content: stretch;
  }

  .btn {
    flex: 1;
    justify-content: center;
  }
}
</style>