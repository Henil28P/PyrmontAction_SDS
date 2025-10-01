<template>
  <div class="bg-white rounded-2xl shadow p-5">
    <h3 class="text-lg font-semibold mb-4">Meeting Minutes</h3>
    <ul class="divide-y">
      <li v-for="m in minutes" :key="m.id" class="py-3 flex items-center justify-between">
        <div>
          <div class="font-medium">{{ m.title }}</div>
          <div class="text-xs text-gray-500">{{ formatDate(m.date) }}</div>
        </div>
        <a :href="m.url" target="_blank" class="text-teal-600 hover:underline">View</a>
      </li>
    </ul>
  </div>
</template>
<script setup>
defineProps({ minutes:{ type:Array, default:()=>[] } });
function formatDate(d){ return d ? new Date(d).toLocaleDateString() : ""; }
</script>
