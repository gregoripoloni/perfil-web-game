import { computed } from 'vue';
import { useRoundStore } from '@/stores/roundStore';
import { useGameStateStore } from '@/stores/gameStateStore';
import { usePlayerStore } from '@/stores/playerStore';
import { usePlayersStore } from '@/stores/playersStore';
import { CARDS } from '@/constants/cards';
import { TIPS } from '@/constants/tips';
import { GamePhase } from '@/types/round';

export const useGameState = () => {
  const roundStore = useRoundStore();
  const gameStateStore = useGameStateStore();
  const playerStore = usePlayerStore();
  const playersStore = usePlayersStore();

  const currentCard = computed(() => {
    return CARDS.find((card) => card.id === roundStore.state.cardId) ?? null;
  });

  const currentTips = computed(() => {
    if (!roundStore.state.cardId) return [];

    return TIPS.filter((tip) => tip.cardId === roundStore.state.cardId).map(
      (tip) => ({
        ...tip,
        isOpen: roundStore.state.openedTipIds[String(tip.id)] != null,
      }),
    );
  });

  const revealedTips = computed(() => {
    const opened = roundStore.state.openedTipIds;
    const tipIdsByOrderDesc = Object.entries(opened)
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => Number(id));

    const tipsMap = currentTips.value.reduce(
      (acc, tip) => {
        acc[tip.id] = tip;
        return acc;
      },
      {} as Record<number, (typeof currentTips.value)[number]>,
    );

    return tipIdsByOrderDesc
      .map((id) => tipsMap[id])
      .filter((tip) => tip && tip.isOpen);
  });

  const gamePhase = computed(() => gameStateStore.state.phase);

  const activePlayer = computed(() => {
    return (
      playersStore.players.find(
        (p) => p.id === gameStateStore.state.activePlayerId,
      ) ?? null
    );
  });

  const isActivePlayer = computed(
    () => activePlayer.value?.id === playerStore.player?.id,
  );

  const isDisabledSendAnswer = computed(
    () => !isActivePlayer.value || gamePhase.value !== GamePhase.Guessing,
  );

  const submittedAnswer = computed(() => roundStore.state.answer?.text ?? '');

  const answeredBy = computed(() => {
    const id = roundStore.state.answer?.playerId;
    if (!id) return '';
    return playersStore.players.find((p) => p.id === id)?.name ?? '';
  });

  const isCorrectAnswer = computed(
    () => roundStore.state.answer?.isCorrect ?? false,
  );

  const pointsAwarded = computed(
    () => roundStore.state.answer?.pointsAwarded ?? 0,
  );

  return {
    currentCard,
    currentTips,
    revealedTips,
    gamePhase,
    activePlayer,
    isActivePlayer,
    isDisabledSendAnswer,
    submittedAnswer,
    answeredBy,
    isCorrectAnswer,
    pointsAwarded,
  };
};
