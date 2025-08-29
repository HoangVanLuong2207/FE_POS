// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../Login.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      redirect: () => {
        const token = sessionStorage.getItem('token');
        return token ? { name: 'home' } : { name: 'login' };
      },
      meta: { public: true },
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue'),
      meta: { requiresAuth: true },
    },
    //admin
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: () => import('../views/Admin/Dashboard.vue'),
      meta: { requiresAuth: true, role: 'admin' },
    },

    {
      path: '/admin/categories',
      name: 'admin-categories',
      component: () => import('../views/Admin/Categories.vue'),
      meta: { requiresAuth: true, role: 'admin' },
    },
    {
      path: '/admin/products',
      name: 'admin-products',
      component: () => import('../views/Admin/Products.vue'),
      meta: { requiresAuth: true, role: 'admin' },
    },
    //staff
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue'),
      meta: { public: true },
    },
  ],
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const token = sessionStorage.getItem('token');
  const role = sessionStorage.getItem('role');
  const isLoggedIn = !!token;

  // Public routes allowed
  if (to.meta?.public) {
    if (to.name === 'login' && isLoggedIn) {
      return next({ name: 'home' });
    }
    return next();
  }

  // Requires auth
  if (to.meta?.requiresAuth) {
    if (!isLoggedIn) return next({ name: 'login' });
    if (to.meta?.role && to.meta.role !== role) {
      // Lazy import to avoid bundling toast here if not needed
      try {
        const { useToast } = await import('vue-toastification');
        const toast = useToast();
        toast.error('Bạn không có quyền truy cập trang này.');
      } catch (e) {}
      return next({ name: 'home' });
    }
    return next();
  }

  if (!isLoggedIn) return next({ name: 'login' });
  return next();
});

export default router;