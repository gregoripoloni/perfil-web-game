<script setup lang="ts">
  import { ConfirmDialog } from 'primevue';
</script>

<template>
  <Transition>
    <RouterView />
  </Transition>
  <ConfirmDialog />
</template>