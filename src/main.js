// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import router đã tạo
import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const app = createApp(App);

app.use(router); // Sử dụng router trong ứng dụng
app.use(Toast, {
  position: POSITION.TOP_RIGHT,
  timeout: 2500,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});
app.mount('#app');