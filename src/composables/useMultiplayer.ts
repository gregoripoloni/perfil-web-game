import { computed, onMounted, onUnmounted } from 'vue';
import type { DataSnapshot } from 'firebase/database';
import { useRoute } from 'vue-router';
import { db, ref as dbRef, onValue, set, update, remove } from '../firebase';
import { usePlayersStore } from '../stores/playersStore';
import { usePlayerStore } from '../stores/playerStore';
import { useRoundStore, DEFAULT_ROUND_STATE, GamePhase } from '../stores/roundStore';
import { CARDS } from '../constants/cards';

interface MultiplayerPlayer {
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
      setActivePlayer(clientId);
    }

    if (!roundStore.state.cardId) {
      setRandomCard();
    }
  }

  const setRandomCard = () => {
    const cardId = CARDS[Math.floor(Math.random() * CARDS.length)].id;

    update(roundStateRef, {
      cardId,
      updatedAt: Date.now(),
    });
  }

  const setActivePlayer = (playerId: string) => {
    update(roundStateRef, {
      activePlayerId: playerId,
      updatedAt: Date.now(),
    });
  }

  const selectTip = (tipId: number) => {
    const openedTips = Array.isArray(roundStore.state.openedTipsIds) ? roundStore.state.openedTipsIds : [];
    openedTips.push(tipId);
    update(roundStateRef, {
      gamePhase: GamePhase.Guessing,
      openedTipsIds: openedTips,
      updatedAt: Date.now(),
    });
  }

  const submitAnswer = (answer: string, answeredBy: string, isCorrect: boolean, pointsAwarded = 0) => {
    update(roundStateRef, {
      gamePhase: GamePhase.Result,
      submittedAnswer: answer.trim(),
      answeredBy,
      isAnswerCorrect: isCorrect,
      pointsAwarded,
      updatedAt: Date.now(),
    });
  }

  const setNextActivePlayer = () => {
    const activePlayerIndex = playersStore.players.findIndex(player => player.id === roundStore.state.activePlayerId);
    update(roundStateRef, {
      gamePhase: GamePhase.SelectingTip,
      activePlayerId: activePlayerIndex === playersStore.players.length - 1 ? playersStore.players[0].id : playersStore.players[activePlayerIndex + 1].id,
      updatedAt: Date.now(),
    });
  }

  const resetRound = () => {
    const cardId = CARDS[Math.floor(Math.random() * CARDS.length)].id;
    const activePlayerIndex = playersStore.players.findIndex(player => player.id === roundStore.state.activePlayerId);
    update(roundStateRef, {
      cardId,
      gamePhase: GamePhase.SelectingTip,
      openedTipsIds: [],
      submittedAnswer: '',
      answeredBy: null,
      isAnswerCorrect: null,
      pointsAwarded: 0,
      activePlayerId: activePlayerIndex === playersStore.players.length - 1 ? playersStore.players[0].id : playersStore.players[activePlayerIndex + 1].id,
      updatedAt: Date.now(),
    });
  }

  const addPointsToPlayer = (playerId: string, points: number) => {
    const currentPoints = playersStore.players.find(player => player.id === playerId)?.points ?? 0;
    const targetPlayerRef = dbRef(db, `rooms/${roomId.value}/players/${playerId}`);

    update(targetPlayerRef, {
      points: currentPoints + points
    });
  }

  const resetPlayersPoints = () => {
    const updates: Record<string, any> = {};
    playersStore.players.forEach((player) => {
      updates[`${player.id}/points`] = 0;
    });

    if (Object.keys(updates).length > 0) {
      update(roomPlayersRef, updates);
    }
  }

  const setWinner = () => {
    update(roundStateRef, {
      gamePhase: GamePhase.Winner,
    });
  }

  const leaveGame = () => {
    remove(myPlayerRef);
  }

  onMounted(() => {
    onValue(roomPlayersRef, (snapshot: DataSnapshot) => {
      const playersMap = (snapshot.val() || {}) as Record<string, MultiplayerPlayer>;
      const players = Object.values(playersMap)
        .sort((a, b) => a.timestamp - b.timestamp)
        .map(player => ({
          id: player.id,
          name: player.name,
          points: player.points ?? 0,
        }));

      playersStore.players = players;
    });

    onValue(roundStateRef, (snapshot: DataSnapshot) => {
      roundStore.setState(snapshot.val() || { ...DEFAULT_ROUND_STATE });
    });
  });

  onUnmounted(() => {
    leaveGame();
    playerStore.$reset();
    playersStore.$reset();
    roundStore.$reset();
  });

  return {
    joinGame,
    selectTip,
    submitAnswer,
    setNextActivePlayer,
    resetRound,
    addPointsToPlayer,
    resetPlayersPoints,
    setWinner,
  };
}
