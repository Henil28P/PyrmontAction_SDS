<template>
    <div class="completed-wrapper">
        <div class="action-header">
            <h3 class="section-title">Completed Events</h3>
            <p class="section-desc">View past event history</p>
        </div>

        <div class="events-table-container">
            <table class="events-table">
                <thead>
                    <tr>
                        <th style="width:140px;">Date</th>
                        <th>Event Title</th>
                        <th>Location</th>
                        <th style="width:140px;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="event in completedEventList" :key="event._id" class="event-row">
                        <td class="date-cell">{{ formatDate(event.startDate) }}</td>
                        <td class="title-cell">{{ event.title }}</td>
                        <td class="location-cell">{{ event.location }}</td>
                        <td>
                            <button @click="selectedEvent = event" class="view-btn">
                                View Details
                            </button>
                        </td>
                    </tr>
                    <tr v-if="!completedEventList.length">
                        <td colspan="4" class="empty-row">
                            <div class="empty-state">
                                <p class="empty-text">No completed events yet</p>
                                <p class="empty-hint">Completed events will appear here</p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <ViewEvents 
            v-if="selectedEvent" 
            :event="selectedEvent" 
            @close="selectedEvent = null"
        />
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import ViewEvents from './ViewEvents.vue';
import { useUserStore } from '../../../../stores/authStore';
import services from '../../editorialServices';
import { formatDate } from '../../../../utils/dateUtils';

const completedEventList = ref([]);
const selectedEvent = ref(null);

async function loadCompletedEvents() {
    try {
        const response = await services.getCompletedEvents(useUserStore().token);
        completedEventList.value = response;
    } catch (error) {
        console.error('Failed to fetch completed events:', error);
    }
}

onMounted(() => {
    loadCompletedEvents();
});

</script>


<style scoped>
.completed-wrapper {
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.action-header {
    margin-bottom: 20px;
}

.section-title {
    font-size: 18px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 4px 0;
}

.section-desc {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
}

.events-table-container {
    overflow-x: auto;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
}

.events-table {
    width: 100%;
    border-collapse: collapse;
}

.events-table thead {
    background: #f9fafb;
}

.events-table th {
    padding: 12px 16px;
    text-align: left;
    font-weight: 600;
    color: #374151;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid #e5e7eb;
}

.events-table tbody tr.event-row {
    transition: background 0.2s ease;
    background: white;
}

.events-table tbody tr.event-row:hover {
    background: #f9fafb;
}

.events-table td {
    padding: 14px 16px;
    border-bottom: 1px solid #f3f4f6;
    font-size: 14px;
}

.date-cell {
    font-weight: 600;
    color: #111827;
}

.title-cell {
    font-weight: 600;
    color: #111827;
}

.location-cell {
    color: #6b7280;
}

.view-btn {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 6px 16px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.view-btn:hover {
    background: #2563eb;
}

.empty-row {
    border: none !important;
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
}

.empty-text {
    font-size: 16px;
    font-weight: 600;
    color: #374151;
    margin: 0 0 6px 0;
}

.empty-hint {
    font-size: 14px;
    color: #9ca3af;
    margin: 0;
}
</style>