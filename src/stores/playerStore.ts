import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Player } from '../types/multiplayer';

export const usePlayerStore = defineStore('player', () => {
  const player = ref<Player>();

  const setPlayer = (id: string, name: string) => {
    player.value = { id, name };
  };

  const $reset = () => {
    player.value = undefined;
  };

  return { player, setPlayer, $reset };
});
