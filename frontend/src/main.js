import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css'; // CSS framework 

const app = createApp(App);
app.config.globalProperties.$axios = axios;
app.use(router);
app.mount('#app');


