<script setup lang="ts">
import { Card } from 'primevue';
import PlayerText from '@/components/game/PlayerText.vue';
import { useGameState } from '@/composables/useGameState';

const { answeredBy } = useGameState();
</script>

<template>
  <div class="flex flex-col items-start gap-2 rounded-2xl h-full px-6 py-10">
    <span>
      <PlayerText :name="answeredBy" />
    </span>
    <Card class="rounded-tl-none! border-2 border-surface-800">
      <template #content>
        <div class="flex items-center gap-4">
          <span class="pi pi-trophy text-primary-400 text-4xl!" />
          <h1 class="text-4xl font-bold text-primary-0">Venceu o jogo!</h1>
        </div>
      </template>
    </Card>
  </div>
</template>
