<script setup lang="ts">
  import { Button } from 'primevue';
  import { useGame } from '../composables/useGame';
  import { useMultiplayer } from '../composables/useMultiplayer';

  const { isActivePlayer } = useGame();

  const { startGame } = useMultiplayer();
</script>

<template>
  <div class="flex flex-col justify-center items-center gap-4 h-full">
    <h1 class="text-xl font-semibold">Aguardando jogadores...</h1>
    <Button v-if="isActivePlayer" label="Começar Jogo" @click="startGame" />
  </div>
</template>