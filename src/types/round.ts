import { POINTS_TO_WIN } from '@/constants/rules';

export enum GamePhase {
  WaitingForPlayers = 'waitingForPlayers',
  SelectingTip = 'selectingTip',
  Guessing = 'guessing',
  Result = 'result',
  TipEffect = 'tipEffect',
  Winner = 'winner',
}

export enum TipKind {
  Hint = 'hint',
  SkipTurn = 'skipTurn',
  LosePoints = 'losePoints',
  GainPoints = 'gainPoints',
}

export interface Tip {
  id: number;
  cardId: number;
  text: string;
  number: number;
  kind: TipKind;
  pointsDelta?: number;
}

export interface RoomMeta {
  createdAt: number;
  pointsToWin: number;
  createdByUserId: string | null;
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
  createdByUserId: null,
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
