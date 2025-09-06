<template>
  <div class="min-h-screen bg-gray-50">

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Danh sách sản phẩm -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-sm border">
            <div class="p-6 border-b">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold text-gray-900">Danh sách sản phẩm</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
  <select 
    v-model="selectedCategory" 
    @change="filterProducts"
    class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
  >
    <option value="">Tất cả danh mục</option>
    <option v-for="category in categories" :key="category.id" :value="category.id">
      {{ category.name }}
    </option>
  </select>

  <input
    v-model="searchKeyword"
    @input="filterProducts"
    type="text"
    placeholder="Tìm kiếm sản phẩm..."
    class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
  />
</div>

              </div>
            </div>
            
            <div class="p-6">
              <div v-if="loading" class="flex justify-center items-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
              
              <div v-else-if="filteredProducts.length === 0" class="text-center py-12">
                <p class="text-gray-500">Không có sản phẩm nào</p>
              </div>
              
              <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                <div 
                  v-for="product in filteredProducts" 
                  :key="product.id"
                  class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  @click="addToCart(product)"
                >
                  <div class="aspect-square mb-3 bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      :src="baseURLimg + product.image_url" 
                      :alt="product.name"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <h3 class="font-medium text-gray-900 mb-1">{{ product.name }}</h3>
                  <p class="text-sm text-gray-500 mb-2">{{ product.category_name }}</p>
                  <div class="flex justify-between items-center">
                    <span class="text-lg font-bold text-green-600">
                      {{ formatPrice(product.payprice) }}
                    </span>
                    <span class="text-sm text-gray-500">
                      SL: {{ product.quantity }}
                    </span>
                  </div>
                  <button 
                    class="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    @click.stop="addToCart(product)"
                  >
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Giỏ hàng -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm border sticky top-6">
            <div class="p-6 border-b">
              <h2 class="text-xl font-semibold text-gray-900">Giỏ hàng</h2>
              <p class="text-sm text-gray-500">{{ cartItems.length }} sản phẩm</p>
            </div>
            
            <div class="p-6">
              <div v-if="cartItems.length === 0" class="text-center py-8">
                <p class="text-gray-500">Giỏ hàng trống</p>
              </div>
              
              <div v-else class="space-y-4">
                <div 
                  v-for="item in cartItems" 
                  :key="item.id"
                  class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <img 
                    :src="baseURLimg + item.image_url" 
                    :alt="item.name"
                    class="w-12 h-12 object-cover rounded"
                  />
                  <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</h4>
                    <p class="text-sm text-gray-500">{{ formatPrice(item.payprice) }}</p>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button 
                      @click="decreaseQuantity(item.id)"
                      class="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-sm"
                    >
                      -
                    </button>
                    <span class="w-8 text-center text-sm font-medium">{{ item.quantity }}</span>
                    <button 
                      @click="increaseQuantity(item.id)"
                      class="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-sm"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    @click="removeFromCart(item.id)"
                    class="text-red-500 hover:text-red-700 text-sm"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
            
            <div v-if="cartItems.length > 0" class="p-6 border-t bg-gray-50">
              <div class="flex justify-between items-center mb-4">
                <span class="text-lg font-semibold text-gray-900">Tổng cộng:</span>
                <span class="text-xl font-bold text-green-600">{{ formatPrice(totalAmount) }}</span>
              </div>
              
              <div class="space-y-3">
                <input
                  v-model="customerName"
                  type="text"
                  placeholder="Tên khách hàng (tùy chọn)"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  v-model="customerPhone"
                  type="tel"
                  placeholder="Số điện thoại (tùy chọn)"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button 
                  @click="processPayment"
                  :disabled="processing"
                  class="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  {{ processing ? 'Đang xử lý...' : 'Thanh toán' }}
                </button>
                <button 
                  @click="clearCart"
                  class="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  Xóa giỏ hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal xác nhận thanh toán -->
    <div v-if="showPaymentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Xác nhận thanh toán</h3>
        <div class="space-y-3 mb-6">
          <div class="flex justify-between">
            <span class="text-gray-600">Số lượng sản phẩm:</span>
            <span class="font-medium">{{ totalItems }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Tổng tiền:</span>
            <span class="font-bold text-green-600">{{ formatPrice(totalAmount) }}</span>
          </div>
          <div v-if="customerName" class="flex justify-between">
            <span class="text-gray-600">Khách hàng:</span>
            <span class="font-medium">{{ customerName }}</span>
          </div>
          <div v-if="customerPhone" class="flex justify-between">
            <span class="text-gray-600">SĐT:</span>
            <span class="font-medium">{{ customerPhone }}</span>
          </div>
        </div>
        <div class="flex space-x-3">
          <button 
            @click="showPaymentModal = false"
            class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Hủy
          </button>
          <button 
            @click="confirmPayment"
            :disabled="processing"
            class="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            {{ processing ? 'Đang xử lý...' : 'Xác nhận' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>  
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { useToast } from 'vue-toastification';

const router = useRouter();
const toast = useToast();
const baseURLimg = import.meta.env.VITE_API_IMG_URL;

// State
const products = ref([]);
const categories = ref([]);
const loading = ref(false);
const searchKeyword = ref('');
const selectedCategory = ref('');
const cartItems = ref([]);
const customerName = ref('');
const customerPhone = ref('');
const processing = ref(false);
const showPaymentModal = ref(false);
const currentUser = ref(JSON.parse(localStorage.getItem('user') || '{}'));

// Computed
const filteredProducts = computed(() => {
  let filtered = products.value.filter(product => product.active && product.quantity > 0);
  
  if (selectedCategory.value) {
    filtered = filtered.filter(product => product.category_id == selectedCategory.value);
  }
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(keyword) ||
      product.category_name.toLowerCase().includes(keyword)
    );
  }
  
  return filtered;
});

const totalAmount = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.payprice * item.quantity), 0);
});

const totalItems = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0);
});

// Methods
const loadProducts = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/admin/products', {
      params: { limit: 100 }
    });
    products.value = data?.data?.product || [];
    categories.value = data?.data?.categories || [];
  } catch (error) {
    toast.error('Không thể tải danh sách sản phẩm');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const filterProducts = () => {
  // Filtering is handled by computed property
};

const addToCart = (product) => {
  const existingItem = cartItems.value.find(item => item.id === product.id);
  
  if (existingItem) {
    if (existingItem.quantity < product.quantity) {
      existingItem.quantity++;
    } else {
      toast.warning('Không đủ số lượng trong kho');
    }
  } else {
    cartItems.value.push({
      ...product,
      quantity: 1
    });
  }
};

const increaseQuantity = (productId) => {
  const item = cartItems.value.find(item => item.id === productId);
  const product = products.value.find(p => p.id === productId);
  
  if (item && item.quantity < product.quantity) {
    item.quantity++;
  } else {
    toast.warning('Không đủ số lượng trong kho');
  }
};

const decreaseQuantity = (productId) => {
  const item = cartItems.value.find(item => item.id === productId);
  if (item && item.quantity > 1) {
    item.quantity--;
  } else {
    removeFromCart(productId);
  }
};

const removeFromCart = (productId) => {
  const index = cartItems.value.findIndex(item => item.id === productId);
  if (index > -1) {
    cartItems.value.splice(index, 1);
  }
};

const clearCart = () => {
  cartItems.value = [];
  customerName.value = '';
  customerPhone.value = '';
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

const processPayment = () => {
  if (cartItems.value.length === 0) {
    toast.error('Giỏ hàng trống');
    return;
  }
  showPaymentModal.value = true;
};

const confirmPayment = async () => {
  processing.value = true;
  try {
    const orderData = {
      items: cartItems.value.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
      customer_name: customerName.value || null,
      customer_phone: customerPhone.value || null,
      total_amount: totalAmount.value
    };

    await api.post('/staff/orders', orderData);
    
    toast.success('Thanh toán thành công!');
    clearCart();
    showPaymentModal.value = false;
    await loadProducts(); // Reload to update quantities
    
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Thanh toán thất bại');
    console.error(error);
  } finally {
    processing.value = false;
  }
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
};

// Lifecycle
onMounted(() => {
  loadProducts();
});
</script>