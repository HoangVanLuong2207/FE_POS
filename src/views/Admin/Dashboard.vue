<template>
  <div class="dashboard-container">
   

    <div class="dashboard-grid">
      <!-- Bộ lọc tháng/năm -->
      <div class="filters-row">
        <div class="filter-item">
          <label for="year">Năm</label>
          <select id="year" v-model.number="selectedYear" class="select">
            <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
        <div class="filter-item">
          <label for="month">Tháng</label>
          <select id="month" v-model.number="selectedMonth" class="select">
            <option v-for="m in monthOptions" :key="m.value" :value="m.value">{{ m.label }}</option>
          </select>
        </div>
        <button class="refresh-btn" @click="applyFilter">Xem thống kê</button>
      </div>
      <!-- Thống kê -->
      <div class="stats-section">
        <div class="stat-card">
          <div class="stat-icon"></div>
          <div class="stat-content">
            <h3>Tổng nhập</h3>
            <p class="stat-value">₫{{ formatNumber(dashboard.subtotal) }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"></div>
          <div class="stat-content">
            <h3>Tổng bán</h3>
            <p class="stat-value">₫{{ formatNumber(dashboard.total) }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"></div>
          <div class="stat-content">
            <h3>Lợi nhuận tổng</h3>
            <p class="stat-value">₫{{ formatNumber(dashboard.profit) }}</p>
          </div>
        </div>
      </div>

      <!-- Quick actions -->
      <div class="quick-actions">
        <h2>Quản trị</h2>
        <div class="action-buttons">
          <router-link to="/admin/categories" class="action-btn">
            Quản lí danh mục
          </router-link>
          <router-link to="/admin/products" class="action-btn">
            Quản lý sản phẩm
          </router-link>
          <button class="action-btn">Báo cáo</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useToast } from 'vue-toastification'

const toast = useToast()

// State lưu dữ liệu từ backend
const dashboard = ref({ subtotal: 0, total: 0, profit: 0 })

// Options tháng/năm
const now = new Date()
const selectedYear = ref(now.getFullYear())
const selectedMonth = ref(now.getMonth() + 1)
const yearOptions = ref([now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1])
const monthOptions = ref([
  { value: 1, label: 'Tháng 1' },
  { value: 2, label: 'Tháng 2' },
  { value: 3, label: 'Tháng 3' },
  { value: 4, label: 'Tháng 4' },
  { value: 5, label: 'Tháng 5' },
  { value: 6, label: 'Tháng 6' },
  { value: 7, label: 'Tháng 7' },
  { value: 8, label: 'Tháng 8' },
  { value: 9, label: 'Tháng 9' },
  { value: 10, label: 'Tháng 10' },
  { value: 11, label: 'Tháng 11' },
  { value: 12, label: 'Tháng 12' },
])

// Gọi API backend
const refresh = async () => {
  try {
    const res = await api.get('/admin/dashboard')
    dashboard.value = res.data.data
  } catch (error) {
    toast.error('Không thể tải dashboard')
  }
}

// Lọc theo tháng/năm
const applyFilter = async () => {
  try {
    const res = await api.get('/admin/dashboard/monthly', {
      params: { year: selectedYear.value, month: selectedMonth.value }
    })
    // Expect: { subtotal, total, profit } cho tháng/năm
    dashboard.value = res.data?.data || res.data
  } catch (error) {
    toast.error('Không thể tải thống kê theo tháng')
  }
}

onMounted(() => {
  refresh()
})

// Format tiền VND
const formatNumber = (num) => {
  return new Intl.NumberFormat('vi-VN').format(num || 0)
}
</script>

<style scoped>
.dashboard-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
.dashboard-header { text-align: center; margin-bottom: 30px; }
.dashboard-header h1 { margin: 0 0 8px; }
.dashboard-grid { display: grid; gap: 24px; }
.filters-row { display: flex; gap: 12px; align-items: flex-end; flex-wrap: wrap; }
.filter-item { display: grid; gap: 6px; }
.filter-item label { font-weight: 600; color: #2c3e50; }
.select { padding: 10px 12px; border: 1px solid #e1e5ea; border-radius: 8px; background: #fff; }
.refresh-btn { padding: 10px 16px; border-radius: 8px; border: 1px solid #e1e5ea; background: #3498db; color: #fff; cursor: pointer; }
.refresh-btn:hover { filter: brightness(0.98); }
.stats-section { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
.stat-card { background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 2px 12px rgba(0,0,0,.06); display: flex; gap: 16px; align-items: center; }
.stat-icon { width: 48px; height: 48px; border-radius: 10px; background: linear-gradient(135deg,#667eea,#764ba2); }
.stat-value { font-size: 1.4rem; font-weight: 700; margin: 4px 0 0; }
.quick-actions { background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 2px 12px rgba(0,0,0,.06); }
.action-buttons { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
.action-btn { padding: 12px 16px; border-radius: 10px; border: 2px solid #e9ecef; background: #f8f9fa; cursor: pointer; text-align: center; font-weight: 500; text-decoration: none; color: #333; transition: 0.2s; }
.action-btn:hover { background: #e9ecef; }
@media (max-width: 768px){ .dashboard-container{ padding: 15px; } }
</style>
