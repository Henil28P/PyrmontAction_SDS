<template>
    <div class="card">
        <AccountManagerCreate @accountCreated="loadUsers" />
        <div class="filter-search-container">
            <input type="text" v-model="searchTerm" placeholder="Search by name or email" class="search-bar" />
            <div class="filter-wrapper">
                <label for="role-filter" class="filter-label">Roles:</label>
                <select id="role-filter" v-model="selectedRole" class="filter-dropdown">
                    <option value="">All</option>
                    <option value="admin">Administrator</option>
                    <option value="member">Community Member</option>
                    <option value="editor">Content Manager</option>
                </select>
            </div>
        </div>
        
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th style="width: 20%;">Name</th>
                        <th style="width: 25%;">Email</th>
                        <th style="width: 20%; text-align: center;">Role</th>
                        <th style="width: 35%; text-align: center;">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in filteredUsers" :key="user.email">
                        <td>{{ user.name }}</td>
                        <td>{{ user.email }}</td>
                        <td class="role-cell">{{ mapRole(user.role) }}</td>
                        <td class="action-cell">
                            <button v-if="user.role === 'admin' || user.role === 'editor'" @click="changeRole(user)" class="action-btn">Role</button>
                            <button @click="changePassword(user)" class="action-btn">Password</button>
                            <button @click="deleteUser(user)" class="delete-btn">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <AccountManagerPassword
            v-if="generatedPassword"
            :user="generatedPassword"
            @close="generatedPassword = null"
        />
    </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '../../../../stores/authStore';
import services from '../../dashboardServices';
import AccountManagerPassword from './AccountManagerPassword.vue';
import AccountManagerCreate from './AccountManagerCreate.vue';

const users = ref([]);
const searchTerm = ref('');
const selectedRole = ref('');
const generatedPassword = ref(null);


onMounted(() => {
    loadUsers();
});

async function loadUsers() {
    try {
        const userStore = useUserStore();
        const response = await services.getAllUsers(userStore.getToken);
        users.value = response.map(user => ({
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role
        }));
    } catch (error) {
        console.error('Error loading active members:', error);
    }
}

function mapRole(role) {
    const roleMapping = {
        admin: 'Administrator',
        editor: 'Content Manager',
        member: 'Community Member'
    };
    return roleMapping[role] || role;
}

const filteredUsers = computed(() => {
    return users.value.filter(user => {
        const term = searchTerm.value.toLowerCase();
        const matchesSearch =
            user.name.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term);
        const matchesRole = selectedRole.value
            ? user.role === selectedRole.value
            : true;
        return matchesSearch && matchesRole;
    });
});

// Switches the role of the user between 'admin' and 'editor'
async function changeRole(user) {
    const newRole = (user.role === 'admin') ? 'editor' : 'admin';
    if (!confirm(`Change role for ${user.email} to ${mapRole(newRole)}?`)) return;
    try {
        const role = await services.changeManagerRole(useUserStore().getToken, user.id, newRole);
        if (role !== newRole) throw new Error('Role change failed on server');
        // Update local user role
        users.value = users.value.map(u => u.id === user.id ? { ...u, role: newRole } : u);
        alert(`Role changed to ${mapRole(role)} for ${user.email}`);
    } catch (error) {
        console.error('Error changing user role:', error);
        alert('Failed to change user role.');
    }
}

// Creates a new random password for the user and shows it in the password popup
async function changePassword(user) {
    if (!confirm(`Generate random password for ${user.email}?`)) return;
    try {
        const password = await services.generateRandomPassword(useUserStore().getToken, user.id);
        generatedPassword.value = {email: user.email, password}; // Triggers password popup
    } catch (error) {
        console.error('Error changing user password:', error);
        alert('Failed to change user password.');
    }
}

</script>
<style scoped>
.card {
    padding: 24px;
    background: white;
    border-radius: 8px;
}

.card h3 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 24px;
    color: #1a1a1a;
}

.filter-search-container {
    display: flex;
    align-items: center;
    justify-content: space-between; /* Align filter on the right */
    gap: 16px; /* Add spacing between elements */
    margin: 0 16px 16px; /* Add margin on left and right, and spacing below the container */
    max-width: calc(100% - 32px); /* Ensure the container stops before the red boundary */
}

.filter-wrapper {
    display: flex;
    align-items: center;
    gap: 8px; /* Reduce gap between label and dropdown */
}

.filter-label {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    text-align: center; /* Center the label text */
}

.filter-dropdown {
    flex: 0 0 30%; /* Shrink the dropdown */
    padding: 8px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.search-bar {
    flex: 0 0 70%; /* Take up remaining space */
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.table-container {
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

.role-cell {
    text-align: center;
}

.action-cell {
    text-align: center;
}

.action-cell button {
    margin: 0 3px;
}

.action-btn {
    background: #3b82f6; /* Blue for Password */
    color: white;
    border: none;
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.action-btn:hover {
    background: #2563eb; /* Darker blue for hover */
}

.delete-btn {
    background: #ef4444; /* Red for Delete */
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
    background: #dc2626; /* Darker red for hover */
}

/* Style for the create button */
.create-btn {
    background: #10b981; /* Match Event Admin */
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px; /* Match Event Admin */
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.create-btn:hover {
    background: #059669; /* Match Event Admin */
    transform: translateY(-1px);
}
</style>