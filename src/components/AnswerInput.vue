<script setup lang="ts">
  import { ref } from 'vue';
  import { InputGroup, InputGroupAddon, InputText, Button, Tooltip as vTooltip, useConfirm } from 'primevue';
  import { usePlayerStore } from '../stores/playerStore';
  import { usePlayersStore } from '../stores/playersStore';
  import { useGame } from '../composables/useGame';
  import { useMultiplayer } from '../composables/useMultiplayer';
  import { POINTS_TO_WIN } from '../constants/rules';

  const confirm = useConfirm();

  const playerStore = usePlayerStore();
  const playersStore = usePlayersStore();

  const { currentCard, isActivePlayer, currentTips, revealedTips } = useGame();
  const { submitAnswer, setNextPlayer, resetRound, setWinner, resetGame, addPointsToPlayer } = useMultiplayer();

  const answer = ref('');

  const handleSendAnswer = async () => {
    if (!isActivePlayer.value || !playerStore.player || !answer.value.length) {
      return;
    }

    const normalizeAnswer = (value?: string) =>
      (value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase();

    const isCorrect = normalizeAnswer(answer.value) === normalizeAnswer(currentCard.value?.response);
    const pointsAwarded = isCorrect ? currentTips.value.length - revealedTips.value.length : 0;

    submitAnswer(answer.value, playerStore.player.name, isCorrect, pointsAwarded);

    if (isCorrect) {
      await addPointsToPlayer(playerStore.player.id, pointsAwarded);
      const currentPlayerPoints = playersStore.players.find(player => player.id === playerStore.player?.id)?.points ?? 0;

      if (currentPlayerPoints >= POINTS_TO_WIN) {
        setTimeout(() => {
          setWinner();
          setTimeout(resetGame, 3000);
        }, 3000);
        return;
      }

      setTimeout(resetRound, 3000);
      return;
    }

    setTimeout(setNextPlayer, 3000);
  };

  const handleSkipTurn = () => {
    if (!isActivePlayer.value) {
      return;
    }

    confirm.require({
      message: 'Tem certeza que deseja passar a vez?',
      header: 'Atenção',
      icon: 'pi pi-info-circle',
      acceptProps: {
        label: 'Passar a vez'
      },
      rejectProps: {
        label: 'Cancelar',
        severity: 'secondary',
      },
      accept() {
        setNextPlayer();
      },
    });
  };
</script>

<template>
  <div class="flex gap-2">
    <InputGroup>
      <InputText
        class="w-full"
        placeholder="Digite seu palpite..."
        v-model="answer"
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
      icon="pi pi-angle-double-right"
      severity="secondary"
      class="shrink-0"
      v-tooltip.top="'Passar a vez'"
      @click="handleSkipTurn"
    />
  </div>
</template>