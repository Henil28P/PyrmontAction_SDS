<template>
    <div class="modal">
        <div class="modal-content">
            <h2>Add New Event</h2>
            <label>Event Title:
                <input v-model="eventForm.title" type="text" :placeholder="'Enter event title'" required/>
            </label>
            <label>Date:
                <input v-model="eventForm.date" type="date" :min="today()" required/>
            </label>
            <label>Start Time:
                <input v-model="eventForm.startTime" type="time" />
            </label>
            <label>End Time:
                <input v-model="eventForm.endTime" type="time" :disabled="!eventForm.startTime" required/>
            </label>
            <label>Location:
                <input v-model="eventForm.location" type="text" placeholder="Enter event location" required/>
            </label>
            <label>Description:
                <textarea v-model="eventForm.description" placeholder="Enter event description" required></textarea>
            </label>
            <label>Attach Image:
                <input type="file" accept="image/*" @change="chooseFile" ref="fileInput" required />
            </label>
            <div>
                <button @click="addEvent('draft')">Draft</button>
                <button @click="addEvent('publish')">Publish</button>
                <button @click="$emit('close')">Cancel</button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed, watch } from 'vue';
    import { useUserStore } from '../../../../stores/authStore';
    import services from '../../editorialServices';
    import { validTimes, dateTimeStr, today } from '../../../../utils/dateUtils';

    function chooseFile() {
    const file = fileInput.value.files[0];
    eventForm.value.imageName = file.name;
    console.log('File selected:', file);
    }

    const emits = defineEmits(['addEvent', 'close']);
    const fileInput = ref(null);
    const eventForm = ref({
        _id: null,
        title: '',
        description: '',
        location: '',
        date: today(),
        startTime: '',
        endTime: '',
        imageName: '',
    });

    async function addEvent(status) {
        try {
            if (!validTimes(eventForm.value.startTime, eventForm.value.endTime)) {
                alert('End time must be after start time.');
                return;
            }
            const startDate = dateTimeStr(eventForm.value.date, eventForm.value.startTime);
            const endDate = dateTimeStr(eventForm.value.date, eventForm.value.endTime);
            const formData = new FormData();
            formData.append('title', eventForm.value.title);
            formData.append('description', eventForm.value.description);
            formData.append('location', eventForm.value.location);
            formData.append('startDate', startDate);
            formData.append('endDate', endDate);
            formData.append('status', status);

            if (fileInput.value.files[0]) {
                formData.append('file', fileInput.value.files[0]);
            } else {
                alert('Please select an image file.');
                return;
            }

            const response = await services.createEvent(useUserStore().token, formData);
            emits('addEvent', response);
            emits('close');
        } catch (error) {
            console.error('Failed to add event:', error);
        }
    }
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