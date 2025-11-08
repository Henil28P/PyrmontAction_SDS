<template>
    <div class="card">
        <h3>Account Manager</h3>
        <AccountManagerCreate @accountCreated="loadUsers" />
        <select v-model="selectedRole">
            <option value="">All</option>
            <option value="admin">Administrator</option>
            <option value="member">Community Member</option>
            <option value="editor">Content Manager</option>
        </select>
        <input type="text" v-model="searchTerm" placeholder="Search by name or email" />
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in filteredUsers" :key="user.email">
                    <td>{{ user.name }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.role }}</td>
                    <td>
                        <button v-if="user.role === 'admin' || user.role === 'editor'" @click="changeRole(user)">Role</button>
                        <button @click="changePassword(user)">Password</button>
                        <button @click="deleteUser(user)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
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
            role: user.role,
        }));
    } catch (error) {
        console.error('Error loading active members:', error);
    }
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
    if (!confirm(`Change role for ${user.email} to ${newRole}?`)) return;
    try {
        const role = await services.changeManagerRole(useUserStore().getToken, user.id, newRole);
        if (role !== newRole) throw new Error('Role change failed on server');
        // Update local user role
        users.value = users.value.map(u => u.id === user.id ? { ...u, role: newRole } : u);
        alert(`Role changed to ${role} for ${user.email}`);
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
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 12px;
}

/* Center align all table cells */
table {
    width: 100%;
    border-collapse: collapse;
}

table th, table td {
    text-align: center;
    padding: 8px;
    /* border: 1px solid #ddd; */
}
</style>