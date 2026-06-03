<script setup lang="ts">
import { ref } from 'vue';
import { Button, InputText } from 'primevue';
import { useGameState } from '@/composables/useGameState';
import { useGameActions } from '@/composables/useGameActions';

const { isRoomCreator } = useGameState();
const { startGame } = useGameActions();

const loading = ref(false);

const location = window.location.href.replace(/^https?:\/\//, '');

const handleCopy = () => {
  navigator.clipboard.writeText(location);
};

const handleStartGame = async () => {
  loading.value = true;
  await startGame();
  loading.value = false;
};
</script>

<template>
  <div class="flex flex-col justify-center items-center gap-4 p-4 h-full">
    <h1 class="text-xl font-semibold mb-4">Aguardando jogadores...</h1>
    <p class="text-sm font-medium text-surface-400">
      Compartilhe o link abaixo com seus amigos:
    </p>
    <div class="flex items-center gap-2">
      <InputText :value="location" disabled />
      <Button icon="pi pi-copy" severity="secondary" @click="handleCopy" />
    </div>
    <Button
      v-if="isRoomCreator"
      icon="pi pi-play"
      label="Começar Jogo"
      class="mt-4"
      :loading="loading"
      @click="handleStartGame"
    />
  </div>
</template>
