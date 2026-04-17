import { ref } from 'vue';
import { defineStore } from 'pinia';

export const usePlayersStore = defineStore('game', () => {
  const players = ref<{ id: string; name: string; points: number }[]>([]);

  const $reset = () => {
    players.value = [];
  };

  return { players, $reset };
});