<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img src="/logo.png" alt="Pyrmont Action" class="h-10" />
          <span class="text-sm text-gray-500">Member Area</span>
        </div>
        <nav class="flex items-center gap-6 text-sm font-medium">
          <RouterLink to="/member/dashboard" class="text-teal-700">Dashboard</RouterLink>
          <RouterLink to="/member/minutes" class="hover:text-teal-700">Minutes</RouterLink>
        </nav>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <section class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-2xl shadow p-6">
          <h2 class="text-2xl font-bold">Welcome back, {{ profile?.name || "Member" }} </h2>
          <p class="text-gray-600 mt-2">Here are your membership details and latest minutes.</p>
        </div>
        <MinutesList :minutes="minutes" />
      </section>

      <aside class="space-y-6">
        <MembershipCard
          :membership-type="profile?.membershipType"
          :expires-at="profile?.expiresAt"
          :status="profile?.status"
          @edit="handleEdit"
        />
        <PaymentCard :expiry="expiryDate" @renew="handleRenew" />
      </aside>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import MembershipCard from "@/components/member/MembershipCard.vue";
import PaymentCard from "@/components/member/PaymentCard.vue";
import MinutesList from "@/components/member/MinutesList.vue";
import { fetchMemberProfile, fetchMemberSummary, fetchMinutes, renewMembership } from "@/api/member";
import { onEvent } from "@/realtime/socket";

const router = useRouter();
const profile = ref(null);
const minutes = ref([]);
const expiryDate = ref("");

async function load(){
  const [p, , list] = await Promise.all([fetchMemberProfile(), fetchMemberSummary(), fetchMinutes()]);
  profile.value = p; minutes.value = list; expiryDate.value = p?.expiresAt ? new Date(p.expiresAt).toLocaleDateString() : "";
}
function handleEdit(){ router.push("/member/edit"); }
async function handleRenew(payload){
  try{
    const res = await renewMembership(payload);
    if(res?.expiresAt){ profile.value.expiresAt = res.expiresAt; expiryDate.value = new Date(res.expiresAt).toLocaleDateString(); }
  }catch(e){ console.error(e); alert("Renewal failed. Please try again."); }
}
onMounted(() => {
  load();
  onEvent("membership:update", (data) => {
    if(!profile.value) return;
    if(data?.memberId === profile.value.id){
      if(data.expiresAt){ profile.value.expiresAt = data.expiresAt; expiryDate.value = new Date(data.expiresAt).toLocaleDateString(); }
      if(data.status){ profile.value.status = data.status; }
    }
  });
  onEvent("minutes:new", (m) => { minutes.value = [m, ...minutes.value]; });
});
</script>
