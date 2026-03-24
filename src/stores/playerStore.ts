import { ref } from 'vue';
import { defineStore } from 'pinia';

export const usePlayerStore = defineStore('player', () => {
  const player = ref({ id: 1, name: 'Player 1' });

  return { player };
});