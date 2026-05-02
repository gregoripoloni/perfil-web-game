<script setup lang="ts">
  import { onUnmounted } from 'vue';
  import { Card } from 'primevue';
  import Sidebar from '@/components/game/Sidebar.vue';
  import RoundBoard from '@/components/game/RoundBoard.vue';
  import WaitingRoom from '@/components/game/WaitingRoom.vue';
  import NameEntryDialog from '@/components/dialogs/NameEntryDialog.vue';
  import { useRoomConnection } from '@/composables/useRoomConnection';
  import { usePlayersStore } from '@/stores/playersStore';
  import { usePlayerStore } from '@/stores/playerStore';
  import { useGameStateStore } from '@/stores/gameStateStore';
  import { GamePhase } from '@/types/round';

  const { disconnect } = useRoomConnection();

  const playersStore = usePlayersStore();
  const playerStore = usePlayerStore();
  const gameStateStore = useGameStateStore();

  onUnmounted(() => {
    disconnect();
  });
</script>

<template>
  <div>
    <Transition>
      <div
        v-if="playerStore.player && playersStore.players.length > 0"
        class="flex flex-col h-full lg:grid lg:grid-cols-4 p-2"
      >
        <Sidebar class="col-span-1" />
        <Card class="Game h-full col-span-3 overflow-y-auto bg-surface-950! border-2 border-surface-800">
          <template #content>
            <WaitingRoom v-if="gameStateStore.state.phase === GamePhase.WaitingForPlayers" class="col-span-3" />
            <RoundBoard v-else class="col-span-3" />
          </template>
        </Card>
      </div>
    </Transition>
    <NameEntryDialog />
  </div>
</template>

<style scoped>
  .Game:deep(> .p-card-body),
  .Game:deep(> .p-card-body > .p-card-content) {
    height: 100%;
    overflow-y: auto;
  }
</style>
