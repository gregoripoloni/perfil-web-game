<script setup lang="ts">
import { Card, Dialog, Button } from 'primevue';
import { useGameState } from '@/composables/useGameState';

const visible = defineModel<boolean>('visible');

const { incorrectGuesses } = useGameState();
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    header="Palpites já tentados"
    :closable="false"
    :style="{ width: '50rem' }"
  >
    <div
      class="grid grid-cols-2 gap-2 p-2 max-h-full overflow-y-auto lg:grid-cols-4"
    >
      <Card
        v-for="(guess, index) in incorrectGuesses"
        :key="`${guess}-${index}`"
        class="col-span-1 border-2 border-surface-800"
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
    <div class="flex justify-end pt-4">
      <Button label="Fechar" severity="secondary" @click="visible = false" />
    </div>
  </Dialog>
</template>
