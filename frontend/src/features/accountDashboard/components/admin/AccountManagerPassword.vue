<template>
    <div class="popup-overlay">
        <div class="popup-content" @click.stop>
            <h3>Password Generated</h3>
            <p>A new temporary password has been generated for <strong>{{ props.user.email }}</strong></p>
            <div class="password-display">
                <code>{{ props.user.password }}</code>
                <button @click="copyPassword" class="copy-btn" :class="{ copied: isCopied }">
                    {{ isCopied ? 'Copied!' : 'Copy' }}
                </button>
            </div>
            <p class="warning">Please save this password. It will not be shown again.</p>
            <button @click="$emit('close')">Close</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    user: {
        type: Object,
        required: true
    }
});

const emits = defineEmits(['close']);
const isCopied = ref(false);

async function copyPassword() {
    try {
        await navigator.clipboard.writeText(props.user.password);
        isCopied.value = true;
        setTimeout(() => {
            isCopied.value = false;
        }, 2000);
    } catch (error) {
        console.error('Failed to copy password:', error);
        alert('Failed to copy password to clipboard');
    }
}
</script>

<style scoped>
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

.password-display {
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 16px;
    margin: 16px 0;
    text-align: center;
    position: relative;
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
    width: auto;
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
    margin-bottom: 16px;
}

button:not(.copy-btn) {
    width: 100%;
    padding: 10px;
    background-color: #1976d2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

button:not(.copy-btn):hover {
    background-color: #1565c0;
}
</style>