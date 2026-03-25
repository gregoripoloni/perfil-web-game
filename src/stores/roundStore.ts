import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useGameStore } from './gameStore';
import { CARDS } from '../constants/cards';
import { TIPS } from '../constants/tips';

export const useRoundStore = defineStore('round', () => {
  const getRandomCard = () => {
    const randomIndex = Math.floor(Math.random() * CARDS.length);
    return CARDS[randomIndex];
  };

  const card = ref(getRandomCard());
  const tips = ref(TIPS.filter(tip => tip.cardId === card.value.id).map(tip => ({ ...tip, isOpen: false })));

  const updateCardAndTips = () => {
    card.value = getRandomCard();
    tips.value = TIPS.filter(tip => tip.cardId === card.value.id).map(tip => ({ ...tip, isOpen: false }));
  }

  const changeTipStatus = (id: number) => {
    const tip = tips.value.find(tip => tip.id === id);

    if (!tip || tip.isOpen) {
      return;
    }

    tip.isOpen = true;
    changeGameStatus();
  };

  const revealedTipsCount = computed(() => tips.value.filter(tip => tip.isOpen).length);

  const gameStore = useGameStore();

  const activePlayerIndex = ref(0);

  const activePlayer = computed(() => {
    return gameStore.players[activePlayerIndex.value];
  });

  const changeToNextPlayer = () => {
    changeGameStatus();
    if (activePlayerIndex.value < gameStore.players.length - 1) {
      activePlayerIndex.value += 1;
    } else {
      activePlayerIndex.value = 0;
    }
  }

  const gameStatus = ref('selectingCard');

  const changeGameStatus = () => {
    if (gameStatus.value === 'selectingCard') {
      gameStatus.value = 'guessing';
    } else {
      gameStatus.value = 'selectingCard';
    }
  }

  return {
    card,
    tips,
    updateCardAndTips,
    changeTipStatus,
    revealedTipsCount,
    activePlayer,
    changeToNextPlayer,
    gameStatus,
    changeGameStatus
  };
});