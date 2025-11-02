<template>
    <div class="events-wrapper">
        <div class="events-header">
            <h2 class="main-title">Events Management</h2>
            <p class="subtitle">Create and manage your community events</p>
        </div>

        <div class="tabs-container">
            <button 
                @click="currentTab = 'upcoming'" 
                :class="['tab-button', { active: currentTab === 'upcoming' }]"
            >
                <span class="tab-text">Upcoming</span>
            </button>
            <button 
                @click="currentTab = 'completed'" 
                :class="['tab-button', { active: currentTab === 'completed' }]"
            >
                <span class="tab-text">Completed</span>
            </button>
        </div>

        <div class="tab-content">
            <UpcomingEvents
                v-if="currentTab === 'upcoming'"
            />
            <CompletedEvents 
                v-else
            />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import CompletedEvents from '../components/Events/EventsCompletedAdmin.vue';
import UpcomingEvents from '../components/Events/EventsUpcomingAdmin.vue';

const currentTab = ref('upcoming');

</script>


<style scoped>
.events-wrapper {
    background: white;
    border-radius: 0;
    border: none;
    box-shadow: none;
    padding: 0;
    margin: 0;
}

.events-header {
    padding: 24px 24px 20px;
    border-bottom: 1px solid #f3f4f6;
}

.main-title {
    font-size: 24px;
    font-weight: 700;
    color: #111827;
    margin: 0;
}

.subtitle {
    margin: 6px 0 0 0;
    color: #6b7280;
    font-size: 14px;
}

.tabs-container {
    display: flex;
    gap: 0;
    background: #f9fafb;
    padding: 0 24px;
    border-bottom: 2px solid #e5e7eb;
}

.tab-button {
    background: transparent;
    border: none;
    padding: 14px 20px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    color: #6b7280;
    border-bottom: 3px solid transparent;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: -2px;
}

.tab-button:hover {
    color: #111827;
    background: rgba(0, 0, 0, 0.02);
}

.tab-button.active {
    color: #059669;
    border-bottom-color: #059669;
    background: white;
}

.tab-text {
    font-size: 14px;
}

.tab-badge {
    background: #e5e7eb;
    color: #374151;
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 700;
}

.tab-button.active .tab-badge {
    background: #d1fae5;
    color: #065f46;
}

.tab-content {
    padding: 24px;
    min-height: 400px;
}
</style>