<script setup lang="ts">
  import { onUnmounted } from 'vue';
  import { Card } from 'primevue';
  import Sidebar from '../components/Sidebar.vue';
  import Main from '../components/Main.vue';
  import WaitingPlayers from '../components/WaitingPlayers.vue';
  import PlayerDialog from '../components/PlayerDialog.vue';
  import { useRoomConnection } from '../composables/useRoomConnection';
  import { usePlayersStore } from '../stores/playersStore';
  import { usePlayerStore } from '../stores/playerStore';
  import { useRoundStore, GamePhase } from '../stores/roundStore';

  const { disconnect } = useRoomConnection();

  const playersStore = usePlayersStore();
  const playerStore = usePlayerStore();
  const roundStore = useRoundStore();

  onUnmounted(() => {
    void disconnect();
  });
</script>

<template>
  <Transition>
    <div
      v-if="playerStore.player && playersStore.players.length > 0"
      class="flex flex-col h-full lg:grid lg:grid-cols-4 p-2"
    >
      <Sidebar class="col-span-1" />
      <Card class="Game h-full col-span-3 overflow-y-auto bg-surface-950! border-2 border-surface-800">
        <template #content>
          <WaitingPlayers v-if="roundStore.state.gamePhase === GamePhase.WaitingForPlayers" class="col-span-3" />
          <Main v-else class="col-span-3" />
        </template>
      </Card>
    </div>
  </Transition>
  <PlayerDialog />
</template>

<style scoped>
  .Game:deep(> .p-card-body),
  .Game:deep(> .p-card-body > .p-card-content) {
    height: 100%;
    overflow-y: auto;
  }
</style>
