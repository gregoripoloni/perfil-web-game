import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { RoundState } from '@/types/round';
import { DEFAULT_ROUND_STATE } from '@/types/round';

export const useRoundStore = defineStore('round', () => {
  const state = ref<RoundState>({ ...DEFAULT_ROUND_STATE });

  const mergeState = (partial: Partial<RoundState>) => {
    state.value = { ...state.value, ...partial };
  };

  const $reset = () => {
    state.value = { ...DEFAULT_ROUND_STATE };
  };

  return { state, mergeState, $reset };
});
