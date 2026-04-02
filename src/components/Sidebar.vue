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
  <div class="flex flex-col gap-4 px-5 py-3">
      <div class="flex flex-nowrap gap-2 py-2 overflow-x-auto lg:flex-col">
        <Player
          v-for="player in gameStore.players.sort((a, b) => b.points - a.points)"
          :key="player.id"
          :name="player.name"
          :points="player.points"
          :isActive="player.id === activePlayer?.id"
          class="w-20 shrink-0 lg:w-full"
        />
        <Button
          icon="pi pi-refresh"
          severity="secondary"
          outlined
          class="shrink-0"
          @click="resetRoom"
        />
      </div>
  </div>
</template>