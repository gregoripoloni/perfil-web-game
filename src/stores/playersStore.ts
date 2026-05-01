import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { RoomPlayer } from '@/types/player';

export const usePlayersStore = defineStore('players', () => {
  const players = ref<RoomPlayer[]>([]);

  const setPlayers = (incoming: RoomPlayer[]) => {
    players.value = incoming;
  };

  const $reset = () => {
    players.value = [];
  };

  return { players, setPlayers, $reset };
});
