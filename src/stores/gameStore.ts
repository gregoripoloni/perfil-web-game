import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useGameStore = defineStore('game', () => {
  const players = ref<{ id: number; name: string; points: number }[]>([]);

  const addPlayer = (id: number, name: string) => {
    players.value.push({
      id,
      name,
      points: 0,
    });
  };

  const addPointsToPlayer = (playerId: number, points: number) => {
    const player = players.value.find(p => p.id === playerId);
    if (player) {
      player.points += points;
    }
  };

  return { players, addPlayer, addPointsToPlayer };
});