<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { Textarea, Button } from 'primevue';
  import Card from './Card.vue';
  import ResponseDialog from './ResponseDialog.vue';
  import { useGame } from '../composables/useGame';
  import { usePlayerStore } from '../stores/playerStore';

  const props = defineProps<{
    selectTip: (id: number) => void;
    submitAnswer: (answer: string, answeredBy: string, isCorrect: boolean, pointsAwarded: number) => void;
    setNextActivePlayer: () => void;
    addPointsToPlayer: (playerId: string, points: number) => void;
    resetRound: () => void;
  }>();

  const playerStore = usePlayerStore();

  const {
    currentCard,
    currentTips,
    revealedTipsCount,
    gamePhase,
    activePlayer,
    isActivePlayer,
    isDisabledSendAnswer,
    submittedAnswer,
    isCorrectAnswer
  } = useGame();

  const answer = ref('');
  const showResponseDialog = ref(false);

  const guideText = computed(() => {
    if (!isActivePlayer.value) {
      return `Aguardando ${activePlayer.value?.name ?? 'jogador'}...`;
    }

    return gamePhase.value === 'selectingTip' ? 'Selecione uma dica' : 'Digite seu palpite';
  });

  const handleCardClick = (id: number) => {
    if (!isActivePlayer.value || gamePhase.value !== 'selectingTip') {
      return;
    }

    props.selectTip(id);
  };

  const handleSendAnswer = () => {
    if (!isActivePlayer.value || !playerStore.player) {
      return;
    }

    const isCorrect = answer.value.trim().toLowerCase() === currentCard.value?.response.toLowerCase();
    const pointsAwarded = isCorrect ? currentTips.value.length - revealedTipsCount.value : 0;

    props.submitAnswer(answer.value, playerStore.player.name, isCorrect, pointsAwarded);

    if (isCorrect) {
      props.addPointsToPlayer(playerStore.player.id, pointsAwarded);
      setTimeout(props.resetRound, 3000);
      return;
    }

    setTimeout(props.setNextActivePlayer, 3000);
  };

  watch(gamePhase, () => {
    if (gamePhase.value !== 'result') {
      return;
    }

    answer.value = '';
    showResponseDialog.value = true;

    setTimeout(() => {
      showResponseDialog.value = false;
    }, 3000);
  });
</script>

<template>
  <div class="flex flex-col gap-2 p-6 max-h-full overflow-y-auto">
    <div class="flex items-center justify-between gap-6">
      <h1 class="text-xl font-black text-left text-primary-400">{{ guideText }}</h1>
      <div class="flex flex-col shrink-0 gap-2">
        <span class="text-sm text-left">
          Categoria:<span class="font-semibold">{{ currentCard?.category }}</span>
        </span>
        <span class="text-sm text-left">
          Dicas:<span class="font-semibold">{{ revealedTipsCount }}/{{ currentTips.length }}</span>
        </span>
      </div>
    </div>
    <div class="flex flex-col max-h-full overflow-y-auto">
      <div class="grid grid-cols-2 gap-2 p-2 max-h-full overflow-y-auto lg:grid-cols-4">
        <Card
          v-for="(tip, index) in currentTips"
          :key="tip.text" class="col-span-1"
          :text="tip.isOpen ? tip.text : `${index + 1}`"
          :isOpen="tip.isOpen"
          :isDisabled="!isActivePlayer || gamePhase !== 'selectingTip'"
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
      :isCorrect="isCorrectAnswer"
      :response="submittedAnswer"
    />
  </div>
</template>