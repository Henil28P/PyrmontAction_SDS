<template>
    <div class="card">
        <h2>Account Manager</h2>
        <select v-model="selectedRole">
            <option value="">All</option>
            <option value="admin">admin</option>
            <option value="member">member</option>
            <option value="editor">editor</option>
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
                        <button @click="performAction(user)">Action</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '../../../../stores/authStore';
import services from '../../dashboardServices';

const users = ref([]);
const searchTerm = ref('');
const selectedRole = ref('');

async function loadUsers() {
    try {
        const userStore = useUserStore();
        const response = await services.getAllUsers(userStore.getToken);
        users.value = response.map(user => ({
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

function performAction(user) {
    console.log('Performing action for:', user);
}

onMounted(() => {
    loadUsers();
});
</script>
<style scoped>
.card {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 12px;
}
</style>