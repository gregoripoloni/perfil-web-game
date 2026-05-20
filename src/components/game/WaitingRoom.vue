<script setup lang="ts">
import { Button } from 'primevue';
import { useGameState } from '@/composables/useGameState';
import { useGameActions } from '@/composables/useGameActions';

const { isActivePlayer } = useGameState();

const { startGame } = useGameActions();
</script>

<template>
  <div class="flex flex-col justify-center items-center gap-4 h-full">
    <h1 class="text-xl font-semibold">Aguardando jogadores...</h1>
    <Button
      v-if="isActivePlayer"
      icon="pi pi-play"
      label="Começar Jogo"
      @click="startGame"
    />
  </div>
</template>
