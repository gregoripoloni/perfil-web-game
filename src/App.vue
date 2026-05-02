<script setup lang="ts">
  import { ConfirmDialog } from 'primevue';
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition mode="out-in">
      <Component :is="Component" />
    </Transition>
  </RouterView>
  <ConfirmDialog />
</template>