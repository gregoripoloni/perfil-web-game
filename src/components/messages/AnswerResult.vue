<script setup lang="ts">
import { ref } from 'vue';
import { Card } from 'primevue';
import { useGameState } from '@/composables/useGameState';
import PlayerText from '@/components/game/PlayerText.vue';

defineProps<{
  response: string;
  isCorrect: boolean;
}>();

const { answeredBy, pointsAwarded } = useGameState();

const isLoading = ref(true);

setTimeout(() => {
  isLoading.value = false;
}, 1000);
</script>

<template>
  <div class="flex flex-col items-start gap-2 rounded-2xl h-full px-6 py-10">
    <PlayerText :name="answeredBy" />
    <Card class="rounded-tl-none! border-2 border-surface-800">
      <template #content>
        <h1 class="text-4xl font-bold text-surface-0">
          {{ response }}
        </h1>
      </template>
    </Card>
    <div
      class="flex justify-center h-fit w-fit gap-2 rounded-xl transition-all"
      :class="{
        'text-surface-400': isLoading,
        'text-red-400': !isLoading && !isCorrect,
        'text-lime-400': !isLoading && isCorrect,
      }"
    >
      <span
        class="pi text-2xl!"
        :class="{
          'pi-spinner pi-spin': isLoading,
          'pi-times': !isLoading && !isCorrect,
          'pi-check': !isLoading && isCorrect,
        }"
      />
      <Transition>
        <p v-if="!isLoading" class="text-2xl text-left">
          {{ isCorrect ? 'Correto' : 'Errado' }}
          <br />
          {{ isCorrect ? `+${pointsAwarded} pontos` : '' }}
        </p>
      </Transition>
    </div>
  </div>
</template>
