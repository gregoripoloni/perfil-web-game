import { ref as vueRef, onMounted, onUnmounted, watch } from "vue";
import type { DataSnapshot } from "firebase/database";
import { db, ref, onValue, set, update, remove } from "../firebase";
import { useGameStore } from "../stores/gameStore";
import { usePlayerStore } from "../stores/playerStore";
import { useRoundStore } from "../stores/roundStore";
import { CARDS } from '../constants/cards';

type GamePhase = "selectingTip" | "guessing" | "result";

interface MultiplayerPlayer {
  id: string;
  name: string;
  points: number;
  timestamp: number;
}

interface RoundState {
  cardId: number | null;
  openedTipsIds: number[];
  gamePhase: GamePhase;
  activePlayerId: string | null;
  submittedAnswer: string;
  answeredBy: string | null;
  isAnswerCorrect: boolean | null;
  pointsAwarded: number;
  updatedAt: number;
}

const clientId = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
const roomId = "room1";

const defaultRoundState: RoundState = {
  cardId: null,
  openedTipsIds: [],
  gamePhase: "selectingTip",
  activePlayerId: null,
  submittedAnswer: "",
  answeredBy: null,
  isAnswerCorrect: null,
  pointsAwarded: 0,
  updatedAt: 0,
};

export function useMultiplayerGame() {
  const gameStore = useGameStore();
  const playerStore = usePlayerStore();
  const roundStore = useRoundStore();

  const playerName = vueRef("");
  const players = vueRef<Record<string, MultiplayerPlayer>>({});
  const roundState = vueRef<RoundState>({ ...defaultRoundState });

  const roomPlayersRef = ref(db, `rooms/${roomId}/players`);
  const roundStateRef = ref(db, `rooms/${roomId}/roundState`);
  const myPlayerRef = ref(db, `rooms/${roomId}/players/${clientId}`);

  function joinGame(name: string) {
    if (!name.trim()) return;
    playerName.value = name.trim();

    const myPlayer: MultiplayerPlayer = {
      id: clientId,
      name: playerName.value,
      points: 0,
      timestamp: Date.now(),
    };

    set(myPlayerRef, myPlayer);
    playerStore.setPlayer(myPlayer.id, myPlayer.name);

    if (!roundState.value.activePlayerId) {
      setActivePlayer(clientId);
    }

    if (!roundState.value.cardId) {
      setRandomCard();
    }
  }

  function setRandomCard() {
    const cardId = CARDS[Math.floor(Math.random() * CARDS.length)].id;

    update(roundStateRef, {
      cardId,
      updatedAt: Date.now(),
    });
  }

  function setActivePlayer(playerId: string) {
    update(roundStateRef, {
      activePlayerId: playerId,
      updatedAt: Date.now(),
    });
  }

  function selectTip(tipId: number) {
    const openedTips = Array.isArray(roundState.value.openedTipsIds) ? roundState.value.openedTipsIds : [];
    openedTips.push(tipId);
    update(roundStateRef, {
      gamePhase: "guessing",
      openedTipsIds: openedTips,
      updatedAt: Date.now(),
    });
  }

  function submitAnswer(answer: string, answeredBy: string, isCorrect: boolean, pointsAwarded = 0) {
    update(roundStateRef, {
      gamePhase: "result",
      submittedAnswer: answer.trim(),
      answeredBy,
      isAnswerCorrect: isCorrect,
      pointsAwarded,
      updatedAt: Date.now(),
    });
  }

  function setNextActivePlayer() {
    const activePlayerIndex = gameStore.players.findIndex(player => player.id === roundState.value.activePlayerId);
    update(roundStateRef, {
      gamePhase: "selectingTip",
      activePlayerId: activePlayerIndex === gameStore.players.length - 1 ? gameStore.players[0].id : gameStore.players[activePlayerIndex + 1].id,
      updatedAt: Date.now(),
    });
  }

  function resetRound() {
    const cardId = CARDS[Math.floor(Math.random() * CARDS.length)].id;
    const activePlayerIndex = gameStore.players.findIndex(player => player.id === roundState.value.activePlayerId);
    update(roundStateRef, {
      cardId,
      gamePhase: "selectingTip",
      openedTipsIds: [],
      submittedAnswer: "",
      answeredBy: null,
      isAnswerCorrect: null,
      pointsAwarded: 0,
      activePlayerId: activePlayerIndex === gameStore.players.length - 1 ? gameStore.players[0].id : gameStore.players[activePlayerIndex + 1].id,
      updatedAt: Date.now(),
    });
  }

  function addPointsToPlayer(playerId: string, points: number) {
    const currentPoints = players.value[playerId]?.points ?? 0;
    const targetPlayerRef = ref(db, `rooms/${roomId}/players/${playerId}`);

    update(targetPlayerRef, {
      points: currentPoints + points,
      timestamp: Date.now(),
    });
  }

  function resetPlayersPoints() {
    const updates: Record<string, any> = {};
    Object.keys(players.value).forEach((playerId) => {
      updates[`${playerId}/points`] = 0;
      updates[`${playerId}/timestamp`] = Date.now();
    });

    if (Object.keys(updates).length > 0) {
      update(roomPlayersRef, updates);
    }
  }

  function setWinner() {
    update(roundStateRef, {
      gamePhase: 'winner',
    });
  }

  function resetRoom() {
    if (roomPlayersRef) {
      set(roomPlayersRef, {});
    }
    if (roundStateRef) {
      set(roundStateRef, { ...defaultRoundState, updatedAt: Date.now() });
    }
  }

  function leaveGame() {
    remove(myPlayerRef);
  }

  onMounted(() => {
    onValue(roomPlayersRef, (snapshot: DataSnapshot) => {
      players.value = snapshot.val() || {};
    });

    onValue(roundStateRef, (snapshot: DataSnapshot) => {
      roundState.value = snapshot.val() || { ...defaultRoundState };
    });
  });

  onUnmounted(() => {
    leaveGame();
  });

  watch(
    players,
    (playersMap) => {
      const players = Object.values(playersMap)
        .sort((a, b) => a.timestamp - b.timestamp)
        .map(player => ({
          id: player.id,
          name: player.name,
          points: player.points ?? 0,
        }));

      gameStore.players = players;
    },
    { immediate: true, deep: true }
  );

  watch(roundState, (newState) => {
    console.log(newState);
    roundStore.setState(newState);
  });

  return {
    clientId,
    playerName,
    players,
    roundState,
    joinGame,
    leaveGame,
    setRandomCard,
    setActivePlayer,
    selectTip,
    submitAnswer,
    setNextActivePlayer,
    resetRound,
    addPointsToPlayer,
    resetPlayersPoints,
    setWinner,
    resetRoom,
  };
}
