<!-- src/views/ContactView.vue -->
<template>
  <div class="contact-page">
    <ContactHeroSection />
    <ContactFollowUsSection />
    <ContactLocationSection />
    <ContactFormSection />

  </div>
</template>

<script setup>
import ContactHeroSection from '@/features/contact/components/ContactHeroSection.vue'
import ContactFormSection from '@/features/contact/components/ContactFormSection.vue'
import ContactFollowUsSection from '@/features/contact/components/ContactFollowUsSection.vue'
import ContactLocationSection from '@/features/contact/components/ContactLocationSection.vue'


</script>

<style scoped>
.contact-page {
  display: flex;
  flex-direction: column;
}
</style>
