<script setup lang="ts">
  import { Dialog, Message } from 'primevue';
  import { useGame } from '../composables/useGame';

  defineProps<{
    response: string;
    isCorrect: boolean;
    isVisible: boolean;
  }>();

  const { activePlayer, currentTips, revealedTipsCount } = useGame(); // usar pointsAwarded
</script>

<template>
  <Dialog :visible="isVisible" modal :header="`Palpite de ${activePlayer?.name ?? 'jogador'}`" :closable="false" :style="{ width: '25rem', maxWidth: '90%' }">
    <div class="flex flex-col gap-8 pt-8">
      <h1 class="text-center text-4xl font-bold">{{ response }}</h1>
      <Message :severity="isCorrect ? 'success' : 'error'">
        A resposta está <span class="font-black">{{ isCorrect ? 'correta' : 'incorreta' }}</span>
        <br v-if="isCorrect" />
        <span v-if="isCorrect">
          {{ activePlayer?.name ?? 'Jogador' }} ganha <span class="font-black">{{ currentTips.length - revealedTipsCount }}</span> pontos
        </span>
      </Message>
    </div>
  </Dialog>
</template>