import { createRouter, createWebHistory } from "vue-router";
const MemberDashboard = () => import("@/views/MemberDashboard.vue");
const MinutesPage = () => import("@/views/MemberDashboard.vue"); // reuse

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/member/dashboard", component: MemberDashboard, meta:{ requiresAuth:true, role:"member" } },
    { path: "/member/minutes",   component: MinutesPage,     meta:{ requiresAuth:true, role:"member" } },
  ],
});

router.beforeEach((to, from, next) => {
  if(to.meta.requiresAuth){
    const token = localStorage.getItem("access_token");
    const role  = localStorage.getItem("role");
    if(!token) return next("/login");
    if(to.meta.role && role !== to.meta.role) return next("/403");
  }
  next();
});

export default router;
