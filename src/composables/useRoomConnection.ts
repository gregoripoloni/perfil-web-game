import { onScopeDispose, ref } from 'vue';
import { ensureAnonymousUser } from '@/services/firebase';
import { roomRepository } from '@/services/roomRepository';
import { usePlayersStore } from '@/stores/playersStore';
import { usePlayerStore } from '@/stores/playerStore';
import { useRoundStore } from '@/stores/roundStore';
import { useGameStateStore } from '@/stores/gameStateStore';
import { useRoomMetaStore } from '@/stores/roomMetaStore';
import type { RoomPlayer } from '@/types/player';
import type { GameState, RoundState, RoomMeta } from '@/types/round';
import { useRoomId } from '@/composables/useRoomId';

export const useRoomConnection = () => {
  const { roomId } = useRoomId();
  const loading = ref(true);

  const playersStore = usePlayersStore();
  const playerStore = usePlayerStore();
  const roundStore = useRoundStore();
  const gameStateStore = useGameStateStore();
  const roomMetaStore = useRoomMetaStore();

  const unsubMeta = roomRepository.subscribeToMeta(
    roomId.value,
    (partial: Partial<RoomMeta>) => {
      const prev = roomMetaStore.state;
      roomMetaStore.mergeState({
        pointsToWin:
          typeof partial.pointsToWin === 'number'
            ? partial.pointsToWin
            : prev.pointsToWin,
        createdAt:
          typeof partial.createdAt === 'number'
            ? partial.createdAt
            : prev.createdAt,
        createdByUserId:
          typeof partial.createdByUserId === 'string'
            ? partial.createdByUserId
            : prev.createdByUserId,
      });
    },
  );

  const restorePlayerIfInRoom = async (players: RoomPlayer[]) => {
    if (playerStore.player) return;

    const { uid } = await ensureAnonymousUser();
    const existing = players.find((p) => p.id === uid);
    if (existing) {
      playerStore.setPlayer(uid, existing.name);
    }
  };

  const unsubPlayers = roomRepository.subscribeToPlayers(
    roomId.value,
    (players) => {
      playersStore.setPlayers(players);

      if (playersStore.loaded) {
        loading.value = false;
        return;
      }

      void (async () => {
        await restorePlayerIfInRoom(players);
        playersStore.setLoaded(true);
        loading.value = false;
      })();
    },
  );

  const unsubState = roomRepository.subscribeToState(
    roomId.value,
    (partial: Partial<GameState>) => {
      const prev = gameStateStore.state;
      gameStateStore.mergeState({
        phase: partial.phase ?? prev.phase,
        activePlayerId:
          'activePlayerId' in partial
            ? partial.activePlayerId
            : prev.activePlayerId,
        turnId:
          typeof partial.turnId === 'number' ? partial.turnId : prev.turnId,
        updatedAt:
          typeof partial.updatedAt === 'number'
            ? partial.updatedAt
            : prev.updatedAt,
      });
    },
  );

  const unsubRound = roomRepository.subscribeToRound(
    roomId.value,
    (partial: Partial<RoundState>) => {
      const prev = roundStore.state;
      const openedTipIds =
        partial.openedTipIds !== undefined && partial.openedTipIds !== null
          ? { ...partial.openedTipIds }
          : {};

      roundStore.mergeState({
        cardId: partial.cardId !== undefined ? partial.cardId : prev.cardId,
        openedTipIds,
        answer: partial.answer !== undefined ? partial.answer : prev.answer,
      });
    },
  );

  const disconnect = () => {
    unsubMeta();
    unsubPlayers();
    unsubState();
    unsubRound();
    playerStore.$reset();
    playersStore.$reset();
    roundStore.$reset();
    gameStateStore.$reset();
    roomMetaStore.$reset();
  };

  onScopeDispose(() => {
    unsubMeta();
    unsubPlayers();
    unsubState();
    unsubRound();
  });

  return { disconnect, loading };
};
