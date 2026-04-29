<script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue';
  import { onValue, type DataSnapshot } from 'firebase/database';
  import { Card } from 'primevue';
  import Sidebar from '../components/Sidebar.vue';
  import Main from '../components/Main.vue';
  import WaitingPlayers from '../components/WaitingPlayers.vue';
  import PlayerDialog from '../components/PlayerDialog.vue';
  import { useMultiplayer, type MultiplayerPlayer } from '../composables/useMultiplayer';
  import { usePlayersStore } from '../stores/playersStore';
  import { usePlayerStore } from '../stores/playerStore';
  import { useRoundStore, DEFAULT_ROUND_STATE, GamePhase } from '../stores/roundStore';

  const { roomPlayersRef, roundStateRef, leaveGame } = useMultiplayer();

  const playersStore = usePlayersStore();
  const playerStore = usePlayerStore();
  const roundStore = useRoundStore();

  onMounted(() => {
    onValue(roomPlayersRef, (snapshot: DataSnapshot) => {
      const playersMap = (snapshot.val() || {}) as Record<string, MultiplayerPlayer>;
      const players = Object.values(playersMap)
        .sort((a, b) => a.timestamp - b.timestamp)
        .map(player => ({
          id: player.id,
          name: player.name,
          points: player.points ?? 0,
        }));

      playersStore.players = players;
    });

    onValue(roundStateRef, (snapshot: DataSnapshot) => {
      roundStore.setState(snapshot.val() || { ...DEFAULT_ROUND_STATE });
    });
  });

  onUnmounted(async () => {
    await leaveGame();
    playerStore.$reset();
    playersStore.$reset();
    roundStore.$reset();
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