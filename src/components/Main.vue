<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { Badge } from 'primevue';
  import RevealedTip from './RevealedTip.vue';
  import AnswerInput from './AnswerInput.vue';
  import TipSelectionDialog from './TipSelectionDialog.vue';
  import ResponseDialog from './ResponseDialog.vue';
  import WinnerDialog from './WinnerDialog.vue';
  import { useGame } from '../composables/useGame';
  import { useMultiplayer } from '../composables/useMultiplayer';
  import { GamePhase } from '../stores/roundStore';
  import { POINTS_TO_WIN } from '../constants/rules';

  const {
    currentCard,
    currentTips,
    revealedTips,
    gamePhase,
    activePlayer,
    isActivePlayer,
    isDisabledSendAnswer,
    submittedAnswer,
    isCorrectAnswer,
    pointsAwarded,
  } = useGame();

  const {
    selectTip,
    setNextPlayer,
    addPointsToPlayer,
    resetRound,
    setWinner,
    resetGame
  } = useMultiplayer();

  const answer = ref('');
  const showTipSelectionDialog = ref(false);
  const showResponseDialog = ref(false);
  const showWinnerDialog = ref(false);

  const handleCardClick = (id: number) => {
    if (!isActivePlayer.value || gamePhase.value !== GamePhase.SelectingTip) {
      return;
    }

    selectTip(id);
    showTipSelectionDialog.value = false;
  };

  const onEndResultPhase = async (isCurrentPlayerActive: boolean) => {
    showResponseDialog.value = false;

    if (isCurrentPlayerActive && isCorrectAnswer.value) {
      await addPointsToPlayer(activePlayer.value?.id ?? '', pointsAwarded.value);
      const currentPlayerPoints = activePlayer.value?.points ?? 0;

      if (currentPlayerPoints >= POINTS_TO_WIN) {
        setWinner();
      } else {
        resetRound();
      }
    } else if (isCurrentPlayerActive) {
      setNextPlayer();
    }
  };

  const onEndWinnerPhase = (isCurrentPlayerActive: boolean) => {
    showWinnerDialog.value = false;

    if (isCurrentPlayerActive) {
      resetGame();
    }
  };

  const gamePhaseWatchers: Partial<Record<GamePhase, () => void>> = {
    [GamePhase.SelectingTip]: () => {
      if (isActivePlayer.value) {
        showTipSelectionDialog.value = true;
      }
    },
    [GamePhase.Result]: () => {
      answer.value = '';
      showResponseDialog.value = true;
      const isCurrentPlayerActive = isActivePlayer.value;
      setTimeout(() => onEndResultPhase(isCurrentPlayerActive), 3000);
    },
    [GamePhase.Winner]: () => {
      showWinnerDialog.value = true;
      const isCurrentPlayerActive = isActivePlayer.value;
      setTimeout(() => onEndWinnerPhase(isCurrentPlayerActive), 5000);
    },
  };

  watch(
    gamePhase,
    () => {
      const watcher = gamePhaseWatchers[gamePhase.value];
      if (watcher) {
        watcher();
      }
    },
    { immediate: true }
  );
</script>

<template>
  <div class="flex flex-col gap-2 h-full overflow-y-auto">
    <div class="flex justify-between gap-2">
      <span class="flex items-center gap-1 text-sm text-left">
        Categoria:
        <Badge>{{ currentCard?.category }}</Badge>
      </span>
      <span class="flex items-center gap-1 text-sm text-left">
        Dicas:
        <Badge>{{ revealedTips.length }}/{{ currentTips.length }}</Badge>
      </span>
    </div>
    <div class="flex flex-col justify-between h-full max-h-full overflow-y-auto">
      <div class="grid grid-cols-1 gap-2 p-2 max-h-full overflow-y-auto">
        <TransitionGroup name="list">
          <RevealedTip
            v-for="tip in revealedTips"
            :key="tip.text"
            :text="tip.text"
            :number="tip.number"
          />
        </TransitionGroup>
      </div>
      <Transition>
        <AnswerInput v-if="!isDisabledSendAnswer" />
      </Transition>
    </div>
    <TipSelectionDialog
      :isVisible="showTipSelectionDialog"
      @selectTip="handleCardClick"
    />
    <ResponseDialog
      :isVisible="showResponseDialog"
      :isCorrect="isCorrectAnswer"
      :response="submittedAnswer"
    />
    <WinnerDialog :isVisible="showWinnerDialog" />
  </div>
</template>