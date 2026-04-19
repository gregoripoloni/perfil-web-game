<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { InputText, InputGroup, InputGroupAddon, Button, Badge } from 'primevue';
  import RevealedTip from './RevealedTip.vue';
  import TipSelectionDialog from './TipSelectionDialog.vue';
  import ResponseDialog from './ResponseDialog.vue';
  import WinnerDialog from './WinnerDialog.vue';
  import { useGame } from '../composables/useGame';
  import { useMultiplayer } from '../composables/useMultiplayer';
  import { usePlayersStore } from '../stores/playersStore';
  import { usePlayerStore } from '../stores/playerStore';
  import { GamePhase } from '../stores/roundStore';
  import { POINTS_TO_WIN } from '../constants/rules';

  const playerStore = usePlayerStore();
  const playersStore = usePlayersStore();

  const {
    currentCard,
    currentTips,
    revealedTips,
    gamePhase,
    isActivePlayer,
    isDisabledSendAnswer,
    submittedAnswer,
    isCorrectAnswer
  } = useGame();

  const {
    selectTip,
    submitAnswer,
    addPointsToPlayer,
    setNextPlayer,
    resetRound,
    setWinner,
    resetGame,
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

  const handleSendAnswer = () => {
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
      const currentPlayerPoints = playersStore.players.find(player => player.id === playerStore.player?.id)?.points ?? 0;
      const hasPlayerWon = currentPlayerPoints + pointsAwarded >= POINTS_TO_WIN;

      addPointsToPlayer(playerStore.player.id, pointsAwarded);

      if (hasPlayerWon) {
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

  watch(
    gamePhase,
    () => {
      if (gamePhase.value === GamePhase.SelectingTip && isActivePlayer.value) {
        showTipSelectionDialog.value = true;
      }

      if (gamePhase.value === GamePhase.Winner) {
        showWinnerDialog.value = true;

        setTimeout(() => {
          showWinnerDialog.value = false;
        }, 3000);

        return;
      }

      if (gamePhase.value !== GamePhase.Result) {
        return;
      }

      answer.value = '';
      showResponseDialog.value = true;

      setTimeout(() => {
        showResponseDialog.value = false;
      }, 3000);
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
        <TransitionGroup>
          <RevealedTip
            v-for="tip in revealedTips"
            :key="tip.text"
            :text="tip.text"
            :number="tip.number"
          />
        </TransitionGroup>
      </div>
      <Transition>
        <div v-if="!isDisabledSendAnswer" class="flex gap-2">
          <InputGroup>
            <InputText
              class="w-full"
              placeholder="Digite seu palpite..."
              v-model="answer"
              @keydown.prevent.enter="handleSendAnswer"
            />
            <InputGroupAddon>
              <Button
                icon="pi pi-send"
                severity="secondary"
                :disabled="!answer.length"
                @click="handleSendAnswer"
              />
            </InputGroupAddon>
          </InputGroup>
        </div>
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