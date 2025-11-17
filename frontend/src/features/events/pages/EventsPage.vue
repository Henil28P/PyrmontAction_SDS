<template>
  <div class="events-page">
    <div class="events-hero">
      <div class="hero-text-block">
        <h1 class="hero-title">Upcoming Events</h1>
      </div>
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

.events-page {
  min-height: calc(100vh - 85px);
  background: #f8fafc;
  padding-top: 85px;
}

.events-hero {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  margin-bottom: 3rem;
  background-color: #06b6d4; /* cyan */
}

.events-hero::before {
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

.events-hero::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(6, 182, 212, 0.3), rgba(6, 182, 212, 0.2)),
              radial-gradient(circle at center, rgba(255, 255, 255, 0.08), transparent 80%);
  pointer-events: none;
  z-index: 2;
  transition: background 0.5s ease-out;
}

.hero-text-block {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 40%;
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.9), rgba(8, 145, 178, 0.9));
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

.hero-title {
  font-family: 'League Spartan', sans-serif;
  font-size: 3.5rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.1;
  letter-spacing: 1.5px;
  color: #fff;
  text-shadow: 3px 3px 8px rgba(0, 70, 90, 0.4);
  animation: fadeIn 1.2s ease-out 0.6s backwards;
  transition: transform 0.4s ease-out;
}

.events-hero:hover::before {
  transform: scale(1.03);
}

.events-hero:hover::after {
  background: linear-gradient(rgba(6, 182, 212, 0.2), rgba(6, 182, 212, 0.1)),
              radial-gradient(circle at center, rgba(255, 255, 255, 0.1), transparent 85%);
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
  border-color: #06b6d4;
}

.filter-select:focus {
  outline: none;
  border-color: #06b6d4;
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
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

@media (max-width: 992px) {
  .hero-text-block {
    width: 45%;
    padding: 0 1.5rem 0 2.5rem;
  }
  .hero-title {
    font-size: 3rem;
  }
}

@media (max-width: 768px) {
  .events-hero {
    height: 250px;
  }
  .hero-text-block {
    width: 55%;
    clip-path: polygon(0 0, 100% 0, 80% 100%, 0 100%);
    padding: 0 1.5rem 0 2rem;
  }
  .hero-title {
    font-size: 2.5rem;
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

@media (max-width: 480px) {
  .events-hero {
    height: 200px;
  }
  .hero-text-block {
    width: 70%;
    clip-path: polygon(0 0, 100% 0, 75% 100%, 0 100%);
    padding: 0 1rem 0 1.5rem;
    backdrop-filter: blur(2px);
  }
  .hero-title {
    font-size: 2rem;
    letter-spacing: 1px;
  }
}
</style>
