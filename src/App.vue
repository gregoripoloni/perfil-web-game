<script setup lang="ts">
  import { watch } from 'vue';
  import Sidebar from './components/Sidebar.vue';
  import Main from './components/Main.vue';
  import PlayerDialog from './components/PlayerDialog.vue';
  import { useGameStore } from './stores/gameStore';
  import { useMultiplayerGame } from './composables/useMultiplayer';
  import { usePlayerStore } from './stores/playerStore';

  const gameStore = useGameStore();
  const playerStore = usePlayerStore();
  const multiplayer = useMultiplayerGame();

  watch(
    multiplayer.players,
    (playersMap) => {
      const players = Object.values(playersMap)
        .sort((a, b) => a.timestamp - b.timestamp)
        .map(player => ({
          id: player.id,
          name: player.name,
          points: player.points ?? 0,
        }));

      gameStore.setPlayers(players);
    },
    { immediate: true, deep: true }
  );
</script>

<template>
  <div v-if="playerStore.player && gameStore.players.length > 0" class="grid grid-cols-1 h-full lg:grid-cols-4">
    <Sidebar class="col-span-1" />
    <Main class="col-span-3" />
  </div>
  <PlayerDialog />
</template>
