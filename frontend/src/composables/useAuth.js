import { reactive, computed } from "vue";

const state = reactive({
  email: localStorage.getItem("email") || "",
  token: localStorage.getItem("token") || "",
  role:  Number(localStorage.getItem("role") || 1),
});

export function useAuth() {
  const isAuthed = computed(() => !!state.token);

  function setUser({ email, token, role = 1 }) {
    state.email = email;
    state.token = token;
    state.role  = Number(role);
    localStorage.setItem("email", email);
    localStorage.setItem("token", token);
    localStorage.setItem("role", String(role));
  }

  function logout() {
    state.email = "";
    state.token = "";
    state.role  = 1;
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }

  return { state, isAuthed, setUser, logout };
}
