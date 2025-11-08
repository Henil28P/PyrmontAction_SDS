<template>
    <div>
        <button @click="showCreateForm = true" class="create-btn">Create Account</button>
        
        <!-- Create Account Form Popup -->
        <div v-if="showCreateForm" class="popup-overlay">
            <div class="popup-content" @click.stop>
                <h3>Create New Account</h3>
                <form @submit.prevent="createAccount">
                    <div class="form-group">
                        <label for="firstName">First Name</label>
                        <input 
                            type="text" 
                            id="firstName" 
                            v-model="formData.firstName" 
                            required 
                            placeholder="First Name"
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="lastName">Last Name</label>
                        <input 
                            type="text" 
                            id="lastName" 
                            v-model="formData.lastName" 
                            required 
                            placeholder="Last Name"
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            v-model="formData.email" 
                            required 
                            placeholder="Email"
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="role">Role</label>
                        <select id="role" v-model="formData.role" required>
                            <option value="">Select Role</option>
                            <option value="admin">admin</option>
                            <option value="editor">editor</option>
                        </select>
                    </div>
                    
                    <div class="button-group">
                        <button type="submit" class="submit-btn">Create</button>
                        <button type="button" @click="closeCreateForm" class="cancel-btn">Cancel</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Account Created Success Popup -->
        <div v-if="createdAccount" class="popup-overlay">
            <div class="popup-content success-popup" @click.stop>
                <h3>Account Created</h3>
                <p>The new account has been created for:</p>
                
                <div class="account-details">
                    <div class="detail-row">
                        <strong>Name:</strong> {{ createdAccount.name }}
                    </div>
                    <div class="detail-row">
                        <strong>Email:</strong> {{ createdAccount.email }}
                    </div>
                    <div class="detail-row">
                        <strong>Role:</strong> {{ createdAccount.role }}
                    </div>
                </div>
                
                <div class="password-section">
                    <h4>Temporary Password:</h4>
                    <div class="password-display">
                        <code>{{ createdAccount.password }}</code>
                        <button @click="copyPassword" class="copy-btn" :class="{ copied: isCopied }">
                            {{ isCopied ? 'Copied!' : 'Copy' }}
                        </button>
                    </div>
                    <p class="warning">Please save this password. It will not be shown again.</p>
                </div>
                
                <button @click="closeSuccessPopup" class="close-btn">Close</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '../../../../stores/authStore';
import services from '../../dashboardServices';

const showCreateForm = ref(false);
const createdAccount = ref(null);
const isCopied = ref(false);

const formData = ref({
    firstName: '',
    lastName: '',
    email: '',
    role: ''
});

const emit = defineEmits(['accountCreated']);

function resetForm() {
    formData.value = {
        firstName: '',
        lastName: '',
        email: '',
        role: ''
    };
}

async function createAccount() {
    try {
        const userStore = useUserStore();
        const password = await services.createManager(userStore.getToken, formData.value);
        
        createdAccount.value = {
            name: `${formData.value.firstName} ${formData.value.lastName}`,
            email: formData.value.email,
            role: formData.value.role,
            password: password
        };
        
        showCreateForm.value = false;
        resetForm();
        emit('accountCreated');
    } catch (error) {
        console.error('Error creating account:', error);
        alert(error.response?.data?.message || 'Failed to create account. Please try again.');
    }
}

async function copyPassword() {
    try {
        await navigator.clipboard.writeText(createdAccount.value.password);
        isCopied.value = true;
        setTimeout(() => {
            isCopied.value = false;
        }, 2000);
    } catch (error) {
        console.error('Failed to copy password:', error);
        alert('Failed to copy password to clipboard');
    }
}

function closeSuccessPopup() {
    createdAccount.value = null;
    isCopied.value = false;
}
</script>

<style scoped>
.create-btn {
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-bottom: 16px;
}

.create-btn:hover {
    background-color: #45a049;
}

.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.popup-content {
    background: white;
    padding: 24px;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.popup-content h3 {
    margin-top: 0;
    margin-bottom: 16px;
}

.form-group {
    margin-bottom: 16px;
}

.form-group label {
    display: block;
    margin-bottom: 6px;
    font-weight: 500;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
}

.button-group {
    display: flex;
    gap: 12px;
    margin-top: 20px;
}

.submit-btn,
.cancel-btn {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

.submit-btn {
    background-color: #1976d2;
    color: white;
}

.submit-btn:hover {
    background-color: #1565c0;
}

.cancel-btn {
    background-color: #757575;
    color: white;
}

.cancel-btn:hover {
    background-color: #616161;
}

.success-popup {
    max-width: 600px;
}

.account-details {
    background-color: #f5f5f5;
    padding: 16px;
    border-radius: 4px;
    margin: 16px 0;
}

.detail-row {
    margin-bottom: 8px;
}

.detail-row:last-child {
    margin-bottom: 0;
}

.password-section {
    margin-top: 20px;
}

.password-section h4 {
    margin-bottom: 12px;
}

.password-display {
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 16px;
    margin: 12px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.password-display code {
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 2px;
    flex: 1;
}

.copy-btn {
    padding: 8px 16px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    white-space: nowrap;
    transition: background-color 0.3s;
}

.copy-btn:hover {
    background-color: #45a049;
}

.copy-btn.copied {
    background-color: #2196f3;
}

.warning {
    color: #d32f2f;
    font-size: 14px;
    margin-top: 8px;
}

.close-btn {
    width: 100%;
    padding: 10px;
    background-color: #1976d2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 16px;
}

.close-btn:hover {
    background-color: #1565c0;
}
</style>