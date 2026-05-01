import {
  getDatabase,
  ref,
  set,
  update,
  remove,
  onValue,
  type Unsubscribe,
} from 'firebase/database';
import { app } from '@/services/firebase';
import type { RoomPlayer } from '@/types/player';
import type { RoundState } from '@/types/round';

const db = getDatabase(app);

const playersPath = (roomId: string) => `rooms/${roomId}/players`;
const roundStatePath = (roomId: string) => `rooms/${roomId}/roundState`;
const playerPath = (roomId: string, playerId: string) => `rooms/${roomId}/players/${playerId}`;

export const roomRepository = {
  subscribeToPlayers(
    roomId: string,
    callback: (players: RoomPlayer[]) => void,
  ): Unsubscribe {
    const playersRef = ref(db, playersPath(roomId));
    return onValue(playersRef, snapshot => {
      const map = (snapshot.val() ?? {}) as Record<string, RoomPlayer>;
      const players = Object.values(map).sort((a, b) => a.timestamp - b.timestamp);
      callback(players);
    });
  },

  subscribeToRoundState(
    roomId: string,
    callback: (state: Partial<RoundState>) => void,
  ): Unsubscribe {
    const roundRef = ref(db, roundStatePath(roomId));
    return onValue(roundRef, snapshot => {
      callback((snapshot.val() ?? {}) as Partial<RoundState>);
    });
  },

  async joinPlayer(roomId: string, player: RoomPlayer): Promise<void> {
    await set(ref(db, playerPath(roomId, player.id)), player);
  },

  async removePlayer(roomId: string, playerId: string): Promise<void> {
    await remove(ref(db, playerPath(roomId, playerId)));
  },

  async updateRoundState(roomId: string, partial: Record<string, unknown>): Promise<void> {
    await update(ref(db, roundStatePath(roomId)), partial);
  },

  async addPointsToPlayer(roomId: string, playerId: string, delta: number, currentPoints: number): Promise<void> {
    await update(ref(db, playerPath(roomId, playerId)), {
      points: currentPoints + delta,
    });
  },

  async resetAllPoints(roomId: string, playerIds: string[]): Promise<void> {
    if (playerIds.length === 0) return;

    const updates: Record<string, number> = {};
    playerIds.forEach(id => {
      updates[`${id}/points`] = 0;
    });
    await update(ref(db, playersPath(roomId)), updates);
  },
};
