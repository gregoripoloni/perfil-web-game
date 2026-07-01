<script setup lang="ts">
import { computed } from 'vue';
import RevealedTip from '@/components/game/RevealedTip.vue';
import AnswerInput from '@/components/game/AnswerInput.vue';
import IncorrectGuessesHistory from '@/components/game/IncorrectGuessesHistory.vue';
import TipSelection from '@/components/dialogs/TipSelection.vue';
import AnswerResult from '@/components/messages/AnswerResult.vue';
import TipEffect from '@/components/messages/TipEffect.vue';
import Winner from '@/components/messages/Winner.vue';
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
  incorrectGuesses,
} = useGameState();

const { selectTip } = useGameActions();

const { showTipSelection, showAnswerResult, showTipEffect, showWinner } =
  useGameFlow();

const handleCardClick = (id: number) => {
  if (!isActivePlayer.value || gamePhase.value !== GamePhase.SelectingTip)
    return;

  void selectTip(id);
  showTipSelection.value = false;
};

const categoryIcon = computed(() => {
  const map = {
    Pessoa: 'pi-user',
    Lugar: 'pi-map-marker',
    Ano: 'pi-calendar',
    Coisa: 'pi-mobile',
  };
  return map[currentCard.value?.category as keyof typeof map];
});
</script>

<template>
  <div class="flex flex-col gap-2 h-full overflow-y-auto">
    <div class="flex gap-8">
      <span class="flex items-center gap-2 text-sm text-left">
        <span class="pi text-xl! text-primary-400" :class="categoryIcon" />
        <span class="font-semibold text-2xl">{{ currentCard?.category }}</span>
      </span>
      <span class="flex items-center gap-2 text-sm text-left">
        <span class="pi pi-lightbulb text-xl! text-primary-400" />
        <span class="font-semibold text-2xl"
          >{{ revealedTips.length }}/{{ currentTips.length }}</span
        >
      </span>
    </div>
    <div
      class="flex flex-col justify-between h-full max-h-full overflow-y-auto"
    >
      <Transition mode="out-in">
        <AnswerResult
          v-if="showAnswerResult"
          :is-correct="isCorrectAnswer"
          :response="submittedAnswer"
        />
        <TipEffect v-else-if="showTipEffect" />
        <Winner v-else-if="showWinner" />
        <div
          v-else
          class="grid grid-cols-1 gap-2 p-2 max-h-full overflow-y-auto"
        >
          <TransitionGroup name="list">
            <RevealedTip
              v-for="tip in revealedTips"
              :key="tip.text"
              :text="tip.text"
              :number="tip.number"
              :kind="tip.kind"
            />
          </TransitionGroup>
        </div>
      </Transition>
      <IncorrectGuessesHistory
        v-if="!showAnswerResult && !showTipEffect && !showWinner"
        :guesses="incorrectGuesses"
      />
      <Transition>
        <AnswerInput v-if="!isDisabledSendAnswer" />
      </Transition>
    </div>
    <TipSelection
      v-model:visible="showTipSelection"
      @select-tip="handleCardClick"
    />
  </div>
</template>
