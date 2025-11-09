<template>
    <button 
        type="button" 
        class="password-toggle" 
        @click="toggleVisibility"
        :aria-label="isVisible ? 'Hide password' : 'Show password'"
        :disabled="disabled"
    >
        <svg v-if="!isVisible" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
    </button>
</template>

<script setup>
import { ref } from 'vue';

// Props
defineProps({
    disabled: {
        type: Boolean,
        default: false
    }
});

// Emits
const emit = defineEmits(['update:isVisible']);

// State
const isVisible = ref(false);

// Methods
function toggleVisibility() {
    isVisible.value = !isVisible.value;
    emit('update:isVisible', isVisible.value);
}
</script>

<style scoped>
.password-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    transition: color 0.2s;
}

.password-toggle:hover:not(:disabled) {
    color: #111;
}

.password-toggle:disabled {
    cursor: not-allowed;
    opacity: 0.4;
}

.password-toggle svg {
    display: block;
}
</style>
