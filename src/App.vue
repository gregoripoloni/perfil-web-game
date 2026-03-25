<script setup lang="ts">
  import Sidebar from './components/Sidebar.vue';
  import Main from './components/Main.vue';
  import PlayerDialog from './components/PlayerDialog.vue';
  import { useGameStore } from './stores/gameStore';

  const gameStore = useGameStore();
</script>

<template>
  <div v-if="gameStore.players.length > 0" class="grid grid-cols-1 h-full lg:grid-cols-4">
    <Sidebar class="col-span-1" />
    <Main class="col-span-3" />
  </div>
  <PlayerDialog />
</template>
