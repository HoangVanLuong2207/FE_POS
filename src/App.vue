<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script setup>
// Bạn không cần thêm logic gì phức tạp ở đây
// router-view sẽ tự động xử lý việc hiển thị component tương ứng
</script>

<style>
/* Thêm CSS chung cho toàn bộ ứng dụng tại đây
  Ví dụ: font chữ, màu nền, reset CSS
*/
body {
  font-family: Arial, sans-serif;
  background-color: #f4f7f6;
  margin: 0;
  padding: 0;
}
</style>