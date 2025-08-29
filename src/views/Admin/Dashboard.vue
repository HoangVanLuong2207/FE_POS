<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1>Admin Dashboard</h1>
      <p>Quản trị hệ thống POS</p>
    </div>

    <div class="dashboard-grid">
      <div class="stats-section">
        <div class="stat-card">
          <div class="stat-icon"></div>
          <div class="stat-content">
            <h3>Tổng doanh thu</h3>
            <p class="stat-value">₫12,450,000</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"></div>
          <div class="stat-content">
            <h3>Đơn hàng hôm nay</h3>
            <p class="stat-value">127</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"></div>
          <div class="stat-content">
            <h3>Người dùng</h3>
            <p class="stat-value">2,301</p>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2>Quản trị</h2>
        <div class="action-buttons">
          <button class="action-btn"><router-link to="/admin/categories" class="btn btn-primary">Quản lí danh mục</router-link></button>
          <button class="action-btn"><router-link to="/admin/products" class="btn btn-primary">Quản lý sản phẩm</router-link></button>
          <button class="action-btn">Báo cáo</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Admin specific logic here
</script>

<style scoped>
.dashboard-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
.dashboard-header { text-align: center; margin-bottom: 30px; }
.dashboard-header h1 { margin: 0 0 8px; }
.dashboard-grid { display: grid; gap: 24px; }
.stats-section { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
.stat-card { background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 2px 12px rgba(0,0,0,.06); display: flex; gap: 16px; align-items: center; }
.stat-icon { width: 48px; height: 48px; border-radius: 10px; background: linear-gradient(135deg,#667eea,#764ba2); }
.stat-value { font-size: 1.4rem; font-weight: 700; margin: 4px 0 0; }
.quick-actions { background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 2px 12px rgba(0,0,0,.06); }
.action-buttons { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
.action-btn { padding: 12px 16px; border-radius: 10px; border: 2px solid #e9ecef; background: #f8f9fa; cursor: pointer; text-align: left; }
@media (max-width: 768px){ .dashboard-container{ padding: 15px; } }
</style>