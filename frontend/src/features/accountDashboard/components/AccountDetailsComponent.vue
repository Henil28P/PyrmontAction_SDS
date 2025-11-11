<template>
    <div>
        <!-- Account Details -->
        <section class="details">
            <div class="details-head">
                <h4><strong>Account Details</strong></h4>
            </div>

            <div class="details-grid">
                <div class="field">
                    <label>Update Email Address</label>
                    <div class="field-value">{{ userData?.email }}</div>
                    <form @submit.prevent="handleUpdateEmail">
                        <input class="form-input" type="email" placeholder="New Email Address" v-model="newEmail" />
                        <button class="btn-edit" type="submit" :disabled="!newEmail">Update</button>
                    </form>
                </div>
                <div class="field">
                    <label>Change Password</label>
                    <div class="password-input-wrapper">
                        <input 
                            class="form-input" 
                            :type="showCurrentPassword ? 'text' : 'password'" 
                            placeholder="Current Password" 
                            v-model="password.current" 
                        />
                        <ShowPasswordButton @update:isVisible="showCurrentPassword = $event" />
                    </div>
                    <form @submit.prevent="handleUpdatePassword">
                        <div class="password-input-wrapper">
                            <input 
                                class="form-input" 
                                :type="showNewPassword ? 'text' : 'password'" 
                                placeholder="New Password" 
                                v-model="password.new" 
                                :disabled="!password.current" 
                            />
                            <ShowPasswordButton 
                                @update:isVisible="showNewPassword = $event" 
                                :disabled="!password.current"
                            />
                        </div>
						<button class="btn-edit" type="submit" :disabled="!password.new && !password.current">Update</button>
                    </form>
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
                    <div class="field-value">{{ userData?.streetName + ", " + userData?.city + " " + userData?.state + ", " + userData?.postcode }}</div>
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
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import EditPersonalDetailsModal from './EditPersonalDetailsModal.vue';
    import ShowPasswordButton from '../../../components/ShowPasswordButton.vue';
	import service from '../dashboardServices';
	import { useUserStore } from '../../../stores/authStore';

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
    const newEmail = ref('');
	const password = ref({current: '', new: ''});
    const showEditModal = ref(false);
    const showCurrentPassword = ref(false);
    const showNewPassword = ref(false);

    // Methods
	function resetPassword() { password.value.current = ''; password.value.new = ''; }

    async function handleUpdateEmail() {
		try {
			if (!confirm('Changing your email will affect login credentials. Proceed?')) { 
                newEmail.value = '';
                return; 
            }
			const data = { email: newEmail.value };
			await service.updateCurrentUser(useUserStore().getToken, data);
        	emit('userUpdated', data);
        	newEmail.value = '';
			alert('Email updated successfully.');
		} catch (error) {
			console.error('Failed to update email:', error);
			newEmail.value = '';
			alert(error.response?.data?.message || 'Failed to update email. Please try again.');
		}
    }

    async function handleUpdatePassword() {
		try {
			if (!confirm('Changing your password will affect login credentials. Proceed?')) { 
                resetPassword();
                return; 
            }
			const data = { oldPassword: password.value.current, password: password.value.new };
			await service.updateCurrentUser(useUserStore().getToken, data);
			resetPassword();
			alert('Password updated successfully.');
		} catch (error) {
			console.error('Failed to update password:', error);
			resetPassword();
			alert(error.response?.data?.message || 'Failed to update password. Please try again.');
		}
    }

    function handleEditPersonalDetails() {
        showEditModal.value = true;
    }

    function closeEditPersonalDetailsModal() {
        showEditModal.value = false;
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
    .details {
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, .04);
        padding: 20px;
        margin-bottom: 22px;
    }

    .details-head {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 18px;
    }

    .btn-edit {
        margin-left: auto;
        background: #111;
        color: #fff;
        border: 0;
        border-radius: 8px;
        padding: 6px 14px;
        font-weight: 700;
        cursor: pointer;
    }

    .btn-edit:hover {
        background: #333;
    }

    .details-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 18px;
    }

    @media (max-width: 760px) {
        .details-grid {
            grid-template-columns: 1fr;
        }
    }

    .field label {
        display: block;
        font-size: 0.95rem;
        color: #6b7280;
        margin-bottom: 4px;
        padding-left: 0.3rem;
    }

    .field-value {
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        padding: 10px 12px;
		margin-bottom: 10px;
        font-weight: 600;
    }

    .form-input {
        padding: 10px 12px;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        font-size: 1rem;
        transition: border-color 0.2s, box-shadow 0.2s;
        background: white;
        width: 100%;
        box-sizing: border-box;
    }
	
    .form-input:disabled {
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        padding: 10px 12px;
        font-weight: 600;
        cursor: not-allowed;
        color: #6b7280;
        width: 100%;
        box-sizing: border-box;
    }

    .form-input:focus {
        outline: none;
        border-color: #0ea5b7;
        box-shadow: 0 0 0 3px rgba(14, 165, 183, 0.1);
    }

    /* "View all" button */
    .btn-all {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 8px 14px;
        border-radius: 10px;
        font-weight: 800;
        text-decoration: none;
        color: #0ea5b7;
        background: #e6fbff;
        border: 1px solid #c8f4fb;
    }

	button:disabled {
		opacity: 0.6; 
		cursor: not-allowed; 
		background-color: #e5e7eb; 
		color: #9ca3af; 
	}
	
    .btn-all:hover {
		filter: brightness(.98);
    }

	button:disabled:hover {
		background-color: #e5e7eb; /* Slightly lighter background for better contrast */
		color: #9ca3af; /* Softer text color */
		cursor: not-allowed; /* Ensure the cursor remains consistent */
		filter: none; /* Remove any hover filter effects */
	}

    .field form {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 12px; /* Adds margin above the button */
    }

    .field form .btn-edit {
        margin-top: 20px; /* Ensures spacing above the button */
        justify-content: center; /* Centers the button horizontally */
    }

    /* Password input wrapper */
    .password-input-wrapper {
        position: relative;
        width: 100%;
        margin-bottom: 10px;
    }

    .password-input-wrapper .form-input {
        padding-right: 45px; /* Make room for the toggle button */
    }
</style>