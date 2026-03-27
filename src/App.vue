<script setup lang="ts">
  import Sidebar from './components/Sidebar.vue';
  import Main from './components/Main.vue';
  import PlayerDialog from './components/PlayerDialog.vue';
  import { useGameStore } from './stores/gameStore';
  import { usePlayerStore } from './stores/playerStore';
  import { useMultiplayerGame } from './composables/useMultiplayer';

  const gameStore = useGameStore();
  const playerStore = usePlayerStore();

  const { joinGame, selectTip, submitAnswer, setNextActivePlayer, addPointsToPlayer, resetRound } = useMultiplayerGame();
</script>

<template>
  <div v-if="playerStore.player && gameStore.players.length > 0" class="grid grid-cols-1 h-full lg:grid-cols-4">
    <Sidebar class="col-span-1" />
    <Main
      :select-tip
      :submit-answer
      :set-next-active-player
      :add-points-to-player
      :reset-round
      class="col-span-3"
    />
  </div>
  <PlayerDialog :join-game />
</template>
