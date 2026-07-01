<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { Button, useConfirm, useToast } from 'primevue';
import { usePlayerStore } from '@/stores/playerStore';
import { useGameState } from '@/composables/useGameState';
import { useGameActions } from '@/composables/useGameActions';
import { calculateAwardedPoints } from '@/utils/scoring';
import { normalizeAnswer } from '@/utils/text';

const confirm = useConfirm();
const toast = useToast();

const playerStore = usePlayerStore();

const { currentCard, isActivePlayer, currentTips, revealedTips } =
  useGameState();
const { submitAnswer, setNextPlayer } = useGameActions();

const inputRef = useTemplateRef<HTMLInputElement>('input');
const answer = ref('');
const isFocused = ref(false);

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

  const result = await submitAnswer(
    answer.value,
    playerStore.player.id,
    isCorrect,
    pointsAwarded,
  );

  if (!result.ok && result.reason === 'duplicate') {
    toast.add({
      severity: 'warn',
      summary: 'Palpite já enviado',
      detail: 'Esse palpite já foi tentado nesta carta.',
      life: 4000,
    });
    return;
  }

  answer.value = '';
};

const handleSkipTurn = () => {
  if (!isActivePlayer.value) return;

  confirm.require({
    message: 'Tem certeza que deseja pular a sua vez?',
    header: 'Atenção',
    acceptProps: {
      label: 'Pular',
      severity: 'contrast',
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
  <div
    class="flex flex-col gap-2 p-2 rounded-xl cursor-text bg-surface-950 border-2 border-surface-800 transition-colors hover:border-surface-700"
    :class="{ 'border-primary-400!': isFocused }"
    @click="inputRef?.focus()"
  >
    <input
      ref="input"
      v-model="answer"
      type="text"
      class="w-full p-2 uppercase font-medium outline-none text-surface-0"
      placeholder="Digite seu palpite..."
      @focus="isFocused = true"
      @blur="isFocused = false"
      @keydown.prevent.enter="handleSendAnswer"
    />
    <div class="flex justify-between gap-2">
      <Button
        icon="pi pi-forward"
        variant="text"
        severity="secondary"
        class="shrink-0"
        @click.stop="handleSkipTurn"
      />
      <Button
        icon="pi pi-send"
        :severity="answer.length ? 'primary' : 'secondary'"
        :disabled="!answer.length"
        class="shrink-0"
        @click.stop="handleSendAnswer"
      />
    </div>
  </div>
</template>
