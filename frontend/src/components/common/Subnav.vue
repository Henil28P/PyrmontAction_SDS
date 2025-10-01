<template>
  <nav class="subnav" role="tablist" aria-label="Section navigation">
    <button
      v-for="item in items"
      :key="item.name"
      :class="['tab', current===item.name && 'active']"
      @click="$emit('update:current', item.name)"
      role="tab"
      :aria-selected="current===item.name"
    >
      {{ item.label }}
    </button>
  </nav>
</template>

<script>
export default {
  name: 'Subnav',
  props: { items: {type:Array, required:true}, current: {type:String, required:true} }
}
</script>

<style scoped>
.subnav{
  display:flex; justify-content:center; gap:12px; flex-wrap:wrap;
  padding:10px 0 18px; position:relative;
}
.tab{
  appearance:none; border:1px solid #e6e6e6; background:#fff;
  padding:10px 16px; border-radius:999px; cursor:pointer;
  font-weight:600; color:#222; letter-spacing:.2px;
  transition:transform .15s ease, box-shadow .2s ease, background .2s;
}
.tab:hover{ transform:translateY(-1px); box-shadow:0 8px 24px rgba(0,0,0,.06); }
.active{
  background:#0ea5e9; border-color:#0ea5e9; color:#fff;
  box-shadow:0 10px 28px rgba(14,165,233,.35);
}
</style>
