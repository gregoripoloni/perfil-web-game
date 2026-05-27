<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Button, Menu, useConfirm } from 'primevue';
import PlayerCard from './PlayerCard.vue';
import { usePlayerStore } from '@/stores/playerStore';
import { usePlayersStore } from '@/stores/playersStore';
import { useGameState } from '@/composables/useGameState';
import { useGameActions } from '@/composables/useGameActions';
import { useRoomId } from '@/composables/useRoomId';

const router = useRouter();
const confirm = useConfirm();

const { activePlayer } = useGameState();
const { leaveGame } = useGameActions();
const { roomId } = useRoomId();

const playersStore = usePlayersStore();
const playerStore = usePlayerStore();

const handleCopy = () => {
  if (!roomId.value) return;

  navigator.clipboard.writeText(
    window.location.href.replace(/^https?:\/\//, ''),
  );
};

const handleLeaveGame = () => {
  confirm.require({
    message: 'Tem certeza que deseja sair do jogo?',
    header: 'Atenção',
    acceptProps: {
      label: 'Sair',
      severity: 'contrast',
    },
    rejectProps: {
      label: 'Cancelar',
      variant: 'text',
      severity: 'secondary',
    },
    async accept() {
      await leaveGame();
      router.push('/');
    },
  });
};

const menu = ref();
const items = ref([
  {
    label: 'Copiar URL',
    icon: 'pi pi-link',
    command: handleCopy,
  },
  {
    label: 'Sair',
    icon: 'pi pi-sign-out',
    command: handleLeaveGame,
  },
]);

const toggle = (event: Event) => {
  menu.value.toggle(event);
};
</script>

<template>
  <div
    class="flex justify-between gap-2 p-5 pt-0 pb-3 lg:flex-col lg:pb-5 lg:pt-5 lg:pl-0"
  >
    <div
      class="flex flex-nowrap w-full gap-2 pt-5 pb-2 overflow-y-visible overflow-x-auto lg:flex-col lg:pb-0 lg:pt-0 lg:pl-5"
    >
      <TransitionGroup name="list">
        <PlayerCard
          v-for="player in playersStore.players"
          :key="player.id"
          :name="player.name"
          :points="player.points"
          :is-active="player.id === activePlayer?.id"
          :is-current-player="player.id === playerStore.player?.id"
          class="w-20 shrink-0 lg:w-full"
        />
      </TransitionGroup>
    </div>
    <div class="flex items-start gap-2 pt-5 lg:pt-0 lg:pl-5">
      <Button
        icon="pi pi-cog"
        type="button"
        variant="text"
        severity="secondary"
        class="shrink-0"
        aria-haspopup="true"
        aria-controls="overlay_menu"
        @click="toggle"
      />
      <Menu id="overlay_menu" ref="menu" :model="items" :popup="true" />
    </div>
  </div>
</template>
