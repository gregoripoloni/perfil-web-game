import { ref } from 'vue';
import { defineStore } from 'pinia';

export const usePlayerStore = defineStore('player', () => {
  const player = ref<{ id: number; name: string }>();

  const setPlayer = (id: number, name: string) => {
    player.value = { id, name };
  };

  return { player, setPlayer };
});