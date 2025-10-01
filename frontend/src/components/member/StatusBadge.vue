<template>
  <span :class="[
    \"inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium\",
    status === \"active\" ? \"bg-green-100 text-green-700\" : \"bg-red-100 text-red-700\"
  ]">
    <span class="w-2.5 h-2.5 rounded-full"
      :class="status==='active' ? 'bg-green-500' : 'bg-red-500'"/>
    {{ status === "active" ? "Active" : "Deactivated" }}
  </span>
</template>
<script setup>
defineProps({ status: { type:String, default: "active" } })
</script>
