<template>
    <div v-if="showViewModal" class="modal">
        <div class="modal-content">
            <h3>Event Details</h3>
            <div class="row">
                <label class="lbl">Title:</label>
                <span>{{ event.title }}</span>
            </div>
            <div class="row">
                <label class="lbl">Date:</label>
                <span>{{ formatDate(event.startDate) }}</span>
            </div>
            <div class="row">
                <label class="lbl">Time:</label>
                <span>{{ timeRange(event.startDate, event.endDate) }}</span>
            </div>
            <div class="row">
                <label class="lbl">Location:</label>
                <span>{{ event.location }}</span>
            </div>
            <div class="row">
                <label class="lbl">Description:</label>
                <span>{{ event.description }}</span>
            </div>
            <div class="row">
                <label class="lbl">Image:</label>
                <span>{{ event.imageName }}</span>
            </div>
            <div class="actions">
                <button class="btn" @click="$emit('close')">Close</button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed, watch } from 'vue';
    import { useUserStore } from '../../../../stores/authStore';
    import services from '../../editorialServices';
    import { formatDate, timeRange } from '../../../../utils/dateUtils';

    const props = defineProps({
        event: {
            type: Object,
            required: false,
        }
    });

    const emits = defineEmits(['close']);

    const showViewModal = computed(() => {
        return !!props.event
    });
</script>



<style scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    min-width: 300px;
}
</style>