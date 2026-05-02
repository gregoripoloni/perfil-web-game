import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { GameState } from '@/types/round';
import { DEFAULT_GAME_STATE } from '@/types/round';

export const useGameStateStore = defineStore('gameState', () => {
  const state = ref<GameState>({ ...DEFAULT_GAME_STATE });

  const mergeState = (partial: Partial<GameState>) => {
    state.value = { ...state.value, ...partial };
  };

  const $reset = () => {
    state.value = { ...DEFAULT_GAME_STATE };
  };

  return { state, mergeState, $reset };
});
