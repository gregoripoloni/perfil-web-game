import { auth, ensureAnonymousUser } from '../firebase';
import { roomRepository } from '../services/roomRepository';
import { usePlayersStore } from '../stores/playersStore';
import { usePlayerStore } from '../stores/playerStore';
import { useRoundStore, GamePhase, DEFAULT_ROUND_STATE } from '../stores/roundStore';
import { CARDS } from '../constants/cards';
import { useRoomId } from './useRoomId';

const getRandomCardId = () => CARDS[Math.floor(Math.random() * CARDS.length)].id;

export const useGameActions = () => {
  const { roomId } = useRoomId();

  const playersStore = usePlayersStore();
  const playerStore = usePlayerStore();
  const roundStore = useRoundStore();

  const getNextPlayerId = (): string => {
    const players = playersStore.players;
    if (players.length === 0) return '';
    const activeIndex = players.findIndex(p => p.id === roundStore.state.activePlayerId);
    return activeIndex === players.length - 1
      ? players[0].id
      : players[activeIndex + 1].id;
  };

  const joinGame = async (name: string): Promise<void> => {
    if (!name.trim()) return;

    const { uid } = await ensureAnonymousUser();
    const myPlayer = {
      id: uid,
      name: name.trim(),
      points: 0,
      timestamp: Date.now(),
    };

    await roomRepository.joinPlayer(roomId.value, myPlayer);
    playerStore.setPlayer(myPlayer.id, myPlayer.name);

    if (!roundStore.state.activePlayerId) {
      await roomRepository.updateRoundState(roomId.value, {
        activePlayerId: uid,
        updatedAt: Date.now(),
      });
    }
  };

  const startGame = async (): Promise<void> => {
    await roomRepository.updateRoundState(roomId.value, {
      cardId: getRandomCardId(),
      gamePhase: GamePhase.SelectingTip,
      updatedAt: Date.now(),
    });
  };

  const selectTip = async (tipId: number): Promise<void> => {
    const openedTips = Array.isArray(roundStore.state.openedTipsIds)
      ? [...roundStore.state.openedTipsIds]
      : [];
    openedTips.push(tipId);
    await roomRepository.updateRoundState(roomId.value, {
      gamePhase: GamePhase.Guessing,
      openedTipsIds: openedTips,
      updatedAt: Date.now(),
    });
  };

  const submitAnswer = async (
    answer: string,
    answeredBy: string,
    isCorrect: boolean,
    pointsAwarded = 0,
  ): Promise<void> => {
    await roomRepository.updateRoundState(roomId.value, {
      gamePhase: GamePhase.Result,
      submittedAnswer: answer.trim(),
      answeredBy,
      isAnswerCorrect: isCorrect,
      pointsAwarded,
      updatedAt: Date.now(),
    });
  };

  const awardPoints = async (playerId: string, points: number): Promise<void> => {
    const currentPoints = playersStore.players.find(p => p.id === playerId)?.points ?? 0;
    await roomRepository.addPointsToPlayer(roomId.value, playerId, points, currentPoints);
  };

  const setNextPlayer = async (): Promise<void> => {
    await roomRepository.updateRoundState(roomId.value, {
      gamePhase: GamePhase.SelectingTip,
      activePlayerId: getNextPlayerId(),
      updatedAt: Date.now(),
    });
  };

  const resetRound = async (): Promise<void> => {
    await roomRepository.updateRoundState(roomId.value, {
      ...DEFAULT_ROUND_STATE,
      cardId: getRandomCardId(),
      gamePhase: GamePhase.SelectingTip,
      activePlayerId: getNextPlayerId(),
      updatedAt: Date.now(),
    });
  };

  const setWinner = async (): Promise<void> => {
    await roomRepository.updateRoundState(roomId.value, {
      gamePhase: GamePhase.Winner,
    });
  };

  const resetGame = async (): Promise<void> => {
    await roomRepository.resetAllPoints(
      roomId.value,
      playersStore.players.map(p => p.id),
    );
    await roomRepository.updateRoundState(roomId.value, {
      ...DEFAULT_ROUND_STATE,
      activePlayerId: getNextPlayerId(),
      updatedAt: Date.now(),
    });
  };

  const leaveGame = async (): Promise<void> => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    if (roundStore.state.activePlayerId === playerStore.player?.id) {
      await roomRepository.updateRoundState(roomId.value, {
        activePlayerId: getNextPlayerId(),
        updatedAt: Date.now(),
      });
    }
    await roomRepository.removePlayer(roomId.value, uid);
  };

  return {
    joinGame,
    startGame,
    selectTip,
    submitAnswer,
    awardPoints,
    setNextPlayer,
    resetRound,
    setWinner,
    resetGame,
    leaveGame,
  };
};
