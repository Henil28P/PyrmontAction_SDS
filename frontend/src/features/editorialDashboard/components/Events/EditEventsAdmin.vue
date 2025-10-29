<template>
    <div class="modal">
        <div class="modal-content">
            <h2>Edit Event</h2>
            <label>Event Title:
                <input v-model="editForm.title" type="text" :placeholder="'Enter event title'" required/>
            </label>
            <label>Date:
                <input v-model="editForm.date" type="date" :min="today()" required/>
            </label>
            <label>Start Time:
                <input v-model="editForm.startTime" type="time" />
            </label>
            <label>End Time:
                <input v-model="editForm.endTime" type="time" :disabled="!editForm.startTime" required/>
            </label>
            <label>Location:
                <input v-model="editForm.location" type="text" placeholder="Enter event location" required/>
            </label>
            <label>Description:
                <textarea v-model="editForm.description" placeholder="Enter event description" required></textarea>
            </label>
            <label>Current Image:
                <input v-model="editForm.imageName" type="text" disabled/>
            </label>
            <div>
                <label>Change Image:
                    <input type="file" accept="image/*" @change="chooseFile" ref="fileInput"/>
                </label>
                <button v-if="editForm.newImage" @click="closeFile">Close</button>
            </div>
            <div v-if="fileError" class="error-message">{{ fileError }}</div>
            <div>
                <button @click="editEvent">Save</button>
                <button @click="$emit('close')">Cancel</button>
            </div>
        </div>
    </div>  
</template>

<script setup>
    import { ref } from 'vue';
    import { today, getLocalDate, getLocalTime, validTimes, dateTimeStr } from '../../../../utils/dateUtils';
    import { useUserStore } from '../../../../stores/authStore';
    import services from '../../editorialServices';
    // Props
    const props = defineProps({
    eventData: {
        type: Object,
        required: true
    }
    });

    const emits = defineEmits(['editEvent', 'close']);
    const fileInput = ref(null);
    const editForm = ref({ 
        ...props.eventData,
        date: getLocalDate(props.eventData.startDate),
        startTime: getLocalTime(props.eventData.startDate),
        endTime: getLocalTime(props.eventData.endDate),
        newImage: '',
    });
    const fileError = ref('');

    function chooseFile() {
        fileError.value = '';
        const file = fileInput.value.files[0];
        if(!file) {
            editForm.value.newImage = '';
            return;
        }
        if (file.name === props.eventData.imageName) {
            fileError.value = 'The selected file is the same as the existing uploaded file.';
            fileInput.value.value = '';
            return;
        }
        editForm.value.newImage = file.name;
    }

    function closeFile() {
        console.log('closeFile:', fileInput.value.value);
        fileInput.value.value = '';
        editForm.value.newImage = '';
    }

    function getImagePath(imageName) {
        // Adjust this path based on your backend image serving endpoint
        return `/uploads/events/${imageName}`;
    }

    async function editEvent() {
        try {
            if (!validTimes(editForm.value.startTime, editForm.value.endTime)) {
                alert('End time must be after start time.');
                return;
            }
            const startDate = dateTimeStr(editForm.value.date, editForm.value.startTime);
            const endDate = dateTimeStr(editForm.value.date, editForm.value.endTime);
            const formData = new FormData();
            formData.append('title', editForm.value.title);
            formData.append('description', editForm.value.description);
            formData.append('location', editForm.value.location);
            formData.append('startDate', startDate);
            formData.append('endDate', endDate);

            if (fileInput.value.files[0]) {
                formData.append('file', fileInput.value.files[0]);
            }

            const response = await services.updateEvent(useUserStore().token, props.eventData._id, formData);
            emits('editEvent', response);
            emits('close');
        } catch (error) {
            console.error('Failed to edit event:', error);
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