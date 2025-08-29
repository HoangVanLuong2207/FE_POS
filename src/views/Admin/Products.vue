<template>
    <div class="categories-container">
      <header class="page-header">
        <div class="title-group">
          <h1>Quản lý sản phẩm</h1>
          <p>Thêm, sửa, xóa và tìm kiếm sản phẩm</p>
        </div>
        <div class="actions-group">
          <input
            v-model="query.keyword"
            @keyup.enter="refresh"
            type="text"
            class="search-input"
            placeholder="Tìm theo tên sản phẩm..."
          />
          <button class="btn btn-primary" @click="openCreate">Thêm sản phẩm</button>
        </div>
      </header>
  
      <section class="card">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th style="width: 80px;">ID</th>
                <th>Tên sản phẩm</th>
                <th>Mô tả</th>
                <th>Giá</th>
                <th>Ảnh</th>
                <th>sản phẩm</th>
                <th style="width: 140px;">Trạng thái</th>
                <th style="width: 180px;">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading && items.length === 0">
                <td colspan="5" class="text-center">Đang tải...</td>
              </tr>
              <tr v-else-if="!loading && items.length === 0">
                <td colspan="5" class="text-center">Không có dữ liệu</td>
              </tr>
              <tr v-for="pro in items" :key="pro.id">
                <td>#{{ pro.id }}</td>
                <td>{{ pro.name }}</td>
                <td class="muted">{{ pro.description || '—' }}</td>
                <td>{{ pro.price }}</td>
                <td>
                  <img :src="baseURLimg + pro.image_url" 
                      alt="" 
                      style="width:150px; height:150px; object-fit:cover; border-radius:8px; border:1px solid #ddd;" />
                </td>

                <td>{{ pro.category_name   }}</td>
                <td>
                  <span :class="['badge', pro.active ? 'badge-success' : 'badge-muted']">
                    {{ pro.active ? 'Hoạt động' : 'Ẩn' }}
                  </span>
                </td>
                <td class="row-actions">
                  <button class="btn btn-small" @click="openEdit(pro)">Sửa</button>
                  <button class="btn btn-small btn-danger" @click="confirmRemove(pro)">Xóa</button>
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
  
      <!-- Modal Tạo / Sửa -->
      <transition name="modal">
        <div v-if="dialog.visible" class="modal-backdrop" @click.self="closeDialog">
          <div class="modal">
            <header class="modal-header">
              <h3>{{ dialog.mode === 'create' ? 'Thêm sản phẩm' : 'Sửa sản phẩm' }}</h3>
            </header>
            <div class="modal-body">
              <div class="form-field">
                <label for="name">Tên sản phẩm <span class="req">*</span></label>
                <input id="name" v-model.trim="form.name" type="text" placeholder="Ví dụ: Đồ uống" />
              </div>
              <div class="form-field">
                <label for="img">Ảnh sản phẩm <span class="req">*</span></label>
                <input id="image" type="file" @change="handleFileUpload" />
              </div>
              <div class="form-field">
                <label for="category">Danh mục <span class="req">*</span></label>
                <select id="category_id" v-model="form.category_id">
                  <option v-for="value in categories" :value="value.id" :key="value.id">{{ value.name }}</option>
                </select>
              </div>
              <div class="form-field">
                <label for="price">Giá<span class="req">*</span></label>
                <input id="price" v-model.trim="form.price" type="number" placeholder="Nhập giá" />
              </div>
              <div class="form-field">
                <label for="description">Mô tả</label>
                <textarea id="description" v-model.trim="form.description" rows="3" placeholder="Mô tả ngắn..."></textarea>
              </div>
              <div class="form-field inline">
                <label class="checkbox">
                  <input type="checkbox" v-model="form.active" />
                  <span>Hoạt động</span>
                </label>
              </div>
            </div>
            <footer class="modal-footer">
              <button class="btn" @click="closeDialog">Hủy</button>
              <button class="btn btn-primary" :disabled="submitLoading || !canSubmit" @click="submit">
                {{ submitLoading ? 'Đang lưu...' : 'Lưu' }}
              </button>
            </footer>
          </div>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted, handleError } from 'vue';
  import api from '@/services/api';
  import { useToast } from 'vue-toastification';
  const baseURLimg= import.meta.env.VITE_API_IMG_URL;
  const toast = useToast();
  
  // Danh sách + phân trang
  const items = ref([]);
  const total = ref(0);
  const categories = ref([]);
  const loading = ref(false);
  const query = reactive({ keyword: '', page: 1, limit: 10 });
  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / query.limit)));
  
  const refresh = async () => {
    loading.value = true;
    try {
      const params = { q: query.keyword || undefined, page: query.page, limit: query.limit };
      const { data } = await api.get('/admin/products', { params });
      items.value = data?.data?.product || [];
      total.value = data?.data?.total || 0;
      categories.value = data?.data?.categories || [];
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Không tải được sản phẩm');
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
  
  // Dialog tạo/sửa
  const dialog = reactive({ visible: false, mode: 'create', editingId: null });
  const submitLoading = ref(false);
  const form = reactive({ name: '', description: '', active: true });
  const canSubmit = computed(() => form.name.trim().length > 0);
  
  const openCreate = () => {
    dialog.visible = true;
    dialog.mode = 'create';
    dialog.editingId = null;
    Object.assign(form, { name: '', description: '', active: true });
  };
  
  const openEdit = (pro) => {
    dialog.visible = true;
    dialog.mode = 'edit';
    dialog.editingId = pro.id;
    Object.assign(form, { name: pro.name || '',price:pro.price||'',category_id:pro.category_id, description: pro.description || '', active: !!pro.active });
  };
  
  const closeDialog = () => {
    if (submitLoading.value) return;
    dialog.visible = false;
  };
  
  const handleFileUpload = (event) => {
    form.image = event.target.files[0];
   
  };

const submit = async () => {
  if (!canSubmit.value) return;
  submitLoading.value = true;
  try {
    // Tạo đối tượng FormData chỉ một lần
    const fd = new FormData();
    
    // Thêm các trường dữ liệu vào FormData
    fd.append('name', form.name);
    fd.append('description', form.description);
    fd.append('price', form.price);
    fd.append('category_id', form.category_id);
    fd.append('active', form.active ? 1 : 0);
    
    // Thêm file ảnh nếu có
    if (form.image) {
      fd.append('image', form.image);
    }

    if (dialog.mode === 'create') {
      // Dùng POST để tạo mới sản phẩm, truyền đối tượng FormData
      await api.post('/admin/products', fd,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Tạo sản phẩm thành công');
    } else {
      // Để cập nhật (PUT), dùng POST và thêm _method=PUT vào FormData
      fd.append('_method', 'PUT'); 
      await api.post(`/admin/products/${dialog.editingId}`, fd,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Cập nhật sản phẩm thành công');
    }

    dialog.visible = false;
    await refresh();
  } catch (e) {
    toast.error(e?.response?.data?.message || 'Lưu sản phẩm thất bại');
  } finally {
    submitLoading.value = false;
  }
};

  
  const confirmRemove = async (pro) => {
    if (!confirm(`Xóa sản phẩm "${pro.name}"?`)) return;
    try {
      await api.delete(`/admin/products/${pro.id}`);
      toast.success('Đã xóa sản phẩm');
      // Nếu xóa phần tử cuối trang, lùi trang nếu cần
      if (items.value.length === 1 && query.page > 1) {
        query.page -= 1;
      }
      await refresh();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Xóa sản phẩm thất bại');
    }
  };
  
  onMounted(() => {
    refresh();
  });
  </script>
  
  <style scoped>
  .categories-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
  .page-header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 16px; }
  .title-group h1 { margin: 0 0 6px; font-size: 1.8rem; color: #2c3e50; }
  .title-group p { margin: 0; color: #7f8c8d; }
  .actions-group { display: flex; gap: 10px; align-items: center; }
  .search-input { padding: 10px 12px; min-width: 260px; border: 1px solid #e1e5ea; border-radius: 8px; }
  
  .card { background: #fff; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,.06); }
  .table-responsive { width: 100%; overflow-x: auto; }
  .table { width: 100%; border-collapse: collapse; }
  .table thead th { text-align: left; padding: 14px; font-weight: 700; color: #2c3e50; border-bottom: 1px solid #eef1f5; white-space: nowrap; }
  .table tbody td { padding: 14px; border-bottom: 1px solid #f2f4f7; vertical-align: top; }
  .text-center { text-align: center; }
  .row-actions { display: flex; gap: 8px; }
  .muted { color: #7f8c8d; }
  
  .badge { display: inline-block; padding: 6px 10px; border-radius: 999px; font-size: .85rem; font-weight: 600; }
  .badge-success { background: #d4edda; color: #155724; }
  .badge-muted { background: #ecf0f1; color: #7f8c8d; }
  
  .table-footer { display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; gap: 12px; }
  .page-size label { margin-right: 8px; color: #7f8c8d; }
  .page-size select { padding: 6px 10px; border: 1px solid #e1e5ea; border-radius: 8px; }
  .pagination { display: flex; gap: 10px; align-items: center; }
  
  .btn { padding: 8px 12px; border: 1px solid transparent; border-radius: 8px; background: #f1f3f5; cursor: pointer; font-weight: 600; }
  .btn:hover { filter: brightness(0.98); }
  .btn-small { padding: 6px 10px; font-size: .9rem; }
  .btn-primary { background: #3498db; color: #fff; }
  .btn-danger { background: #e74c3c; color: #fff; }
  
  /* Modal */
  .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.3); display: flex; align-items: center; justify-content: center; padding: 16px; z-index: 1001; }
  .modal { width: 100%; max-width: 560px; background: #fff; border-radius: 12px; box-shadow: 0 12px 40px rgba(0,0,0,.2); overflow: hidden; }
  .modal-header { padding: 16px 16px 0; }
  .modal-body { padding: 16px; display: grid; gap: 12px; }
  .modal-footer { padding: 16px; display: flex; justify-content: flex-end; gap: 10px; }
  .form-field { display: grid; gap: 6px; }
  .form-field.inline { align-items: center; }
  .form-field label { font-weight: 600; color: #2c3e50; }
  .form-field .req { color: #e74c3c; }
  .form-field input, .form-field textarea { padding: 10px 12px; border: 1px solid #e1e5ea; border-radius: 8px; }
  .checkbox { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; }
  
  @media (max-width: 768px) {
    .categories-container { padding: 15px; }
    .search-input { min-width: 180px; }
    .table thead { display: none; }
    .table tbody tr { display: grid; gap: 6px; padding: 10px 0; border-bottom: 1px solid #f2f4f7; }
    .table tbody td { padding: 2px 14px; }
    .row-actions { padding: 8px 14px; }
  }

  :deep(.table tbody tr:nth-child(even)) {
  background-color: #f9fafb;
}


  .table tbody tr:nth-child(even) {
  background-color: #f9f8f8; /* màu xám nhạt */
}

.table tbody tr:nth-child(odd) {
  background-color: #ffffff; /* màu trắng */
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

  </style>
  