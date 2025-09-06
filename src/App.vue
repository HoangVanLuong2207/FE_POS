<template>
  <div>
    <Header></Header>
    <div style="padding-top: 80px;">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import Header from './components/Header.vue';

</script>

<style>
body {
  font-family: Arial, sans-serif;
  background-color: #f4f7f6;
  margin: 0;
  padding: 0;
}
</style>