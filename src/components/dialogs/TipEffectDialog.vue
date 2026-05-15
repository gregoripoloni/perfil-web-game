<script setup lang="ts">
import { computed } from 'vue';
import MessageDialog from '@/components/ui/MessageDialog.vue';
import { useGameState } from '@/composables/useGameState';
import { TipKind } from '@/types/round';

const dialogVisible = defineModel<boolean>('visible');

const { activePlayer, latestRevealedTip } = useGameState();

const tone = computed<'success' | 'error' | 'warn'>(() => {
  const kind = latestRevealedTip.value?.kind;
  if (kind === TipKind.GainPoints) return 'success';
  if (kind === TipKind.LosePoints) return 'error';
  return 'warn';
});

const summaryText = computed(() => {
  const kind = latestRevealedTip.value?.kind;
  if (kind === TipKind.GainPoints) return 'Pontos ganhos!';
  if (kind === TipKind.LosePoints) return 'Pontos perdidos!';
  return 'Vez pulada!';
});
</script>

<template>
  <MessageDialog
    v-model:visible="dialogVisible"
    :tone="tone"
    :header="`Vez de ${activePlayer?.name ?? ''}`"
    :main-text="latestRevealedTip?.text ?? ''"
  >
    <template #additional>
      <span class="font-black">{{ summaryText }}</span>
    </template>
  </MessageDialog>
</template>
