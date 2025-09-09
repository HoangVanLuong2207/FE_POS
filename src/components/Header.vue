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
          <li>
          </li>
          <!-- Admin Dropdown -->
          <li v-if="isAdmin"><router-link class="nav-item" to="/admin" @click="closeMobileMenu">Thống kê</router-link></li>
          <li v-if="isAdmin"><router-link class="nav-item" to="/staff" @click="closeMobileMenu">Cửa hàng</router-link></li>
          <li class="dropdown" v-if="isAdmin" @mouseenter="openDropdown" @mouseleave="closeDropdown">
            <button 
              class="dropdown-toggle" 
              :class="{ 'active': isDropdownOpen || isManagementActive }" 
              @click="toggleDropdown"
            >
              Quản lý
              <span class="dropdown-icon">{{ isDropdownOpen ? '▲' : '▼' }}</span>
            </button>
            <ul class="dropdown-menu" :class="{ 'show': isDropdownOpen }">
              <li><router-link class="nav-item" to="/admin/products" @click="closeMobileMenu">Quản lý sản phẩm</router-link></li>
              <li><router-link class="nav-item" to="/admin/categories" @click="closeMobileMenu">Quản lý danh mục</router-link></li>
            </ul>
          </li>
          <!-- Staff Links -->
          <li v-if="isStaff">
            <router-link class="nav-item" to="/staff/sales" @click="closeMobileMenu">Bán hàng</router-link>
          </li>
          <li v-if="isStaff">
            <router-link class="nav-item" to="/staff/orders" @click="closeMobileMenu">Đơn hàng</router-link>
          </li>
          <li v-if="isLoggedIn">
            <button class="logout-btn" @click="handleLogout">Đăng xuất</button>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/services/api';

const baseURLimg = import.meta.env.VITE_API_IMG_URL;
const router = useRouter();
const route = useRoute();
const isLoggedIn = ref(false);
const isMobileMenuOpen = ref(false);
const isAdmin = ref(false);
const isStaff = ref(false);
const isDropdownOpen = ref(false);

const checkLoginStatus = () => {
  const token = sessionStorage.getItem('token');
  isLoggedIn.value = !!token;
  isAdmin.value = sessionStorage.getItem('role') === 'admin';
  isStaff.value = sessionStorage.getItem('role') === 'staff';
};

const isManagementActive = computed(() => {
  return route.path.startsWith('/admin/products') || route.path.startsWith('/admin/categories');
});

const goToDashboard = () => {
  const role = sessionStorage.getItem('role');
  if (role === 'admin') router.push({ name: 'admin-dashboard' });
  else router.push({ name: 'home' });
  closeMobileMenu();
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  if (!isMobileMenuOpen.value) isDropdownOpen.value = false;
};

const toggleDropdown = () => {
  if (window.innerWidth <= 768) {
    isDropdownOpen.value = !isDropdownOpen.value;
  }
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
  isDropdownOpen.value = false;
};

const openDropdown = () => {
  if (window.innerWidth > 768) {
    isDropdownOpen.value = true;
  }
};

const closeDropdown = () => {
  if (window.innerWidth > 768) {
    isDropdownOpen.value = false;
  }
};

const handleResize = () => {
  if (window.innerWidth > 768) {
    isMobileMenuOpen.value = false;
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  checkLoginStatus();
  window.addEventListener('storage', checkLoginStatus);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('storage', checkLoginStatus);
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
  align-items: center;
  gap: 10px;
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

/* Dropdown Styles */
.dropdown {
  position: relative;
}

.dropdown-toggle {
  background: none;
  border: none;
  color: #555;
  font-weight: 500;
  padding: 8px 16px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.dropdown-toggle:hover {
  color: #3498db;
  background-color: #f8f9fa;
}

.dropdown-toggle.active {
  color: #3498db;
  background-color: #f0f8ff;
  font-weight: 600;
}

.dropdown-icon {
  font-size: 0.8rem;
  transition: transform 0.3s ease;
}

.dropdown-toggle.active .dropdown-icon {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  list-style: none;
  padding: 10px 0;
  margin: 5px 0 0 0;
  min-width: 200px;
  max-width: 250px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;
  z-index: 1000;
}

.dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-menu .nav-item {
  display: block;
  padding: 10px 20px;
  width: 100%;
  box-sizing: border-box;
  border-radius: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-menu .nav-item:hover {
  background-color: #f0f8ff;
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
  }

  .header-nav.mobile-open {
    right: -20px;
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
    width: 80%;
    padding: 15px;
    font-size: 1rem;
  }

  /* Mobile Dropdown */
  .dropdown {
    width: 100%;
  }

  .dropdown-toggle {
    width: 100%;
    text-align: left;
    padding: 15px;
    border-bottom: 1px solid #eee;
  }

  .dropdown-menu {
    position: static;
    box-shadow: none;
    background-color: #f8f9fa;
    width: 100%;
    margin: 0;
    padding: 0;
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  .dropdown-menu.show {
    max-height: 300px;
  }

  .dropdown-menu .nav-item {
    padding: 15px 20px;
    border-bottom: 1px solid #ddd;
    width: 100%;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
 .logout-btn {
    width: 100%;
 }
}

.nav-item.router-link-active,
.nav-item.router-link-exact-active {
  color: #3498db;
  background-color: #f0f8ff;
  font-weight: 600;
}
</style>