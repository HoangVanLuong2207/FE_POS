<template>
  <div class="home-container">
    <div class="hero-section">
      <div class="hero-content">
        <h1>Hệ thống quản lý POS</h1>
        <p>Giải pháp toàn diện cho việc quản lý bán hàng và kinh doanh</p>
        <div class="hero-buttons">
          <router-link to="/admin" class="btn btn-primary">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Đến trang admin
          </router-link>
          <router-link to="/staff" class="btn btn-primary">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Đến trang bán hàng
          </router-link>
        </div>
      </div>
      <div class="hero-image">
        <div class="mockup-pos">
          <div class="pos-screen">
            <div class="pos-header">
              <span class="pos-title">POS System</span>
              <span class="pos-time">14:30</span>
            </div>
            <div class="pos-content">
              <div class="pos-item">
                <span>Cà phê sữa</span>
                <span>₫25,000</span>
              </div>
              <div class="pos-item">
                <span>Bánh mì</span>
                <span>₫15,000</span>
              </div>
              <div class="pos-total">
                <span>Tổng cộng</span>
                <span>₫40,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="features-section">
      <h2>Tính năng nổi bật</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h3>Quản lý bán hàng</h3>
          <p>Xử lý đơn hàng nhanh chóng, quản lý kho hàng hiệu quả</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h3>Báo cáo chi tiết</h3>
          <p>Thống kê doanh thu, phân tích xu hướng kinh doanh</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h3>Quản lý khách hàng</h3>
          <p>Lưu trữ thông tin khách hàng, chăm sóc khách hàng hiệu quả</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h3>Đồng bộ đa thiết bị</h3>
          <p>Làm việc trên nhiều thiết bị, dữ liệu được đồng bộ real-time</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
// Home component logic can be added here
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero Section */
.hero-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  padding: 60px 0;
  min-height: 70vh;
}

.hero-content h1 {
  font-size: 3.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 20px 0;
  line-height: 1.2;
}

.hero-content p {
  font-size: 1.3rem;
  color: #7f8c8d;
  margin: 0 0 40px 0;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
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
  color: #3498db;
  border: 2px solid #3498db;
}

.btn-secondary:hover {
  background: #3498db;
  color: white;
  transform: translateY(-3px);
}

.btn-large {
  padding: 18px 40px;
  font-size: 1.2rem;
}

/* Hero Image */
.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.mockup-pos {
  background: #2c3e50;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  transform: perspective(1000px) rotateY(-15deg) rotateX(10deg);
  transition: transform 0.3s ease;
}

.mockup-pos:hover {
  transform: perspective(1000px) rotateY(-10deg) rotateX(5deg);
}

.pos-screen {
  background: #ecf0f1;
  border-radius: 12px;
  padding: 20px;
  min-width: 280px;
}

.pos-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #bdc3c7;
}

.pos-title {
  font-weight: 700;
  color: #2c3e50;
  font-size: 1.2rem;
}

.pos-time {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.pos-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pos-item {
  display: flex;
  justify-content: space-between;
  color: #2c3e50;
  font-size: 0.95rem;
}

.pos-total {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  color: #2c3e50;
  font-size: 1.1rem;
  padding-top: 15px;
  border-top: 2px solid #bdc3c7;
}

/* Features Section */
.features-section {
  padding: 80px 0;
  text-align: center;
}

.features-section h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 60px 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.feature-card {
  background: white;
  padding: 40px 30px;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 25px;
  color: white;
}

.feature-icon svg {
  width: 40px;
  height: 40px;
}

.feature-card h3 {
  font-size: 1.4rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 15px 0;
}

.feature-card p {
  color: #7f8c8d;
  line-height: 1.6;
  margin: 0;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  margin: 80px 0;
}

.cta-content h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin: 0 0 20px 0;
}

.cta-content p {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 40px 0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-section {
    gap: 40px;
    padding: 40px 0;
  }
  
  .hero-content h1 {
    font-size: 3rem;
  }
  
  .features-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 25px;
  }
}

@media (max-width: 768px) {
  .home-container {
    padding: 0 15px;
  }
  
  .hero-section {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
    padding: 30px 0;
  }
  
  .hero-content h1 {
    font-size: 2.5rem;
  }
  
  .hero-content p {
    font-size: 1.1rem;
  }
  
  .hero-buttons {
    justify-content: center;
  }
  
  .btn {
    padding: 12px 25px;
    font-size: 1rem;
  }
  
  .features-section {
    padding: 60px 0;
  }
  
  .features-section h2 {
    font-size: 2rem;
    margin-bottom: 40px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .feature-card {
    padding: 30px 25px;
  }
  
  .cta-section {
    padding: 40px 25px;
    margin: 60px 0;
  }
  
  .cta-content h2 {
    font-size: 2rem;
  }
  
  .cta-content p {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .hero-content p {
    font-size: 1rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }
  
  .mockup-pos {
    transform: none;
    padding: 15px;
  }
  
  .pos-screen {
    min-width: 240px;
    padding: 15px;
  }
  
  .features-section h2 {
    font-size: 1.8rem;
  }
  
  .cta-content h2 {
    font-size: 1.8rem;
  }
  
  .cta-content p {
    font-size: 1rem;
  }
}
</style>