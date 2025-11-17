<template>
    <div class="button-wrapper">
        <button class="delete-account-button" @click="handleDelete">Delete Account</button>
    </div>
</template>

<script setup>
    import { useRouter } from 'vue-router';
    import { useUserStore } from '../../../stores/authStore';
    import services from '../dashboardServices';

    const router = useRouter();
    const userStore = useUserStore();

    async function handleDelete() {
        try {
            if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                return;
            }
            await services.deleteCurrentUser(userStore.getToken);
            userStore.logout();
            alert('Account deleted successfully.');
            await router.push('/login');
            // Logout and redirect
        } catch (error) {
            console.error('Error deleting account:', error);
            alert(error.response?.data?.message || 'Failed to delete account. Please try again.');
        }
    };
</script>

<style scoped>
.button-wrapper {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}

.delete-account-button {
    background-color: #dc2626;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 15px 20px;
    cursor: pointer;
    font-weight: 600;
    font-size: 1rem;
    transition: background-color 0.2s;
}

.delete-account-button:hover {
    background-color: #b91c1c;
}
</style>