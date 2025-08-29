<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-illustration">
        <div class="error-number">404</div>
        <div class="error-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
      </div>
      
      <h1>Oops! Trang không tìm thấy</h1>
      <p>Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển. Hãy kiểm tra lại URL hoặc quay về trang chủ.</p>
      
      <div class="action-buttons">
        <router-link to="/" class="btn btn-primary">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          Quay về trang chủ
        </router-link>
        <button class="btn btn-secondary" @click="goBack">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Quay lại
        </button>
      </div>
      
      <div class="helpful-links">
        <h3>Có thể bạn quan tâm:</h3>
        <div class="links-grid">
          <router-link to="/dashboard" class="helpful-link">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
            Dashboard
          </router-link>
          <router-link to="/login" class="helpful-link">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
            </svg>
            Đăng nhập
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
.not-found-container {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.not-found-content {
  max-width: 600px;
  text-align: center;
  background: white;
  padding: 60px 40px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.6s ease-out;
}

.error-illustration {
  position: relative;
  margin-bottom: 30px;
}

.error-number {
  font-size: 8rem;
  font-weight: 900;
  color: #e74c3c;
  line-height: 1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  margin: 0;
}

.error-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.error-icon svg {
  width: 40px;
  height: 40px;
  color: #e74c3c;
}

h1 {
  color: #2c3e50;
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0 0 20px 0;
  line-height: 1.3;
}

p {
  color: #7f8c8d;
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0 0 40px 0;
}

.action-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 50px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 160px;
  justify-content: center;
}

.btn svg {
  width: 20px;
  height: 20px;
}

.btn-primary {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(52, 152, 219, 0.4);
}

.btn-secondary {
  background: transparent;
  color: #7f8c8d;
  border: 2px solid #bdc3c7;
}

.btn-secondary:hover {
  background: #7f8c8d;
  color: white;
  border-color: #7f8c8d;
  transform: translateY(-3px);
}

.helpful-links {
  border-top: 1px solid #ecf0f1;
  padding-top: 40px;
}

.helpful-links h3 {
  color: #2c3e50;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 25px 0;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.helpful-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: #f8f9fa;
  border: 2px solid transparent;
  border-radius: 12px;
  color: #2c3e50;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.helpful-link:hover {
  background: #e9ecef;
  border-color: #3498db;
  transform: translateY(-2px);
}

.helpful-link svg {
  width: 20px;
  height: 20px;
  color: #3498db;
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

/* Responsive Design */
@media (max-width: 768px) {
  .not-found-container {
    padding: 15px;
  }
  
  .not-found-content {
    padding: 40px 25px;
    border-radius: 16px;
  }
  
  .error-number {
    font-size: 6rem;
  }
  
  .error-icon {
    width: 60px;
    height: 60px;
  }
  
  .error-icon svg {
    width: 30px;
    height: 30px;
  }
  
  h1 {
    font-size: 1.8rem;
  }
  
  p {
    font-size: 1rem;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 100%;
    max-width: 280px;
  }
  
  .links-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .not-found-content {
    padding: 30px 20px;
  }
  
  .error-number {
    font-size: 5rem;
  }
  
  .error-icon {
    width: 50px;
    height: 50px;
  }
  
  .error-icon svg {
    width: 25px;
    height: 25px;
  }
  
  h1 {
    font-size: 1.6rem;
  }
  
  .helpful-links h3 {
    font-size: 1.2rem;
  }
}
</style>