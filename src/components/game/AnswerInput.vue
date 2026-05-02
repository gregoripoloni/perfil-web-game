<script setup lang="ts">
  import { ref } from 'vue';
  import { InputGroup, InputGroupAddon, InputText, Button, Tooltip as vTooltip, useConfirm } from 'primevue';
  import { usePlayerStore } from '@/stores/playerStore';
  import { useGameState } from '@/composables/useGameState';
  import { useGameActions } from '@/composables/useGameActions';
  import { calculateAwardedPoints } from '@/utils/scoring';
  import { normalizeAnswer } from '@/utils/text';

  const confirm = useConfirm();

  const playerStore = usePlayerStore();

  const { currentCard, isActivePlayer, currentTips, revealedTips } = useGameState();
  const { submitAnswer, setNextPlayer } = useGameActions();

  const answer = ref('');

  const handleSendAnswer = async () => {
    if (!isActivePlayer.value || !playerStore.player || !answer.value.length) return;

    const isCorrect = normalizeAnswer(answer.value) === normalizeAnswer(currentCard.value?.response);
    const pointsAwarded = isCorrect
      ? calculateAwardedPoints(currentTips.value.length, revealedTips.value.length)
      : 0;

    await submitAnswer(answer.value, playerStore.player.id, isCorrect, pointsAwarded);
  };

  const handleSkipTurn = () => {
    if (!isActivePlayer.value) return;

    confirm.require({
      message: 'Tem certeza que deseja passar a vez?',
      header: 'Atenção',
      icon: 'pi pi-info-circle',
      acceptProps: {
        label: 'Passar a vez',
      },
      rejectProps: {
        label: 'Cancelar',
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
    <InputGroup>
      <InputText
        v-model="answer"
        class="w-full"
        placeholder="Digite seu palpite..."
        @keydown.prevent.enter="handleSendAnswer"
      />
      <InputGroupAddon v-tooltip.top="'Enviar palpite'">
        <Button
          icon="pi pi-send"
          severity="secondary"
          :disabled="!answer.length"
          @click="handleSendAnswer"
        />
      </InputGroupAddon>
    </InputGroup>
    <Button
      v-tooltip.top="'Passar a vez'"
      icon="pi pi-angle-double-right"
      severity="secondary"
      class="shrink-0"
      @click="handleSkipTurn"
    />
  </div>
</template>
