<script setup lang="ts">
  import Player from './Player.vue';
  import { useGameStore } from '../stores/gameStore';
  import { useRoundStore } from '../stores/roundStore';

  const gameStore = useGameStore();
  const roundStore = useRoundStore();
</script>

<template>
  <div class="flex flex-col gap-4 p-6 pb-0 lg:border-r lg:border-surface-800">
      <div class="grid grid-cols-4 gap-2 lg:flex lg:flex-col">
        <Player
          v-for="player in gameStore.players"
          :key="player.id"
          :name="player.name"
          :points="player.points"
          :isActive="player.id === roundStore.activePlayer.id"
        />
      </div>
  </div>
</template>