<template>
  <div class="modal-overlay">
    <div class="modal-content" @click.stop>
      <!-- Modal Header -->
      <div class="modal-header">
        <h2>Edit Account Details</h2>
        <button class="close-btn" @click="closeModal">&times;</button>
      </div>

      <!-- Modal Body -->
      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-grid">
          <div class="form-group">
            <label for="email">Email Address <span class="info-text">Changing this will change how you log in.</span></label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="form-input"
              :class="{'error-border': v$.email.$errors.length > 0}"
            />
            <span v-for="error in v$.email.$errors" :key="error.$uid" class="error-message">
              {{ error.$message }}
            </span>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              required
              class="form-input"
              :class="{'error-border': v$.password.$errors.length > 0}"
            />
            <span v-for="error in v$.password.$errors" :key="error.$uid" class="error-message">
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
import { ref, reactive, computed, watch } from 'vue';
import services from '../dashboardServices';
import { useUserStore } from '../../../stores/authStore';
import useVuelidate from '@vuelidate/core';
import { required, email, minLength } from '@vuelidate/validators';

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

// Form data - initialize with current user data
const formData = reactive({
  email: '',
  password: ''
});

// Validation rules
const rules = computed(() => {
  return {
    email: { required: required, email: email },
    password: { required: required, minLength: minLength(8) }
  };
});

// Vuelidate
const v$ = useVuelidate(rules, formData);

// Watch for userData changes and update form
watch(() => props.userData, (newUserData) => {
  if (newUserData) {
    formData.email = newUserData.email || '';
    formData.password = '';
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
    // Validate form
    const result = await v$.value.$validate();

    if (!result) {
      isLoading.value = false;
      return;
    }

    // Call API to update user
    await services.updateCurrentUser(userStore.getToken, formData);

    // Emit success event with updated data
    emit('updated', formData);

    // Close modal
    closeModal();
  } catch (error) {
    console.error('Error updating account details:', error);
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

/* Form Styles */
.modal-form {
  padding: 0 24px 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
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

.info-text {
  font-size: 0.75rem;
  color: #6b7280;
  margin-left: 8px;
}
</style>