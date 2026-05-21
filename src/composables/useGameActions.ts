import { auth, ensureAnonymousUser } from '@/services/firebase';
import { roomRepository } from '@/services/roomRepository';
import { usePlayersStore } from '@/stores/playersStore';
import { usePlayerStore } from '@/stores/playerStore';
import { useGameStateStore } from '@/stores/gameStateStore';
import { useRoundStore } from '@/stores/roundStore';
import { CARDS } from '@/constants/cards';
import { TIPS } from '@/constants/tips';
import { useRoomId } from '@/composables/useRoomId';
import { hasRemainingTips } from '@/utils/tips';
import { GamePhase, TipKind } from '@/types/round';
import type { RoomPlayerStored } from '@/types/player';

const getRandomCardId = () =>
  CARDS[Math.floor(Math.random() * CARDS.length)].id;

export const useGameActions = () => {
  const { roomId } = useRoomId();

  const playersStore = usePlayersStore();
  const playerStore = usePlayerStore();
  const gameStateStore = useGameStateStore();
  const roundStore = useRoundStore();

  const getNextPlayerId = (): string => {
    const players = playersStore.players;
    if (players.length === 0) return '';
    const activeIndex = players.findIndex(
      (p) => p.id === gameStateStore.state.activePlayerId,
    );
    if (activeIndex === -1) return players[0]?.id ?? '';
    return activeIndex === players.length - 1
      ? players[0].id
      : players[activeIndex + 1].id;
  };

  const advanceTurnOrResetRound = async (): Promise<void> => {
    const nextPlayerId = getNextPlayerId();
    const { cardId, openedTipIds } = roundStore.state;

    if (!hasRemainingTips(cardId, openedTipIds)) {
      await roomRepository.resetRound(roomId.value, {
        nextPlayerId,
        cardId: getRandomCardId(),
      });
      return;
    }

    await roomRepository.advanceTurn(roomId.value, {
      nextPlayerId,
      phase: GamePhase.SelectingTip,
    });
  };

  const joinGame = async (name: string): Promise<void> => {
    if (!name.trim()) return;

    const { uid } = await ensureAnonymousUser();
    const myPlayer: RoomPlayerStored = {
      name: name.trim(),
      points: 0,
      joinedAt: Date.now(),
    };

    await roomRepository.joinPlayer(roomId.value, uid, myPlayer);
    playerStore.setPlayer(uid, myPlayer.name);
  };

  const startGame = async (): Promise<void> => {
    await roomRepository.startGame(roomId.value, {
      cardId: getRandomCardId(),
    });
  };

  const selectTip = async (tipId: number): Promise<void> => {
    const tip = TIPS.find((t) => t.id === tipId);
    if (tip && tip.kind !== TipKind.Hint) {
      await roomRepository.revealTrickTip(roomId.value, tipId);
      return;
    }
    await roomRepository.revealTip(roomId.value, tipId);
  };

  const applyTipEffect = async (
    playerId: string,
    pointsDelta: number,
  ): Promise<void> => {
    await roomRepository.applyPointsDelta(roomId.value, playerId, pointsDelta);
    await advanceTurnOrResetRound();
  };

  const submitAnswer = async (
    answer: string,
    playerId: string,
    isCorrect: boolean,
    pointsAwarded = 0,
  ): Promise<void> => {
    await roomRepository.submitAnswer(roomId.value, {
      text: answer.trim(),
      playerId,
      isCorrect,
      pointsAwarded,
    });
  };

  const awardPoints = async (
    playerId: string,
    points: number,
  ): Promise<void> => {
    await roomRepository.incrementPlayerPoints(roomId.value, playerId, points);
  };

  const setNextPlayer = async (): Promise<void> => {
    await advanceTurnOrResetRound();
  };

  const resetRound = async (): Promise<void> => {
    await roomRepository.resetRound(roomId.value, {
      nextPlayerId: getNextPlayerId(),
      cardId: getRandomCardId(),
    });
  };

  const setWinner = async (): Promise<void> => {
    await roomRepository.setWinner(roomId.value);
  };

  const resetGame = async (): Promise<void> => {
    await roomRepository.resetGame(roomId.value, {
      playerIds: playersStore.players.map((p) => p.id),
      nextPlayerId: getNextPlayerId(),
    });
  };

  const leaveGame = async (): Promise<void> => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const currentRoomId = roomId.value;
    if (!currentRoomId) return;

    const isLeavingActivePlayer =
      gameStateStore.state.activePlayerId === playerStore.player?.id;

    if (!isLeavingActivePlayer) {
      await roomRepository.removePlayer(currentRoomId, uid);
      return;
    }

    await roomRepository.leaveActivePlayer(currentRoomId, {
      playerId: uid,
      nextPlayerId: getNextPlayerId(),
    });
  };

  return {
    joinGame,
    startGame,
    selectTip,
    applyTipEffect,
    submitAnswer,
    awardPoints,
    setNextPlayer,
    resetRound,
    setWinner,
    resetGame,
    leaveGame,
  };
};
