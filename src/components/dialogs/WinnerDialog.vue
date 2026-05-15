<script setup lang="ts">
import MessageDialog from '@/components/ui/MessageDialog.vue';
import { useGameState } from '@/composables/useGameState';
import { useRoomMetaStore } from '@/stores/roomMetaStore';

const dialogVisible = defineModel<boolean>('visible');

const { answeredBy } = useGameState();
const roomMetaStore = useRoomMetaStore();
</script>

<template>
  <MessageDialog
    v-model:visible="dialogVisible"
    tone="success"
    header="Vencedor(a):"
    :main-text="answeredBy"
  >
    <template #additional>
      <span class="font-black">Parabéns!</span>
      <br />
      <span>
        {{ answeredBy }} passou dos
        <span class="font-black">{{ roomMetaStore.state.pointsToWin }}</span>
        pontos e venceu o jogo!
      </span>
    </template>
  </MessageDialog>
</template>
