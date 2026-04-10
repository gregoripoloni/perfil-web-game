import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useRoundStore = defineStore('roundState', () => {
  const state = ref({
    cardId: null as number|null,
    openedTipsIds: [] as number[],
    gamePhase: 'selectingTip' as 'selectingTip' | 'guessing' | 'result' | 'winner',
    activePlayerId: null as string|null,
    selectedTipId: null as number|null,
    submittedAnswer: "",
    answeredBy: null as string|null,
    isAnswerCorrect: null as boolean|null,
    pointsAwarded: 0,
    updatedAt: 0,
  });

  const setState = (newState: Partial<typeof state.value>) => {
    state.value = { ...state.value, ...newState };
  };

  return { state, setState };
});