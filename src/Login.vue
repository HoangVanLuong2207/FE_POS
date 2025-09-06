<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>Đăng nhập hệ thống</h2>
        <p>Vui lòng nhập thông tin đăng nhập của bạn</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <div class="input-wrapper">
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              required 
              placeholder="Nhập email của bạn"
              class="form-input"
            >
          </div>
        </div>
        
        <div class="form-group">
          <label for="password">Mật khẩu</label>
          <div class="input-wrapper">
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              required 
              placeholder="Nhập mật khẩu"
              class="form-input"
            >
          </div>
        </div>
        
        <button type="submit" :disabled="loading" class="submit-btn">
          <span v-if="loading" class="loading-spinner"></span>
          {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
        </button>
        
        <div v-if="error" class="error-message">
          <svg class="error-icon" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import api from './services/api'; 

const router = useRouter();
const toast = useToast();

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

    const token = response.data?.token;
    const role = response.data?.user?.role || response.data?.role;

    if (!token) {
      throw new Error('Phản hồi không hợp lệ: thiếu token');
    }

      // Sau khi setItem token
    sessionStorage.setItem('token', token);
    if (role) sessionStorage.setItem('role', role);
    // Phát sự kiện storage để Header.vue nhận được
    window.dispatchEvent(new Event('storage'));

    // Toast đăng nhập thành công
    toast.success('Đăng nhập thành công!');
    router.push({ name: 'home' });

  } catch (err) {
    if (err.response && err.response.status === 403) {
      error.value = 'Bạn không có quyền truy cập.';
    } else {
      error.value = err.response?.data?.message || err.message || 'Thông tin đăng nhập không chính xác.';
    }
    console.error('Lỗi đăng nhập:', err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-top: -20px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 450px;
  animation: slideUp 0.6s ease-out;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 10px 0;
}

.login-header p {
  color: #7f8c8d;
  margin: 0;
  font-size: 1rem;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.95rem;
}

.input-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e1e8ed;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #3498db;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-input::placeholder {
  color: #bdc3c7;
}

.submit-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(52, 152, 219, 0.3);
}

.submit-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #fff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-message {
  margin-top: 20px;
  padding: 16px;
  background-color: #fee;
  color: #c0392b;
  border: 1px solid #fadbd8;
  border-radius: 12px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 500;
}

.error-icon {
  width: 20px;
  height: 20px;
  fill: #c0392b;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  .login-container {
    padding: 15px;
  }
  
  .login-card {
    padding: 30px 25px;
    border-radius: 12px;
    margin: 0;
  }
  
  .login-header h2 {
    font-size: 1.75rem;
  }
  
  .form-input {
    padding: 14px 18px;
  }
  
  .submit-btn {
    padding: 14px;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 10px;
    padding-top: 2vh;
    padding-bottom: 2vh;
  }
  
  .login-card {
    padding: 25px 20px;
  }
  
  .login-header h2 {
    font-size: 1.5rem;
  }
  
  .login-header p {
    font-size: 0.9rem;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-input {
    padding: 12px 16px;
    font-size: 0.95rem;
  }
  
  .submit-btn {
    padding: 12px;
    font-size: 0.95rem;
  }
}

@media (max-width: 360px) {
  .login-container {
    padding: 8px;
    padding-top: 1vh;
    padding-bottom: 1vh;
  }
  
  .login-card {
    padding: 20px 15px;
  }
  
  .login-header h2 {
    font-size: 1.4rem;
  }
}

/* Mobile keyboard optimization */
@media (max-height: 600px) {
  .login-container {
    padding-top: 1vh;
    padding-bottom: 1vh;
    align-items: flex-start;
  }
  
  .login-card {
    margin: 0;
  }
  
  .login-header {
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 16px;
  }
}

/* Landscape mobile optimization */
@media (max-height: 500px) and (orientation: landscape) {
  .login-container {
    padding: 10px;
    padding-top: 0.5vh;
    padding-bottom: 0.5vh;
  }
  
  .login-card {
    padding: 20px;
  }
  
  .login-header {
    margin-bottom: 15px;
  }
  
  .login-header h2 {
    font-size: 1.3rem;
    margin-bottom: 5px;
  }
  
  .login-header p {
    font-size: 0.85rem;
  }
  
  .form-group {
    margin-bottom: 12px;
  }
  
  .form-input {
    padding: 10px 14px;
  }
  
  .submit-btn {
    padding: 10px;
  }
}
</style>