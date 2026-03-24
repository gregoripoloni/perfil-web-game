import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useGameStore = defineStore('game', () => {
  const players = ref([
    { id: 1, name: 'Player 1', points: 0 },
    // { id: 2, name: 'Player 2', points: 0 },
    // { id: 3, name: 'Player 3', points: 0 },
    // { id: 4, name: 'Player 4', points: 0 },
  ]);

  const addPointsToPlayer = (playerId: number, points: number) => {
    const player = players.value.find(p => p.id === playerId);
    if (player) {
      player.points += points;
    }
  };

  return { players, addPointsToPlayer };
});