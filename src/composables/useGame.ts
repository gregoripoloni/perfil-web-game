import { computed } from 'vue';
import { useRoundStateStore } from '../stores/roundStateStore';
import { usePlayerStore } from '../stores/playerStore';
import { useGameStore } from '../stores/gameStore';
import { CARDS } from '../constants/cards';
import { TIPS } from '../constants/tips';

export const useGame = () => {
  const roundStateStore = useRoundStateStore();
  const playerStore = usePlayerStore();
  const gameStore = useGameStore();

  const currentCard = computed(() => {
    return CARDS.find(card => card.id === roundStateStore.state.cardId) || null;
  });

  const currentTips = computed(() => {
    if (!roundStateStore.state.cardId) {
      return [];
    }

    return TIPS.filter(tip => tip.cardId === roundStateStore.state.cardId).map(tip => ({
      ...tip,
      isOpen: roundStateStore.state.openedTipsIds.includes(tip.id),
    }));
  });

  const revealedTipsCount = computed(() => currentTips.value.filter(tip => tip.isOpen).length);

  const gamePhase = computed(() => roundStateStore.state.gamePhase);

  const activePlayer = computed(() => {
    return gameStore.players.find(player => player.id === roundStateStore.state.activePlayerId) || null;
  });

  const isActivePlayer = computed(() => {
    return activePlayer.value?.id === playerStore.player?.id;
  });

  const isDisabledSendAnswer = computed(() => !isActivePlayer.value || gamePhase.value !== 'guessing');

  const submittedAnswer = computed(() => roundStateStore.state.submittedAnswer);

  const answeredBy = computed(() => roundStateStore.state.answeredBy);

  const isCorrectAnswer = computed(() => roundStateStore.state.isAnswerCorrect ?? false);

  const pointsAwarded = computed(() => roundStateStore.state.pointsAwarded);

  return {
    currentCard,
    currentTips,
    revealedTipsCount,
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