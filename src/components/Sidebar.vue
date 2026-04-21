<script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import {
    Button,
    InputGroup,
    InputText,
    InputGroupAddon,
    Tooltip as vTooltip,
    useConfirm,
  } from 'primevue';
  import Player from './Player.vue';
  import { usePlayerStore } from '../stores/playerStore';
  import { usePlayersStore } from '../stores/playersStore';
  import { useGame } from '../composables/useGame';

  const route = useRoute();
  const router = useRouter();

  const confirm = useConfirm();

  const { activePlayer } = useGame();

  const playersStore = usePlayersStore();
  const playerStore = usePlayerStore();

  const isUrlCopied = ref(false);

  const handleCopy = () => {
    if (route.params.id) {
      navigator.clipboard.writeText(window.location.href.replace('http://', '').replace('https://', ''));
      isUrlCopied.value = true;
      setTimeout(() => {
        isUrlCopied.value = false;
      }, 3000);
    }
  };

  const handleLeaveGame = () => {
    confirm.require({
      message: 'Tem certeza que deseja sair do jogo?',
      header: 'Atenção',
      icon: 'pi pi-info-circle',
      acceptProps: {
        label: 'Sair'
      },
      rejectProps: {
        label: 'Cancelar',
        severity: 'secondary',
      },
      accept() {
        router.push('/');
      },
    });
  };
</script>

<template>
  <div class="flex flex-col justify-between gap-2 px-5 py-3">
    <div class="flex flex-nowrap gap-2 py-2 overflow-x-auto lg:flex-col">
      <Player
        v-for="player in playersStore.players"
        :key="player.id"
        :name="player.name"
        :points="player.points"
        :isActive="player.id === activePlayer?.id"
        :isCurrentPlayer="player.id === playerStore.player?.id"
        class="w-20 shrink-0 lg:w-full"
      />
    </div>
    <div class="flex gap-2">
      <Button
        icon="pi pi-sign-out"
        type="button"
        severity="secondary"
        class="shrink-0 -scale-100"
        v-tooltip.top="'Sair do jogo'"
        @click="handleLeaveGame"
      />
      <InputGroup>
        <InputText
          class="w-full"
          disabled
          :value="route.params.id"
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