<template>
  <div class="modal-overlay">
    <div class="modal-content" @click.stop>
      <!-- Modal Header -->
      <div class="modal-header">
        <h2>Edit Personal Details</h2>
        <button class="close-btn" @click="closeModal">&times;</button>
      </div>

      <!-- Modal Body -->
      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-grid">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input
              id="firstName"
              v-model="formData.firstName"
              type="text"
              required
              class="form-input"
              :class="{'error-border': v$.firstName.$errors.length > 0}"
            />
            <span v-for="error in v$.firstName.$errors" :key="error.$uid" class="error-message">
              {{ error.$message }}
            </span>
          </div>

          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input
              id="lastName"
              v-model="formData.lastName"
              type="text"
              required
              class="form-input"
              :class="{'error-border': v$.lastName.$errors.length > 0}"
            />
            <span v-for="error in v$.lastName.$errors" :key="error.$uid" class="error-message">
              {{ error.$message }}
            </span>
          </div>

          <div class="form-group">
            <label for="mobilePhone">Phone Number</label>
            <input
              id="mobilePhone"
              v-model="formData.mobilePhone"
              type="tel"
              class="form-input"
              :class="{'error-border': v$.mobilePhone.$errors.length > 0}"
              placeholder="04XXXXXXXX"
            />
            <span v-for="error in v$.mobilePhone.$errors" :key="error.$uid" class="error-message">
              {{ error.$message }}
            </span>
          </div>

          <div class="form-group full-width">
            <label for="streetName">Street Name</label>
            <input
              id="streetName"
              v-model="formData.streetName"
              type="text"
              class="form-input"
              :class="{'error-border': v$.streetName.$errors.length > 0}"
            />
            <span v-for="error in v$.streetName.$errors" :key="error.$uid" class="error-message">
              {{ error.$message }}
            </span>
          </div>

          <div class="form-group">
            <label for="city">City</label>
            <input
              id="city"
              v-model="formData.city"
              type="text"
              class="form-input"
              :class="{'error-border': v$.city.$errors.length > 0}"
            />
            <span v-for="error in v$.city.$errors" :key="error.$uid" class="error-message">
              {{ error.$message }}
            </span>
          </div>

          <div class="form-group">
            <label for="state">State</label>
            <select
              id="state"
              v-model="stateChosen"
              class="form-input"
              :class="v$.state.$errors.length > 0 ? 'error-border' : 'input-valid'"
            >
              <option 
                v-for="state in stateOptions" 
                :key="state.value"
                :value="state.value" 
                :disabled="state.placeholder" 
                :hidden="state.placeholder"
              >
                {{ state.text }}
              </option>
            </select>
            <span v-for="error in v$.state.$errors" :key="error.$uid" class="error-message">
              {{ error.$message }}
            </span>
          </div>

          <div class="form-group">
            <label for="postcode">Postal Code</label>
            <input
              id="postcode"
              v-model="formData.postcode"
              type="text"
              class="form-input"
              :class="{'error-border': v$.postcode.$errors.length > 0}"
              placeholder="4 digits"
            />
            <span v-for="error in v$.postcode.$errors" :key="error.$uid" class="error-message">
              {{ error.$message }}
            </span>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button type="button" class="btn-cancel" @click="closeModal">
            Cancel
          </button>
          <button type="submit" class="btn-submit" :disabled="isLoading">
            {{ isLoading ? 'Updating...' : 'Update Details' }}
          </button>
        </div>
      </form>

      <!-- API Error Message -->
      <div v-if="errorMessage" class="error-message api-error">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue';
import services from '../dashboardServices';
import { useUserStore } from '../../../stores/authStore';
import useVuelidate from '@vuelidate/core';
import { required, helpers, minLength, maxLength, numeric } from '@vuelidate/validators';

// Props
const props = defineProps({
  userData: {
    type: Object,
    required: true
  }
});

// Emits
const emit = defineEmits(['close', 'updated']);

// Store
const userStore = useUserStore();

// Reactive data
const isLoading = ref(false);
const errorMessage = ref('');

// State selection
const stateChosen = ref('Default');
const stateOptions = ref([
  {text: 'Select State', value: "Default", placeholder: true},
  {text: 'NSW', value: "NSW", placeholder: false},
  {text: 'SA', value: "SA", placeholder: false},
  {text: 'WA', value: "WA", placeholder: false},
  {text: 'NT', value: "NT", placeholder: false},
  {text: 'QLD', value: "QLD", placeholder: false},
  {text: 'VIC', value: "VIC", placeholder: false},
  {text: 'TAS', value: "TAS", placeholder: false}
]);

// Form data - initialize with current user data
const formData = reactive({
  firstName: '',
  lastName: '',
  mobilePhone: '',
  streetName: '',
  city: '',
  state: '',
  postcode: ''
});

// Validation rules
const validNumber = helpers.withMessage(
  'Must be exactly 10 digits, start with 04',
  (value) => !value || (/^[0-9]{10}$/.test(value) && value.startsWith('04'))
);

const stateValidator = helpers.withMessage(
  'State is required',
  (value) => value !== 'Default'
);

const rules = computed(() => {
  return {
    firstName: { required: helpers.withMessage('First name is required', required) },
    lastName: { required: helpers.withMessage('Last name is required', required) },
    mobilePhone: { validNumber: validNumber },
    streetName: {},
    city: {},
    state: { stateValidator: stateValidator },
    postcode: { 
      numeric: helpers.withMessage('Postcode must be numeric', numeric),
      minLength: helpers.withMessage('Postcode must be 4 digits', minLength(4)),
      maxLength: helpers.withMessage('Postcode must be 4 digits', maxLength(4))
    },
  };
});

// Vuelidate
const v$ = useVuelidate(rules, formData);

// Watch for userData changes and update form
watch(() => props.userData, (newUserData) => {
  if (newUserData) {
    formData.firstName = newUserData.firstName || '';
    formData.lastName = newUserData.lastName || '';
    formData.mobilePhone = newUserData.mobilePhone || '';
    formData.streetName = newUserData.streetName || '';
    formData.city = newUserData.city || '';
    formData.state = newUserData.state || '';
    formData.postcode = newUserData.postcode || newUserData.postcode || '';
    
    // Set state dropdown
    stateChosen.value = newUserData.state || 'Default';
  }
}, { immediate: true });

// Methods
const closeModal = () => {
  emit('close');
};

const handleSubmit = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    // Set state from dropdown
    formData.state = stateChosen.value;
    
    // Validate form
    const result = await v$.value.$validate();
    
    if (!result) {
      isLoading.value = false;
      return;
    }

    // Call API to update user
    const response = await services.updateCurrentUser(userStore.getToken, formData);
    
    // Emit success event with updated data
    emit('updated', response);
    
    // Close modal
    closeModal();
  } catch (error) {
    console.error('Error updating user:', error);
    errorMessage.value = error.response?.data?.message || 'Failed to update account details';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

/* Modal Content */
.modal-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

/* Modal Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  color: #111827;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

/* Validation Styles */
.error-message {
  color: #c90e21;
  font-size: 0.75rem;
  margin: 4px 0 0 0;
  display: block;
}

.error-border {
  border-color: #c90e21 !important;
}

.input-valid {
  border-color: #d1d5db;
}

/* Form Styles */
.modal-form {
  padding: 0 24px 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}

.form-input {
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: white;
  width: 100%;
  box-sizing: border-box;
}

.form-input select {
  background: white;
  color: #6b7280;
}

.form-input:focus {
  outline: none;
  border-color: #0ea5b7;
  box-shadow: 0 0 0 3px rgba(14, 165, 183, 0.1);
}

/* Modal Footer */
.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel {
  padding: 10px 20px;
  border: 1px solid #d1d5db;
  background: white;
  color: #6b7280;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn-submit {
  padding: 10px 20px;
  border: none;
  background: #0ea5b7;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background: #0891a5;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* API Error Message */
.error-message.api-error {
  background: #fef2f2;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 8px;
  margin: 16px 24px 24px;
  font-size: 0.875rem;
  border: 1px solid #fecaca;
}

/* Responsive */
@media (max-width: 640px) {
  .modal-overlay {
    padding: 10px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .modal-header,
  .modal-form {
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style>
