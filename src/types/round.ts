import { POINTS_TO_WIN } from '@/constants/rules';

export enum GamePhase {
  WaitingForPlayers = 'waitingForPlayers',
  SelectingTip = 'selectingTip',
  Guessing = 'guessing',
  Result = 'result',
  Winner = 'winner',
}

export interface RoomMeta {
  createdAt: number;
  pointsToWin: number;
}

export interface GameState {
  phase: GamePhase;
  activePlayerId: string | null;
  turnId: number;
  updatedAt: number;
}

export interface AnswerResult {
  text: string;
  playerId: string;
  isCorrect: boolean;
  pointsAwarded: number;
}

export interface RoundState {
  cardId: number | null;
  openedTipIds: Record<string, number>;
  answer: AnswerResult | null;
}

export const DEFAULT_ROOM_META: RoomMeta = {
  createdAt: 0,
  pointsToWin: POINTS_TO_WIN,
};

export const DEFAULT_GAME_STATE: GameState = {
  phase: GamePhase.WaitingForPlayers,
  activePlayerId: null,
  turnId: 0,
  updatedAt: 0,
};

export const DEFAULT_ROUND_STATE: RoundState = {
  cardId: null,
  openedTipIds: {},
  answer: null,
};
