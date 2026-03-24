<script setup lang="ts">
  import Sidebar from './components/Sidebar.vue';
  import Main from './components/Main.vue';
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-4 lg:h-screen">
    <Sidebar class="col-span-1" />
    <Main class="col-span-3" />
  </div>
</template>
