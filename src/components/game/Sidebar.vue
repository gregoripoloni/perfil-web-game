<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import {
    Button,
    InputGroup,
    InputText,
    InputGroupAddon,
    Tooltip as vTooltip,
    useConfirm,
  } from 'primevue';
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

  const isUrlCopied = ref(false);

  const handleCopy = () => {
    if (!roomId.value) return;

    navigator.clipboard.writeText(window.location.href.replace(/^https?:\/\//, ''));
    isUrlCopied.value = true;
    setTimeout(() => {
      isUrlCopied.value = false;
    }, 3000);
  };

  const handleLeaveGame = () => {
    confirm.require({
      message: 'Tem certeza que deseja sair do jogo?',
      header: 'Atenção',
      icon: 'pi pi-info-circle',
      acceptProps: {
        label: 'Sair',
      },
      rejectProps: {
        label: 'Cancelar',
        severity: 'secondary',
      },
      async accept() {
        await leaveGame();
        router.push('/');
      },
    });
  };
</script>

<template>
  <div class="flex flex-col-reverse justify-between gap-5 p-5 pb-3 lg:flex-col lg:pb-5">
    <div class="flex flex-nowrap gap-2 pb-2 overflow-x-auto lg:flex-col">
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
    <div class="flex gap-2">
      <Button
        v-tooltip.top="'Sair do jogo'"
        icon="pi pi-sign-out"
        type="button"
        severity="secondary"
        class="shrink-0 -scale-100"
        @click="handleLeaveGame"
      />
      <InputGroup>
        <InputText
          class="w-full"
          disabled
          :value="roomId"
        />
        <InputGroupAddon
          v-if="!isUrlCopied"
          v-tooltip.top="'Copiar URL'"
        >
          <Button
            icon="pi pi-copy"
            severity="secondary"
            @click="handleCopy"
          />
        </InputGroupAddon>
        <InputGroupAddon
          v-else
          v-tooltip.top="'Copiado!'"
        >
          <Button
            icon="pi pi-check"
            severity="secondary"
            disabled
          />
        </InputGroupAddon>
      </InputGroup>
    </div>
  </div>
</template>
