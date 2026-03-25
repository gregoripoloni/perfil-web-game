import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useGameStore } from './gameStore';
import { CARDS } from '../constants/cards';
import { TIPS } from '../constants/tips';

export const useRoundStore = defineStore('round', () => {
  type GameStatus = 'selectingCard' | 'guessing' | 'result';
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
    gameStatus.value = 'guessing';
  };

  const revealedTipsCount = computed(() => tips.value.filter(tip => tip.isOpen).length);

  const gameStore = useGameStore();

  const activePlayerIndex = ref(0);

  const activePlayer = computed(() => {
    return gameStore.players[activePlayerIndex.value];
  });

  const changeToNextPlayer = () => {
    gameStatus.value = 'selectingCard';
    if (activePlayerIndex.value < gameStore.players.length - 1) {
      activePlayerIndex.value += 1;
    } else {
      activePlayerIndex.value = 0;
    }
  }

  const gameStatus = ref<GameStatus>('selectingCard');

  const changeGameStatus = () => {
    if (gameStatus.value === 'selectingCard') {
      gameStatus.value = 'guessing';
    } else {
      gameStatus.value = 'selectingCard';
    }
  }

  const setGameStatus = (status: GameStatus) => {
    gameStatus.value = status;
  };

  const openTipById = (id: number) => {
    const tip = tips.value.find(tip => tip.id === id);
    if (tip) {
      tip.isOpen = true;
    }
  };

  const setActivePlayerById = (playerId: string) => {
    const index = gameStore.players.findIndex(player => player.id === playerId);
    if (index >= 0) {
      activePlayerIndex.value = index;
    }
  };

  return {
    card,
    tips,
    updateCardAndTips,
    changeTipStatus,
    revealedTipsCount,
    activePlayer,
    changeToNextPlayer,
    gameStatus,
    changeGameStatus,
    setGameStatus,
    openTipById,
    setActivePlayerById
  };
});