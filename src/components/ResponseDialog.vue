<script setup lang="ts">
  import { Dialog, Message } from 'primevue';
  import { useRoundStore } from '../stores/roundStore';

  defineProps<{
    response: string;
    isCorrect: boolean;
    isVisible: boolean;
  }>();

  const roundStore = useRoundStore();
</script>

<template>
  <Dialog :visible="isVisible" modal :header="`Palpite de ${roundStore.activePlayer?.name ?? 'jogador'}`" :closable="false" :style="{ width: '25rem', maxWidth: '90%' }">
    <div class="flex flex-col gap-8 pt-8">
      <h1 class="text-center text-4xl font-bold">{{ response }}</h1>
      <Message :severity="isCorrect ? 'success' : 'error'">
        A resposta está <span class="font-black">{{ isCorrect ? 'correta' : 'incorreta' }}</span>
        <br v-if="isCorrect" />
        <span v-if="isCorrect">
          {{ roundStore.activePlayer?.name ?? 'Jogador' }} ganha <span class="font-black">{{ roundStore.tips.length - roundStore.revealedTipsCount }}</span> pontos
        </span>
      </Message>
    </div>
  </Dialog>
</template>