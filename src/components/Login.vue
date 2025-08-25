<template>
  <div class="login-container">
    <h2>Đăng nhập hệ thống</h2>
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label for="email">Email:</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          required 
          placeholder="Nhập email của bạn"
        >
      </div>
      <div class="form-group">
        <label for="password">Mật khẩu:</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          required 
          placeholder="Nhập mật khẩu"
        >
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
      </button>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// Giả định bạn đã tạo và cấu hình file src/services/api.js
import api from '../services/api'; 

const router = useRouter();

const email = ref('');
const password = ref('');
const error = ref(null);
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await api.post('/login', {
      email: email.value,
      password: password.value,
    });

    // Sau khi đăng nhập thành công, bạn có thể xử lý phản hồi từ backend tại đây
    // Ví dụ: lưu token vào Local Storage
    localStorage.setItem('auth_token', response.data.token);
    
    // Chuyển hướng người dùng đến một trang khác (ví dụ: dashboard)
    router.push('/dashboard');
    
  } catch (err) {
    // Xử lý lỗi từ backend
    if (err.response && err.response.status === 403) {
      error.value = 'Bạn không có quyền truy cập.';
    } else {
      error.value = err.response?.data?.message || 'Thông tin đăng nhập không chính xác.';
    }
    console.error('Lỗi đăng nhập:', err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* CSS để tạo kiểu cho form */
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #fff;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.login-form .form-group {
  margin-bottom: 15px;
}

.login-form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.login-form input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.login-form button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.login-form button:hover:not(:disabled) {
  background-color: #0056b3;
}

.login-form button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  margin-top: 15px;
  padding: 10px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  text-align: center;
}
</style>