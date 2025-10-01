<template>
  <div class="bg-white rounded-2xl shadow p-5 space-y-4">
    <h3 class="text-lg font-semibold">Payment</h3>
    <div class="flex items-center justify-between">
      <div class="text-sm text-gray-600">Plan expiry</div>
      <div class="font-medium">{{ expiry || "—" }}</div>
    </div>
    <form @submit.prevent="onSubmit" class="space-y-3">
      <select v-model="planId" class="w-full border rounded-xl px-3 py-2">
        <option disabled value="">Select plan</option>
        <option value="annual">Annual  $20</option>
        <option value="lifetime">Lifetime  $100</option>
      </select>
      <input v-model="paymentMethodId" placeholder="Payment method ID (demo)" class="w-full border rounded-xl px-3 py-2"/>
      <button type="submit" class="w-full px-4 py-2 rounded-xl bg-teal-600 text-white hover:bg-teal-700">Renew Membership</button>
    </form>
    <p v-if="msg" class="text-sm text-teal-700">{{ msg }}</p>
  </div>
</template>
<script setup>
import { ref } from "vue";
const props = defineProps({ expiry:String }); const emit = defineEmits(["renew"]);
const planId = ref(""); const paymentMethodId = ref(""); const msg = ref("");
function onSubmit(){ emit("renew", { planId:planId.value, paymentMethodId:paymentMethodId.value }); msg.value="Processing renewal"; }
</script>
