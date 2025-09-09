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
        <button class="btn" style="border-color:black;" @click="search">Tìm</button>
        <button class="btn btn-primary" @click="openCreate">Thêm sản phẩm</button>
      </div>
    </header>

    <section class="card">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th style="width: 30px;">ID</th>
              <th>Tên sản phẩm</th>
              <th>Giá nhập vào</th>
              <th>Giá bán ra</th>
              <th>Ảnh</th>
              <th>Số lượng</th>
              <th>Danh mục</th>
              <th style="width: 70px;">Trạng thái</th>
              <th>Mô tả</th>
              <th style="width: 210px;">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading && items.length === 0">
              <td colspan="9" class="text-center py-4">
                <img src="/loading.svg" alt="Đang tải..." class="w-4 h-4 mx-auto animate-spin" />
              </td>
            </tr>

            <tr v-else-if="!loading && items.length === 0">
              <td colspan="9" class="text-center">Không có dữ liệu</td>
            </tr>
            <tr v-for="pro in items" :key="pro.id">
  <td data-label="ID">#{{ pro.id }}</td>
  <td data-label="Tên sản phẩm">{{ pro.name }}</td>
  <td data-label="Giá nhập vào">{{ Number(pro.price) }}</td>
  <td data-label="Giá bán ra">{{ Number(pro.payprice) }}</td>

  <td data-label="Ảnh">
    <img :src="pro.image_url"
         alt=""
         style="width:150px; height:150px; object-fit:cover; border-radius:8px; border:1px solid #ddd;" />
  </td>

  <td data-label="Số lượng">{{ pro.quantity }}</td>
  <td data-label="Danh mục">{{ pro.category_name }}</td>
  <td data-label="Trạng thái">
    <span :class="['badge', pro.active ? 'badge-success' : 'badge-muted']">
      {{ pro.active ? 'On' : 'Off' }}
    </span>
  </td>
  <td data-label="Mô tả" class="muted">{{ pro.description || '—' }}</td>
  <td data-label="Thao tác" class="row-actions">
    <button class="btn btn-small" @click="openEdit(pro)">Sửa</button>
    <button class="btn btn-small btn-danger" @click="confirmRemove(pro)">Xóa</button>
    <button class="btn btn-small btn-primary" @click="addquantity(pro.id)">+SL</button>
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

    <transition name="modal">
      <div v-if="dialog.visible" class="modal-backdrop" @click.self="closeDialog">
        <div class="modal">
          <header class="modal-header">
            <h1>{{ dialog.mode === 'create' ? 'Thêm sản phẩm' : 'Sửa sản phẩm' }}</h1>
          </header>
          <div class="modal-body">
            <div class="flex gap-4">
              <div class="form-field w-full">
              <label for="name">Tên sản phẩm <span class="req">*</span></label>
              <input id="name" v-model.trim="form.name" type="text" placeholder="Nhập tên sản phẩm" />
            </div>
            <div class="form-field w-full">
              <label for="category">Danh mục <span class="req">*</span></label>
              <select v-model="form.category_id">
                <option v-for="c in categories" :key="c.id" :value="c.id">
                  {{ c.name }}
                </option>
              </select>
            </div>
            </div>
            <div class="flex gap-4">
              <div class="form-field w-full">
                <label for="price">Giá nhập vào/đơn vị <span class="req">*</span></label>
                <input id="price" v-model.trim="form.price" type="number" placeholder="Nhập giá" />
              </div>
              <div class="form-field w-full">
                <label for="payprice">Giá bán ra/đơn vị <span class="req">*</span></label>
                <input id="payprice" v-model.trim="form.payprice" type="number" placeholder="Nhập giá bán" />
              </div>
            </div>
            <div class="form-field">
              <label for="quantity">Số lượng <span class="req">*</span></label>
              <input id="quantity" v-model.trim="form.quantity" type="number" placeholder="Nhập số lượng" />
            </div>
            <div class="form-field">
              <label>Ảnh sản phẩm <span class="req">*</span></label>
              <div class="flex items-center gap-4">
                <input id="image" type="file" accept="image/*" @change="handleFileUpload" />
                <img v-if="imagePreview || form.image_url" :src="imagePreview || ( form.image_url)" alt="preview" style="width:160px; height:160px; object-fit:cover; border-radius:8px; border:1px solid #e1e5ea;" />
              </div>
            </div>
            <div class="form-field inline">
              <label class="checkbox">
                <input type="checkbox" id="active" v-model="form.active" />
                <span>Hoạt động</span>
              </label>
            </div>
            <div class="form-field">
              <label for="description">Mô tả</label>
              <textarea id="description" v-model.trim="form.description" rows="3" placeholder="Mô tả ngắn..."></textarea>
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


    <transition name="modal">
      <div v-if="isaddquantity" class="modal-backdrop" @click.self="closeAddQuantityDialog">
        <div class="modal">
          <header class="modal-header">
            <h3>Thêm số lượng</h3>
          </header>
          <div class="modal-body">
            <div class="form-field">
              <label for="add-quantity">Số lượng cần thêm</label>
              <input id="add-quantity" v-model.number="addquantityForm.quantity" type="number" min="1" placeholder="Nhập số lượng..." />
              
            </div>
          </div>
          <footer class="modal-footer">
            <button class="btn" @click="closeAddQuantityDialog">Hủy</button>
            <button class="btn btn-primary" :disabled="submitLoading || !addquantityForm.quantity" @click="submitquantity">
              {{ submitLoading ? 'Đang lưu...' : 'Lưu' }}
            </button>
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

const baseURLimg = import.meta.env.VITE_API_IMG_URL;
const toast = useToast();
const isaddquantity = ref(false);
const selectedProductId = ref(null);
const addquantityForm = reactive({ quantity: null });

// Danh sách + phân trang
const items = ref([]);
const total = ref(0);
const categories = ref([]);
const loading = ref(false);
const query = reactive({ keyword: '', page: 1, limit: 10 });
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / query.limit)));

const search = () => {
  query.page = 1;
  refresh();
};

const refresh = async () => {
  loading.value = true;
  try {
    const params = { keyword: query.keyword || undefined, page: query.page, limit: query.limit };
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
const form = reactive({ name: '', description: '',payprice: '', price: '', category_id: null, image_url: '', image: null, active: true, quantity: null });
const imagePreview = ref('');
const canSubmit = computed(() => form.name.trim().length > 0 && form.category_id && form.price && form.quantity&& form.payprice);

const resetForm = () => {
  Object.assign(form, { name: '', payprice: '', description: '', price: '', category_id: null, image_url: '', image: null, quantity: null, active: true });
  imagePreview.value = '';
};

const openCreate = () => {
  dialog.visible = true;
  dialog.mode = 'create';
  dialog.editingId = null;
  resetForm();
};

const openEdit = (pro) => {
  dialog.visible = true;
  dialog.mode = 'edit';
  dialog.editingId = pro.id;
  Object.assign(form, {
    name: pro.name || '',
    price: pro.price || '',
    quantity: pro.quantity || '',
    image_url: pro.image_url || '',
    payprice: pro.payprice || '',
    status: 'on',
    category_id: Number(pro.category_id) || null,
    image: null,
    description: pro.description || '',
    active: !!pro.active
  })
  imagePreview.value = '';
};

const closeDialog = () => {
  if (submitLoading.value) return;
  dialog.visible = false;
  resetForm();
};

const handleFileUpload = (event) => {
  const file = event.target.files && event.target.files[0];
  form.image = file || null;
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result || '';
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.value = '';
  }
};

const submit = async () => {
  if (!canSubmit.value) {
    toast.error('Vui lòng điền đầy đủ các trường bắt buộc.');
    return;
  }
  submitLoading.value = true;
  try {
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('description', form.description);
    fd.append('price', form.price);
    fd.append('payprice', form.payprice);
    fd.append('category_id', form.category_id);
    fd.append('quantity', form.quantity);
    fd.append('active', form.active ? 1 : 0);

    if (form.image) {
      fd.append('image', form.image);
    }

    if (dialog.mode === 'create') {
      fd.append('status', 'admin_management');
      await api.post('/admin/products', fd, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Tạo sản phẩm thành công');
    } else {
      fd.append('_method', 'PUT');
      fd.append('status', 'admin_management');
      await api.post(`/admin/products/${dialog.editingId}`, fd, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Cập nhật sản phẩm thành công');
    }

    dialog.visible = false;
    resetForm();
    await refresh();
  } catch (e) {
    toast.error(e?.response?.data?.message || 'Lưu sản phẩm thất bại');
  } finally {
    submitLoading.value = false;
  }
};

const confirmRemove = async (pro) => {
  // kiểm tra số lượng > 0 thì không cho xóa
  if (pro.quantity > 0) {
    toast.error('Chỉ được xóa sản phẩm khi số lượng = 0');
    return;
  }

  if (!confirm(`Xóa sản phẩm "${pro.name}"?`)) return;

  try {
    await api.delete(`/admin/products/${pro.id}`);
    toast.success('Đã xóa sản phẩm');
    if (items.value.length === 1 && query.page > 1) {
      query.page -= 1;
    }
    await refresh();
  } catch (e) {
    toast.error(e?.response?.data?.message || 'Xóa sản phẩm thất bại');
  }
};


// Logic thêm số lượng
const addquantity = (proId) => {
  isaddquantity.value = true;
  selectedProductId.value = proId;
  addquantityForm.quantity = null;
};

const closeAddQuantityDialog = () => {
  isaddquantity.value = false;
  selectedProductId.value = null;
  addquantityForm.quantity = null;
};

const submitquantity = async () => {
  if (!addquantityForm.quantity || addquantityForm.quantity <= 0) {
    toast.error('Vui lòng nhập số lượng hợp lệ.');
    return;
  }

  submitLoading.value = true;
  try {
    // 1. Tìm sản phẩm hiện tại trong danh sách items
    const currentProduct = items.value.find(pro => pro.id === selectedProductId.value);
    
    // 2. Kiểm tra nếu tìm thấy sản phẩm
    if (!currentProduct) {
      toast.error('Không tìm thấy sản phẩm để cập nhật.');
      submitLoading.value = false;
      return;
    }
    
    // 3. Tính toán số lượng mới
    const newQuantity = currentProduct.quantity + addquantityForm.quantity;

    // 4. Tạo payload với số lượng mới
    const payload = {
      quantity: newQuantity,
      status: 'admin_management'
    };
    
    // 5. Gửi request PUT
    await api.put(`/admin/products/${selectedProductId.value}`, payload);
    toast.success('Cập nhật số lượng thành công!');
    
    // 6. Đóng dialog và refresh
    closeAddQuantityDialog();
    await refresh();
  } catch (e) {
    toast.error(e?.response?.data?.message || 'Cập nhật số lượng thất bại!');
  } finally {
    submitLoading.value = false;
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
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, .2);
  overflow: hidden;
}

.modal-header { padding: 16px 16px 0; }
.modal-body { padding: 16px; display: grid; gap: 12px; }
.modal-footer { padding: 16px; display: flex; justify-content: flex-end; gap: 10px; }
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