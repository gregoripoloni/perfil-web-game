<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ConfirmDialog } from 'primevue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import { ensureAnonymousUser } from '@/services/firebase';

const isLoading = ref(true);

onMounted(async () => {
  try {
    await ensureAnonymousUser();
  } catch (err) {
    console.error('Falha na autenticação anônima do Firebase:', err);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <LoadingOverlay :visible="isLoading" />
  <RouterView v-if="!isLoading" v-slot="{ Component }">
    <Transition mode="out-in">
      <Component :is="Component" />
    </Transition>
  </RouterView>
  <ConfirmDialog />
</template>
