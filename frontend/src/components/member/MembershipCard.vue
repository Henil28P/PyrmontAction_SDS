<template>
  <div class="bg-white rounded-2xl shadow p-5 space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">Membership</h3>
      <button class="px-4 py-2 rounded-xl bg-teal-600 text-white hover:bg-teal-700" @click="$emit('edit')">
        Edit Details
      </button>
    </div>
    <div class="grid grid-cols-2 gap-3 text-sm">
      <div><div class="text-gray-500">Type</div><div class="font-medium">{{ membershipType || "—" }}</div></div>
      <div><div class="text-gray-500">Expiry</div><div class="font-medium">{{ formattedExpiry }}</div></div>
    </div>
    <StatusBadge :status="status" />
  </div>
</template>
<script setup>
import { computed } from "vue"; import StatusBadge from "./StatusBadge.vue";
const props = defineProps({ membershipType:String, expiresAt:[String,Number,Date], status:{type:String,default:"active"}});
const formattedExpiry = computed(()=> props.expiresAt ? new Date(props.expiresAt).toLocaleDateString() : "");
</script>
