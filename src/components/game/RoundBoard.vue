<script setup lang="ts">
  import { Badge } from 'primevue';
  import RevealedTip from '@/components/game/RevealedTip.vue';
  import AnswerInput from '@/components/game/AnswerInput.vue';
  import TipSelectionDialog from '@/components/dialogs/TipSelectionDialog.vue';
  import AnswerResultDialog from '@/components/dialogs/AnswerResultDialog.vue';
  import WinnerDialog from '@/components/dialogs/WinnerDialog.vue';
  import { useGameState } from '@/composables/useGameState';
  import { useGameActions } from '@/composables/useGameActions';
  import { useGameFlow } from '@/composables/useGameFlow';
  import { GamePhase } from '@/types/round';

  const {
    currentCard,
    currentTips,
    revealedTips,
    gamePhase,
    isActivePlayer,
    isDisabledSendAnswer,
    submittedAnswer,
    isCorrectAnswer,
  } = useGameState();

  const { selectTip } = useGameActions();

  const { showTipSelectionDialog, showResponseDialog, showWinnerDialog } = useGameFlow();

  const handleCardClick = (id: number) => {
    if (!isActivePlayer.value || gamePhase.value !== GamePhase.SelectingTip) return;

    void selectTip(id);
    showTipSelectionDialog.value = false;
  };
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
      v-model:visible="showTipSelectionDialog"
      @select-tip="handleCardClick"
    />
    <AnswerResultDialog
      v-model:visible="showResponseDialog"
      :is-correct="isCorrectAnswer"
      :response="submittedAnswer"
    />
    <WinnerDialog v-model:visible="showWinnerDialog" />
  </div>
</template>
