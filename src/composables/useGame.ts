import { computed } from 'vue';
import { useRoundStore } from '../stores/roundStore';
import { usePlayerStore } from '../stores/playerStore';
import { useGameStore } from '../stores/gameStore';
import { CARDS } from '../constants/cards';
import { TIPS } from '../constants/tips';

export const useGame = () => {
  const roundStore = useRoundStore();
  const playerStore = usePlayerStore();
  const gameStore = useGameStore();

  const currentCard = computed(() => {
    return CARDS.find(card => card.id === roundStore.state.cardId) || null;
  });

  const currentTips = computed(() => {
    if (!roundStore.state.cardId) {
      return [];
    }

    return TIPS.filter(tip => tip.cardId === roundStore.state.cardId).map(tip => ({
      ...tip,
      isOpen: roundStore.state.openedTipsIds.includes(tip.id),
    }));
  });

  const revealedTips = computed(() => {
    const reversedOpenedIds = [...roundStore.state.openedTipsIds].reverse();
    const tipsMap = currentTips.value.reduce((acc, tip) => {
      acc[tip.id] = tip;
      return acc;
    }, {} as Record<typeof currentTips.value[number]["id"], typeof currentTips.value[number]>);

    return reversedOpenedIds
      .map(id => tipsMap[id])
      .filter(tip => tip && tip.isOpen);
  });

  const gamePhase = computed(() => roundStore.state.gamePhase);

  const activePlayer = computed(() => {
    return gameStore.players.find(player => player.id === roundStore.state.activePlayerId) || null;
  });

  const isActivePlayer = computed(() => {
    return activePlayer.value?.id === playerStore.player?.id;
  });

  const isDisabledSendAnswer = computed(() => !isActivePlayer.value || gamePhase.value !== 'guessing');
  const submittedAnswer = computed(() => roundStore.state.submittedAnswer);
  const answeredBy = computed(() => roundStore.state.answeredBy);
  const isCorrectAnswer = computed(() => roundStore.state.isAnswerCorrect ?? false);
  const pointsAwarded = computed(() => roundStore.state.pointsAwarded);

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
    pointsAwarded
  };
}