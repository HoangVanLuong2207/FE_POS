// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../components/Dashboard.vue'),
    },

      {
      path: '/',
      name: 'home',
      component: () => import('../components/Home.vue'),
    },
    // Thêm các route khác vào đây

  ],
});

// Navigation guard kiểm tra đăng nhập
router.beforeEach((to, from, next) => {
  // Giả sử token lưu ở localStorage
  const isLoggedIn = !!localStorage.getItem('token');
  if (to.name !== 'login' && !isLoggedIn) {
    next({ name: 'login' });
  } else if (to.name === 'login' && isLoggedIn) {
    // Nếu đã đăng nhập mà vào trang login thì chuyển về home (hoặc trang chính)
    next({ path: '/' });
  } else {
    next();
  }
});

export default router;