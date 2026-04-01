<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { Card, InputText, InputGroup, InputGroupAddon, Button, Badge } from 'primevue';
  import RevealedTip from './RevealedTip.vue';
  import TipSelectionDialog from './TipSelectionDialog.vue';
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
    revealedTips,
    gamePhase,
    isActivePlayer,
    isDisabledSendAnswer,
    submittedAnswer,
    isCorrectAnswer
  } = useGame();

  const answer = ref('');
  const showTipSelectionDialog = ref(false);
  const showResponseDialog = ref(false);

  const handleCardClick = (id: number) => {
    if (!isActivePlayer.value || gamePhase.value !== 'selectingTip') {
      return;
    }

    props.selectTip(id);
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

    props.submitAnswer(answer.value, playerStore.player.name, isCorrect, pointsAwarded);

    if (isCorrect) {
      props.addPointsToPlayer(playerStore.player.id, pointsAwarded);
      setTimeout(props.resetRound, 3000);
      return;
    }

    setTimeout(props.setNextActivePlayer, 3000);
  };

  watch(
    gamePhase,
    () => {
      if (gamePhase.value === 'selectingTip' && isActivePlayer.value) {
        showTipSelectionDialog.value = true;
      }

      if (gamePhase.value !== 'result') {
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
  <Card class="Main h-full overflow-y-auto bg-surface-950!">
    <template #content>
      <div class="flex flex-col gap-2 h-full overflow-y-auto">
        <div class="flex justify-between gap-2">
          <span class="flex items-center gap-1 text-sm text-left">
            Categoria:
            <Badge size="small">{{ currentCard?.category }}</Badge>
          </span>
          <span class="flex items-center gap-1 text-sm text-left">
            Dicas:
            <Badge size="small">{{ revealedTips.length }}/{{ currentTips.length }}</Badge>
          </span>
        </div>
        <div class="flex flex-col justify-between h-full max-h-full overflow-y-auto">
          <div class="grid grid-cols-1 gap-2 p-2 max-h-full overflow-y-auto">
            <RevealedTip
              v-for="tip in revealedTips"
              :key="tip.text"
              :text="tip.text"
              :number="tip.number"
            />
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
      </div>
    </template>
  </Card>
</template>

<style scoped>
  .Main:deep(> .p-card-body),
  .Main:deep(> .p-card-body > .p-card-content) {
    height: 100%;
    overflow-y: auto;
  }
</style>