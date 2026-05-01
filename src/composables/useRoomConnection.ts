import { onScopeDispose } from 'vue';
import { roomRepository } from '@/services/roomRepository';
import { usePlayersStore } from '@/stores/playersStore';
import { usePlayerStore } from '@/stores/playerStore';
import { useRoundStore } from '@/stores/roundStore';
import { DEFAULT_ROUND_STATE, type RoundState } from '@/types/round';
import { useRoomId } from '@/composables/useRoomId';
import { useGameActions } from '@/composables/useGameActions';

export const useRoomConnection = () => {
  const { roomId } = useRoomId();

  const playersStore = usePlayersStore();
  const playerStore = usePlayerStore();
  const roundStore = useRoundStore();
  const { leaveGame } = useGameActions();

  const unsubPlayers = roomRepository.subscribeToPlayers(roomId.value, players => {
    playersStore.setPlayers(players);
  });

  const unsubRound = roomRepository.subscribeToRoundState(roomId.value, (partial: Partial<RoundState>) => {
    roundStore.mergeState({ ...DEFAULT_ROUND_STATE, ...partial });
  });

  const disconnect = async () => {
    unsubPlayers();
    unsubRound();
    await leaveGame();
    playerStore.$reset();
    playersStore.$reset();
    roundStore.$reset();
  };

  onScopeDispose(() => {
    unsubPlayers();
    unsubRound();
  });

  return { disconnect };
};
