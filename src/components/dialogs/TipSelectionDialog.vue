<script setup lang="ts">
  import { Dialog } from 'primevue';
  import SelectableCard from '@/components/ui/SelectableCard.vue';
  import { useGameState } from '@/composables/useGameState';

  defineModel<boolean>('visible');

  defineEmits<{
    (e: 'selectTip', id: number): void;
  }>();

  const { currentTips } = useGameState();
</script>

<template>
  <Dialog :visible="visible" modal header="Selecione uma dica" :closable="false" :style="{ width: '50rem' }">
    <div class="grid grid-cols-2 gap-2 p-2 max-h-full overflow-y-auto lg:grid-cols-4">
      <SelectableCard
        v-for="(tip, index) in currentTips"
        :key="tip.text"
        :text="`${index + 1}`"
        :is-disabled="tip.isOpen"
        class="col-span-1"
        @click="$emit('selectTip', tip.id)"
      />
    </div>
  </Dialog>
</template>
