<template>
  <section class="card">
    <header class="hdr">
      <h3 class="ttl">{{ title }}</h3>
      <div class="actions"><slot name="action" /></div>
    </header>
    <div class="body"><slot /></div>
  </section>
</template>

<script>
export default { name:'StatCard', props:{ title:{type:String, required:true} } }
</script>

<style scoped>
.card{
  background:#fff; border:1px solid #eee; border-radius:16px; padding:18px;
  box-shadow:0 10px 30px rgba(0,0,0,.06);
  transition:transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}
.card:hover{ transform:translateY(-2px); box-shadow:0 16px 40px rgba(0,0,0,.08); border-color:#e6e6e6; }
.hdr{ display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
.ttl{ font-size:18px; font-weight:700; margin:0; color:#0f172a; }
.body{ color:#334155; font-size:14.5px; }
.actions :deep(a), .actions :deep(button){
  font-size:13px; padding:6px 10px; border-radius:10px; border:1px solid #e5e7eb; background:#f8fafc; cursor:pointer;
}
.actions :deep(a:hover), .actions :deep(button:hover){ background:#eef6ff; border-color:#c7e3ff; }
</style>
