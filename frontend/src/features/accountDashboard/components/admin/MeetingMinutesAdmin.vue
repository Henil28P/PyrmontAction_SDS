<template>
  <div class="card">
    <div class="header">
      <h4><strong>Meeting Minutes</strong></h4>
      <button @click="addMeetingModal = true" class="create-btn">+ Upload Meeting Minutes</button>
    </div>

    <!-- List -->
    <div class="events-table-container">
      <table>
        <thead>
          <tr>
            <th style="width: 10%;">Date</th>
            <th style="width: 20%;">Title</th>
            <th style="width: 10%; text-align: center;">Status</th>
            <th style="width: 25%;">Note</th>
            <th style="width: 12%;">Files</th>
            <th style="width: 23%; text-align: center;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="meeting in meetingList" :key="meeting._id">
            <td class="date-cell">{{ formatDate(meeting.createdAt) }}</td>
            <td class="title-cell">{{ meeting.title }}</td>
            <td class="status-cell">
              <span class="badge" :class="meeting.status === 'published' ? 'badge-pub' : 'badge-draft'">
                {{ meeting.status === 'published' ? 'Published' : 'Draft' }}
              </span>
            </td>
            <td class="note-cell">{{ meeting.note }}</td>
            <td class="file-cell">
              <template v-if="meeting.filename">
                <span class="fileBadge">{{shortName(meeting.filename)}}</span>
              </template>
              <span v-else class="muted">—</span>
            </td>
            <td class="action-cell">
              <button class="publish-btn action-btn" @click="publishItem(meeting)" v-if="meeting.status === 'draft'">Publish</button>
              <button class="edit-btn action-btn" @click="selectedMeeting = meeting">Edit</button>
              <button class="delete-btn" @click="deleteItem(meeting._id)">Delete</button>
            </td>
          </tr>
          <tr v-if="!meetingList.length">
            <td colspan="6" class="muted">No minutes yet.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit Modal -->
    <AddMeeting 
      v-if="addMeetingModal"
      @addMeeting="addNewMeeting" 
      @close="addMeetingModal = false"
    />

    <EditMeeting 
      v-if="selectedMeeting"
      :meeting="selectedMeeting" 
      @updateMeetingMinute="updateMeetingList" 
      @close="selectedMeeting = null" 
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../../../../stores/authStore'
import services from '../../dashboardServices';
import AddMeeting from './MeetingMinutesAdd.vue';
import EditMeeting from './MeetingMinutesEdit.vue';
import { formatDate } from '../../../../utils/dateUtils';


const meetingList = ref([])
const selectedMeeting = ref(null)
const addMeetingModal = ref(false)

async function loadMeetingMinutes() {
  try {
    const meetings = await services.getAllMeetingMinutes(useUserStore().getToken);
    meetingList.value = meetings;
  } catch (error) {
    console.error('Failed to load meetings:', error);
  }
}

onMounted(() => {
  loadMeetingMinutes();
});

async function publishItem(meeting) {
  try {
    if (!meeting || !meeting._id) {
      throw new Error('Meeting ID is required');
    }

    await services.publishMeetingMinute(useUserStore().getToken, meeting._id, {status: 'published'});

    const index = meetingList.value.findIndex(m => m._id === meeting._id);
    if (index !== -1) {
      meetingList.value[index].status = 'published';
    }
  } catch (error) {
    console.error('Failed to publish meeting:', error);
  }
}

function addNewMeeting(newMeeting) {
  meetingList.value.unshift(newMeeting);
}

// Returns Updated Meeting after Edit Page
// Takes ID and update meeting list
function updateMeetingList(updatedMeeting) {
  const index = meetingList.value.findIndex(m => m._id === updatedMeeting._id);
  if (index !== -1) {
    meetingList.value[index] = { ...meetingList.value[index], ...updatedMeeting };
  }
}

async function deleteItem(id) {
  try {
    if (confirm('Are you sure you want to delete this meeting minute?')) {
      await services.deleteMeetingMinute(useUserStore().getToken, id);
      meetingList.value = meetingList.value.filter(m => m._id !== id);
    }
  } catch (error) {
    console.error('Failed to delete meeting:', error);
  }
}

function shortName(name) { return name.length > 18 ? name.slice(0, 16) + '…' : name }

</script>

<style scoped>
.card {
    padding: 24px;
    background: white;
    border-radius: 8px;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
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
}

.events-table-container {
    overflow-x: auto;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
}

table {
    width: 100%;
    border-collapse: collapse;
}

table thead {
    background: #f9fafb;
}

table th {
    padding: 12px 16px;
    text-align: left;
    font-weight: 600;
    color: #374151;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid #e5e7eb;
}

table tbody tr {
    transition: background 0.2s ease;
    background: white;
}

table tbody tr:hover {
    background: #f9fafb;
}

table td {
    padding: 14px 16px;
    border-bottom: 1px solid #f3f4f6;
    font-size: 14px;
}

.date-cell {
    white-space: nowrap;
    font-weight: 600;
    color: #111827;
}

.title-cell {
    font-weight: 600;
    color: #111827;
}

.status-cell {
    text-align: center;
    white-space: nowrap;
}

.note-cell {
    color: #6b7280;
}

.file-cell {
    white-space: nowrap;
}

.action-cell {
    text-align: center;
    white-space: nowrap;
}

.action-cell button {
    margin: 0 3px;
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
    border: none;
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.delete-btn:hover {
    background: #dc2626;
}

.muted {
    color: #6b7280;
    text-align: center;
}

.fileBadge {
    display: inline-block;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    border-radius: 999px;
    padding: 2px 8px;
    margin-right: 6px;
    font-size: 12px;
}

.badge {
    display: inline-block;
    border-radius: 12px;
    padding: 4px 12px;
    font-size: 12px;
    font-weight: 600;
}

.badge-draft {
    background: #fef3c7;
    color: #92400e;
}

.badge-pub {
    background: #d1fae5;
    color: #065f46;
}
</style>
