<script setup lang="ts">
import { computed } from 'vue';
import { Dialog, Message } from 'primevue';
import { useGameState } from '@/composables/useGameState';
import { TipKind } from '@/types/round';

defineModel<boolean>('visible');

const { activePlayer, latestRevealedTip } = useGameState();

const severity = computed(() => {
  const kind = latestRevealedTip.value?.kind;
  if (kind === TipKind.GainPoints) return 'success';
  if (kind === TipKind.LosePoints) return 'error';
  return 'warn';
});

const messageText = computed(() => {
  const kind = latestRevealedTip.value?.kind;
  if (kind === TipKind.GainPoints) return 'Pontos ganhos!';
  if (kind === TipKind.LosePoints) return 'Pontos perdidos!';
  return 'Vez pulada!';
});
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :header="`Vez de ${activePlayer?.name ?? ''}`"
    :closable="false"
    :style="{ width: '25rem' }"
  >
    <div class="flex flex-col gap-8 pt-8">
      <h1 class="text-center text-4xl font-bold">
        {{ latestRevealedTip?.text }}
      </h1>
      <Message :severity="severity">
        <span class="font-black">{{ messageText }}</span>
      </Message>
    </div>
  </Dialog>
</template>
