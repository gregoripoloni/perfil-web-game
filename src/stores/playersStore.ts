import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { RoomPlayer } from '@/types/player';

export const usePlayersStore = defineStore('players', () => {
  const players = ref<RoomPlayer[]>([]);
  const loaded = ref(false);

  const setPlayers = (incoming: RoomPlayer[]) => {
    players.value = incoming;
  };

  const setLoaded = (value: boolean) => {
    loaded.value = value;
  };

  const $reset = () => {
    players.value = [];
    loaded.value = false;
  };

  return { players, loaded, setPlayers, setLoaded, $reset };
});
