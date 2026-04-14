<script setup lang="ts">
  import Sidebar from './components/Sidebar.vue';
  import Main from './components/Main.vue';
  import PlayerDialog from './components/PlayerDialog.vue';
  import { usePlayersStore } from './stores/playersStore';
  import { usePlayerStore } from './stores/playerStore';

  const playersStore = usePlayersStore();
  const playerStore = usePlayerStore();
</script>

<template>
  <div
    v-if="playerStore.player && playersStore.players.length > 0"
    class="flex flex-col h-full lg:grid lg:grid-cols-4 p-2"
  >
    <Sidebar class="col-span-1" />
    <Main class="col-span-3" />
  </div>
  <PlayerDialog />
</template>