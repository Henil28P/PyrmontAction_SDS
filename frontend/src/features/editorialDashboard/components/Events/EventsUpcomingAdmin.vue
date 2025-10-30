<template>
    <div class="upcoming-wrapper">
        <div class="action-header">
            <h3 class="section-title">Upcoming Events</h3>
            <button @click="addEventModal = true" class="create-btn">
                + Create Event
            </button>
        </div>

        <div class="events-table-container">
            <table class="events-table">
                <thead>
                    <tr>
                        <th style="width:120px;">Date</th>
                        <th>Event Title</th>
                        <th style="width:120px;">Status</th>
                        <th style="width:180px;">Location</th>
                        <th style="width:150px;">Time</th>
                        <th style="width:280px;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="event in upcomingList" :key="event._id" class="event-row">
                        <td class="date-cell">{{ formatDate(event.startDate) }}</td>
                        <td class="title-cell">{{ event.title }}</td>
                        <td>
                            <span class="status-badge" :class="event.status === 'published' ? 'status-published' : 'status-draft'">
                                {{ event.status === 'published' ? 'Published' : 'Draft' }}
                            </span>
                        </td>
                        <td class="location-cell">{{ event.location }}</td>
                        <td class="time-cell">{{ timeRange(event.startDate, event.endDate) }}</td>
                        <td>
                            <div class="action-buttons">
                                <button 
                                    v-if="event.status !== 'published'" 
                                    @click="handlePublish(event)" 
                                    class="action-btn publish-btn"
                                >
                                    Publish
                                </button>
                                <button 
                                    @click="selectedEvent = event" 
                                    class="action-btn edit-btn"
                                >
                                    Edit
                                </button>
                                <button 
                                    @click="handleDelete(event)" 
                                    class="action-btn delete-btn"
                                >
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="!upcomingList.length">
                        <td colspan="6" class="empty-row">
                            <div class="empty-state">
                                <p class="empty-text">No upcoming events</p>
                                <p class="empty-hint">Click "Create Event" to add your first event</p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <AddEvents 
            v-if="addEventModal"
            @addEvent="addEventToList"
            @close="addEventModal = false"
        />

        <EditEvents
            v-if="selectedEvent"
            :eventData="selectedEvent"
            @editEvent="updateEventfromList"
            @close="selectedEvent = null"
        />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '../../../../stores/authStore';
import services from '../../editorialServices';
import { formatDate, timeRange } from '../../../../utils/dateUtils';
import AddEvents from './AddEventsAdmin.vue';
import EditEvents from './EditEventsAdmin.vue';
import { mount } from '@vue/test-utils';

const upcomingList = ref([]);
const addEventModal = ref(false);
const selectedEvent = ref(null);

async function loadUpcomingEvents() {
    try {
        const response = await services.getUpcomingEvents(useUserStore().token);
        upcomingList.value = response;
    } catch (error) {
        console.error('Failed to fetch upcoming events:', error);
    }
}

onMounted(() => {
    loadUpcomingEvents();
});

async function handlePublish(event) {
    try {
        if (!confirm('Are you sure you want to publish this event?')) {
            return;
        }

        await services.publishEvent(useUserStore().token, event._id);
        
        const index = upcomingList.value.findIndex(m => m._id === event._id);
        if (index !== -1) {
            upcomingList.value[index].status = 'published';
        }
        
    } catch (error) {
        console.error('Failed to publish event:', error);
    }
}

async function handleDelete(event) {
    try {

        if (!confirm('Are you sure you want to delete this event?')) {
            return;
        }
        await services.deleteEvent(useUserStore().token, event._id);
        upcomingList.value = upcomingList.value.filter(m => m._id !== event._id);
    } catch (error) {
        console.error('Failed to delete event:', error);
    }
}

function addEventToList(newEvent) {
    console.log('Updating upcoming events with:', newEvent);
    upcomingList.value.unshift(newEvent);
}

function updateEventfromList(updatedEvent) {
    console.log('Updating upcoming events with:', updatedEvent);
    const index = upcomingList.value.findIndex(event => event._id === updatedEvent._id);
    if (index !== -1) {
        upcomingList.value[index] = updatedEvent;
    }
}
</script>


<style scoped>
.table-wrap {
    overflow-x: auto;
}

.table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
}

.table thead {
    background: #f9fafb;
}

.table th {
    padding: 12px;
    text-align: left;
    font-weight: 600;
    color: #666;
    border-bottom: 2px solid #e5e7eb;
}

.table td {
    padding: 12px;
    border-bottom: 1px solid #e5e7eb;
    color: #333;
}

.table tbody tr:hover {
    background: #f9fafb;
}

.badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}

.badge-open {
    background: #d1fae5;
    color: #065f46;
}

.badge-closed {
    background: #fef3c7;
    color: #92400e;
}

.actionsCell {
    white-space: nowrap;
}

.btn {
    padding: 8px 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #fff;
    color: #333;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
}

.btn:hover {
    background: #f5f5f5;
}

.btn.primary {
    background: #EBBD6D;
    color: #fff;
    border-color: #EBBD6D;
}

.btn.primary:hover {
    background: #d4a962;
    border-color: #d4a962;
}

.btn.sm {
    padding: 6px 12px;
    font-size: 12px;
    margin-right: 4px;
}

.btn.danger {
    background: #fee2e2;
    border-color: #fecaca;
    color: #991b1b;
}

.btn.danger:hover {
    background: #fecaca;
}

.muted {
    color: #999;
    text-align: center;
}

.actions {
    display: flex;
    gap: 8px;
}

/* CLEAN PROFESSIONAL STYLES */
.upcoming-wrapper {
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.action-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.section-title {
    font-size: 18px;
    font-weight: 700;
    color: #111827;
    margin: 0;
}

.create-btn {
    background: #10b981;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.create-btn:hover {
    background: #059669;
    transform: translateY(-1px);
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

.time-cell {
    color: #6b7280;
    font-size: 13px;
}

.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
}

.status-draft {
    background: #fef3c7;
    color: #92400e;
}

.status-published {
    background: #d1fae5;
    color: #065f46;
}

.action-buttons {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.action-btn {
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
}

.publish-btn {
    background: #10b981;
    color: white;
}

.publish-btn:hover {
    background: #059669;
}

.edit-btn {
    background: #3b82f6;
    color: white;
}

.edit-btn:hover {
    background: #2563eb;
}

.delete-btn {
    background: #ef4444;
    color: white;
}

.delete-btn:hover {
    background: #dc2626;
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