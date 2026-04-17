<script setup lang="ts">
  import { Button, InputGroup, InputText, InputGroupAddon } from 'primevue';
  import { useRoute, useRouter } from 'vue-router';
  import Player from './Player.vue';
  import { usePlayerStore } from '../stores/playerStore';
  import { usePlayersStore } from '../stores/playersStore';
  import { useGame } from '../composables/useGame';

  const route = useRoute();
  const router = useRouter();

  const { activePlayer } = useGame();

  const playersStore = usePlayersStore();
  const playerStore = usePlayerStore();

  const handleCopy = () => {
    if (route.params.id) {
      navigator.clipboard.writeText(String(route.params.id));
    }
  };
</script>

<template>
  <div class="flex flex-col justify-between gap-4 px-5 py-3">
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
          @click="router.back()"
        />
        <InputGroup>
          <InputText
            class="w-full"
            disabled
            :value="route.params.id"
          />
          <InputGroupAddon>
            <Button
              icon="pi pi-copy"
              severity="secondary"
              @click="handleCopy"
            />
          </InputGroupAddon>
        </InputGroup>
      </div>
  </div>
</template>