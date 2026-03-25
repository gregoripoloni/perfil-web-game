<script setup lang="ts">
  import Sidebar from './components/Sidebar.vue';
  import Main from './components/Main.vue';
  import PlayerDialog from './components/PlayerDialog.vue';
  import { useGameStore } from './stores/gameStore';

  const gameStore = useGameStore();
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-4 lg:h-screen">
    <Sidebar class="col-span-1" />
    <Main v-if="gameStore.players.length > 0" class="col-span-3" />
  </div>
  <PlayerDialog />
</template>
