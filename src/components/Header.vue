<template>
  <header class="app-header">
    <div class="header-container">
      <router-link to="/" class="logo">
        <span>POS System</span>
      </router-link>
      
      <!-- Mobile menu button -->
      <button 
        class="mobile-menu-btn"
        @click="toggleMobileMenu"
        :class="{ 'active': isMobileMenuOpen }"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav class="header-nav" :class="{ 'mobile-open': isMobileMenuOpen }">
        <ul class="nav-links">
          <li v-if="isLoggedIn">
            <a href="#" class="nav-item" @click.prevent="goToDashboard">Dashboard</a>
          </li>
        </ul>
        <button
          v-if="isLoggedIn"
          class="logout-btn"
          @click="handleLogout"
        >
          Đăng xuất
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
const baseURLimg= import.meta.env.VITE_API_IMG_URL;
const router = useRouter();
const isLoggedIn = ref(false);
const isMobileMenuOpen = ref(false);

const checkLoginStatus = () => {
  const token = sessionStorage.getItem('token');
  isLoggedIn.value = !!token;
};

const goToDashboard = () => {
  const role = sessionStorage.getItem('role');
  if (role === 'admin') router.push({ name: 'admin-dashboard' });
  else router.push({ name: 'home' });
  closeMobileMenu();
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const handleResize = () => {
  if (window.innerWidth > 768) {
    isMobileMenuOpen.value = false;
  }
};

onMounted(() => {
  checkLoginStatus();
  window.addEventListener('storage', checkLoginStatus);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

const handleLogout = async () => {
  try {
    await api.post('/logout');
  } catch (err) {
    // ignore
  }
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('role');
  checkLoginStatus();
  closeMobileMenu();
  router.push({ name: 'login' });
};
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: all 0.3s ease;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #2c3e50;
  font-weight: 700;
  font-size: 1.5rem;
  transition: color 0.3s ease;
}

.logo:hover {
  color: #3498db;
}

.mobile-menu-btn {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  z-index: 1001;
}

.mobile-menu-btn span {
  width: 25px;
  height: 3px;
  background-color: #2c3e50;
  margin: 3px 0;
  transition: 0.3s;
  border-radius: 2px;
}

.mobile-menu-btn.active span:nth-child(1) {
  transform: rotate(-45deg) translate(-5px, 6px);
}

.mobile-menu-btn.active span:nth-child(2) {
  opacity: 0;
}

.mobile-menu-btn.active span:nth-child(3) {
  transform: rotate(45deg) translate(-5px, -6px);
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 20px;
}

.nav-item {
  text-decoration: none;
  color: #555;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.nav-item:hover {
  color: #3498db;
  background-color: #f8f9fa;
}

.logout-btn {
  padding: 10px 20px;
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #c0392b;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);
}

/* Mobile styles */
@media (max-width: 768px) {
  .header-container {
    padding: 15px;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .header-nav {
    position: fixed;
    top: 0;
    right: -100%;
    width: 280px;
    height: 100vh;
    background-color: #fff;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    padding: 80px 20px 20px;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
    transition: right 0.3s ease;
    gap: 0;
  }

  .header-nav.mobile-open {
    right: 0;
  }

  .nav-links {
    flex-direction: column;
    gap: 0;
    margin-bottom: 30px;
  }

  .nav-item {
    display: block;
    padding: 15px 0;
    border-bottom: 1px solid #eee;
    text-align: center;
  }

  .logout-btn {
    width: 100%;
    padding: 15px;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .header-container {
    padding: 12px 15px;
  }

  .logo {
    font-size: 1.3rem;
  }

  .header-nav {
    width: 100%;
    right: -110%;
  }
}
</style>
