import { ref } from 'vue';
import { defineStore } from 'pinia';

export const initialState = {
  cardId: null,
  openedTipsIds: [],
  gamePhase: 'selectingTip' as 'selectingTip' | 'guessing' | 'result',
  activePlayerId: null,
  selectedTipId: null,
  submittedAnswer: "",
  answeredBy: null,
  isAnswerCorrect: null,
  pointsAwarded: 0,
  updatedAt: 0,
};

export const useRoundStateStore = defineStore('roundState', () => {
  const state = ref<{
    cardId: number | null;
    openedTipsIds: number[];
    gamePhase: 'selectingTip' | 'guessing' | 'result';
    activePlayerId: string | null;
    selectedTipId: number | null;
    submittedAnswer: string;
    answeredBy: string | null;
    isAnswerCorrect: boolean | null;
    pointsAwarded: number;
    updatedAt: number;
  }>({ ...initialState});

  const setState = (newState: Partial<typeof state.value>) => {
    state.value = { ...state.value, ...newState };
  };

  return { state, setState };
});