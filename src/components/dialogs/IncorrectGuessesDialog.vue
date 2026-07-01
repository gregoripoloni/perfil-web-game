<script setup lang="ts">
import { Card, Dialog } from 'primevue';
import { useGameState } from '@/composables/useGameState';

const visible = defineModel<boolean>('visible');

const { incorrectGuesses } = useGameState();
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Palpites já tentados"
    :style="{ width: '50rem' }"
  >
    <div class="grid grid-cols-1 gap-2 p-2 max-h-full overflow-y-auto">
      <Card
        v-for="(guess, index) in incorrectGuesses"
        :key="`${guess}-${index}`"
        class="border-2 border-surface-800"
      >
        <template #content>
          <div class="flex items-center justify-center h-16 px-2">
            <span
              class="text-sm font-semibold uppercase text-surface-0 text-center"
            >
              {{ guess }}
            </span>
          </div>
        </template>
      </Card>
    </div>
  </Dialog>
</template>
