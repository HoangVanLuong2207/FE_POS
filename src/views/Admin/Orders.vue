<template>
    <div class="categories-container">
      <header class="page-header">
        <div class="title-group">
          <h1>Quản lý hóa đơn</h1>
          <p>Quản lý hóa đơn bán hàng và nhập hàng</p>
        </div>
        <div class="actions-group">
          <input
            v-model="query.keyword"
            @keyup.enter="refresh"
            type="text"
            class="search-input"
            :placeholder="activeTab === 'sales' ? 'Tìm theo mã hóa đơn bán hàng...' : 'Tìm theo mã hóa đơn nhập hàng...'"
          />
          <button class="btn" style="border-color:black;" @click="search">Tìm</button>
          
        </div>
      </header>

      <!-- Tab Navigation -->
      <div class="tab-navigation">
        <button 
          :class="['tab-button', { active: activeTab === 'sales' }]"
          @click="switchTab('sales')"
        >
          Hóa đơn bán hàng
        </button>
        <button 
          :class="['tab-button', { active: activeTab === 'purchase' }]"
          @click="switchTab('purchase')"
        >
          Hóa đơn nhập hàng
        </button>
      </div>
  
      <section class="card">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr v-if="activeTab === 'sales'">
              
                <th>Mã hóa đơn</th>
                <th>Khách hàng</th>
                <th>Tổng tiền</th>
                <th>Ngày tạo</th>
                
                <th style="width: 210px;">Thao tác</th>
              </tr>
              <tr v-else>
                <th style="width: 30px;">ID</th>
                <th>Mã hóa đơn</th>
                <th>Nhà cung cấp</th>
                <th>Tổng tiền</th>
                <th>Ngày nhập</th>
              
                <th style="width: 210px;">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading && items.length === 0">
                <td :colspan="6" class="text-center py-4">
                  <img src="/loading.svg" alt="Đang tải..." class="w-4 h-4 mx-auto animate-spin" />
                </td>
              </tr>
  
              <tr v-else-if="!loading && items.length === 0">
                <td :colspan="6" class="text-center">Không có dữ liệu</td>
              </tr>
              
              <!-- Hóa đơn bán hàng -->
              <tr v-for="order in (activeTab === 'sales' ? salesItems : [])" :key="order.id" v-if="activeTab === 'sales'">
           
                <td data-label="Mã hóa đơn">{{ order.id || order.order_number || '—' }}</td>
                <td data-label="Khách hàng">{{ order.customer_name || '—' }}</td>
                <td data-label="Tổng tiền">{{ formatCurrency(order.total_amount) }}</td>
                <td data-label="Ngày tạo">{{ formatDate(order.created_at) }}</td>
                <td data-label="Thao tác" class="row-actions">
                  <button class="btn btn-small" @click="viewOrder(order)">Xem</button>
                  <button class="btn btn-small btn-danger" @click="confirmRemove(order)">Xóa</button>
    </td>
              </tr>

              <!-- Hóa đơn nhập hàng -->
              <tr v-for="order in (activeTab === 'purchase' ? purchaseItems : [])" :key="order.id" v-if="activeTab === 'purchase'">
                <td data-label="ID">#{{ order.id }}</td>
                <td data-label="Mã hóa đơn">{{ order.purchase_number || order.invoice_code || '—' }}</td>
                <td data-label="Nhà cung cấp">{{ order.supplier_name || '—' }}</td>
                <td data-label="Tổng tiền">{{ formatCurrency(order.total_amount) }}</td>
                <td data-label="Ngày tạo">{{ formatDate(order.purchase_date || order.created_at) }}</td>
    <td data-label="Thao tác" class="row-actions">
                  <button class="btn btn-small" @click="viewOrder(order)">Xem</button>
                  <button class="btn btn-small btn-danger" @click="confirmRemove(order)">Xóa</button>
    </td>
              </tr>
  
            </tbody>
          </table>
        </div>
  
        <footer class="table-footer" v-if="total > 0">
          <div class="page-size">
            <label>Kích thước trang</label>
            <select v-model.number="query.limit" @change="onPageSizeChange">
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
          </div>
          <div class="pagination">
            <button class="btn btn-small" :disabled="query.page === 1 || loading" @click="gotoPage(query.page - 1)">Trước</button>
            <span>Trang {{ query.page }} / {{ totalPages }}</span>
            <button class="btn btn-small" :disabled="query.page >= totalPages || loading" @click="gotoPage(query.page + 1)">Sau</button>
          </div>
        </footer>
      </section>
  
      
  
  
      <!-- Detail Modal -->
      <transition name="modal">
        <div v-if="detailDialog.visible" class="modal-backdrop" @click.self="closeDetailDialog">
          <div class="modal" style="max-width:800px;">
            <header class="modal-header">
              <h1>Chi tiết {{ activeTab === 'sales' ? 'hóa đơn bán hàng' : 'hóa đơn nhập hàng' }}</h1>
            </header>
            <div class="modal-body">
              <div v-if="detailLoading" class="text-center py-4">
                <img src="/loading.svg" alt="Đang tải..." class="w-4 h-4 mx-auto animate-spin" />
              </div>
              <template v-else>
              <div class="grid-two">
                <div class="form-field">
                  <label>Mã hóa đơn</label>
                  <div>{{ activeTab === 'sales' ? (detail.invoice_code || detail.order_number || ('HD' + (detail.id || ''))) : (detail.purchase_number || detail.invoice_code || ('PN' + (detail.id || ''))) }}</div>
              </div>
                <div class="form-field">
                  <label>{{ activeTab === 'sales' ? 'Khách hàng' : 'Nhà cung cấp' }}</label>
                  <div>{{ activeTab === 'sales' ? (detail.customer_name || 'Khách lẻ') : (detail.supplier_name || 'Chưa xác định') }}</div>
              </div>
                <div class="form-field">
                  <label>Số điện thoại</label>
                  <div>{{ detail.customer_phone || detail.supplier_phone || '—' }}</div>
              </div>
              <div class="form-field">
                  <label>Tổng tiền</label>
                  <div>{{ formatCurrency(detail.total_amount) }}</div>
              </div>
              <div class="form-field">
                  <label>{{ activeTab === 'sales' ? 'Ngày tạo' : 'Ngày nhập' }}</label>
                  <div>{{ formatDate(detail.created_at || detail.purchase_date) }}</div>
                </div>
                
              </div>
              <div class="form-field">
                <label>Ghi chú</label>
                <div class="muted">{{ detail.notes || '—' }}</div>
              </div>

              <!-- Items table if available -->
              <div v-if="detailItems.length" class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Sản phẩm</th>
                      <th>Mô tả</th>
                      <th>SL</th>
                      <th v-if="activeTab === 'purchase'">Giá nhập</th>
                      <th v-if="activeTab === 'purchase'">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(it, idx) in detailItems" :key="idx">
                      <td>{{ idx + 1 }}</td>
                      <td>{{ it.product_name || it.name || ('#' + (it.product_id || '')) }}</td>
                      <td class="muted">{{ it.product_description || it.description || '—' }}</td>
                      <td>{{ it.quantity }}</td>
                      <td v-if="activeTab === 'purchase'">{{ formatCurrency(it.purchase_price) }}</td>
                      <td v-if="activeTab === 'purchase'">{{ formatCurrency(it.total_amount) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              </template>
            </div>
            <footer class="modal-footer">
              <button class="btn" @click="closeDetailDialog">Đóng</button>
            </footer>
          </div>
        </div>
      </transition>

    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue';
  import api from '@/services/api';
  import { useToast } from 'vue-toastification';
  
  const toast = useToast();
  
  // Tab management
  const activeTab = ref('sales');
  
  // Danh sách + phân trang
  const items = ref([]);
  const salesItems = ref([]);
  const purchaseItems = ref([]);
  const total = ref(0);
  const loading = ref(false);
  const query = reactive({ keyword: '', page: 1, limit: 10 });
  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / query.limit)));
  
  // Tab switching
  const switchTab = (tab) => {
    activeTab.value = tab;
    // Do not refetch; reuse cached lists
    items.value = activeTab.value === 'sales' ? salesItems.value : purchaseItems.value;
  };
  
  const search = () => {
    query.page = 1;
    refresh();
  };
  
  const extractItems = (raw) => {
    // Accept various shapes from backend
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.orders)) return raw.orders;
    if (Array.isArray(raw?.purchase_orders)) return raw.purchase_orders;
    if (Array.isArray(raw?.items)) return raw.items;
    if (Array.isArray(raw?.rows)) return raw.rows;
    // Laravel pagination variants
    if (Array.isArray(raw?.orders?.data)) return raw.orders.data;
    if (Array.isArray(raw?.data?.data)) return raw.data.data;
    if (Array.isArray(raw?.data)) return raw.data;
    return [];
  };

  const extractTotal = (raw, list) => {
    if (typeof raw?.total === 'number') return raw.total;
    if (typeof raw?.orders?.total === 'number') return raw.orders.total;
    if (typeof raw?.count === 'number') return raw.count;
    if (typeof raw?.orders?.count === 'number') return raw.orders.count;
    return Array.isArray(list) ? list.length : 0;
  };
  
  const refresh = async () => {
    loading.value = true;
    try {
      const commonParams = { keyword: query.keyword || undefined, page: query.page, limit: query.limit };
      const [salesRes, purchaseRes] = await Promise.all([
        api.get('/admin/orders/sales', { params: commonParams }),
        api.get('/admin/orders/purchase', { params: commonParams })
      ]);
      const salesPayload = salesRes?.data?.data ?? salesRes?.data;
      const purchasePayload = purchaseRes?.data?.data ?? purchaseRes?.data;
      const sList = extractItems(salesPayload);
      const pList = extractItems(purchasePayload);
      salesItems.value = Array.isArray(sList) ? sList : [];
      purchaseItems.value = Array.isArray(pList) ? pList : [];
      // For footer pagination, prefer sales total (or any) since both share UI controls
      total.value = extractTotal(salesPayload, salesItems.value);
      items.value = activeTab.value === 'sales' ? salesItems.value : purchaseItems.value;
      // Prefetch top N details in background to speed up first open
      const prefetchSales = salesItems.value.slice(0, 5).map(o => o.id).filter(Boolean);
      const prefetchPurchase = purchaseItems.value.slice(0, 5).map(o => o.id).filter(Boolean);
      prefetchSales.forEach(async (pid) => {
        const key = String(pid);
        if (detailCache.sales.has(key)) return;
        try {
          const res = await api.get(`/admin/orders/sales/${pid}`);
          const pl = res?.data?.data ?? res?.data;
          const record = pl?.order || pl;
          const items = record?.items || record?.order_items || pl?.items || [];
          detailCache.sales.set(key, { record, items });
        } catch (_) {}
      });
      prefetchPurchase.forEach(async (pid) => {
        const key = String(pid);
        if (detailCache.purchase.has(key)) return;
        try {
          const res = await api.get(`/admin/orders/purchase/${pid}`);
          const pl = res?.data?.data ?? res?.data;
          const record = pl?.purchase_order || pl;
          const items = record?.items || record?.purchase_order_items || pl?.items || [];
          detailCache.purchase.set(key, { record, items });
        } catch (_) {}
      });
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Không tải được hóa đơn');
    } finally {
      loading.value = false;
    }
  };
  
  const gotoPage = (page) => {
    query.page = Math.min(Math.max(1, page), totalPages.value);
    refresh();
  };
  
  const onPageSizeChange = () => {
    query.page = 1;
    refresh();
  };
  
  // Removed create/edit invoice UI per business rule
  const submitLoading = ref(false);

  // Utility functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const getStatusClass = (status) => {
    const normalized = String(status || '').toLowerCase();
    const statusClasses = {
      pending: 'badge-warning',
      processing: 'badge-info',
      completed: 'badge-success',
      cancelled: 'badge-danger',
      confirmed: 'badge-info',
      paid: 'badge-success',
      unpaid: 'badge-warning',
      partial: 'badge-info'
    };
    return statusClasses[normalized] || 'badge-muted';
  };

  const getStatusText = (status) => {
    const normalized = String(status || '').toLowerCase();
    const statusTexts = {
      pending: 'Chờ xử lý',
      processing: 'Đang xử lý',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy',
      confirmed: 'Đã xác nhận',
      paid: 'Đã thanh toán',
      unpaid: 'Chưa thanh toán',
      partial: 'Thanh toán một phần'
    };
    return statusTexts[normalized] || 'Không xác định';
  };

  const viewOrder = (order) => {
    openDetail(order?.id || order?.purchase_number || order?.order_number);
  };

  // Detail modal state
  const detailDialog = reactive({ visible: false });
  const detail = reactive({});
  const detailItems = ref([]);
  const detailLoading = ref(false);
  // simple in-memory cache per tab: key -> payload
  const detailCache = reactive({ sales: new Map(), purchase: new Map() });

  const openDetail = async (id) => {
    if (!id) {
      toast.error('Thiếu mã hóa đơn');
      return;
    }
    detailDialog.visible = true;
    // try cache first
    const tabKey = activeTab.value;
    const cacheMap = tabKey === 'sales' ? detailCache.sales : detailCache.purchase;
    const cached = cacheMap.get(String(id));
    if (cached) {
      Object.assign(detail, cached.record || {});
      detailItems.value = Array.isArray(cached.items) ? cached.items : [];
    }

    detailLoading.value = true;
    try {
      const endpoint = activeTab.value === 'sales' ? `/admin/orders/sales/${id}` : `/admin/orders/purchase/${id}`;
      const { data } = await api.get(endpoint);
      const payload = data?.data ?? data;
      // normalize
      const record = payload?.order || payload?.purchase_order || payload;
      Object.assign(detail, record || {});
      const items = record?.items || record?.order_items || record?.purchase_order_items || payload?.items || [];
      detailItems.value = Array.isArray(items) ? items : [];
      cacheMap.set(String(id), { record: { ...record }, items: [...detailItems.value] });
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Không tải được chi tiết hóa đơn');
    } finally {
      detailLoading.value = false;
    }
  };

  const closeDetailDialog = () => {
    detailDialog.visible = false;
    Object.keys(detail).forEach(k => delete detail[k]);
    detailItems.value = [];
  };

  // Status Edit Modal logic
  const statusDialog = reactive({ visible: false, id: null, tab: 'sales' });
  const statusForm = reactive({ status: 'confirmed', notes: '' });

  const openStatusEdit = (d) => {
    statusDialog.visible = true;
    statusDialog.id = d?.id;
    statusDialog.tab = activeTab.value;
    statusForm.status = (d?.payment_status || d?.status || 'confirmed');
    statusForm.notes = d?.notes || '';
  };

  const closeStatusDialog = () => {
    statusDialog.visible = false;
    statusDialog.id = null;
    statusForm.status = 'confirmed';
    statusForm.notes = '';
  };

  const submitStatus = async () => {
    if (!statusDialog.id) return;
    submitLoading.value = true;
    try {
      const isSales = statusDialog.tab === 'sales';
      const endpoint = isSales ? `/admin/orders/sales/${statusDialog.id}` : `/admin/orders/purchase/${statusDialog.id}`;
      const payload = isSales
        ? { status: statusForm.status, notes: statusForm.notes }
        : { payment_status: statusForm.status, notes: statusForm.notes };
      await api.put(endpoint, payload);
      toast.success('Cập nhật trạng thái thành công');
      closeStatusDialog();
      // refresh detail + list
      await refresh();
      // also refresh detail cache for this id
      const tabKey = isSales ? 'sales' : 'purchase';
      const cacheMap = isSales ? detailCache.sales : detailCache.purchase;
      try {
        const { data } = await api.get(endpoint);
        const pl = data?.data ?? data;
        const record = pl?.order || pl?.purchase_order || pl;
        const items = record?.items || record?.order_items || record?.purchase_order_items || pl?.items || [];
        cacheMap.set(String(statusDialog.id), { record, items });
        if (detailDialog.visible && detail?.id === statusDialog.id) {
          Object.assign(detail, record || {});
          detailItems.value = Array.isArray(items) ? items : [];
        }
      } catch (_) {}
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Cập nhật trạng thái thất bại');
    } finally {
      submitLoading.value = false;
    }
  };
  
  const submit = async () => {
    if (!canSubmit.value) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }
    submitLoading.value = true;
    try {
      const payload = {
        invoice_code: form.invoice_code,
        contact_name: form.contact_name,
        contact_phone: form.contact_phone,
        total_amount: form.total_amount,
        status: form.status,
        notes: form.notes,
        type: activeTab.value
      };
  
      const endpoint = activeTab.value === 'sales' ? '/admin/orders/sales' : '/admin/orders/purchase';
  
      if (dialog.mode === 'create') {
        await api.post(endpoint, payload);
        toast.success(`Tạo hóa đơn ${activeTab.value === 'sales' ? 'bán hàng' : 'nhập hàng'} thành công`);
      } else {
        await api.put(`${endpoint}/${dialog.editingId}`, payload);
        toast.success('Cập nhật hóa đơn thành công');
      }
  
      dialog.visible = false;
      resetForm();
      await refresh();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Lưu hóa đơn thất bại');
    } finally {
      submitLoading.value = false;
    }
  };
  
  const confirmRemove = async (order) => {
    if (!confirm(`Xóa hóa đơn "${order.invoice_code || order.id}"?`)) return;
  
    try {
      const endpoint = activeTab.value === 'sales' ? '/admin/orders/sales' : '/admin/orders/purchase';
      await api.delete(`${endpoint}/${order.id}`);
      toast.success('Đã xóa hóa đơn');
      if (items.value.length === 1 && query.page > 1) {
        query.page -= 1;
      }
      await refresh();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Xóa hóa đơn thất bại');
    }
  };
  
  

  
  
  onMounted(() => {
    refresh();
  });
  </script>
  
  ---
  
  <style scoped>
  /* Modal styles copied to align with Categories */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, .3);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    z-index: 1001;
  }
  
  .modal {
    width: 100%;
    max-width: 560px;
    max-height: 90vh;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, .2);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .grid-two {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px 16px;
  }
  
  .modal-header { padding: 16px 16px 0; }
  .modal-body { padding: 16px; display: grid; gap: 12px; overflow: auto; }
  .modal-footer { padding: 16px; display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid #eef1f5; background: #fff; }
  .form-field { display: grid; gap: 6px; }
  .form-field.inline { align-items: center; }
  .form-field label { font-weight: 600; color: #2c3e50; }
  .form-field .req { color: #e74c3c; }
  .form-field input, .form-field textarea, .form-field select { padding: 10px 12px; border: 1px solid #e1e5ea; border-radius: 8px; }
  
  /* Modal animations aligned with Categories */
  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }
  
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .modal-enter-to,
  .modal-leave-from {
    opacity: 1;
  }
  
  .modal-enter-from .modal,
  .modal-leave-to .modal {
    transform: scale(0.9);
  }
  
  .modal-enter-active .modal,
  .modal-leave-active .modal {
    transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  }
  /*
   * GENERAL LAYOUT
   */
  .categories-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .page-header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }
  
  .title-group h1 {
    margin: 0 0 6px;
    font-size: 1.8rem;
    color: #2c3e50;
  }
  
  .title-group p {
    margin: 0;
    color: #7f8c8d;
  }
  
  .actions-group {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  /* Tab Navigation */
  .tab-navigation {
    display: flex;
    gap: 4px;
    margin-bottom: 20px;
    border-bottom: 1px solid #e1e5ea;
  }

  .tab-button {
    padding: 12px 24px;
    border: none;
    background: transparent;
    color: #7f8c8d;
    font-weight: 600;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.2s ease;
  }

  .tab-button:hover {
    color: #2c3e50;
    background: #f8f9fa;
  }

  .tab-button.active {
    color: #3498db;
    border-bottom-color: #3498db;
    background: #f8f9fa;
  }
  
  .search-input {
    padding: 10px 12px;
    min-width: 260px;
    border: 1px solid #e1e5ea;
    border-radius: 8px;
  }
  
  /*
   * TABLE STYLES
   */
  .card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, .06);
  }
  
  .table-responsive {
    width: 100%;
    overflow-x: auto;
  }
  
  .table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .table thead th {
    text-align: left;
    padding: 14px;
    font-weight: 700;
    color: #2c3e50;
    border-bottom: 1px solid #eef1f5;
    white-space: nowrap;
  }
  
  .table tbody td {
    padding: 14px;
    border-bottom: 1px solid #f2f4f7;
    vertical-align: top;
  }
  
  .text-center {
    text-align: center;
  }
  
  .row-actions {
    display: flex;
    gap: 8px;
  }
  
  .muted {
    color: #7f8c8d;
  }
  
  .badge {
    display: inline-block;
    padding: 6px 10px;
    border-radius: 999px;
    font-size: .85rem;
    font-weight: 600;
  }
  
  .badge-success {
    background: #d4edda;
    color: #155724;
  }
  
  .badge-muted {
    background: #ecf0f1;
    color: #7f8c8d;
  }

  .badge-warning {
    background: #fff3cd;
    color: #856404;
  }

  .badge-info {
    background: #d1ecf1;
    color: #0c5460;
  }

  .badge-danger {
    background: #f8d7da;
    color: #721c24;
  }
  
  .table-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 14px;
    gap: 12px;
  }
  
  .page-size label {
    margin-right: 8px;
    color: #7f8c8d;
  }
  
  .page-size select {
    padding: 6px 10px;
    border: 1px solid #e1e5ea;
    border-radius: 8px;
  }
  
  .pagination {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  
  /*
   * BUTTON STYLES
   */
  .btn {
    padding: 8px 12px;
    border: 1px solid transparent;
    border-radius: 8px;
    background: #f1f3f5;
    cursor: pointer;
    font-weight: 600;
  }
  
  .btn:hover {
    filter: brightness(0.98);
  }
  
  .btn-small {
    padding: 6px 10px;
    font-size: .9rem;
  }
  
  .btn-primary {
    background: #3498db;
    color: #fff;
  }
  
  .btn-danger {
    background: #e74c3c;
    color: #fff;
  }
  
  /*
   * MODAL STYLES
   */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, .3);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    z-index: 1001;
  }
  
  .modal {
    width: 100%;
    max-width: 560px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, .2);
    overflow: hidden;
  }
  
  .modal-header {
    padding: 16px 16px 0;
  }
  
  .modal-body {
    padding: 16px;
    display: grid;
    gap: 12px;
  }
  
  .modal-footer {
    padding: 16px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  
  .form-field {
    display: grid;
    gap: 6px;
  }
  
  .form-field.inline {
    align-items: center;
  }
  
  .form-field label {
    font-weight: 600;
    color: #2c3e50;
  }
  
  .form-field .req {
    color: #e74c3c;
  }
  
  /*
   * RESPONSIVE STYLES
   */
  @media (max-width: 768px) {
    .categories-container {
      padding: 15px;
    }
  
    .search-input {
      min-width: 180px;
    }
  
    .table thead {
      display: none;
    }
  
    .table tbody tr {
      display: grid;
      gap: 6px;
      padding: 10px 0;
      border-bottom: 1px solid #f2f4f7;
    }
  
    .table tbody td {
      padding: 2px 14px;
    }
  
    .row-actions {
      padding: 8px 14px;
    }
  
    /* MODAL RESPONSIVE FIXES */
    .modal {
      max-width: 100%;
      margin: 16px;
    }
  
    /* Cải thiện các phần tử flex bên trong modal để chúng tự xuống dòng */
    .modal-body > div {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
  
    /* Đặt các trường nhập liệu và chọn danh mục chiếm toàn bộ chiều rộng */
    .modal-body .form-field,
    .modal-body .form-field select {
      width: 100%;
    }
  
    /* Đảm bảo input và textarea cũng co giãn */
    .form-field input,
    .form-field textarea {
      width: 100%;
      box-sizing: border-box;
    }
  
    /* Đảm bảo ảnh xem trước tự động co giãn */
    .modal-body img {
      width: 100%;
      height: auto;
      object-fit: contain;
    }
  }
  
  /*
   * OTHER STYLES
   */
  :deep(.table tbody tr:nth-child(even)) {
    background-color: #f9fafb;
  }
  
  .table tbody tr:nth-child(even) {
    background-color: #f9f8f8;
  }
  
  .table tbody tr:nth-child(odd) {
    background-color: #ffffff;
  }
  
  .checkbox {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }
  
  /* Animation cho Modal */
  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }
  
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .modal-enter-to,
  .modal-leave-from {
    opacity: 1;
  }
  
  /* Hiệu ứng riêng cho modal-dialog */
  .modal-enter-from .modal,
  .modal-leave-to .modal {
    transform: scale(0.9);
  }
  
  .modal-enter-active .modal,
  .modal-leave-active .modal {
    transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  }
  @media (max-width: 768px) {
    /* HEADER */
    .page-header {
      flex-direction: column;
      align-items: stretch;
    }
  
    .actions-group {
      flex-direction: column;
      width: 100%;
    }
  
    .actions-group input,
    .actions-group button {
      width: 100%;
    }
  
    /* BẢNG → CARD LIST */
    .table thead {
      display: none;
    }
  
    .table tbody tr {
      display: block;
      background: #fff;
      margin-bottom: 12px;
      border: 1px solid #eaeaea;
      border-radius: 10px;
      padding: 12px;
    }
  
    .table tbody td {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      border: none;
    }
  
    .table tbody td::before {
      content: attr(data-label);
      font-weight: 600;
      color: #2c3e50;
    }
  
    /* ẨN cột ảnh lớn, chỉ giữ thumbnail nhỏ */
    .table tbody td img {
      max-width: 100px;
      max-height: 100px;
    }
  
    /* ROW ACTIONS */
    .row-actions {
      flex-wrap: wrap;
      justify-content: flex-start;
    }
  
    .row-actions .btn {
      flex: 1 1 48%;
      margin-bottom: 6px;
    }
  
    /* PAGINATION */
    .pagination {
      flex-direction: column;
      gap: 6px;
      width: 100%;
    }
  
    .pagination span {
      text-align: center;
      width: 100%;
    }
  
    /* MODAL FORM */
    .modal {
      max-width: 100%;
      margin: 10px;
    }
  
    .modal-body {
      display: flex;
      flex-direction: column;
    }
  
    .form-field {
      width: 100%;
    }
  
    .form-field input,
    .form-field select,
    .form-field textarea,
    .form-field button {
      width: 100%;
      box-sizing: border-box;
    }
  
    .modal-footer {
      flex-direction: column;
      gap: 8px;
    }
  
    .modal-footer button {
      width: 100%;
    }
  }
  
  </style>