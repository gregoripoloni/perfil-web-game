<script setup lang="ts">
  import { Button } from 'primevue';
  import Player from './Player.vue';
  import { useGameStore } from '../stores/gameStore';
  import { useGame } from '../composables/useGame';

  defineProps<{
    resetRoom: () => void;
  }>();

  const { activePlayer } = useGame();

  const gameStore = useGameStore();
</script>

<template>
  <div class="flex flex-col gap-4 p-5">
      <div class="grid grid-cols-4 gap-2 lg:flex lg:flex-col">
        <Player
          v-for="player in gameStore.players"
          :key="player.id"
          :name="player.name"
          :points="player.points"
          :isActive="player.id === activePlayer?.id"
        />
        <Button icon="pi pi-refresh" outlined severity="secondary" @click="resetRoom" />
      </div>
  </div>
</template>