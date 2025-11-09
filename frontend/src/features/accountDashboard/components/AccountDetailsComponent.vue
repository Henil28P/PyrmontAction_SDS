<template>
  <div>
    <!-- Account Details -->
    <section class="details">
      <div class="details-head">
        <h4><strong>Account Details</strong></h4>
        <button class="btn-edit" @click="handleEditAccountDetails">Edit</button>
      </div>

      <div class="details-grid">
        <div class="field">
          <label>Email Address</label>
          <div class="field-value">{{ userData?.email }}</div>
        </div>
        <div class="field">
          <label>Password</label>
          <div class="field-value">************************</div>
        </div>
      </div>
    </section>

    <!-- Personal Details -->
    <section class="details">
      <div class="details-head">
        <h4><strong>Personal Details</strong></h4>
        <button class="btn-edit" @click="handleEditPersonalDetails">Edit</button>
      </div>

      <div class="details-grid">
        <div class="field">
          <label>Full Name</label>
          <div class="field-value">{{ userData?.firstName }}</div>
        </div>
        <div class="field">
          <label>Last Name</label>
          <div class="field-value">{{ userData?.lastName}}</div>
        </div>
        <div class="field">
          <label>Phone Number</label>
          <div class="field-value">{{ userData?.mobilePhone }}</div>
        </div>
        <div class="field">
          <label>Address</label>
          <div class="field-value">{{ userData?.streetName + ", " + userData?.city + ", " + userData?.state + ", " + userData?.postcode }}</div>
        </div>
      </div>
    </section>



    <!-- Edit Personal Details Modal -->
    <EditPersonalDetailsModal
      v-if="showEditModal"
      :userData="userData"
      @close="closeEditPersonalDetailsModal"
      @updated="handleUserUpdated"
    />

    <!-- Edit Account Details Modal -->
    <EditAccountDetailsModal
      v-if="showEditAccountDetailsModal"
      :userData="userData"
      @close="closeEditAccountDetailsModal"
      @updated="handleUserUpdated"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import EditPersonalDetailsModal from './EditPersonalDetailsModal.vue';
import EditAccountDetailsModal from './EditAccountDetailsModal.vue';

// Props
const props = defineProps({
  userData: {
    type: Object,
    required: true
  }
});

// Emits
const emit = defineEmits(['userUpdated']);

// Reactive data
const showEditModal = ref(false);
const showEditAccountDetailsModal = ref(false);

// Methods
function handleEditPersonalDetails() {
  showEditModal.value = true;
}

function closeEditPersonalDetailsModal() {
  showEditModal.value = false;
}

function handleEditAccountDetails() {
  showEditAccountDetailsModal.value = true;
}

function closeEditAccountDetailsModal() {
  showEditAccountDetailsModal.value = false;
}

function handleUserUpdated(updatedUserData) {
  emit('userUpdated', updatedUserData);
}
</script>

<style scoped>
/* details card */
.details{
  background:#fff; border:1px solid #e5e7eb; border-radius:16px;
  box-shadow:0 4px 16px rgba(0,0,0,.04); padding:20px; margin-bottom:22px;
}
.details-head{ display:flex; align-items:center; gap:12px; margin-bottom:18px; }
/* .details-head h2{ margin:0; font-size:1.2rem; font-weight:800; flex:1; } */
.btn-edit{
  margin-left:auto; background:#111; color:#fff; border:0; border-radius:8px;
  padding:6px 14px; font-weight:700; cursor:pointer;
}
.btn-edit:hover{ background:#333; }
.details-grid{
  display:grid; grid-template-columns:1fr 1fr; gap:18px;
}
@media(max-width:760px){ .details-grid{ grid-template-columns:1fr; } }
.field label{ display:block; font-size:.85rem; color:#6b7280; margin-bottom:4px; }
.field-value{
  background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px; padding:10px 12px; font-weight:600;
}


/* "View all" button */
.btn-all{
  display:inline-flex; align-items:center; justify-content:center;
  padding:8px 14px; border-radius:10px; font-weight:800; text-decoration:none;
  color:#0ea5b7; background:#e6fbff; border:1px solid #c8f4fb;
}
.btn-all:hover{ filter:brightness(.98); }


</style>