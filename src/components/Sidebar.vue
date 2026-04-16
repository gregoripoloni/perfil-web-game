<script setup lang="ts">
  import Player from './Player.vue';
  import { usePlayerStore } from '../stores/playerStore';
  import { usePlayersStore } from '../stores/playersStore';
  import { useGame } from '../composables/useGame';

  const { activePlayer } = useGame();

  const playersStore = usePlayersStore();
  const playerStore = usePlayerStore();
</script>

<template>
  <div class="flex flex-col gap-4 px-5 py-3">
      <div class="flex flex-nowrap gap-2 py-2 overflow-x-auto lg:flex-col">
        <Player
          v-for="player in playersStore.players"
          :key="player.id"
          :name="player.name"
          :points="player.points"
          :isActive="player.id === activePlayer?.id"
          :isCurrentPlayer="player.id === playerStore.player?.id"
          class="w-20 shrink-0 lg:w-full"
        />
      </div>
  </div>
</template>