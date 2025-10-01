import LoginPage from "./views/LoginPage.vue";

export const loginRoutes = [
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role"); // "0" admin, "1" member

      if (token) {
        if (role === "0") return next("/admin/dashboard");
        if (role === "1") return next("/member/dashboard");
      }
      next(); // no token or no role -> stay on login
    },
  },
];
