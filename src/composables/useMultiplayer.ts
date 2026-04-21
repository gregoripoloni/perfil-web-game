import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { db, ref as dbRef, set, update, remove } from '../firebase';
import { usePlayersStore } from '../stores/playersStore';
import { usePlayerStore } from '../stores/playerStore';
import { useRoundStore, GamePhase, DEFAULT_ROUND_STATE } from '../stores/roundStore';
import { CARDS } from '../constants/cards';

export interface MultiplayerPlayer {
  id: string;
  name: string;
  points: number;
  timestamp: number;
}

const clientId = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export const useMultiplayer = () => {
  const route = useRoute();
  const roomId = computed(() => route.params.id);

  const playersStore = usePlayersStore();
  const playerStore = usePlayerStore();
  const roundStore = useRoundStore();

  const roomPlayersRef = dbRef(db, `rooms/${roomId.value}/players`);
  const roundStateRef = dbRef(db, `rooms/${roomId.value}/roundState`);
  const myPlayerRef = dbRef(db, `rooms/${roomId.value}/players/${clientId}`);

  const getRandomCardId = () => {
    return CARDS[Math.floor(Math.random() * CARDS.length)].id;
  };

  const getNextPlayerId = () => {
    const activePlayerIndex = playersStore.players.findIndex(player => player.id === roundStore.state.activePlayerId);
    return activePlayerIndex === playersStore.players.length - 1 ? playersStore.players[0].id : playersStore.players[activePlayerIndex + 1].id;
  };

  const joinGame = (name: string) => {
    if (!name.trim()) return;

    const myPlayer: MultiplayerPlayer = {
      id: clientId,
      name: name.trim(),
      points: 0,
      timestamp: Date.now(),
    };

    set(myPlayerRef, myPlayer);
    playerStore.setPlayer(myPlayer.id, myPlayer.name);

    if (!roundStore.state.activePlayerId) {
      update(roundStateRef, {
        activePlayerId: clientId,
        updatedAt: Date.now(),
      });
    }
  };

  const startGame = () => {
    update(roundStateRef, {
      cardId: getRandomCardId(),
      gamePhase: GamePhase.SelectingTip,
      updatedAt: Date.now(),
    });
  };

  const selectTip = (tipId: number) => {
    const openedTips = Array.isArray(roundStore.state.openedTipsIds) ? roundStore.state.openedTipsIds : [];
    openedTips.push(tipId);
    update(roundStateRef, {
      gamePhase: GamePhase.Guessing,
      openedTipsIds: openedTips,
      updatedAt: Date.now(),
    });
  };

  const submitAnswer = (answer: string, answeredBy: string, isCorrect: boolean, pointsAwarded = 0) => {
    update(roundStateRef, {
      gamePhase: GamePhase.Result,
      submittedAnswer: answer.trim(),
      answeredBy,
      isAnswerCorrect: isCorrect,
      pointsAwarded,
      updatedAt: Date.now(),
    });
  };

  const addPointsToPlayer = (playerId: string, points: number) => {
    const currentPoints = playersStore.players.find(player => player.id === playerId)?.points ?? 0;
    const targetPlayerRef = dbRef(db, `rooms/${roomId.value}/players/${playerId}`);

    update(targetPlayerRef, {
      points: currentPoints + points
    });
  };

  const setNextPlayer = () => {
    update(roundStateRef, {
      gamePhase: GamePhase.SelectingTip,
      activePlayerId: getNextPlayerId(),
      updatedAt: Date.now(),
    });
  };

  const resetRound = () => {
    update(roundStateRef, {
      ...DEFAULT_ROUND_STATE,
      cardId: getRandomCardId(),
      gamePhase: GamePhase.SelectingTip,
      activePlayerId: getNextPlayerId(),
      updatedAt: Date.now(),
    });
  };

  const setWinner = () => {
    update(roundStateRef, {
      gamePhase: GamePhase.Winner,
    });
  };

  const resetGame = () => {
    const updates: Record<string, any> = {};
    playersStore.players.forEach((player) => {
      updates[`${player.id}/points`] = 0;
    });

    if (Object.keys(updates).length > 0) {
      update(roomPlayersRef, updates);
    }

    update(roundStateRef, {
      ...DEFAULT_ROUND_STATE,
      activePlayerId: getNextPlayerId(),
      updatedAt: Date.now(),
    });
  };

  const leaveGame = () => {
    if (roundStore.state.activePlayerId === playerStore.player?.id) {
      update(roundStateRef, {
        activePlayerId: getNextPlayerId(),
        updatedAt: Date.now(),
      });
    }
    remove(myPlayerRef);
  };

  return {
    roomPlayersRef,
    roundStateRef,
    joinGame,
    startGame,
    selectTip,
    submitAnswer,
    addPointsToPlayer,
    setNextPlayer,
    resetRound,
    setWinner,
    resetGame,
    leaveGame,
  };
}
