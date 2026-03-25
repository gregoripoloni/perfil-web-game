<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { Textarea, Button } from 'primevue';
  import Card from './Card.vue';
  import ResponseDialog from './ResponseDialog.vue';
  import { usePlayerStore } from '../stores/playerStore';
  import { useRoundStore } from '../stores/roundStore';
  import { useGameStore } from '../stores/gameStore';
  import { useMultiplayerGame } from '../composables/useMultiplayer';

  const playerStore = usePlayerStore();
  const roundStore = useRoundStore();
  const gameStore = useGameStore();
  const multiplayer = useMultiplayerGame();

  const answer = ref('');
  const isAnswerCorrect = ref(false);
  const showResponseDialog = ref(false);
  const lastProcessedResultAt = ref(0);

  const isActivePlayer = computed(() => playerStore.player?.id === roundStore.activePlayer?.id);
  const isDisabledSendAnswer = computed(() => !isActivePlayer.value || roundStore.gameStatus !== 'guessing');

  const guideText = computed(() => {
    if (!isActivePlayer.value) {
      return `Aguardando ${roundStore.activePlayer?.name ?? 'jogador'}...`;
    }

    return roundStore.gameStatus === 'selectingCard' ? 'Selecione uma dica' : 'Digite seu palpite';
  });

  const handleCardClick = (id: number) => {
    if (!isActivePlayer.value || roundStore.gameStatus !== 'selectingCard') {
      return;
    }

    roundStore.changeTipStatus(id);
    multiplayer.selectTip(id);
  };

  const handleSendAnswer = () => {
    if (!isActivePlayer.value || !playerStore.player) {
      return;
    }

    isAnswerCorrect.value = answer.value.trim().toLowerCase() === roundStore.card.response.toLowerCase();
    const pointsAwarded = isAnswerCorrect.value ? roundStore.tips.length - roundStore.revealedTipsCount : 0;

    multiplayer.submitAnswer(answer.value, playerStore.player.id);
    multiplayer.setRoundResult(isAnswerCorrect.value, pointsAwarded);
    if (isAnswerCorrect.value) {
      multiplayer.addPointsToPlayer(playerStore.player.id, pointsAwarded);
    }
  };

  const getNextPlayerId = () => {
    if (!roundStore.activePlayer || gameStore.players.length === 0) {
      return undefined;
    }

    const currentIndex = gameStore.players.findIndex(player => player.id === roundStore.activePlayer.id);
    if (currentIndex < 0) {
      return gameStore.players[0]?.id;
    }

    const nextIndex = currentIndex === gameStore.players.length - 1 ? 0 : currentIndex + 1;
    return gameStore.players[nextIndex]?.id;
  };

  watch(
    multiplayer.roundState,
    (state) => {
      if (state.activePlayerId) {
        roundStore.setActivePlayerById(state.activePlayerId);
      }

      if (state.gamePhase === 'selectingTip') {
        roundStore.setGameStatus('selectingCard');
      } else {
        roundStore.setGameStatus(state.gamePhase);
      }

      if (state.selectedTipId !== null) {
        roundStore.openTipById(state.selectedTipId);
      }

      if (state.gamePhase === 'result' && state.updatedAt > lastProcessedResultAt.value && state.isAnswerCorrect !== null) {
        lastProcessedResultAt.value = state.updatedAt;
        answer.value = state.submittedAnswer;
        isAnswerCorrect.value = state.isAnswerCorrect;
        showResponseDialog.value = true;

        setTimeout(() => {
          showResponseDialog.value = false;
          answer.value = '';
          isAnswerCorrect.value = false;

          if (playerStore.player?.id === state.answeredBy) {
            if (state.isAnswerCorrect) {
              roundStore.updateCardAndTips();
            }

            roundStore.changeToNextPlayer();
            multiplayer.resetRound(getNextPlayerId());
          }
        }, 3000);
      }
    },
    { immediate: true, deep: true }
  );
</script>

<template>
  <div class="flex flex-col gap-2 p-6 max-h-full overflow-y-auto">
    <div class="flex items-center justify-between gap-6">
      <h1 class="text-xl font-black text-left text-primary-400">{{ guideText }}</h1>
      <div class="flex flex-col shrink-0 gap-2">
        <span class="text-sm text-left">
          Categoria:<span class="font-semibold">{{ roundStore.card.category }}</span>
        </span>
        <span class="text-sm text-left">
          Dicas:<span class="font-semibold">{{ roundStore.revealedTipsCount }}/{{ roundStore.tips.length }}</span>
        </span>
      </div>
    </div>
    <div class="flex flex-col max-h-full overflow-y-auto">
      <div class="grid grid-cols-2 gap-2 p-2 max-h-full overflow-y-auto lg:grid-cols-4">
        <Card
          v-for="(tip, index) in roundStore.tips"
          :key="tip.text" class="col-span-1"
          :text="tip.isOpen ? tip.text : `${index + 1}`"
          :isOpen="tip.isOpen"
          :isDisabled="!isActivePlayer || roundStore.gameStatus !== 'selectingCard'"
          @click="handleCardClick(tip.id)"
        />
      </div>
      <Transition>
        <div v-if="!isDisabledSendAnswer" class="flex flex-col gap-2">
          <Textarea
            class="w-full"
            placeholder="Digite seu palpite..."
            v-model="answer"
            @keydown.prevent.enter="handleSendAnswer"
          />
          <Button label="Enviar resposta" @click="handleSendAnswer" />
        </div>
      </Transition>
    </div>
    <ResponseDialog
      :isVisible="showResponseDialog"
      :isCorrect="isAnswerCorrect"
      :response="answer"
    />
  </div>
</template>