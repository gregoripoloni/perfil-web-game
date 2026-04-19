import { ref } from 'vue';
import { defineStore } from 'pinia';

export enum GamePhase {
  WaitingForPlayers = 'waitingForPlayers',
  SelectingTip = 'selectingTip',
  Guessing = 'guessing',
  Result = 'result',
  Winner = 'winner',
}

export interface RoundState {
  cardId: number | null;
  openedTipsIds: number[];
  gamePhase: GamePhase;
  activePlayerId: string | null;
  submittedAnswer: string;
  answeredBy: string | null;
  isAnswerCorrect: boolean | null;
  pointsAwarded: number;
  updatedAt: number;
}

export const DEFAULT_ROUND_STATE: RoundState = {
  cardId: null,
  openedTipsIds: [],
  gamePhase: GamePhase.WaitingForPlayers,
  activePlayerId: null,
  submittedAnswer: "",
  answeredBy: null,
  isAnswerCorrect: null,
  pointsAwarded: 0,
  updatedAt: 0,
};

export const useRoundStore = defineStore('roundState', () => {
  const state = ref(DEFAULT_ROUND_STATE);

  const setState = (newState: Partial<typeof state.value>) => {
    state.value = { ...state.value, ...newState };
  };

  const $reset = () => {
    state.value = DEFAULT_ROUND_STATE;
  };

  return { state, setState, $reset };
});