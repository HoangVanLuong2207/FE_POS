// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import router đã tạo

const app = createApp(App);

app.use(router); // Sử dụng router trong ứng dụng
app.mount('#app');