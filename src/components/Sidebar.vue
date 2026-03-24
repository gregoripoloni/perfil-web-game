<script setup lang="ts">
  import Player from './Player.vue';
  import { useGameStore } from '../stores/gameStore';
  import { useRoundStore } from '../stores/roundStore';

  const gameStore = useGameStore();
  const roundStore = useRoundStore();
</script>

<template>
  <div class="flex flex-col gap-8 p-4 lg:border-r lg:border-surface-800">
      <span class="text-md text-left">
        Jogadores
      </span>
      <div class="flex flex-col gap-2">
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