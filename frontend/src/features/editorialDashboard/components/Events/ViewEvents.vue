<template>
    <div v-if="showViewModal" class="modal">
        <div class="modal-content">
            <h3>Event Details</h3>
            
            <div class="row">
                <label class="lbl">Title</label>
                <span class="value">{{ event.title }}</span>
            </div>
            
            <div class="row">
                <label class="lbl">Date</label>
                <span class="value">{{ formatDate(event.startDate) }}</span>
            </div>
            
            <div class="row">
                <label class="lbl">Time</label>
                <span class="value">{{ timeRange(event.startDate, event.endDate) }}</span>
            </div>
            
            <div class="row">
                <label class="lbl">Location</label>
                <span class="value">{{ event.location }}</span>
            </div>
            
            <div class="row">
                <label class="lbl">Description</label>
                <span class="value">{{ event.description }}</span>
            </div>
            
            <div class="row">
                <label class="lbl">Image</label>
                <span class="value">{{ event.imageName }}</span>
            </div>
            
            <div class="actions">
                <button class="btn" @click="$emit('close')">Close</button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed, watch } from 'vue';
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
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  padding: 28px;
  border-radius: 8px;
  width: 560px;
  max-width: 92vw;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.2s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

h3 {
  margin: 0 0 24px 0;
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.row {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 10px 14px;
  align-items: start;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.row:last-of-type {
  border-bottom: none;
}

.lbl {
  font-size: 13px;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.value {
  font-size: 14px;
  color: #111827;
  line-height: 1.6;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.btn {
  border: 1px solid #d1d5db;
  background: white;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn:hover {
  background: #f9fafb;
}
</style>