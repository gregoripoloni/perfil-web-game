<script setup lang="ts">
import { ref } from 'vue';
import { InputText, Button, useConfirm } from 'primevue';
import { usePlayerStore } from '@/stores/playerStore';
import { useGameState } from '@/composables/useGameState';
import { useGameActions } from '@/composables/useGameActions';
import { calculateAwardedPoints } from '@/utils/scoring';
import { normalizeAnswer } from '@/utils/text';

const confirm = useConfirm();

const playerStore = usePlayerStore();

const { currentCard, isActivePlayer, currentTips, revealedTips } =
  useGameState();
const { submitAnswer, setNextPlayer } = useGameActions();

const answer = ref('');

const handleSendAnswer = async () => {
  if (!isActivePlayer.value || !playerStore.player || !answer.value.length)
    return;

  const isCorrect =
    normalizeAnswer(answer.value) ===
    normalizeAnswer(currentCard.value?.response);
  const pointsAwarded = isCorrect
    ? calculateAwardedPoints(
        currentTips.value.length,
        revealedTips.value.length,
      )
    : 0;

  await submitAnswer(
    answer.value,
    playerStore.player.id,
    isCorrect,
    pointsAwarded,
  );
};

const handleSkipTurn = () => {
  if (!isActivePlayer.value) return;

  confirm.require({
    message: 'Tem certeza que deseja pular a sua vez?',
    header: 'Atenção',
    icon: 'pi pi-exclamation-triangle',
    acceptProps: {
      label: 'Sim, pular minha vez',
      severity: 'danger',
    },
    rejectProps: {
      label: 'Cancelar',
      variant: 'text',
      severity: 'secondary',
    },
    accept() {
      void setNextPlayer();
    },
  });
};
</script>

<template>
  <div class="flex gap-2">
    <Button
      icon="pi pi-forward"
      variant="text"
      severity="secondary"
      class="shrink-0"
      @click="handleSkipTurn"
    />
    <InputText
      v-model="answer"
      class="w-full"
      placeholder="Digite seu palpite..."
      @keydown.prevent.enter="handleSendAnswer"
    />
    <Button
      icon="pi pi-send"
      :severity="answer.length ? 'primary' : 'secondary'"
      :disabled="!answer.length"
      class="shrink-0"
      @click="handleSendAnswer"
    />
  </div>
</template>
