import {
  getDatabase,
  ref,
  set,
  update,
  onValue,
  get,
  runTransaction,
  serverTimestamp,
  increment,
  remove,
  type Unsubscribe,
} from 'firebase/database';
import { app } from '@/services/firebase';
import { POINTS_TO_WIN } from '@/constants/rules';
import type { RoomPlayerStored, RoomPlayer } from '@/types/player';
import type {
  RoomMeta,
  GameState,
  RoundState,
  AnswerResult,
} from '@/types/round';
import { GamePhase } from '@/types/round';
import { isDuplicateGuess } from '@/utils/text';

export class DuplicateGuessError extends Error {
  constructor() {
    super('DUPLICATE_GUESS');
    this.name = 'DuplicateGuessError';
  }
}

const db = getDatabase(app);

const roomRoot = (roomId: string) => `rooms/${roomId}`;
const metaPath = (roomId: string) => `${roomRoot(roomId)}/meta`;
const statePath = (roomId: string) => `${roomRoot(roomId)}/state`;
const roundPath = (roomId: string) => `${roomRoot(roomId)}/round`;
const playersPath = (roomId: string) => `${roomRoot(roomId)}/players`;
const playerPath = (roomId: string, playerId: string) =>
  `${playersPath(roomId)}/${playerId}`;

interface RoomPatch {
  state?: Partial<GameState>;
  round?: {
    cardId?: number | null;
    openedTipIds?: Record<string, number> | null;
    answer?: AnswerResult | null;
    incorrectGuesses?: string[] | null;
  };
  players?: Record<string, RoomPlayerStored | null>;
}

const patchRoom = async (roomId: string, patch: RoomPatch): Promise<void> => {
  const updates: Record<string, unknown> = {};

  if (patch.state) {
    for (const [key, value] of Object.entries(patch.state)) {
      if (value === undefined) continue;
      updates[`state/${key}`] = value;
    }
    if (patch.state.updatedAt === undefined) {
      updates['state/updatedAt'] = Date.now();
    }
  }

  if (patch.round) {
    for (const [key, value] of Object.entries(patch.round)) {
      if (value === undefined) continue;
      updates[`round/${key}`] = value;
    }
  }

  if (patch.players) {
    for (const [id, value] of Object.entries(patch.players)) {
      if (value === undefined) continue;
      updates[`players/${id}`] = value;
    }
  }

  if (Object.keys(updates).length === 0) return;
  await update(ref(db, roomRoot(roomId)), updates);
};

const readTurnId = async (roomId: string): Promise<number> => {
  const snap = await get(ref(db, statePath(roomId)));
  const value = snap.val() as Partial<GameState> | null;
  return typeof value?.turnId === 'number' ? value.turnId : 0;
};

export const roomRepository = {
  subscribeToMeta(
    roomId: string,
    callback: (meta: Partial<RoomMeta>) => void,
  ): Unsubscribe {
    const r = ref(db, metaPath(roomId));
    return onValue(r, (snapshot) => {
      callback((snapshot.val() ?? {}) as Partial<RoomMeta>);
    });
  },

  subscribeToState(
    roomId: string,
    callback: (state: Partial<GameState>) => void,
  ): Unsubscribe {
    const r = ref(db, statePath(roomId));
    return onValue(r, (snapshot) => {
      callback((snapshot.val() ?? {}) as Partial<GameState>);
    });
  },

  subscribeToRound(
    roomId: string,
    callback: (round: Partial<RoundState>) => void,
  ): Unsubscribe {
    const r = ref(db, roundPath(roomId));
    return onValue(r, (snapshot) => {
      callback((snapshot.val() ?? {}) as Partial<RoundState>);
    });
  },

  subscribeToPlayers(
    roomId: string,
    callback: (players: RoomPlayer[]) => void,
  ): Unsubscribe {
    const playersRef = ref(db, playersPath(roomId));
    return onValue(playersRef, (snapshot) => {
      const map = (snapshot.val() ?? {}) as Record<
        string,
        RoomPlayerStored & { timestamp?: number }
      >;
      const players = Object.entries(map)
        .map(([id, row]) => ({
          id,
          name: row.name,
          points: row.points ?? 0,
          joinedAt: row.joinedAt ?? row.timestamp ?? 0,
        }))
        .sort((a, b) => a.joinedAt - b.joinedAt);
      callback(players);
    });
  },

  async ensureRoomMeta(
    roomId: string,
    createdByUserId: string,
  ): Promise<void> {
    const metaRef = ref(db, metaPath(roomId));
    await runTransaction(metaRef, (current) => {
      if (current === null || current === undefined) {
        return {
          createdAt: serverTimestamp(),
          pointsToWin: POINTS_TO_WIN,
          createdByUserId,
        };
      }
      return current;
    });
  },

  async joinPlayer(
    roomId: string,
    playerId: string,
    data: RoomPlayerStored,
  ): Promise<void> {
    await roomRepository.ensureRoomMeta(roomId, playerId);
    await set(ref(db, playerPath(roomId, playerId)), data);
    const stateSnap = await get(ref(db, statePath(roomId)));
    const s = stateSnap.val() as Partial<GameState> | null;
    if (!s?.activePlayerId) {
      await patchRoom(roomId, {
        state: {
          activePlayerId: playerId,
          phase: GamePhase.WaitingForPlayers,
          turnId: 0,
        },
      });
    }
  },

  async removePlayer(roomId: string, playerId: string): Promise<void> {
    await remove(ref(db, playerPath(roomId, playerId)));
  },

  async incrementPlayerPoints(
    roomId: string,
    playerId: string,
    delta: number,
  ): Promise<void> {
    await update(ref(db, playerPath(roomId, playerId)), {
      points: increment(delta),
    });
  },

  async resetAllPoints(roomId: string, playerIds: string[]): Promise<void> {
    if (playerIds.length === 0) return;

    const updates: Record<string, number> = {};
    playerIds.forEach((id) => {
      updates[`${id}/points`] = 0;
    });
    await update(ref(db, playersPath(roomId)), updates);
  },

  async startGame(roomId: string, params: { cardId: number }): Promise<void> {
    await patchRoom(roomId, {
      state: { phase: GamePhase.SelectingTip },
      round: { cardId: params.cardId },
    });
  },

  async submitAnswer(roomId: string, answer: AnswerResult): Promise<void> {
    const roundUpdates: NonNullable<RoomPatch['round']> = { answer };

    if (!answer.isCorrect) {
      const guessesRef = ref(db, `${roundPath(roomId)}/incorrectGuesses`);
      const snap = await get(guessesRef);
      const current = Array.isArray(snap.val()) ? (snap.val() as string[]) : [];

      if (isDuplicateGuess(answer.text, current)) {
        throw new DuplicateGuessError();
      }

      roundUpdates.incorrectGuesses = [...current, answer.text];
    }

    await patchRoom(roomId, {
      state: { phase: GamePhase.Result },
      round: roundUpdates,
    });
  },

  async setWinner(roomId: string): Promise<void> {
    await patchRoom(roomId, {
      state: { phase: GamePhase.Winner },
    });
  },

  async revealTip(roomId: string, tipId: number): Promise<void> {
    const openedRef = ref(db, `${roundPath(roomId)}/openedTipIds`);
    const snap = await get(openedRef);
    const current = (snap.val() ?? {}) as Record<string, number>;
    const orders = Object.values(current);
    const maxOrder = orders.length > 0 ? Math.max(...orders) : 0;
    await update(ref(db, roomRoot(roomId)), {
      [`round/openedTipIds/${tipId}`]: maxOrder + 1,
      'state/phase': GamePhase.Guessing,
      'state/updatedAt': Date.now(),
    });
  },

  async revealTrickTip(roomId: string, tipId: number): Promise<void> {
    const openedRef = ref(db, `${roundPath(roomId)}/openedTipIds`);
    const snap = await get(openedRef);
    const current = (snap.val() ?? {}) as Record<string, number>;
    const orders = Object.values(current);
    const maxOrder = orders.length > 0 ? Math.max(...orders) : 0;
    await update(ref(db, roomRoot(roomId)), {
      [`round/openedTipIds/${tipId}`]: maxOrder + 1,
      'state/phase': GamePhase.TipEffect,
      'state/updatedAt': Date.now(),
    });
  },

  async applyPointsDelta(
    roomId: string,
    playerId: string,
    pointsDelta: number,
  ): Promise<void> {
    if (pointsDelta === 0) return;

    const playerRef = ref(db, playerPath(roomId, playerId));
    const snap = await get(playerRef);
    const data = snap.val() as { points?: number } | null;
    const current = typeof data?.points === 'number' ? data.points : 0;
    const newPoints = Math.max(0, current + pointsDelta);
    await update(playerRef, { points: newPoints });
  },

  async advanceTurn(
    roomId: string,
    params: { nextPlayerId: string | null; phase: GamePhase },
  ): Promise<void> {
    const turnId = (await readTurnId(roomId)) + 1;
    await patchRoom(roomId, {
      state: {
        phase: params.phase,
        activePlayerId: params.nextPlayerId,
        turnId,
      },
    });
  },

  async resetRound(
    roomId: string,
    params: { nextPlayerId: string | null; cardId: number },
  ): Promise<void> {
    const turnId = (await readTurnId(roomId)) + 1;
    await patchRoom(roomId, {
      state: {
        phase: GamePhase.SelectingTip,
        activePlayerId: params.nextPlayerId,
        turnId,
      },
      round: {
        cardId: params.cardId,
        openedTipIds: null,
        answer: null,
        incorrectGuesses: null,
      },
    });
  },

  async resetGame(
    roomId: string,
    params: { playerIds: string[]; nextPlayerId: string | null },
  ): Promise<void> {
    await roomRepository.resetAllPoints(roomId, params.playerIds);
    const turnId = (await readTurnId(roomId)) + 1;
    await patchRoom(roomId, {
      state: {
        phase: GamePhase.WaitingForPlayers,
        activePlayerId: params.nextPlayerId,
        turnId,
      },
      round: {
        cardId: null,
        openedTipIds: null,
        answer: null,
        incorrectGuesses: null,
      },
    });
  },

  async leaveActivePlayer(
    roomId: string,
    params: { playerId: string; nextPlayerId: string | null },
  ): Promise<void> {
    const turnId = (await readTurnId(roomId)) + 1;
    await patchRoom(roomId, {
      players: { [params.playerId]: null },
      state: {
        activePlayerId: params.nextPlayerId,
        turnId,
      },
    });
  },
};
