<template>
  <div class="card">
    <h2 class="title">Meeting Minutes</h2>
    <button @click="addMeetingModal = true">Upload New Meeting Minutes</button>
    <hr class="divider" />

    <!-- List -->
    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th style="width:120px;">Date</th>
            <th>Title</th>
            <th style="width:120px;">Status</th>
            <th style="width:140px;">Note</th>
            <th style="width:160px;">Files</th>
            <th style="width:160px;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="meeting in meetingList" :key="meeting._id">
            <td>{{ formatDate(meeting.createdAt) }}</td>
            <td>{{ meeting.title }}</td>
            <td>
              <span class="badge" :class="meeting.status === 'published' ? 'badge-pub' : 'badge-draft'">
                {{ meeting.status === 'published' ? 'Published' : 'Draft' }}
              </span>
            </td>
            <td>{{ meeting.note }}</td>
            <td>
              <template v-if="meeting.filename">
                <span class="fileBadge">{{shortName(meeting.filename)}}</span>
              </template>
              <span v-else class="muted">—</span>
            </td>
            <td class="actionsCell">
              <button class="btn sm" @click="publishItem(meeting)" v-if="meeting.status === 'draft'">Publish</button>
              <button class="btn sm" @click="selectedMeeting = meeting">Edit</button>
              <button class="btn sm danger" @click="deleteItem(meeting._id)">Delete</button>
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
.card{padding:16px;border:1px solid #e5e7eb;border-radius:12px;background:#fff}
.title{margin:0 0 12px 0;font-size:20px;font-weight:600}
.btn{border:1px solid #e5e7eb;background:#fff;padding:8px 12px;border-radius:10px;cursor:pointer}
.btn.sm{padding:6px 10px}
.btn.primary{background:#111;color:#fff;border-color:#111}
.btn.danger{border-color:#ef4444;color:#ef4444}
.muted{color:#6b7280}
.divider{border:0;border-top:1px solid #f0f0f0;margin:12px 0}
.table-wrap{overflow-x:auto}
.table{width:100%;border-collapse:collapse;font-size:14px}
.table th,.table td{padding:10px 12px;border-top:1px solid #f3f4f6;text-align:left;vertical-align:top}
.fileBadge{display:inline-block;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:999px;padding:2px 8px;margin-right:6px;font-size:12px}
.badge{display:inline-block;border-radius:999px;padding:2px 8px;font-size:12px;border:1px solid #e5e7eb}
.badge-draft{background:#fff7ed;color:#9a3412;border-color:#fed7aa}
.badge-pub{background:#ecfeff;color:#155e75;border-color:#a5f3fc}
.actionsCell{display:flex;gap:6px}
</style>
