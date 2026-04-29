<script setup lang="ts">
  import { Dialog, Message } from 'primevue';
  import { useGame } from '../composables/useGame';
  import { POINTS_TO_WIN } from '../constants/rules';

  defineProps<{
    isVisible: boolean;
  }>();

  const { answeredBy } = useGame();
</script>

<template>
  <Dialog :visible="isVisible" modal header="Vencedor(a):" :closable="false" :style="{ width: '25rem' }">
    <div class="flex flex-col gap-8 pt-8">
      <h1 class="text-center text-4xl font-bold">{{ answeredBy }}</h1>
      <Message severity="success">
        <span class="font-black">Parabéns!</span>
        <br />
        <span>
          {{ answeredBy }} passou dos <span class="font-black">{{ POINTS_TO_WIN }}</span> pontos e venceu o jogo!
        </span>
      </Message>
    </div>
  </Dialog>
</template>