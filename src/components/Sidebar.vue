<script setup lang="ts">
  import Player from './Player.vue';
  import { useGameStore } from '../stores/gameStore';
  import { useGame } from '../composables/useGame';

  const { activePlayer } = useGame();

  const gameStore = useGameStore();
</script>

<template>
  <div class="flex flex-col gap-4 p-6 border-b-2 border-surface-800 lg:border-b-0 lg:border-r-2">
      <div class="grid grid-cols-4 gap-2 lg:flex lg:flex-col">
        <Player
          v-for="player in gameStore.players"
          :key="player.id"
          :name="player.name"
          :points="player.points"
          :isActive="player.id === activePlayer?.id"
        />
      </div>
  </div>
</template>