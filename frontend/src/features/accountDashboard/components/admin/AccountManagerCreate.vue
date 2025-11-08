<template>
    <div>
        <div class="header">
            <h4><strong>Account Manager</strong></h4>
            <button @click="showCreateForm = true" class="create-btn">Create Account</button>
        </div>
        
        <!-- Create Account Form Popup -->
        <div v-if="showCreateForm" class="popup-overlay">
            <div class="popup-content" @click.stop>
                <h3>Create New Manager Account</h3>
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
                            <option value="admin">Administrator</option>
                            <option value="editor">Content Manager</option>
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
                <p class="text-center">The new account has been created for:</p>
                
                <div class="account-details">
                    <div class="detail-row">
                        <strong>Name:</strong> {{ createdAccount.name }}
                    </div>
                    <div class="detail-row">
                        <strong>Email:</strong> {{ createdAccount.email }}
                    </div>
                    <div class="detail-row">
                        <strong>Role:</strong> {{ mapRole(createdAccount.role) }}
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

function mapRole(role) {
    const roleMapping = {
        admin: 'Administrator',
        editor: 'Content Manager',
        member: 'Community Member'
    };
    return roleMapping[role] || role;
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

function closeCreateForm() {
    showCreateForm.value = false;
    resetForm();
}

function closeSuccessPopup() {
    createdAccount.value = null;
    isCopied.value = false;
}
</script>

<style scoped>
.header {
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: space-between; /* Ensure header and button are on the same line */
    margin-bottom: 40px;
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
    margin-left: auto; /* Align to the right */
}

.create-btn:hover {
    background: #059669;
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
    padding: 32px;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.popup-content h3 {
    margin-top: 0;
    margin-bottom: 24px;
    font-size: 24px;
    font-weight: 600;
    color: #1a1a1a;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    font-size: 14px;
    color: #333;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
    transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus {
    outline: none;
    border-color: #2196f3;
}

.button-group {
    display: flex;
    gap: 12px;
    margin-top: 24px;
}

.submit-btn,
.cancel-btn {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
}

.submit-btn {
    background-color: #2196f3;
    color: white;
}

.submit-btn:hover {
    background-color: #1976d2;
}

.cancel-btn {
    background-color: #f5f5f5;
    color: #666;
}

.cancel-btn:hover {
    background-color: #e0e0e0;
}

.success-popup {
    max-width: 600px;
}

.account-details {
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 6px;
    margin: 20px 0;
    border-left: 4px solid #26a69a;
}

.detail-row {
    margin-bottom: 12px;
    font-size: 14px;
    line-height: 1.6;
}

.detail-row:last-child {
    margin-bottom: 0;
}

.detail-row strong {
    color: #555;
    min-width: 80px;
    display: inline-block;
}

.password-section {
    margin-top: 24px;
}

.password-section h4 {
    margin-bottom: 12px;
    font-size: 16px;
    font-weight: 600;
    color: #333;
}

.password-display {
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 16px;
    margin: 16px 0;
    text-align: center; /* Center the content */
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center; /* Center the code and button horizontally */
    gap: 12px;
}

.password-display code {
    font-size: 26px;
    font-weight: bold;
    letter-spacing: 2px;
    flex: 1;
    /* font-family: 'Courier New', monospace; */
}

.copy-btn {
    padding: 10px 20px; /* Increased padding for consistent size */
    background-color: #1976d2; /* Blue color */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px; /* Larger font size for consistency */
    font-weight: 500;
    white-space: nowrap;
    transition: background-color 0.2s, width 0.2s; /* Added width transition */
    width: 120px; /* Fixed width for consistency */
}

.copy-btn:hover {
    background-color: #1565c0; /* Darker blue for hover */
}

.copy-btn.copied {
    background-color: #4caf50; /* Green color when copied */
    width: 120px; /* Fixed width for consistency */
}

.warning {
    color: #f44336;
    font-size: 13px;
    margin-top: 8px;
    font-style: italic;
}

.close-btn {
    width: 100%;
    padding: 12px;
    background-color: #2196f3;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    margin-top: 20px;
    transition: background-color 0.2s;
}

.close-btn:hover {
    background-color: #1976d2;
}
</style>