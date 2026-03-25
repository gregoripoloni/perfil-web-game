import { ref as vueRef, onMounted, onUnmounted } from "vue";
import type { DataSnapshot } from "firebase/database";
import { db, ref, onValue, set, update, remove } from "../firebase";

type GamePhase = "selectingTip" | "guessing" | "result";

interface MultiplayerPlayer {
  id: string;
  name: string;
  points: number;
  timestamp: number;
}

interface RoundState {
  gamePhase: GamePhase;
  activePlayerId: string | null;
  selectedTipId: number | null;
  submittedAnswer: string;
  answeredBy: string | null;
  isAnswerCorrect: boolean | null;
  pointsAwarded: number;
  updatedAt: number;
}

const clientId = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
const roomId = "room1";

const defaultRoundState: RoundState = {
  gamePhase: "selectingTip",
  activePlayerId: null,
  selectedTipId: null,
  submittedAnswer: "",
  answeredBy: null,
  isAnswerCorrect: null,
  pointsAwarded: 0,
  updatedAt: 0,
};

export function useMultiplayerGame() {
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

    if (!roundState.value.activePlayerId) {
      update(roundStateRef, {
        activePlayerId: clientId,
        updatedAt: Date.now(),
      });
    }
  }

  function setActivePlayer(playerId: string) {
    update(roundStateRef, {
      activePlayerId: playerId,
      updatedAt: Date.now(),
    });
  }

  function selectTip(tipId: number) {
    update(roundStateRef, {
      gamePhase: "guessing",
      selectedTipId: tipId,
      submittedAnswer: "",
      answeredBy: null,
      isAnswerCorrect: null,
      pointsAwarded: 0,
      updatedAt: Date.now(),
    });
  }

  function submitAnswer(answer: string, answeredById = clientId) {
    update(roundStateRef, {
      gamePhase: "result",
      submittedAnswer: answer.trim(),
      answeredBy: answeredById,
      updatedAt: Date.now(),
    });
  }

  function setRoundResult(isCorrect: boolean, pointsAwarded = 0) {
    update(roundStateRef, {
      isAnswerCorrect: isCorrect,
      pointsAwarded,
      updatedAt: Date.now(),
    });
  }

  function resetRound(nextActivePlayerId?: string) {
    update(roundStateRef, {
      gamePhase: "selectingTip",
      selectedTipId: null,
      submittedAnswer: "",
      answeredBy: null,
      isAnswerCorrect: null,
      pointsAwarded: 0,
      activePlayerId: nextActivePlayerId ?? roundState.value.activePlayerId,
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

  return {
    clientId,
    playerName,
    players,
    roundState,
    joinGame,
    leaveGame,
    setActivePlayer,
    selectTip,
    submitAnswer,
    setRoundResult,
    resetRound,
    addPointsToPlayer,
  };
}
