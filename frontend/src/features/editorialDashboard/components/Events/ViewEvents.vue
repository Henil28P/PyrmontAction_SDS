<template>
    <div v-if="showViewModal" class="modal">
        <div class="modal-content">
            <h3>Event Details</h3>
            
            <div class="event-image" v-if="event.imageName">
                <img :src="getImageUrl(event)" :alt="event.title" />
            </div>

            <div class="details-grid">
                <div class="detail-item">
                    <label class="lbl">Event Title</label>
                    <span class="value">{{ event.title }}</span>
                </div>
                
                <div class="detail-item">
                    <label class="lbl">Date</label>
                    <span class="value">{{ formatDate(event.startDate) }}</span>
                </div>
                
                <div class="detail-item">
                    <label class="lbl">Time</label>
                    <span class="value">{{ timeRange(event.startDate, event.endDate) }}</span>
                </div>
                
                <div class="detail-item">
                    <label class="lbl">Location</label>
                    <span class="value">{{ event.location }}</span>
                </div>
                
                <div class="detail-item full-width">
                    <label class="lbl">Description</label>
                    <span class="value description">{{ event.description }}</span>
                </div>
            </div>
            
            <div class="actions">
                <button class="btn primary" @click="$emit('close')">Close</button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed, watch } from 'vue';
    import { formatDate, timeRange } from '../../../../utils/dateUtils';
    import SERVER_URL from '../../../../config';

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

    function getImageUrl(event) {
        return `${SERVER_URL}${event.imageUrl}`;
    }
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
  animation: fadeIn 0.3s ease;
  backdrop-filter: blur(2px);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  padding: 32px;
  border-radius: 12px;
  width: 640px;
  max-width: 92vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { 
    opacity: 0; 
    transform: translateY(30px) scale(0.95); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
  }
}

h3 {
  margin: 0 0 24px 0;
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  border-bottom: 3px solid #10b981;
  padding-bottom: 12px;
}

.event-image {
  width: 100%;
  margin-bottom: 24px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.event-image img {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
  display: block;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.lbl {
  font-size: 12px;
  color: #6b7280;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.value {
  font-size: 15px;
  color: #111827;
  line-height: 1.5;
  font-weight: 500;
}

.value.description {
  line-height: 1.7;
  white-space: pre-wrap;
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
  border-left: 3px solid #10b981;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 28px;
  padding-top: 24px;
  border-top: 2px solid #e5e7eb;
}

.btn {
  border: 1px solid #d1d5db;
  background: white;
  padding: 12px 28px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn:hover {
  background: #f9fafb;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn.primary {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.btn.primary:hover {
  background: #059669;
  border-color: #059669;
}

/* Scrollbar styling */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

@media (max-width: 768px) {
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    padding: 24px;
  }
  
  h3 {
    font-size: 20px;
  }
}
</style>