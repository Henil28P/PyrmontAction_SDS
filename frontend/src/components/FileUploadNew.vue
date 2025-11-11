<template>
    <div class="file-upload-wrapper">
        <div class="fileZone">
            <input ref="fileInput" type="file" :accept="accept" @change="chooseFile" :required="props.required"/>
            <div v-if="fileName" class="fileList">
                <span class="chip-name">{{ fileName }}</span>
            </div>
            <div v-else class="hint">No file chosen</div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    fileName: {
        type: String,
        default: ''
    },
    accept: {
        type: String,
        default: 'image/*'
    },
    required: {
        type: Boolean,
        default: false
    }
})

const emits = defineEmits(['update:fileName'])

const fileInput = ref(null)
const fileError = ref('')

function chooseFile() {
    fileError.value = ''
    const file = fileInput.value.files[0]
    
    if (!file) {
        emits('update:fileName', '')
        return
    }
    

    
    emits('update:fileName', file.name)
}

// Expose fileInput ref for parent to access
defineExpose({
    fileInput
})

</script>

<style scoped>
.file-upload-wrapper {
    width: 100%;
}

.fileZone {
    border: 2px dashed #d1d5db;
    border-radius: 6px;
    padding: 14px;
    background: #f9fafb;
    transition: all 0.2s ease;
}

.fileZone:hover {
    border-color: #10b981;
    background: #f0fdf4;
}

.fileList {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
}

.chip-name {
    display: inline-block;
    background: #10b981;
    color: white;
    border-radius: 4px;
    padding: 6px 12px;
    font-size: 13px;
    font-weight: 600;
}

.chip-x {
    border: none;
    background: #ef4444;
    color: white;
    cursor: pointer;
    font-size: 14px;
    line-height: 1;
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: 600;
}

.chip-x:hover {
    background: #dc2626;
}

.hint {
    color: #9ca3af;
    font-size: 13px;
}

.error-message {
    color: #ef4444;
    font-size: 13px;
    margin-top: 6px;
}
</style>
