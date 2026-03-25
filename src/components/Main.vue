<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { Textarea, Button } from 'primevue';
  import Card from './Card.vue';
  import { usePlayerStore } from '../stores/playerStore';
  import { useRoundStore } from '../stores/roundStore';
  import { useGameStore } from '../stores/gameStore';

  const playerStore = usePlayerStore();
  const roundStore = useRoundStore();
  const gameStore = useGameStore();

  const answer = ref('');

  const revealedTipsCount = computed(() => roundStore.tips.filter(tip => tip.isOpen).length);

  const isActivePlayer = computed(() => playerStore.player?.id === roundStore.activePlayer.id);

  const isDisabledSendAnswer = computed(() => !isActivePlayer.value || roundStore.gameStatus !== 'guessing');

  const guideText = computed(() => {
    if (!isActivePlayer.value) {
      return `Aguardando ${roundStore.activePlayer.name}...`;
    }

    return roundStore.gameStatus === 'selectingCard' ? 'Selecione uma dica' : 'Digite seu palpite';
  });

  const handleCardClick = (id: number) => {
    if (!isActivePlayer.value || roundStore.gameStatus !== 'selectingCard') {
      return;
    }

    roundStore.changeTipStatus(id);
  };

  const handleSendAnswer = () => {
    if (!isActivePlayer.value) {
      return;
    }

    if (answer.value.trim().toLowerCase() === roundStore.card.response.toLowerCase()) {
      gameStore.addPointsToPlayer(playerStore.player?.id ?? 0, roundStore.tips.length - revealedTipsCount.value);
      roundStore.updateCardAndTips();
    }

    roundStore.changeToNextPlayer();

    answer.value = '';
  };
</script>

<template>
  <div class="flex flex-col gap-2 p-6 max-h-full overflow-y-auto">
    <div class="flex items-center justify-between gap-6">
      <h1 class="text-2xl font-black text-left text-primary-400">{{ guideText }}</h1>
      <div class="flex flex-col shrink-0 gap-2">
        <span class="text-md text-left">
          Categoria: <span class="font-semibold">{{ roundStore.card.category }}</span>
        </span>
        <span class="text-md text-left">
          Dicas: <span class="font-semibold">{{ revealedTipsCount }}/{{ roundStore.tips.length }}</span>
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
  </div>
</template>