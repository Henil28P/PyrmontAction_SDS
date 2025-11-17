
<template>
  <div class="card">
	<div class="header">
	  <h4><strong>Meeting Minutes</strong></h4>
	  <button @click="showModal = true" class="view-all-btn" aria-label="View all minutes">
		View all
	  </button>
	</div>

	<div class="minutes-table-container">
	  <table>
		<thead>
		  <tr>
			<th style="width: 20%;">Date</th>
			<th style="width: 50%;">Title</th>
			<th style="width: 30%; text-align: center;">Actions</th>
		  </tr>
		</thead>
		<tbody>
		  <tr v-for="m in minutes.slice(0, 3)" :key="m.id">
			<td class="date-cell">{{ m.date }}</td>
			<td class="title-cell">{{ m.title }}</td>
			<td class="action-cell">
			  <a :href="m.url" target="_blank" rel="noopener" class="view-btn">Download PDF</a>
			</td>
		  </tr>
		  <tr v-if="!minutes.length">
			<td colspan="3" class="muted">No minutes available.</td>
		  </tr>
		</tbody>
	  </table>
	</div>

	<!-- Modal for all meeting minutes -->
	<div v-if="showModal" class="modal-overlay" @click="showModal = false">
	  <div class="modal-content" @click.stop>
		<div class="modal-header">
		  <h3><strong>All Meeting Minutes</strong></h3>
		  <button @click="showModal = false" class="close-btn" aria-label="Close modal">&times;</button>
		</div>
		<div class="modal-body">
		  <div class="minutes-table-container">
			<table>
			  <thead>
				<tr>
				  <th style="width: 20%;">Date</th>
				  <th style="width: 50%;">Title</th>
				  <th style="width: 30%; text-align: center;">Actions</th>
				</tr>
			  </thead>
			  <tbody>
				<tr v-for="m in minutes" :key="m.id">
				  <td class="date-cell">{{ m.date }}</td>
				  <td class="title-cell">{{ m.title }}</td>
				  <td class="action-cell">
					<a :href="m.url" target="_blank" rel="noopener" class="view-btn">Download PDF</a>
				  </td>
				</tr>
				<tr v-if="!minutes.length">
				  <td colspan="3" class="muted">No minutes available.</td>
				</tr>
			  </tbody>
			</table>
		  </div>
		</div>
	  </div>
	</div>
  </div>
</template>

<script setup>
	import { onMounted, ref, watch } from 'vue';
	import services from '../../dashboardServices';
	import { useUserStore } from '@/stores/authStore';
	import { formatDate } from '@/utils/dateUtils';
	import SERVER_URL from '../../../../config';

	const minutes = ref([]);
	const showModal = ref(false);

	// Prevent background scrolling when modal is open
	watch(showModal, (isOpen) => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	});

	async function loadMinutes() {
		try {
			console.log('Loading meeting minutes...');
			const response = await services.getPublishedMeetingMinutes(useUserStore().getToken);
			console.log('Meeting minutes response:', response);
			minutes.value = response.map(m => ({
				id: m._id,
				date: formatDate(m.createdAt),
				title: m.title,
				url: `${SERVER_URL}${m.fileUrl}`
			}));
			console.log('Mapped minutes:', minutes.value);
		} catch (error) {
			console.error('Error loading meeting minutes:', error);
			console.error('Error details:', error.response?.data);
		}
	}

	onMounted(() => {
		loadMinutes();
	});

</script>

<style scoped>
.card {
	padding: 24px;
	background: white;
	border-radius: 8px;
}

.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 20px;
}

.view-all-btn {
	margin-left: auto;
	background: #111;
	color: #fff;
	border: 0;
	border-radius: 8px;
	padding: 6px 14px;
	font-weight: 700;
	cursor: pointer;
	transition: all 0.2s ease;
	text-decoration: none;
	display: inline-block;
}

.view-all-btn:hover {
	background: #333;
}

.minutes-table-container {
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

.date-cell {
	white-space: nowrap;
	font-weight: 600;
	color: #111827;
}

.title-cell {
	font-weight: 600;
	color: #111827;
}

.action-cell {
	text-align: center;
	white-space: nowrap;
}

.view-btn {
	display: inline-block;
	padding: 6px 14px;
	border-radius: 6px;
	font-size: 13px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.2s ease;
	border: none;
	background: #3b82f6;
	color: white;
	text-decoration: none;
}

.view-btn:hover {
	background: #2563eb;
}

.muted {
	color: #6b7280;
	text-align: center;
}

/* Modal Styles */
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
	padding: 20px;
}

.modal-content {
	background: white;
	border-radius: 12px;
	width: 100%;
	max-width: 1200px;
	max-height: 85vh;
	height: 700px;
	display: flex;
	flex-direction: column;
	box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24px 24px 20px;
	border-bottom: 2px solid #e5e7eb;
}

.modal-header h3 {
	margin: 0;
	font-size: 20px;
	color: #111827;
}

.close-btn {
	background: none;
	border: none;
	font-size: 32px;
	color: #6b7280;
	cursor: pointer;
	padding: 0;
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 4px;
	transition: all 0.2s ease;
}

.close-btn:hover {
	background: #f3f4f6;
	color: #111827;
}

.modal-body {
	padding: 24px;
	overflow-y: auto;
	flex: 1;
}
</style>