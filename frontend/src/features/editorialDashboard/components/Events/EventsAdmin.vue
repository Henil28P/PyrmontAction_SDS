<template>
    <div>
        <div>
            <button @click="currentTab = 'upcoming'">Upcoming</button>
            <button @click="currentTab = 'completed'">Completed</button>
        </div>
        <div v-if="currentTab === 'upcoming'">
            <UpcomingEvents
                :upcoming="upcomingList"
                @updateList="updateUpcomingList"
            />
        </div>
        <div v-if="currentTab === 'completed'">
            <CompletedEvents 
                :completed="completedList"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';
import CompletedEvents from './EventsCompletedAdmin.vue';
import UpcomingEvents from './EventsUpcomingAdmin.vue';

const props = defineProps({
  eventsData: {
    type: Object,
    required: true,
  }
});

const emits = defineEmits(['eventsUpdated']);
const upcomingList = ref([]);
const completedList = ref([]);
const currentTab = ref('upcoming');

watch(() => props.eventsData, (newData) => {
    upcomingList.value = newData.upcoming;
    completedList.value = newData.completed;
    console.log('Received events data:', { upcoming: upcomingList.value, completed: completedList.value });
}, { immediate: true });

onUnmounted(() => {
  upcomingList.value = [];
  completedList.value = [];
});

function updateUpcomingList(updatedEvent) {
    // Event is already added in EventsUpcomingAdmin, just pass it up
    emits('eventsUpdated', { upcoming: upcomingList.value });
}
</script>


<style scoped>
/* Add your styles here */
</style>