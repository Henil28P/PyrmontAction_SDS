import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import { useAuthStore } from './stores/auth';

import 'bootstrap/dist/css/bootstrap.min.css'; // CSS framework 

const app = createApp(App);
const pinia = createPinia();

app.config.globalProperties.$axios = axios;
app.use(pinia);
app.use(router);

// Initialize auth store after pinia is installed
const authStore = useAuthStore();
authStore.initializeAuth();

app.mount('#app');
