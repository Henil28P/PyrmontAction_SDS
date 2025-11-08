<template>
    <div class="card">
        <h4><strong>Active Members List</strong></h4>
        <div class="filter-search-container">
            <input type="text" v-model="searchTerm" placeholder="Search by name or email" class="search-bar" />
            <button @click="makeEmailList" class="copy-btn" :class="{ copied: emailListCopied }">
                {{ emailListCopied ? 'Copied!' : 'Make Email List' }}
            </button>
        </div>
        
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th style="width: 20%;">Name</th>
                        <th style="width: 40%;">Email</th>
                        <th style="width: 10%; text-align: center;">Number</th>
                        <th style="width: 30%; text-align: center;">Expiry</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in filteredUsers" :key="user.email">
                        <td>{{ user.name }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.number }}</td>
                        <td class="expiry-cell">{{ formatDate(user.expiry) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '../../../../stores/authStore';
import services from '../../dashboardServices';
import {formatDate} from '../../../../utils/dateUtils';

const users = ref([]);
const searchTerm = ref('');
const emailListCopied = ref(false);

onMounted(() => {
    loadActiveMembers();
});

async function loadActiveMembers() {
    try {
        const userStore = useUserStore();
        const response = await services.getActiveMembers(userStore.getToken);
        users.value = response.map(user => ({
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            number: user.mobilePhone,
            expiry: user.memberExpiryDate
        }));
    } catch (error) {
        console.error('Error loading active members:', error);
    }
}

function makeEmailList() {
    const emailList = users.value.map(user => user.email).join(', ');
    navigator.clipboard.writeText(emailList)
        .then(() => {
            emailListCopied.value = true;
            setTimeout(() => {
                emailListCopied.value = false;
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy email list:', err);
            alert('Failed to copy email list to clipboard');
        });
};

const filteredUsers = computed(() => {
    return users.value.filter(user => {
        const term = searchTerm.value.toLowerCase();
        const matchesSearch =
            user.name.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term);
        return matchesSearch;
    });
});
</script>

<style scoped>
.card {
    padding: 24px;
    background: white;
    border-radius: 8px;
}

.card h4 {
    margin-bottom: 24px;
}

.filter-search-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin: 0 16px 16px;
    max-width: calc(100% - 32px);
}

.filter-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
}

.filter-label {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    text-align: center;
}

.filter-dropdown {
    flex: 0 0 30%;
    padding: 8px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.search-bar {
    flex: 0 0 70%;
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

.expiry-cell {
    text-align: center;
}

.copy-btn {
    padding: 10px 20px; /* Increased padding to match the height of the search bar */
    background-color: #1976d2; /* Blue color */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px; /* Slightly larger font size */
    white-space: nowrap;
    transition: background-color 0.3s;
    width: 100%; /* Set width to match the search bar */
}

.copy-btn:hover {
    background-color: #1565c0; /* Darker blue for hover */
}

.copy-btn.copied {
    background-color: #4caf50; /* Green color when copied */
    padding: 10px 20px; /* Ensure the green copied button matches the same size */
    font-size: 16px; /* Ensure the font size matches */
    width: 100%; /* Ensure the width matches the search bar */
}
</style>