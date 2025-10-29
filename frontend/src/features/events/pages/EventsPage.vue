<template>
  <div class="events-page">
    <div class="events-hero">
      <h1 class="hero-title">Upcoming Events</h1>
      <p class="hero-subtitle">Join us for community gatherings, meetings, and special occasions</p>
    </div>

    <div class="events-container">
      <!-- Filter Section -->
      <div class="events-filters">
        <div class="filter-group">
          <label for="month-filter">Filter by Month:</label>
          <select id="month-filter" v-model="selectedMonth" class="filter-select">
            <option value="">All Months</option>
            <option v-for="month in availableMonths" :key="month.value" :value="month.value">
              {{ month.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Events List -->
      <div v-if="loading" class="loading">
        <p>Loading events...</p>
      </div>

      <div v-else-if="filteredEvents.length === 0" class="empty-state">
        <p>No upcoming events at the moment. Check back soon!</p>
      </div>

      <div v-else class="events-grid">
        <EventCard
          v-for="event in filteredEvents"
          :key="event._id"
          :event="event"
          @select="openEventDetails"
        />
      </div>
    </div>

    <!-- Event Details Modal -->
    <EventDetails
      v-if="selectedEvent"
      :event="selectedEvent"
      :show="showDetails"
      @close="closeEventDetails"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import EventCard from '../components/EventCard.vue'
import EventDetails from '../components/EventDetails.vue'
import eventsService from '../services.js'

const loading = ref(true)
const events = ref([])
const selectedMonth = ref('')
const selectedEvent = ref(null)
const showDetails = ref(false)

async function loadEvents() {
  try {
    loading.value = true
    const response = await eventsService.getPublishedEvents()
    // Sort events by startDate (earliest first)
    events.value = response.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
  } catch (error) {
    console.error('Failed to load events:', error)
    events.value = []
  } finally {
    loading.value = false
  }
}

const availableMonths = computed(() => {
  const months = new Set()
  events.value.forEach(event => {
    const date = new Date(event.startDate)
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    months.add(monthYear)
  })
  
  return Array.from(months).map(monthYear => {
    const [year, month] = monthYear.split('-')
    const date = new Date(year, parseInt(month) - 1)
    return {
      value: monthYear,
      label: date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    }
  }).sort()
})

const filteredEvents = computed(() => {
  if (!selectedMonth.value) {
    return events.value
  }
  
  return events.value.filter(event => {
    const date = new Date(event.startDate)
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    return monthYear === selectedMonth.value
  })
})

function openEventDetails(event) {
  selectedEvent.value = event
  showDetails.value = true
}

function closeEventDetails() {
  showDetails.value = false
  selectedEvent.value = null
}

onMounted(() => {
  loadEvents()
})
</script>

<style scoped>
.events-page {
  min-height: calc(100vh - 85px);
  background: #f8fafc;
  padding-top: 85px;
}

.events-hero {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: #fff;
  padding: 60px 20px;
  text-align: center;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 16px 0;
}

.hero-subtitle {
  font-size: 20px;
  margin: 0;
  opacity: 0.9;
}

.events-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.events-filters {
  margin-bottom: 32px;
  display: flex;
  justify-content: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-group label {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
}

.filter-select {
  padding: 10px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-select:hover {
  border-color: #EBBD6D;
}

.filter-select:focus {
  outline: none;
  border-color: #EBBD6D;
  box-shadow: 0 0 0 3px rgba(235, 189, 109, 0.1);
}

.loading,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
  font-size: 18px;
}

.events-grid {
  display: grid;
  gap: 24px;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 32px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .events-filters {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-select {
    width: 100%;
  }
}
</style>
