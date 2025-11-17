<template>
	<div class="modal">
		<div class="modal-content">
			<h3>Edit Meeting Minute</h3>

			<form @submit.prevent="saveEdit">
				<div class="row">
					<label class="lbl" for="edit-title">Title</label>
					<input 
						id="edit-title"
						v-model="editForm.title" 
						class="input" 
						placeholder="Enter title"
						required
					/>
				</div>

				<div class="row">
					<label class="lbl" for="edit-notes">Notes</label>
					<textarea 
						id="edit-notes"
						v-model="editForm.note" 
						class="input" 
						rows="6" 
						placeholder="Type the meeting notes…"
					></textarea>
				</div>

				<div class="row">
					<label class="lbl">Attach File</label>
					<FileUploadEdit 
						:current-file-name="meeting?.filename"
						v-model:file-name="editForm.newPDF"
						accept="application/pdf"
						ref="fileUploadRef"
					/>
				</div>

				<div class="actions">
					<button type="submit" class="btn primary">Save</button>
					<button type="button" class="btn" @click="$emit('close')">Cancel</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '../../../../stores/authStore';
import services from '../../dashboardServices';
import FileUploadEdit from '../../../../components/FileUploadEdit.vue';

const props = defineProps({
	meeting: {
		type: Object,
		required: true,
	}
});

const fileUploadRef = ref(null);
const emits = defineEmits(['updateMeetingMinute', 'close']);
const editForm = ref({
	...props.meeting,
	newPDF: '' 
});

// Prevent background scrolling when modal is open
onMounted(() => {
	document.body.style.overflow = 'hidden';
});

onUnmounted(() => {
	document.body.style.overflow = '';
});

async function saveEdit() {
	try {
		const formData = new FormData();
		formData.append('_id', editForm.value._id);
		formData.append('title', editForm.value.title);
		formData.append('note', editForm.value.note);

		if (fileUploadRef.value?.fileInput?.files[0]) {
			formData.append('file', fileUploadRef.value.fileInput.files[0]);
		}

		const response = await services.updateMeetingWithFile(useUserStore().getToken, editForm.value._id, formData);
		emits('updateMeetingMinute', response );
		emits('close');
	} catch (error) {
		console.error('Failed to save edit:', error);
	}
}
</script>

<style scoped>
.modal {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
	overflow: hidden;
}
.modal-content {
	background: #fff;
	padding: 24px;
	border-radius: 12px;
	width: 600px;
	max-width: 90vw;
	max-height: 80vh;
	overflow-y: auto;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.row{display:grid;grid-template-columns:140px 1fr;gap:10px 12px;align-items:start;margin-bottom:10px}
.lbl{font-size:14px;color:#374151;padding-top:8px}
.input{border:1px solid #e5e7eb;border-radius:10px;padding:10px 12px;width:100%;background:#fff;font:inherit}
.actions {
	display: flex;
	gap: 10px;
	justify-content: flex-end;
}
.btn{border:1px solid #e5e7eb;background:#fff;padding:8px 12px;border-radius:10px;cursor:pointer}
.btn.primary{background:#111;color:#fff;border-color:#111}
</style>