import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { MultiplayerPlayer } from '../types/multiplayer';

export const usePlayersStore = defineStore('players', () => {
  const players = ref<MultiplayerPlayer[]>([]);

  const setPlayers = (incoming: MultiplayerPlayer[]) => {
    players.value = incoming;
  };

  const $reset = () => {
    players.value = [];
  };

  return { players, setPlayers, $reset };
});
