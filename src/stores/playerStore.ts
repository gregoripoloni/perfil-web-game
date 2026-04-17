import { ref } from 'vue';
import { defineStore } from 'pinia';

export const usePlayerStore = defineStore('player', () => {
  const player = ref<{ id: string; name: string }>();

  const setPlayer = (id: string, name: string) => {
    player.value = { id, name };
  };

  const $reset = () => {
    player.value = undefined;
  };

  return { player, setPlayer, $reset };
});