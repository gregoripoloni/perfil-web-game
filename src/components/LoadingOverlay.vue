<script setup lang="ts">
import logoUrl from '@/assets/logo.png';

defineProps<{
  visible?: boolean;
}>();
</script>

<template>
  <Transition>
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-surface-950"
      role="status"
      aria-live="polite"
      aria-label="Carregando"
    >
      <span
        class="game-logo shrink-0 bg-primary-400 animate-shake"
        role="img"
        aria-hidden="true"
        :style="{ '--logo-mask': `url('${logoUrl}')` }"
      />
    </div>
  </Transition>
</template>

<style scoped>
.game-logo {
  display: inline-block;
  width: 6rem;
  height: 6rem;
  mask-image: var(--logo-mask);
  -webkit-mask-image: var(--logo-mask);
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}
</style>
